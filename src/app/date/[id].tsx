import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sacredDates } from '../../content/dates';
import { colors, shadows } from '../../theme/colors';
import { useAudio } from '../../context/AudioContext';

export default function SacredDateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { playTrack } = useAudio();
  const dateItem = sacredDates.find(d => d.id === id) || sacredDates[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌺 *${dateItem.title}*\n${dateItem.subtitle}\n\n${dateItem.description}\n\nशिव चर्चा ऐप — महाव्योम स्टूडियो`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large Devotional Artwork */}
        <Image source={{ uri: dateItem.imageUrl }} style={styles.heroImage} />

        <View style={styles.contentCard}>
          <Text style={styles.dateTag}>📅 {dateItem.date} पावन तिथि</Text>
          <Text style={styles.title}>{dateItem.title}</Text>
          <Text style={styles.subtitle}>{dateItem.subtitle}</Text>

          {/* Audio Button */}
          {dateItem.audioUrl && (
            <TouchableOpacity
              style={styles.audioBtn}
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
              <Text style={styles.audioBtnText}>🎧 ऑडियो स्मरण व्याख्यान सुनें</Text>
            </TouchableOpacity>
          )}

          {/* Description */}
          <Text style={styles.descText}>{dateItem.description}</Text>

          {/* Detailed Text */}
          <Text style={styles.sectionHeading}>📖 पावन संस्मरण व महत्व:</Text>
          <Text style={styles.fullText}>{dateItem.detailedText}</Text>

          {/* Quick Actions */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCardBtn}
              onPress={() => router.push('/jap' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>📿</Text>
              <Text style={styles.actionText}>108 जाप करें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCardBtn}
              onPress={() => router.push('/share' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🖼️</Text>
              <Text style={styles.actionText}>शेयर कार्ड बनाएं</Text>
            </TouchableOpacity>
          </View>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Text style={styles.shareBtnText}>📤 यह स्मरण संदेश साझा करें</Text>
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
    height: 220,
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
