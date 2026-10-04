import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { colors, shadows } from '@/theme/colors';
import { shareTemplates } from '@/content/shareTemplates';
import { ShareCardRenderer } from '@/components/share/ShareCardRenderer';
import { ShareTemplate } from '@/types';

import { StorageService, getFirstSutraText, getDiscipleTitle, getFormattedUserName } from '@/services/storage';

export default function ShareStudioScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [userGender, setUserGender] = useState<'male' | 'female' | 'neutral'>('male');
  const [userProfileName, setUserProfileName] = useState<string>('शिव शिष्य');

  useFocusEffect(
    useCallback(() => {
      StorageService.getPreferences().then((p) => {
        setUserGender(p.userGender || 'male');
        const formatted = getFormattedUserName(p);
        if (formatted) {
          setUserProfileName(formatted);
        }
      });
    }, [])
  );

  const activeThemeTemplate: ShareTemplate = {
    id: 'st-active-app-theme',
    title: `🎨 आपकी थीम (${theme.nameHindi})`,
    category: 'personal',
    style: 'premium',
    bgGradient: [theme.primaryDark, theme.primary],
    textColor: theme.textWhite,
    accentColor: theme.accent,
    defaultText: getFirstSutraText(userGender),
    defaultAuthor: `- ${getDiscipleTitle(userGender)}`,
    artworkUrl: '',
  };

  const allTemplates = [activeThemeTemplate, ...shareTemplates];
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate>(activeThemeTemplate);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="शिव सुविचार" subtitle="डिजाइन चुनें • नाम दर्ज करें • साझा करें" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Full-Screen Reels Mode Feature Banner */}
        <TouchableOpacity
          style={[styles.reelsBanner, { backgroundColor: theme.cardBgMaroon, borderColor: theme.accent }]}
          onPress={() => router.push('/quote-reels' as any)}
          activeOpacity={0.9}
        >
          <View style={styles.reelsBannerLeft}>
            <View style={[styles.reelsBadge, { backgroundColor: theme.accent, borderColor: theme.accent }]}>
              <Text style={[styles.reelsBadgeText, { color: theme.primaryDark }]}>✨ 100+ पावन विचार रील्स</Text>
            </View>
            <Text style={[styles.reelsBannerTitle, { color: theme.textGold }]}>🎬 विचार रिल्स स्क्रॉल (Reels Mode)</Text>
            <Text style={[styles.reelsBannerSub, { color: theme.textWhite }]}>
              फुल-स्क्रीन शिव वॉलपेपर पर 100 विचार स्क्रॉल करें, सहेजें और शेयर करें ➔
            </Text>
          </View>
          <View style={[styles.reelsPlayCircle, { backgroundColor: theme.accent }]}>
            <Text style={styles.reelsPlayIcon}>▶️</Text>
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionHeaderTitle, { color: theme.primary }]}>टैम्पलेट स्टाइल चुनें 🎨</Text>
        <Text style={[styles.sectionHeaderSub, { color: theme.textSecondary }]}>
          अपनी पसंद की रंग शैली चुनें और अपना नाम लिखकर शेयर कार्ड बनाएँ:
        </Text>

        {/* Template Selector Horizontal List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.templateScroll}
          contentContainerStyle={styles.templateScrollContainer}
        >
          {allTemplates.map((template) => {
            const isSelected = template.id === selectedTemplate.id;
            return (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templatePill,
                  { backgroundColor: template.bgGradient[0] },
                  isSelected && styles.templatePillSelected,
                ]}
                onPress={() => setSelectedTemplate(template)}
                activeOpacity={0.8}
              >
                <Text style={styles.templatePillTitle}>{template.title}</Text>
                <Text style={styles.templatePillStyle}>
                  {isSelected ? '✓ चयनित' : 'रंग शैली'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Live Card Renderer & Customization Form */}
        <ShareCardRenderer key={selectedTemplate.id + userProfileName} template={selectedTemplate} userName={userProfileName} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  reelsBanner: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.8,
    borderColor: colors.goldPrimary,
    ...shadows.gold,
  },
  reelsBannerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  reelsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.goldPrimary,
    marginBottom: 6,
  },
  reelsBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  reelsBannerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.goldLight,
    letterSpacing: 0.3,
  },
  reelsBannerSub: {
    fontSize: 12,
    color: colors.bgIvory,
    opacity: 0.9,
    marginTop: 4,
    lineHeight: 17,
  },
  reelsPlayCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  reelsPlayIcon: {
    fontSize: 20,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionHeaderSub: {
    fontSize: 12,
    marginBottom: 12,
  },
  templateScroll: {
    marginBottom: 16,
  },
  templateScrollContainer: {
    paddingRight: 12,
  },
  templatePill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 10,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  templatePillSelected: {
    borderColor: colors.goldLight,
    borderWidth: 2.5,
    transform: [{ scale: 1.05 }],
  },
  templatePillTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  templatePillStyle: {
    fontSize: 10,
    color: colors.goldLight,
    marginTop: 2,
    fontWeight: '600',
  },
});
