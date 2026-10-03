import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { featureFlags } from '@/utils/featureFlags';
import { PRODUCTION_AD_UNITS } from '@/utils/adConfig';

const AD_FREE_UNTIL_KEY = 'shiv-charcha-ad-free-until';
const USAGE_COUNTER_KEY = 'shiv-charcha-usage-counter';
const INTERSTITIAL_COOLDOWN_MS = 120000; // 2 minutes frequency capping

export let AD_FREE_DURATION_MINUTES = 15;

// Dynamically require SDK to prevent crashes on web or unsupported environments
let mobileAds: any = null;
let InterstitialAd: any = null;
let AppOpenAd: any = null;
let RewardedAd: any = null;
if (Platform.OS !== 'web') {
  try {
    const adMob = require('react-native-google-mobile-ads');
    mobileAds = adMob.default;
    InterstitialAd = adMob.InterstitialAd;
    AppOpenAd = adMob.AppOpenAd;
    RewardedAd = adMob.RewardedAd;
  } catch {
    // Fallback
  }
}

const GOOGLE_TEST_IDS = {
  android: {
    appOpen: 'ca-app-pub-3940256099942544/9257395921',
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
    native: 'ca-app-pub-3940256099942544/2247696110',
  },
  ios: {
    appOpen: 'ca-app-pub-3940256099942544/5575463023',
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
    native: 'ca-app-pub-3940256099942544/3986693108',
  },
};

export const getGoogleAdUnitId = (format: 'appOpen' | 'banner' | 'interstitial' | 'rewarded' | 'native'): string => {
  const os = Platform.OS === 'ios' ? 'ios' : 'android';
  if (__DEV__) {
    return GOOGLE_TEST_IDS[os][format];
  }
  return PRODUCTION_AD_UNITS[os][format];
};

let interstitial: any = null;
let appOpenAdInstance: any = null;
let rewardedAdInstance: any = null;
let lastInterstitialShownTime = 0;
let isInterstitialLoading = false;
let isAppOpenAdLoading = false;
let isRewardedAdLoading = false;
let isAdShowing = false;
let wasAdRecentlyClosed = false;

let onRewardedAdLoadedCallback: (() => void) | null = null;
let onRewardedAdClosedCallback: (() => void) | null = null;
let onRewardedAdEarnedCallback: (() => void) | null = null;

async function getNumber(key: string): Promise<number> {
  try {
    const rawValue = await AsyncStorage.getItem(key);
    return rawValue ? Number(rawValue) || 0 : 0;
  } catch {
    return 0;
  }
}

