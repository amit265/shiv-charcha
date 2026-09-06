import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'शिव चर्चा',
  subtitle = 'हर हर महादेव',
  showBack = false,
  onBackPress,
  showSearch = false,
  onSearchPress,
  rightAction,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44
  ) + 8;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.navigationBackground,
        borderBottomColor: theme.accent,
        paddingTop: topPadding,
      }
    ]}>
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          {showBack && (
            <TouchableOpacity
              style={[
                styles.circularBackBtn,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  borderColor: theme.borderGold,
                },
              ]}
              onPress={handleBack}
              activeOpacity={0.75}
            >
              <View style={styles.iconCenterWrapper}>
                <Text style={[styles.backArrowSymbol, { color: theme.textGold }]}>←</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={[styles.omBadge, { backgroundColor: theme.accent, borderColor: theme.accentGlow }]}>
            <Text style={[styles.omText, { color: theme.primaryDark }]}>ॐ</Text>
          </View>
          <View style={styles.textColumn}>
            <Text style={[styles.titleText, { color: theme.textGold }]} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitleText, { color: theme.textWhite }]} numberOfLines={1}>{subtitle}</Text> : null}
          </View>
        </View>

        <View style={styles.actionsRow}>
          {showSearch && (
            <TouchableOpacity style={styles.iconBtn} onPress={onSearchPress} activeOpacity={0.7}>
              <Text style={styles.iconSymbol}>🔍</Text>
            </TouchableOpacity>
          )}
          {rightAction}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circularBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconCenterWrapper: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
      ios: {
        lineHeight: 20,
      },
      web: {
        lineHeight: 20,
      },
    }),
  },
  omBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
  },
  omText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  textColumn: {
    flex: 1,
    paddingRight: 6,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 11,
    opacity: 0.9,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconSymbol: {
    fontSize: 16,
  },
});
