import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { AdManager } from '@/services/analytics/AdManager';
import { featureFlags } from '@/utils/featureFlags';

type AdStateContextValue = {
  isAdFree: boolean;
  isRewardedLoaded: boolean;
  refreshAdState: () => Promise<void>;
  setIsAdFree: (value: boolean) => void;
  setIsRewardedLoaded: (value: boolean) => void;
};

const AdStateContext = createContext<AdStateContextValue | undefined>(undefined);

export function AdStateProvider({ children }: React.PropsWithChildren) {
  const [isAdFree, setIsAdFree] = useState(false);
  const [isRewardedLoaded, setIsRewardedLoaded] = useState(() => AdManager.isRewardedAdLoaded());

  useEffect(() => {
    if (Platform.OS === 'web') return;

    if (!AdManager.isRewardedAdLoaded()) {
      void AdManager.loadRewardedAd();
    }

    AdManager.registerRewardedListeners(
      () => { setIsRewardedLoaded(true); },
      () => { setIsRewardedLoaded(false); }
    );
  }, []);

  const refreshAdState = useCallback(async () => {
    if (featureFlags.ads.enabled && Platform.OS !== 'web') {
      const adFreeActive = await AdManager.isAdFreeActive();
      setIsAdFree(adFreeActive);
      if (!AdManager.isRewardedAdLoaded()) {
        void AdManager.loadRewardedAd();
      }
      setIsRewardedLoaded(AdManager.isRewardedAdLoaded());
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let isMounted = true;

    async function checkAdFree() {
      if (featureFlags.ads.enabled) {
        const active = await AdManager.isAdFreeActive();
        if (isMounted) {
          setIsAdFree(active);
        }
        if (!AdManager.isRewardedAdLoaded()) {
          void AdManager.loadRewardedAd();
        }
      }
    }

    void checkAdFree();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setTimeout(() => {
          if (isMounted) {
            void checkAdFree();
          }
        }, 1000);
      }
    });

    return () => {
      isMounted = false;
      sub.remove();
    };
  }, []);

  const value = useMemo(
    () => ({
      isAdFree,
      isRewardedLoaded,
      refreshAdState,
      setIsAdFree,
      setIsRewardedLoaded,
    }),
    [isAdFree, isRewardedLoaded, refreshAdState]
  );

  return <AdStateContext.Provider value={value}>{children}</AdStateContext.Provider>;
}

export function useAdState() {
  const context = useContext(AdStateContext);

  if (!context) {
    throw new Error('useAdState must be used within an AdStateProvider');
  }

  return context;
}
