import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { teachingTopics } from '../../content/teachings';
import { colors, shadows } from '../../theme/colors';
import { useAudio } from '../../context/AudioContext';
import { safeShare } from '../../services/shareService';

export default function TeachingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { playTrack } = useAudio();
  const topic = teachingTopics.find(t => t.id === id) || teachingTopics[0];

  const handleShare = async () => {
    await safeShare({
      title: topic.title,
      message: `💡 *${topic.title}*\n\n${topic.summary}\n\nशिव चर्चा ऐप — महाव्योम स्टूडियो`,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Topic Header Image */}
        {topic.imageUrl && (
          <Image source={{ uri: topic.imageUrl }} style={styles.heroImage} />
        )}

        <View style={styles.contentCard}>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.subtitle}>{topic.subTitle}</Text>

          {/* Audio Bar */}
          {topic.audioUrl && (
            <TouchableOpacity
              style={styles.audioBar}
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
              <Text style={styles.audioBarText}>🎧 सुनें (Audio Explanation)</Text>
            </TouchableOpacity>
          )}

          {/* Summary Box */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>सरल सार:</Text>
            <Text style={styles.summaryText}>{topic.summary}</Text>
          </View>

          {/* Key Takeaways */}
          <Text style={styles.sectionHeading}>🎯 मुख्य बिंदु:</Text>
          {topic.keyTakeaways.map((item, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}

          {/* Practical Examples */}
          {topic.practicalExamples && topic.practicalExamples.length > 0 && (
            <View style={styles.examplesBox}>
              <Text style={styles.examplesTitle}>🌱 दैनिक जीवन में प्रयोग:</Text>
              {topic.practicalExamples.map((ex, idx) => (
                <Text key={idx} style={styles.exampleItem}>
                  - {ex}
                </Text>
              ))}
            </View>
          )}

          {/* Full Text */}
          <Text style={styles.sectionHeading}>📖 विस्तृत विवेचन:</Text>
          <Text style={styles.fullText}>{topic.fullContent}</Text>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Text style={styles.shareBtnText}>📤 यह ज्ञान संदेश साझा करें</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});
