import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { THEMES, ThemeId } from '@/theme/themes';
import { shadows } from '@/theme/colors';
import { SmartBanner } from '@/components/common/SmartBanner';

export default function ThemeSelectorScreen() {
  const router = useRouter();
  const { theme, themeId, setThemeId } = useTheme();

  const themeList: Array<{ id: ThemeId; title: string; desc: string; icon: string }> = [
    {
      id: 'divya_sukoon',
      title: THEMES.divya_sukoon.nameHindi,
      desc: THEMES.divya_sukoon.descriptionHindi,
      icon: THEMES.divya_sukoon.icon,
    },
    {
      id: 'kesariya_bhakti',
      title: THEMES.kesariya_bhakti.nameHindi,
      desc: THEMES.kesariya_bhakti.descriptionHindi,
      icon: THEMES.kesariya_bhakti.icon,
    },
    {
      id: 'kailash_ratri',
      title: THEMES.kailash_ratri.nameHindi,
      desc: THEMES.kailash_ratri.descriptionHindi,
      icon: THEMES.kailash_ratri.icon,
    },
    {
      id: 'harit_prakriti',
      title: THEMES.harit_prakriti.nameHindi,
      desc: THEMES.harit_prakriti.descriptionHindi,
      icon: THEMES.harit_prakriti.icon,
    },
    {
      id: 'gulabi_bhakti',
      title: THEMES.gulabi_bhakti.nameHindi,
      desc: THEMES.gulabi_bhakti.descriptionHindi,
      icon: THEMES.gulabi_bhakti.icon,
    },
    {
      id: 'saral_prakash',
      title: THEMES.saral_prakash.nameHindi,
      desc: THEMES.saral_prakash.descriptionHindi,
      icon: THEMES.saral_prakash.icon,
    },
    {
      id: 'system',
      title: '📱 सिस्टम थीम',
      desc: 'आपके मोबाइल फोन की लाइट/डार्क थीम के अनुसार स्वतः बदलेगा',
      icon: '📱',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🎨 अपना रंग चुनें" subtitle="व्यक्तिगत ऐप रूप-सज्जा (App Themes)" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>
            शिव चर्चा ऐप के पावन स्वरूप 🌸
          </Text>
          <Text style={[styles.introDesc, { color: theme.textSecondary }]}>
            अपनी पसंद के अनुसार संपूर्ण ऐप का रंग-रूप बदलें। चयनित थीम तुरंत लागू होगी और सहेजी जाएगी।
          </Text>
        </View>

        {themeList.map((item) => {
          const isSelected = themeId === item.id;
          const targetTheme = item.id === 'system' ? THEMES.divya_sukoon : THEMES[item.id];

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.themeCard,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: isSelected ? theme.primary : theme.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => setThemeId(item.id)}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.themeIcon}>{item.icon}</Text>
                  <View style={styles.textCol}>
                    <Text style={[styles.themeTitle, { color: theme.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.themeDesc, { color: theme.textSecondary }]}>
                      {item.desc}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={[styles.activeBadge, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.activeBadgeText, { color: theme.textWhite }]}>
                      ✓ लागू है
                    </Text>
                  </View>
                )}
              </View>

              {/* Color Swatches Preview */}
              <View style={styles.swatchContainer}>
                <View style={[styles.swatchCircle, { backgroundColor: targetTheme.primary }]} />
                <View style={[styles.swatchCircle, { backgroundColor: targetTheme.secondary }]} />
                <View style={[styles.swatchCircle, { backgroundColor: targetTheme.accent }]} />
                <View style={[styles.swatchCircle, { backgroundColor: targetTheme.background, borderWidth: 1, borderColor: '#CCC' }]} />
                <View style={[styles.swatchCircle, { backgroundColor: targetTheme.surfaceElevated }]} />
              </View>

              {/* Sample Devotional Preview Block */}
              <View
                style={[
                  styles.previewBox,
                  {
                    backgroundColor: targetTheme.surfaceElevated,
                    borderColor: targetTheme.border,
                  },
                ]}
              >
                <Text style={[styles.previewSampleText, { color: targetTheme.textPrimary }]}>
                  नमः शिवाय • शिव चर्चा एवं साधना 📿
                </Text>
                <View style={[styles.previewBtn, { backgroundColor: targetTheme.primary }]}>
                  <Text style={[styles.previewBtnText, { color: targetTheme.textWhite }]}>
                    नमूना बटन
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <SmartBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  introCard: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  introDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  themeCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    ...shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  themeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  textCol: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  swatchContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 10,
  },
  swatchCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  previewBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  previewSampleText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  previewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  previewBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
