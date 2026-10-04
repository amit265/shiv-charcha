import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View, Image, ViewStyle } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme/colors';

export type Promotion = {
  id: string;
  name?: string;
  tagline?: string;
  icon?: string;
  androidUrl?: string;
  iosUrl?: string;
  webUrl?: string;
  titleHi?: string;
  descriptionHi?: string;
};

// Bundled local icons as fallback (guaranteed to render even offline)
const LOCAL_ICONS: Record<string, any> = {
  'hindi-calendar-2027': require('../../../assets/images/cross-promo/hindi-calendar-2027.webp'),
  'shiv-charcha': require('../../../assets/images/cross-promo/shiv-charcha.webp'),
  'vrat-sathi': require('../../../assets/images/cross-promo/vrat-sathi.webp'),
  'shakti-peetha': require('../../../assets/images/cross-promo/shakti-peetha.webp'),
  'jyotirlinga': require('../../../assets/images/cross-promo/jyotirlinga.webp'),
  'bihar-explorer': require('../../../assets/images/cross-promo/bihar-explorer.webp'),
};

type CrossPromotionCardProps = {
  promotion: Promotion;
  onPress?: () => void;
  style?: ViewStyle;
};

export function CrossPromotionCard({ promotion, onPress, style }: CrossPromotionCardProps) {
  async function handlePress() {
    const url = promotion.androidUrl || promotion.iosUrl || promotion.webUrl;
    if (url) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) await Linking.openURL(url);
      } catch {
        // URL not supported or app not installed — fail silently
      }
    }
    if (onPress) onPress();
  }

  // Use bundled local icon first (guaranteed to work), fallback to remote URL
  const localIcon = LOCAL_ICONS[promotion.id];
  const iconSource = localIcon
    ? localIcon
    : promotion.icon
    ? { uri: promotion.icon }
    : null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        shadows.soft,
        {
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
      onPress={handlePress}
    >
      <View style={styles.contentRow}>
        {iconSource ? (
          <Image source={iconSource} style={styles.icon} />
        ) : (
          <View style={styles.iconPlaceholder}>
            <Text style={{ fontSize: 24 }}>📱</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {promotion.name || promotion.titleHi}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {promotion.tagline || promotion.descriptionHi}
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>INSTALL</Text>
          <Text style={styles.arrowText}>➔</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBgAmber,
    borderColor: colors.borderGold,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: '700',
    color: colors.maroonPrimary,
  },
  description: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textMedium,
    marginTop: 2,
    lineHeight: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0D4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.saffronDark,
  },
  arrowText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.saffronDark,
  },
});
