import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearchPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'शिव चर्चा',
  subtitle = 'हर हर महादेव',
  showSearch = false,
  onSearchPress,
  rightAction,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44
  ) + 8;

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
          <View style={[styles.omBadge, { backgroundColor: theme.accent, borderColor: theme.accentGlow }]}>
            <Text style={[styles.omText, { color: theme.primaryDark }]}>ॐ</Text>
          </View>
          <View style={styles.textColumn}>
            <Text style={[styles.titleText, { color: theme.textGold }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitleText, { color: theme.textWhite }]}>{subtitle}</Text> : null}
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
    paddingHorizontal: 18,
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
  omBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  omText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textColumn: {
    flex: 1,
  },
  titleText: {
    fontSize: 22,
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
