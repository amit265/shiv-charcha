import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { featureFlags } from '@/utils/featureFlags';
import { AdManager } from '@/services/analytics/AdManager';

const CACHE_KEY = 'mahavyoma_remote_config';
const API_URL = 'https://mahavyomastudio.com/api/app-config';

export const fallbackConfig = {
  version: "1.0.1",
  legal: {
    privacyBaseUrl: "https://mahavyomastudio.com/legal",
    termsBaseUrl: "https://mahavyomastudio.com/legal",
    supportBaseUrl: "https://mahavyomastudio.com/legal",
    website: "https://mahavyomastudio.com",
    contactEmail: "hello@mahavyomastudio.com",
  },
  ai: {
    model: "llama-3.3-70b-versatile",
    enabled: true,
  },
  ads: {
    globalKillSwitch: false,
    banner: { enabled: true },
    interstitial: { enabled: true, frequency: 5, clickLimit: 3 },
    rewarded: { enabled: true },
    native: { enabled: true, frequency: 4 },
    appOpen: { enabled: true, frequency: 1 },
  },
  announcement: {
    show: false,
    message: "Welcome to Shiv Charcha!",
    url: "https://mahavyomastudio.com",
  },
  crossPromoApps: [
    {
      id: "hindi-calendar-2027",
      name: "Thakur Prasad Calendar 2027",
      tagline: "Authentic Hindu Calendar & Panchang",
      icon: "https://mahavyomastudio.com/apps/hindi-calendar-2027/icon.png",
      androidUrl: "https://play.google.com/store/apps/details?id=com.mahavyomastudio.hindicalendar",
      iosUrl: "https://mahavyomastudio.com/apps/hindi-calendar-2027",
    },
    {
      id: "shiv-charcha",
      name: "Shiv Charcha",
      tagline: "Shiv Bhajan, Katha & Sadhana",
      icon: "https://mahavyomastudio.com/apps/shiv-charcha/icon.png",
      androidUrl: "https://play.google.com/store/apps/details?id=com.mahavyomastudio.shivcharcha",
      iosUrl: "https://mahavyomastudio.com/apps/shiv-charcha",
    },
    {
      id: "vrat-sathi",
      name: "Vrat Sathi",
      tagline: "Your Fasting & Vrat Companion",
      icon: "https://mahavyomastudio.com/apps/vrat-sathi/icon.png",
      androidUrl: "https://play.google.com/store/apps/details?id=com.mahavyomastudio.vratsathi",
      iosUrl: "https://mahavyomastudio.com/apps/vrat-sathi",
    },
    {
      id: "shakti-peetha",
      name: "Shakti Peetha Explorer",
      tagline: "51 Shakti Peethas Guide",
      icon: "https://mahavyomastudio.com/apps/shakti-peetha/icon.png",
      androidUrl: "https://play.google.com/store/apps/details?id=com.mahavyomastudio.shaktipeetha",
      iosUrl: "https://mahavyomastudio.com/apps/shakti-peetha",
    },
    {
      id: "jyotirlinga",
      name: "Jyotirlinga Explorer",
      tagline: "12 Jyotirlinga Yatra Guide",
      icon: "https://mahavyomastudio.com/apps/jyotirlinga/icon.png",
      androidUrl: "https://play.google.com/store/apps/details?id=com.mahavyomastudio.jyotirlinga",
      iosUrl: "https://mahavyomastudio.com/apps/jyotirlinga",
    },
    {
      id: "bihar-explorer",
      name: "Bihar Explorer",
      tagline: "Discover Bihar Tourism & History",
      icon: "https://mahavyomastudio.com/apps/bihar-explorer/icon.png",
      androidUrl: "https://play.google.com/store/apps/details?id=com.mahavyomastudio.biharexplorer",
      iosUrl: "https://mahavyomastudio.com/apps/bihar-explorer",
    },
  ],
  features: {
    festivalModal: true,
    crossPromotion: true,
    reminders: true,
    adFreeDurationMinutes: 15,
  },
  versions: {
    "hindi-calendar-2027": { latest: "1.0.3", forceUpdate: false },
    "shiv-charcha": { latest: "1.0.1", forceUpdate: false },
    "vrat-sathi": { latest: "1.0.0", forceUpdate: false },
    "shakti-peetha-explorer": { latest: "1.0.0", forceUpdate: false },
    "jyotirlinga-explorer": { latest: "1.0.0", forceUpdate: false },
    "bihar-explorer": { latest: "1.0.0", forceUpdate: false },
  },
  maintenanceMode: false,
};

function updateFeatureFlags(fetchedConfig: typeof fallbackConfig) {
  const config = fetchedConfig || fallbackConfig;

  featureFlags.ads.enabled = !(config.ads?.globalKillSwitch ?? false);
  featureFlags.ads.bannerEnabled = config.ads?.banner?.enabled ?? true;
  featureFlags.ads.interstitialEnabled = config.ads?.interstitial?.enabled ?? true;
  featureFlags.ads.rewardedEnabled = config.ads?.rewarded?.enabled ?? true;

  featureFlags.festivalModal = config.features?.festivalModal ?? true;
  featureFlags.crossPromotion = config.features?.crossPromotion ?? true;
  featureFlags.reminders = config.features?.reminders ?? true;

  const adFreeMins = config.features?.adFreeDurationMinutes;
  if (adFreeMins && adFreeMins > 0) {
    try {
      AdManager.setAdFreeDuration(adFreeMins);
    } catch (_e) {
      // safe fallback
    }
  }
}

export function useMahavyomaConfig() {
  const [config, setConfig] = useState(fallbackConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      updateFeatureFlags(fallbackConfig);
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached && isMounted) {
          const parsed = JSON.parse(cached);
          setConfig(parsed);
          updateFeatureFlags(parsed);
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(API_URL, { signal: controller.signal });
          clearTimeout(timeout);
          if (response.ok) {
            const freshConfig = await response.json();
            if (isMounted) {
              setConfig(freshConfig);
              updateFeatureFlags(freshConfig);
              await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(freshConfig));
            }
          }
        } finally {
          clearTimeout(timeout);
        }
      } catch (error) {
        updateFeatureFlags(fallbackConfig);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return { config, loading };
}
