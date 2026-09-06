import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/common/Header';
import { shivaStories } from '@/content/sansar/stories';
import { useAudio } from '@/context/AudioContext';
import { RelatedContentSection } from '@/components/sansar/RelatedContentSection';
import { safeShare } from '@/services/shareService';
import { shadows } from '@/theme/colors';
import { FormattedText } from '@/components/common/FormattedText';

export default function ShivaStoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const story = shivaStories.find((s) => s.id === id) || shivaStories[0];

  const handleShareStory = async () => {
    await safeShare({
      title: story.title,
      message: `📖 *${story.title}*\n"${story.subtitle}"\n\n${story.shortSummaryHindi}\n\nशिव चर्चा ऐप - शिव संसार 🔱`,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={story.title} subtitle={story.subtitle} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cover Artwork */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: story.coverImage }} style={styles.coverImage} />
          <View style={styles.coverOverlay}>
            {story.tradition && (
              <Text style={[styles.traditionTag, { backgroundColor: theme.primary, color: theme.textWhite }]}>
                📜 {story.tradition}
              </Text>
            )}
            <Text style={styles.heroTitle}>{story.title}</Text>
            <Text style={styles.heroSub}>{story.subtitle}</Text>
          </View>
        </View>

        {/* Audio Player Action Box */}
        {story.audioUrl && (
          <View style={[styles.audioBanner, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
            <View style={styles.audioTextCol}>
              <Text style={[styles.audioBannerTitle, { color: theme.primary }]}>🎧 कहानी सुनें (ऑडियो)</Text>
              <Text style={[styles.audioBannerSub, { color: theme.textSecondary }]}>
                लगभग {Math.floor((story.audioDuration || 300) / 60)} मिनट • सुलभ हिंदी स्वर
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.audioPlayBtn, { backgroundColor: theme.primary }]}
              onPress={() =>
                playTrack({
                  id: story.id,
                  title: story.title,
                  subtitle: story.subtitle,
                  category: 'teachings',
                  duration: story.audioDuration || 300,
                  audioUrl: story.audioUrl || '',
                  coverImage: story.coverImage,
                })
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.audioPlayText, { color: theme.textWhite }]}>▶️ सुनें</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION: कहानी का सरल सार */}
        <View style={[styles.sectionBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>💡 कहानी का सरल सार</Text>
          <FormattedText text={story.shortSummaryHindi} style={[styles.summaryText, { color: theme.textPrimary }]} />
        </View>

        {/* SECTION: VISUAL STORY MODE (दृश्य कथा) */}
        {story.visualScenes && story.visualScenes.length > 0 && (
          <View style={[styles.visualModeContainer, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={[styles.sectionHeader, { color: theme.primary }]}>🖼️ दृश्य कथा मोड (Visual Scenes)</Text>
            <Text style={[styles.visualModeSub, { color: theme.textSecondary }]}>
              दृश्यों के माध्यम से कथा क्रम समझें (दृश्य {activeSceneIndex + 1} / {story.visualScenes.length})
            </Text>

            {/* Scene Stepper Buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sceneTabsRow}>
              {story.visualScenes.map((scene, idx) => (
                <TouchableOpacity
                  key={scene.sceneNumber}
                  style={[
                    styles.sceneTabBtn,
                    {
                      backgroundColor: activeSceneIndex === idx ? theme.primary : theme.surfaceElevated,
                      borderColor: activeSceneIndex === idx ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setActiveSceneIndex(idx)}
                >
                  <Text
                    style={[
                      styles.sceneTabText,
                      { color: activeSceneIndex === idx ? theme.textWhite : theme.textPrimary },
                    ]}
                  >
                    दृश्य {scene.sceneNumber}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Active Scene Display */}
            {story.visualScenes[activeSceneIndex] && (
              <View style={styles.activeSceneCard}>
                <Image
                  source={{ uri: story.visualScenes[activeSceneIndex].image }}
                  style={styles.sceneImage}
                />
                <Text style={[styles.sceneTitle, { color: theme.textPrimary }]}>
                  {story.visualScenes[activeSceneIndex].title}
                </Text>
                <Text style={[styles.sceneDesc, { color: theme.textSecondary }]}>
                  {story.visualScenes[activeSceneIndex].description}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* SECTION: विस्तार से पढ़ें */}
        <View style={[styles.sectionBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>📖 विस्तार से पढ़ें</Text>
          <FormattedText text={story.detailedText} style={[styles.detailedText, { color: theme.textPrimary }]} />

          {story.sourceReference && (
            <View style={[styles.sourceBox, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.sourceText, { color: theme.textMuted }]}>
                📌 कथा स्रोत एवं प्रमाणिकता: {story.sourceReference}
              </Text>
            </View>
          )}

          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: theme.primary }]} onPress={handleShareStory}>
            <Text style={[styles.shareBtnText, { color: theme.textWhite }]}>📤 कथा साझा करें</Text>
          </TouchableOpacity>
        </View>

        {/* RELATED CONTENT GRAPH */}
        <RelatedContentSection items={story.relatedContent} />
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
  traditionTag: {
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
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
  },
  visualModeContainer: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    ...shadows.soft,
  },
  visualModeSub: {
    fontSize: 12,
    marginBottom: 12,
  },
  sceneTabsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sceneTabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
  sceneTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeSceneCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  sceneImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  sceneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sceneDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  detailedText: {
    fontSize: 14,
    lineHeight: 23,
  },
  sourceBox: {
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    marginBottom: 14,
  },
  sourceText: {
    fontSize: 12,
    lineHeight: 17,
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
