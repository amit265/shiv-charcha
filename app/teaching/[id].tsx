import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { teachingTopics } from '@/content/teachings';
import { resolveImageSource } from '@/constants/imageAssets';
import { colors, shadows } from '@/theme/colors';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';

import { FormattedText } from '@/components/common/FormattedText';
import { SmartBanner } from '@/components/common/SmartBanner';
import { NativeAdCard } from '@/components/common/NativeAdCard';
import { AdManager } from '@/services/analytics/AdManager';

export default function TeachingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { playTrack } = useAudio();
  const topic = teachingTopics.find(t => t.id === id) || teachingTopics[0];
  const [fontScale, setFontScale] = React.useState(1.0);

  React.useEffect(() => {
    void AdManager.registerClickAndShowAd();
  }, []);

  const handleShare = async () => {
    await safeShare({
      title: topic.title,
      message: `💡 *${topic.title}*\n\n${topic.summary}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="💡 शिव गुरु ज्ञान" subtitle={topic.title} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Topic Header Image */}
        {topic.imageUrl ? (
          <Image
            source={resolveImageSource(topic.id || topic.imageUrl, 'teaching')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        ) : null}

        {/* Font Scaling & Reading Controls */}
        <View style={[styles.fontControlRow, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <Text style={[styles.fontControlLabel, { color: theme.textMuted }]}>अक्षर आकार (Font):</Text>
          <TouchableOpacity
            style={[styles.fontScaleBtn, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => setFontScale((prev) => Math.max(0.85, prev - 0.15))}
            activeOpacity={0.7}
          >
            <Text style={[styles.fontScaleBtnText, { color: theme.primary }]}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fontScaleBtn, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => setFontScale(1.0)}
            activeOpacity={0.7}
          >
            <Text style={[styles.fontScaleBtnText, { color: theme.primary }]}>सामान्य</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fontScaleBtn, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => setFontScale((prev) => Math.min(1.45, prev + 0.15))}
            activeOpacity={0.7}
          >
            <Text style={[styles.fontScaleBtnText, { color: theme.primary }]}>A+</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.contentCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.primary, fontSize: 20 * fontScale }]}>{topic.title}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>{topic.subTitle}</Text>

          {/* Audio Bar */}
          {topic.audioUrl && (
            <TouchableOpacity
              style={[styles.audioBar, { backgroundColor: theme.primary }]}
              onPress={() =>
                playTrack({
                  id: topic.id,
                  title: topic.title,
                  subtitle: topic.subTitle,
                  category: 'teachings',
                  duration: topic.audioDuration || 180,
                  audioUrl: topic.audioUrl || '',
                  coverImage: topic.imageUrl || '',
                })
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.audioBarText, { color: theme.textWhite }]}>🎧 सुनें (Audio Explanation)</Text>
            </TouchableOpacity>
          )}

          {/* Summary Box */}
          <View style={[styles.summaryBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
            <Text style={[styles.summaryTitle, { color: theme.primary }]}>सरल सार (संक्षेप में):</Text>
            <FormattedText text={topic.summary} style={[styles.summaryText, { color: theme.textPrimary, fontSize: 14 * fontScale, lineHeight: 22 * fontScale }]} />
          </View>

          {/* Inline Native Ad */}
          <NativeAdCard forceShow />

          {/* Key Takeaways */}
          <Text style={[styles.sectionHeading, { color: theme.primary }]}>🎯 मुख्य बिंदु:</Text>
          {topic.keyTakeaways.map((item, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: theme.primary }]}>•</Text>
              <FormattedText text={item} style={[styles.bulletText, { color: theme.textSecondary, fontSize: 14 * fontScale }]} />
            </View>
          ))}

          {/* Practical Examples */}
          {topic.practicalExamples && topic.practicalExamples.length > 0 && (
            <View style={[styles.examplesBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Text style={[styles.examplesTitle, { color: theme.primary }]}>🌱 दैनिक जीवन में प्रयोग:</Text>
              {topic.practicalExamples.map((ex, idx) => (
                <Text key={idx} style={[styles.exampleItem, { color: theme.textPrimary, fontSize: 13 * fontScale }]}>
                  - <FormattedText text={ex} />
                </Text>
              ))}
            </View>
          )}

          {/* Full Text */}
          <Text style={[styles.sectionHeading, { color: theme.primary }]}>📖 विस्तृत विवेचन:</Text>
          <FormattedText text={topic.fullContent} style={[styles.fullText, { color: theme.textPrimary, fontSize: 15 * fontScale, lineHeight: 24 * fontScale }]} />

          {/* Share Button */}
          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: theme.primary }]} onPress={handleShare} activeOpacity={0.8}>
            <Text style={[styles.shareBtnText, { color: theme.textWhite }]}>📤 यह ज्ञान संदेश साझा करें</Text>
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
    height: 180,
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.saffronDark,
    marginTop: 4,
    marginBottom: 14,
  },
  audioBar: {
    backgroundColor: colors.saffronPrimary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  audioBarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  summaryBox: {
    backgroundColor: colors.bgSoftAmber,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.saffronDark,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginTop: 14,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 16,
    color: colors.saffronDark,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 13,
    color: colors.textMedium,
    flex: 1,
    lineHeight: 18,
  },
  examplesBox: {
    backgroundColor: '#FFF8E7',
    borderRadius: 14,
    padding: 14,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  examplesTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginBottom: 6,
  },
  exampleItem: {
    fontSize: 13,
    color: colors.textDark,
    lineHeight: 18,
    marginBottom: 4,
  },
  fullText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 24,
    marginTop: 4,
  },
  shareBtn: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  fontControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  fontControlLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 4,
  },
  fontScaleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  fontScaleBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
