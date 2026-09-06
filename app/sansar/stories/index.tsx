import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shivaStories } from '@/content/sansar/stories';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';

export default function ShivaStoriesListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="📖 शिव कथाएँ" subtitle="पौराणिक गाथाएँ • ऑडियो • दृश्य कथा" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerInfo}>
          <Text style={[styles.infoTitle, { color: theme.primary }]}>शिव महापुराण एवं पौराणिक कथाएँ</Text>
          <Text style={[styles.infoSub, { color: theme.textSecondary }]}>
            कहानी सुनें (Audio-first), दृश्यों के साथ समझें और विस्तार से अध्ययन करें।
          </Text>
        </View>

        {shivaStories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={[styles.storyCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => router.push(`/sansar/stories/${story.id}` as any)}
            activeOpacity={0.88}
          >
            <Image source={{ uri: story.coverImage }} style={styles.storyCover} />

            <View style={styles.storyContent}>
              <View style={styles.badgeRow}>
                {story.tradition && (
                  <Text style={[styles.traditionTag, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                    📜 {story.tradition}
                  </Text>
                )}
                {story.audioDuration && (
                  <Text style={[styles.audioTimeTag, { color: theme.secondary }]}>
                    ⏱️ {Math.floor(story.audioDuration / 60)} मिनट ऑडियो
                  </Text>
                )}
              </View>

              <Text style={[styles.storyTitle, { color: theme.textPrimary }]}>{story.title}</Text>
              <Text style={[styles.storySub, { color: theme.textSecondary }]}>{story.subtitle}</Text>
              <Text style={[styles.storySummary, { color: theme.textMuted }]} numberOfLines={2}>
                {story.shortSummaryHindi}
              </Text>

              <View style={styles.cardActions}>
                {story.audioUrl && (
                  <TouchableOpacity
                    style={[styles.playBtn, { backgroundColor: theme.primary }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      playTrack({
                        id: story.id,
                        title: story.title,
                        subtitle: story.subtitle,
                        category: 'teachings',
                        duration: story.audioDuration || 180,
                        audioUrl: story.audioUrl || '',
                        coverImage: story.coverImage,
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.playBtnText, { color: theme.textWhite }]}>▶️ कथा सुनें</Text>
                  </TouchableOpacity>
                )}

                <View style={[styles.readLink, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                  <Text style={[styles.readLinkText, { color: theme.primary }]}>📖 पढ़ें व चित्र देखें ➔</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  headerInfo: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSub: {
    fontSize: 12,
    marginTop: 2,
  },
  storyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    ...shadows.medium,
  },
  storyCover: {
    width: '100%',
    height: 170,
  },
  storyContent: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  traditionTag: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  audioTimeTag: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  storyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  storySub: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  storySummary: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  playBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  readLink: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  readLinkText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
