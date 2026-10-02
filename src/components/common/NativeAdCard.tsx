import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme/colors';
import { useAdState } from '@/context/AdStateContext';
import { featureFlags } from '@/utils/featureFlags';
import { getGoogleAdUnitId } from '@/services/analytics/AdManager';

type NativeAdCardProps = {
  index?: number;
  forceShow?: boolean;
};

export const NativeAdCard = React.memo(function NativeAdCard({ index, forceShow = false }: NativeAdCardProps) {
  const { isAdFree } = useAdState();
  const [loaded, setLoaded] = useState(false);

  const adUnitId = getGoogleAdUnitId('native');

  const shouldSkipAd = !forceShow && index !== undefined && (() => {
    const frequency = featureFlags.ads.nativeFrequency || 4; 
    if (index < 2) {
      return true;
    }
    return (index - 2) % frequency !== 0;
  })();

  if (Platform.OS === 'web' || isAdFree || !featureFlags.ads.enabled || shouldSkipAd) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');

  return (
    <View style={[styles.container, !loaded && { display: 'none' }]}>
      <View style={[styles.adWrapper, loaded && { backgroundColor: colors.cardBackground || '#1A0A0C', borderColor: colors.goldPrimary || '#FFD700' }]}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.MEDIUM_RECTANGLE}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => setLoaded(true)}
          onAdFailedToLoad={() => setLoaded(false)}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
  }
});