async function setNumber(key: string, value: number): Promise<void> {
  try {
    await AsyncStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

export const AdManager = {
  initialize() {
    if (Platform.OS === 'web' || !featureFlags.ads.enabled) {
      return false;
    }

    try {
      if (mobileAds) {
        mobileAds()
          .initialize()
          .catch(() => {});
      }

      void this.loadInterstitial();
      void this.loadAppOpenAd();
      void this.loadRewardedAd();

      const appOpenId = getGoogleAdUnitId('appOpen');
      if (AppOpenAd && appOpenId) {
        appOpenAdInstance = AppOpenAd.createForAdRequest(appOpenId, {
          requestNonPersonalizedAdsOnly: true,
        });

        appOpenAdInstance.addAdEventListener('loaded', () => {
          isAppOpenAdLoading = false;
        });

        appOpenAdInstance.addAdEventListener('closed', () => {
          isAppOpenAdLoading = false;
          this.setAdRecentlyClosed();
          void this.loadAppOpenAd();
        });

        appOpenAdInstance.addAdEventListener('error', () => {
          isAppOpenAdLoading = false;
        });
      }

      return true;
    } catch {
      return false;
    }
  },

  createAndLoadInterstitialAd() {
    const interstitialUnitId = getGoogleAdUnitId('interstitial');
    if (Platform.OS === 'web' || !featureFlags.ads.enabled || !InterstitialAd || !interstitialUnitId) {
      return;
    }

    if (isInterstitialLoading || (interstitial && interstitial.loaded)) {
      return;
    }

    try {
      isInterstitialLoading = true;
      interstitial = InterstitialAd.createForAdRequest(interstitialUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      interstitial.addAdEventListener('loaded', () => {
        isInterstitialLoading = false;
      });

      interstitial.addAdEventListener('closed', () => {
        isInterstitialLoading = false;
        isAdShowing = false;
        this.setAdRecentlyClosed();
        interstitial = null;
        void this.createAndLoadInterstitialAd();
      });

      interstitial.addAdEventListener('error', () => {
        isInterstitialLoading = false;
        interstitial = null;
      });

      interstitial.load();
    } catch {
      isInterstitialLoading = false;
      interstitial = null;
    }
  },

  async loadInterstitial() {
    this.createAndLoadInterstitialAd();
  },

  async loadAppOpenAd() {
    if (!appOpenAdInstance || isAppOpenAdLoading || appOpenAdInstance.loaded) return;
    try {
      isAppOpenAdLoading = true;
      appOpenAdInstance.load();
    } catch {
      isAppOpenAdLoading = false;
    }
  },

  async showInterstitial(): Promise<boolean> {
    if (Platform.OS === 'web' || !featureFlags.ads.enabled || !interstitial) {
      return false;
    }

    const isAdFree = await this.isAdFreeActive();
    if (isAdFree) return false;

    const now = Date.now();
    if (now - lastInterstitialShownTime < INTERSTITIAL_COOLDOWN_MS) {
      return false;
    }

    if (interstitial.loaded) {
      try {
        lastInterstitialShownTime = now;
        isAdShowing = true;
        interstitial.show();
        return true;
      } catch {
        isAdShowing = false;
        return false;
      }
    } else {
      void this.loadInterstitial();
      return false;
    }
  },

  async registerClickAndShowAd(): Promise<boolean> {
    if (Platform.OS === 'web' || !featureFlags.ads.enabled) {
      return false;
    }

    const isAdFree = await this.isAdFreeActive();
    if (isAdFree) return false;

    const currentCount = await getNumber(USAGE_COUNTER_KEY);
    const newCount = currentCount + 1;
    await setNumber(USAGE_COUNTER_KEY, newCount);

    const limit = 5;
    if (newCount >= limit) {
      const shown = await this.showInterstitial();
      if (shown) {
        await setNumber(USAGE_COUNTER_KEY, 0);
        return true;
      }
    }
    return false;
  },

  async shouldShowAd(): Promise<boolean> {
    const adFreeUntil = await getNumber(AD_FREE_UNTIL_KEY);
    return Date.now() > adFreeUntil;
  },

  async grantAdFree(): Promise<number> {
    const adFreeUntil = Date.now() + AD_FREE_DURATION_MINUTES * 60 * 1000;
    await setNumber(AD_FREE_UNTIL_KEY, adFreeUntil);
    return adFreeUntil;
  },

  async isAdFreeActive(): Promise<boolean> {
    const adFreeUntil = await getNumber(AD_FREE_UNTIL_KEY);
    return Date.now() < adFreeUntil;
  },

  async getAdFreeRemainingMinutes(): Promise<number> {
    const adFreeUntil = await getNumber(AD_FREE_UNTIL_KEY);
    const remaining = adFreeUntil - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
  },

  async getAdFreeRemainingSeconds(): Promise<number> {
    const adFreeUntil = await getNumber(AD_FREE_UNTIL_KEY);
    const remaining = adFreeUntil - Date.now();
    return remaining > 0 ? Math.floor(remaining / 1000) : 0;
  },

  async showAppOpenAd(): Promise<boolean> {
    if (Platform.OS === 'web' || !featureFlags.ads.enabled || !appOpenAdInstance) {
      return false;
    }

    const isAdFree = await this.isAdFreeActive();
    if (isAdFree) return false;

    if (isAdShowing || wasAdRecentlyClosed) {
      return false;
    }

    if (appOpenAdInstance.loaded) {
      try {
        appOpenAdInstance.show();
        return true;
      } catch {
        return false;
      }
    } else {
      void this.loadAppOpenAd();
      return false;
    }
  },

  setAdRecentlyClosed() {
    wasAdRecentlyClosed = true;
    setTimeout(() => {
      wasAdRecentlyClosed = false;
    }, 5000);
  },

  createAndLoadRewardedAd() {
    const rewardedId = getGoogleAdUnitId('rewarded');
    if (Platform.OS === 'web' || !featureFlags.ads.enabled || !RewardedAd || !rewardedId) {
      return;
    }

    if (isRewardedAdLoading || (rewardedAdInstance && rewardedAdInstance.loaded)) {
      return;
    }

    try {
      isRewardedAdLoading = true;
      rewardedAdInstance = RewardedAd.createForAdRequest(rewardedId, {
        requestNonPersonalizedAdsOnly: true,
      });

      rewardedAdInstance.addAdEventListener('loaded', () => {
        isRewardedAdLoading = false;
        if (onRewardedAdLoadedCallback) {
          onRewardedAdLoadedCallback();
        }
      });

      rewardedAdInstance.addAdEventListener('closed', () => {
        isRewardedAdLoading = false;
        isAdShowing = false;
        this.setAdRecentlyClosed();
        if (onRewardedAdClosedCallback) {
          onRewardedAdClosedCallback();
        }
        setTimeout(() => {
          rewardedAdInstance = null;
          void this.createAndLoadRewardedAd();
        }, 1000);
      });

      rewardedAdInstance.addAdEventListener('earned_reward', () => {
        if (onRewardedAdEarnedCallback) {
          onRewardedAdEarnedCallback();
        }
      });

      rewardedAdInstance.addAdEventListener('error', () => {
        isRewardedAdLoading = false;
        if (onRewardedAdClosedCallback) {
          onRewardedAdClosedCallback();
        }
        setTimeout(() => {
          rewardedAdInstance = null;
          void this.createAndLoadRewardedAd();
        }, 10000);
      });

      rewardedAdInstance.load();
    } catch {
      isRewardedAdLoading = false;
      rewardedAdInstance = null;
    }
  },

  async loadRewardedAd() {
    this.createAndLoadRewardedAd();
  },

  showRewardedAd(onRewardEarned: () => void, onClosed: () => void): boolean {
    if (rewardedAdInstance?.loaded) {
      onRewardedAdEarnedCallback = onRewardEarned;
      onRewardedAdClosedCallback = onClosed;
      try {
        isAdShowing = true;
        rewardedAdInstance.show();
        return true;
      } catch {
        isAdShowing = false;
        return false;
      }
    }
    return false;
  },

  registerRewardedListeners(onLoaded: () => void, onUnloaded: () => void) {
    onRewardedAdLoadedCallback = onLoaded;
    onRewardedAdClosedCallback = onUnloaded;
    if (this.isRewardedAdLoaded() && onLoaded) {
      onLoaded();
    }
  },

  isRewardedAdLoaded() {
    return rewardedAdInstance?.loaded || false;
  },

  setAdFreeDuration(minutes: number) {
    AD_FREE_DURATION_MINUTES = minutes;
  },
};

export const useRewardedAdLoader = () => {
  const { useRewardedAd } = require('react-native-google-mobile-ads');
  const adUnitId = getGoogleAdUnitId('rewarded');

  const ad = useRewardedAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  if (Platform.OS === 'web' || !featureFlags.ads.enabled) {
    return {
      isLoaded: false,
      isEarnedReward: false,
      load: () => {},
      show: () => {},
    };
  }

  return ad;
};

export default AdManager;
