import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { featureFlags } from '@/utils/featureFlags';
import { useAdState } from '@/context/AdStateContext';
import { getGoogleAdUnitId } from '@/services/analytics/AdManager';

export function SmartBanner() {
  const { isAdFree } = useAdState();
  const insets = useSafeAreaInsets();
  const [loaded, setLoaded] = useState(false);

  if (Platform.OS === 'web' || !featureFlags.ads.enabled || isAdFree) {
    return null;
  }

  const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');
  const adUnitId = getGoogleAdUnitId('banner');

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }, !loaded && { display: 'none' }]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={() => setLoaded(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
