import React from 'react';

type NativeAdCardProps = {
  index?: number;
  forceShow?: boolean;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: () => void;
};

export const NativeAdCard = React.memo(function NativeAdCard({ index }: NativeAdCardProps) {
  return null;
});
