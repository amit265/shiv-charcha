import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { booksLibrary } from '@/content/books';
import { resolveImageSource } from '@/constants/imageAssets';
import { colors, shadows } from '@/theme/colors';
import { useAudio } from '@/context/AudioContext';
import { FormattedText } from '@/components/common/FormattedText';
import { SmartBanner } from '@/components/common/SmartBanner';
import { NativeAdCard } from '@/components/common/NativeAdCard';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { playTrack } = useAudio();
  const book = booksLibrary.find(b => b.id === id) || booksLibrary[0];
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const chapter = book.chapters[activeChapterIndex] || book.chapters[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="📖 पुस्तक अध्ययन" subtitle={book.title} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Book Header Card */}
        <View style={[styles.bookHeaderCard, { backgroundColor: theme.cardBgMaroon, borderColor: theme.accent }]}>
          <Image source={resolveImageSource(book.id || book.coverImage, 'book')} style={styles.coverImage} />
          <View style={styles.headerMeta}>
            <Text style={[styles.bookTitle, { color: theme.textGold }]}>{book.title}</Text>
            <Text style={[styles.authorText, { color: theme.textWhite }]}>लेखक: {book.author}</Text>
            <Text style={[styles.easyHighlight, { color: theme.accent }]}>✨ आसान भाषा में अध्याय सार</Text>
            <Text style={[styles.descText, { color: theme.textWhite }]}>{book.description}</Text>
          </View>
        </View>

        {/* Chapter Selector Tabs */}
        {book.chapters.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapTabsScroll}>
            {book.chapters.map((chap, idx) => {
              const isActive = activeChapterIndex === idx;
              return (
                <TouchableOpacity
                  key={chap.id}
                  style={[
                    styles.chapTabBtn,
                    {
                      backgroundColor: isActive ? theme.primary : theme.cardBg,
                      borderColor: isActive ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => setActiveChapterIndex(idx)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chapTabText,
                      { color: isActive ? theme.textWhite : theme.textPrimary },
                    ]}
                  >
                    अध्याय {chap.chapterNumber}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Chapter Content Card */}
        {chapter && (
          <View style={[styles.chapterCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={[styles.chapterTitle, { color: theme.primary }]}>{chapter.title}</Text>

            {/* "आसान भाषा में समझें" Featured Box */}
            <View style={[styles.easySummaryBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
              <Text style={[styles.easyHeader, { color: theme.primary }]}>💡 आसान भाषा में समझें:</Text>
              <FormattedText text={chapter.summaryHindi} style={[styles.easyContent, { color: theme.textPrimary }]} />
            </View>

            {/* Inline Native Ad */}
            <NativeAdCard forceShow />

            {/* Key Lessons */}
            <Text style={[styles.sectionHeading, { color: theme.primary }]}>🎯 मुख्य सीख:</Text>
            {chapter.keyLessons.map((lesson, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: theme.primary }]}>•</Text>
                <FormattedText text={lesson} style={[styles.bulletText, { color: theme.textSecondary }]} />
              </View>
            ))}

            {/* Daily Life Connection */}
            <View style={[styles.dailyConnectionBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Text style={[styles.dailyHeader, { color: theme.primary }]}>🌱 आज की जिंदगी से संबंध:</Text>
              <FormattedText text={chapter.dailyLifeConnection} style={[styles.dailyText, { color: theme.textSecondary }]} />
            </View>

            {/* Audio Explanation Button */}
            {chapter.audioUrl && (
              <TouchableOpacity
                style={[styles.audioBtn, { backgroundColor: theme.primary }]}
                onPress={() =>
                  playTrack({
                    id: chapter.id,
                    title: `${book.title} - ${chapter.title}`,
                    subtitle: 'अध्याय ऑडियो व्याख्या',
                    category: 'teachings',
                    duration: chapter.audioDuration || 300,
                    audioUrl: chapter.audioUrl || '',
                    coverImage: book.coverImage,
                    artist: book.author,
                  })
                }
                activeOpacity={0.8}
              >
                <Text style={[styles.audioBtnText, { color: theme.textWhite }]}>🎧 अध्याय का ऑडियो व्याख्यान सुनें</Text>
              </TouchableOpacity>
            )}

            {/* Full Chapter Text */}
            <Text style={[styles.sectionHeading, { color: theme.primary }]}>📖 विस्तृत पाठ:</Text>
            <FormattedText text={chapter.fullText} style={[styles.fullText, { color: theme.textPrimary }]} />
          </View>
        )}
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
  bookHeaderCard: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
    ...shadows.medium,
  },
  coverImage: {
    width: 90,
    height: 125,
    borderRadius: 12,
    marginRight: 14,
  },
  headerMeta: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  authorText: {
    fontSize: 12,
    color: colors.bgIvory,
    opacity: 0.85,
    marginTop: 2,
  },
  easyHighlight: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.goldPrimary,
    marginTop: 6,
  },
  descText: {
    fontSize: 12,
    color: colors.bgIvory,
    opacity: 0.9,
    marginTop: 4,
    lineHeight: 16,
  },
  chapTabsScroll: {
    marginBottom: 16,
  },
  chapTabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.cardBgAmber,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  chapTabBtnActive: {
    backgroundColor: colors.goldPrimary,
  },
  chapTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  chapTabTextActive: {
    color: colors.maroonDark,
  },
  chapterCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginBottom: 14,
  },
  easySummaryBox: {
    backgroundColor: colors.bgSoftAmber,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  easyHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.saffronDark,
    marginBottom: 6,
  },
  easyContent: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginTop: 14,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 10,
  },
  bulletDot: {
    fontSize: 16,
    color: colors.saffronDark,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 13,
    color: colors.textMedium,
    lineHeight: 18,
    flex: 1,
  },
  dailyConnectionBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 14,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  dailyHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  dailyText: {
    fontSize: 13,
    color: '#1B5E20',
    lineHeight: 18,
  },
  audioBtn: {
    backgroundColor: colors.saffronPrimary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 14,
  },
  audioBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  fullText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 24,
    marginTop: 4,
  },
});
