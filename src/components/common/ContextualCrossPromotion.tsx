import React from 'react';
import { View, ViewStyle } from 'react-native';
import { CrossPromotionCard } from './CrossPromotionCard';
import { useMahavyomaConfig } from '@/hooks/useMahavyomaConfig';
import { spacing } from '@/theme/colors';

type Props = {
  targetAppId: string;
  style?: ViewStyle;
};

export function ContextualCrossPromotion({ targetAppId, style }: Props) {
  const { config } = useMahavyomaConfig();

  // If cross promotion is globally disabled, don't show anything
  if (!config?.features?.crossPromotion) return null;

  // Find the exact app requested
  const promotion = config.crossPromoApps?.find(p => p.id === targetAppId);

  // If it doesn't exist in config, or if we are accidentally targeting ourselves, return null
  if (!promotion || promotion.id === 'shiv-charcha') return null;

  return (
    <View style={[{ marginVertical: spacing.md, paddingHorizontal: spacing.md }, style]}>
      <CrossPromotionCard promotion={promotion as any} />
    </View>
  );
}
