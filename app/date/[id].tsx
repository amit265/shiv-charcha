import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { sacredDates } from '@/content/dates';
import { resolveImageSource } from '@/constants/imageAssets';
import { colors, shadows } from '@/theme/colors';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';
import { FormattedText } from '@/components/common/FormattedText';
import { SmartBanner } from '@/components/common/SmartBanner';

export default function SacredDateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();
  const dateItem = sacredDates.find(d => d.id === id) || sacredDates[0];

  const handleShare = async () => {
    await safeShare({
      title: dateItem.title,
      message: `🌺 *${dateItem.title}*\n${dateItem.subtitle}\n\n${dateItem.description}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="📅 पावन दिवस स्मरण" subtitle={dateItem.title} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large Devotional Artwork */}
        <Image
          source={resolveImageSource(dateItem.id || dateItem.imageUrl, 'hero')}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <View style={[styles.contentCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.dateTag, { color: theme.primary }]}>📅 {dateItem.date} पावन तिथि</Text>
          <Text style={[styles.title, { color: theme.primary }]}>{dateItem.title}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{dateItem.subtitle}</Text>

          {/* Audio Button */}
          {dateItem.audioUrl && (
            <TouchableOpacity
              style={[styles.audioBtn, { backgroundColor: theme.primary }]}
              onPress={() =>
                playTrack({
                  id: dateItem.id,
                  title: dateItem.title,
                  subtitle: dateItem.subtitle,
                  category: 'special_day',
                  duration: 210,
                  audioUrl: dateItem.audioUrl || '',
                  coverImage: dateItem.imageUrl,
                })
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.audioBtnText, { color: theme.textWhite }]}>🎧 ऑडियो स्मरण व्याख्यान सुनें</Text>
            </TouchableOpacity>
          )}

          {/* Description */}
          <FormattedText text={dateItem.description} style={[styles.descText, { color: theme.textPrimary }]} />

          {/* Detailed Text */}
          <Text style={[styles.sectionHeading, { color: theme.primary }]}>📖 पावन संस्मरण व महत्व:</Text>
          <FormattedText text={dateItem.detailedText} style={[styles.fullText, { color: theme.textPrimary }]} />

          {/* Quick Actions */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCardBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
              onPress={() => router.push('/jap' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>📿</Text>
              <Text style={[styles.actionText, { color: theme.textPrimary }]}>108 जाप करें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCardBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
              onPress={() => router.push('/share' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🖼️</Text>
              <Text style={[styles.actionText, { color: theme.textPrimary }]}>शेयर कार्ड बनाएं</Text>
            </TouchableOpacity>
          </View>

          {/* Share Button */}
          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: theme.primary }]} onPress={handleShare} activeOpacity={0.8}>
            <Text style={[styles.shareBtnText, { color: theme.textWhite }]}>📤 यह स्मरण संदेश साझा करें</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SmartBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgIvory,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  heroImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    marginBottom: 16,
  },
  contentCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  dateTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.saffronDark,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMedium,
    marginTop: 2,
    marginBottom: 14,
  },
  audioBtn: {
    backgroundColor: colors.saffronPrimary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  audioBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  descText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginTop: 10,
    marginBottom: 8,
  },
  fullText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionCardBtn: {
    backgroundColor: colors.cardBgAmber,
    borderRadius: 16,
    padding: 14,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  shareBtn: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
});
