import { useEffect, useState } from 'react';

export const AdManager = {
  initialize() {
    return false;
  },

  async isAdFreeActive(): Promise<boolean> {
    return false;
  },

  async getAdFreeRemainingMinutes(): Promise<number> {
    return 0;
  },

  setAdFreeDuration(_mins: number) {},

  async grantAdFree() {
    return false;
  },

  async registerClickAndShowAd() {},

  async showInterstitial() {},

  async loadInterstitial() {},

  async showAppOpenAd() {},

  async loadAppOpenAd() {},

  async loadRewardedAd() {},

  isRewardedAdLoaded(): boolean {
    return false;
  },

  registerRewardedListeners() {
    return () => {};
  },

  setAdRecentlyClosed() {},

  wasAdRecentlyClosed(): boolean {
    return false;
  },
};

export const getGoogleAdUnitId = (): string => {
  return 'ca-app-pub-3940256099942544/6300978111';
};

export function useRewardedAdLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, []);

  return { isLoaded, loadAd: () => {} };
}

export default AdManager;
