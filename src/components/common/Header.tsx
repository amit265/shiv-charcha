import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { SymbolView } from 'expo-symbols';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearchPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'शिव चर्चा',
  subtitle = 'महाव्योम स्टूडियो • देखें • सुनें • छुएँ • करें • सीखें',
  showSearch = false,
  onSearchPress,
  rightAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <View style={styles.omBadge}>
            <Text style={styles.omText}>ॐ</Text>
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.titleText}>{title}</Text>
            {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
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
    backgroundColor: colors.maroonPrimary,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderBottomColor: colors.goldPrimary,
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
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.goldLight,
  },
  omText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  textColumn: {
    flex: 1,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.goldLight,
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 11,
    color: colors.bgIvory,
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
