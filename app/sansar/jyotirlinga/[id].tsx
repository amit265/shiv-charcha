import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/common/Header';
import { jyotirlingas } from '@/content/sansar/jyotirlingas';
import { resolveImageSource } from '@/constants/imageAssets';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';
import { shadows } from '@/theme/colors';

import { FormattedText } from '@/components/common/FormattedText';
import { ContextualCrossPromotion } from '@/components/common/ContextualCrossPromotion';
import { SmartBanner } from '@/components/common/SmartBanner';
import { NativeAdCard } from '@/components/common/NativeAdCard';

export default function JyotirlingaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  const item = jyotirlingas.find((j) => j.id === id) || jyotirlingas[0];

  const handleShare = async () => {
    await safeShare({
      title: item.title,
      message: `🛕 *${item.nameHindi}*\n📍 ${item.location}, ${item.state}\n\n${item.summaryHindi}\n\nशिव चर्चा ऐप - 12 ज्योतिर्लिंग दर्शन 🔱`,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={item.nameHindi} subtitle={`${item.location}, ${item.state}`} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cover Image & Title */}
        <View style={styles.coverWrapper}>
          <Image
            source={resolveImageSource(item.image || item.id, 'jyotirlinga')}
            style={styles.coverImage}
            resizeMode="contain"
          />
          <View style={styles.coverOverlay}>
            <Text style={styles.locationBadge}>📍 {item.location}, {item.state}</Text>
            <Text style={styles.heroTitle}>{item.nameHindi}</Text>
            <Text style={styles.heroSub}>{item.significance}</Text>
          </View>
        </View>

        {/* Audio Action Button */}
        {item.audioUrl && (
          <View style={[styles.audioBanner, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
            <View style={styles.audioTextCol}>
              <Text style={[styles.audioBannerTitle, { color: theme.primary }]}>🎧 ज्योतिर्लिंग कथा सुनें</Text>
              <Text style={[styles.audioBannerSub, { color: theme.textSecondary }]}>
                पावन उत्पत्ति व महिमा का सरल हिंदी ऑडियो
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.audioPlayBtn, { backgroundColor: theme.primary }]}
              onPress={() =>
                playTrack({
                  id: item.id,
                  title: item.title,
                  subtitle: `${item.location}, ${item.state}`,
                  category: 'teachings',
                  duration: item.audioDuration || 240,
                  audioUrl: item.audioUrl || '',
                  coverImage: item.image,
                })
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.audioPlayText, { color: theme.textWhite }]}>▶️ सुनें</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION: संक्षिप्त सार */}
        <View style={[styles.sectionBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>💡 संक्षिप्त सार एवं मान्यता</Text>
          <FormattedText text={item.summaryHindi} style={[styles.bodyText, { color: theme.textPrimary }]} />
        </View>

        {/* Inline Native Ad */}
        <NativeAdCard forceShow />

        {/* SECTION: पौराणिक इतिहास व कथा */}
        <View style={[styles.sectionBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>📖 पौराणिक उत्पत्ति एवं इतिहास</Text>
          <FormattedText text={item.detailedHistory} style={[styles.bodyText, { color: theme.textPrimary }]} />

          {item.relatedFestivals && item.relatedFestivals.length > 0 && (
            <View style={[styles.festivalsBox, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.festivalsTitle, { color: theme.primary }]}>🎉 प्रमुख पर्व एवं उत्सव:</Text>
              <Text style={[styles.festivalsList, { color: theme.textSecondary }]}>
                {item.relatedFestivals.join(' • ')}
              </Text>
            </View>
          )}
        </View>

        {/* Cross Promotion Card for Jyotirlinga Explorer */}
        <ContextualCrossPromotion targetAppId="jyotirlinga" style={{ paddingHorizontal: 0 }} />

        {/* MAP & SHARE ACTION BUTTONS */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push(`/sansar/yatra?focusId=${item.id}` as any)}
            activeOpacity={0.85}
          >
            <Text style={[styles.actionBtnText, { color: theme.textWhite }]}>📍 नक्शे (Map) पर स्थान देखें</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={[styles.outlineBtnText, { color: theme.primary }]}>📤 साझा करें</Text>
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  coverWrapper: {
    width: '100%',
    minHeight: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#0F172A',
    ...shadows.medium,
  },
  coverImage: {
    ...StyleSheet.absoluteFill,
  },
  coverOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    padding: 16,
    justifyContent: 'flex-end',
    minHeight: 180,
  },
  locationBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD54F',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  audioBanner: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  audioTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  audioBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioBannerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  audioPlayBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  audioPlayText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionBox: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    ...shadows.soft,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  festivalsBox: {
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  festivalsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  festivalsList: {
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  actionBtn: {
    flex: 1.4,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  outlineBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  outlineBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
