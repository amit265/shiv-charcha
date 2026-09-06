import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/common/Header';
import { shivaStotras } from '@/content/sansar/stotras';
import { useAudio } from '@/context/AudioContext';
import { RelatedContentSection } from '@/components/sansar/RelatedContentSection';
import { safeShare } from '@/services/shareService';
import { shadows } from '@/theme/colors';
import { FormattedText } from '@/components/common/FormattedText';

export default function ShivaStotraDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  const stotra = shivaStotras.find((s) => s.id === id) || shivaStotras[0];

  const handleShareStotra = async () => {
    await safeShare({
      title: stotra.title,
      message: `📿 *${stotra.title}*\n"${stotra.subtitle}"\n\n${stotra.shareCardPrompt}\n\nशिव चर्चा ऐप - शिव संसार 🔱`,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={stotra.title} subtitle={stotra.subtitle} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cover Artwork */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: stotra.image }} style={styles.coverImage} />
          <View style={styles.coverOverlay}>
            <Text style={[styles.authorTag, { backgroundColor: theme.primary, color: theme.textWhite }]}>
              ✍️ रचयिता: {stotra.author}
            </Text>
            <Text style={styles.heroTitle}>{stotra.title}</Text>
            <Text style={styles.heroSub}>{stotra.subtitle}</Text>
          </View>
        </View>

        {/* Audio Player Action Banner */}
        {stotra.audioUrl && (
          <View style={[styles.audioBanner, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
            <View style={styles.audioTextCol}>
              <Text style={[styles.audioBannerTitle, { color: theme.primary }]}>🎧 स्तोत्र पाठ सुनें</Text>
              <Text style={[styles.audioBannerSub, { color: theme.textSecondary }]}>
                लगभग {Math.floor((stotra.audioDuration || 200) / 60)} मिनट • शुद्ध संस्कृत ध्वन्यात्मक पाठ
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.audioPlayBtn, { backgroundColor: theme.primary }]}
              onPress={() =>
                playTrack({
                  id: stotra.id,
                  title: stotra.title,
                  subtitle: stotra.subtitle,
                  category: 'teachings',
                  duration: stotra.audioDuration || 200,
                  audioUrl: stotra.audioUrl || '',
                  coverImage: stotra.image,
                })
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.audioPlayText, { color: theme.textWhite }]}>▶️ सुनें</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION: स्तोत्र की पृष्ठभूमि व कथा */}
        <View style={[styles.sectionBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>📖 पृष्ठभूमि एवं कथा</Text>
          <FormattedText text={stotra.summaryHindi} style={[styles.summaryText, { color: theme.textPrimary }]} />
        </View>

        {/* SECTION: फलश्रुति व लाभ */}
        <View style={[styles.sectionBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>✨ फलश्रुति एवं साधना लाभ</Text>
          <FormattedText text={stotra.benefits} style={[styles.summaryText, { color: theme.textPrimary }]} />
        </View>

        {/* SECTION: संस्कृत श्लोक एवं हिंदी अनुवाद */}
        <View style={[styles.sectionBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>📜 श्लोक एवं हिंदी अनुवाद</Text>

          {stotra.verses.map((verse, index) => (
            <View
              key={index}
              style={[
                styles.verseCard,
                { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold },
              ]}
            >
              <View style={[styles.verseNumberBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.verseNumberText}>श्लोक {index + 1}</Text>
              </View>

              <Text style={[styles.sanskritVerse, { color: theme.primary }]}>{verse.sanskrit}</Text>
              <View style={styles.divider} />
              <Text style={[styles.hindiMeaningTitle, { color: theme.secondary }]}>💡 सरल हिंदी भावार्थ:</Text>
              <FormattedText text={verse.hindiMeaning} style={[styles.hindiMeaning, { color: theme.textPrimary }]} />
            </View>
          ))}

          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: theme.primary }]} onPress={handleShareStotra}>
            <Text style={[styles.shareBtnText, { color: theme.textWhite }]}>📤 यह स्तोत्र साझा करें</Text>
          </TouchableOpacity>
        </View>

        {/* RELATED CONTENT GRAPH */}
        <RelatedContentSection
          items={[
            {
              id: 'jyotirlinga',
              title: '12 ज्योतिर्लिंग दर्शन',
              subtitle: 'सोमनाथ से घृष्णेश्वर तक द्वादश पावन धाम',
              type: 'jyotirlinga',
              routePath: '/sansar/jyotirlinga',
              image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=400&auto=format&fit=crop',
            },
            {
              id: 'stories',
              title: 'शिव महापुराण कथाएँ',
              subtitle: 'सती, पार्वती व गंगा अवतरण',
              type: 'story',
              routePath: '/sansar/stories',
              image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
            },
            {
              id: 'symbols',
              title: 'शिव के दिव्य प्रतीक',
              subtitle: 'त्रिशूल, डमरू व रुद्राक्ष का रहस्य',
              type: 'symbol',
              routePath: '/sansar/symbols',
              image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop',
            },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
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
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.medium,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  authorTag: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 13,
    color: '#FFE082',
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
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
  },
  verseCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  verseNumberBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  verseNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sanskritVerse: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 24,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    marginVertical: 10,
  },
  hindiMeaningTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hindiMeaning: {
    fontSize: 13,
    lineHeight: 20,
  },
  shareBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
