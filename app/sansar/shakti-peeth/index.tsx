import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shaktiPeethas } from '@/content/sansar/shaktiPeethas';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';

export default function ShaktiPeethListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🌺 शक्ति पीठ" subtitle="सती के पावन अंगों से बने 51 सिद्ध पीठ" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>भगवती जगदम्बा के पावन शक्ति स्थल</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>
            दक्ष यज्ञ के पश्चात् सती के पावन देह के अंग जहाँ-जहाँ गिरे, वे स्थान परम जाग्रत शक्ति पीठ बने।
          </Text>
        </View>

        <View style={styles.grid}>
          {shaktiPeethas.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              onPress={() => router.push(`/sansar/shakti-peeth/${item.id}` as any)}
              activeOpacity={0.88}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <View style={styles.badgeRow}>
                  <Text style={[styles.bodyPartTag, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                    🌺 अंग: {item.associatedBodyPart}
                  </Text>
                  <Text style={[styles.locationTag, { color: theme.textMuted }]}>
                    📍 {item.location}, {item.stateRegion}
                  </Text>
                </View>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardSub, { color: theme.textSecondary }]} numberOfLines={2}>
                  {item.summaryHindi}
                </Text>

                {item.traditionSource && (
                  <Text style={[styles.sourceNote, { color: theme.textMuted }]}>
                    📌 प्रमाण: {item.traditionSource}
                  </Text>
                )}

                <View style={styles.cardActions}>
                  {item.audioUrl && (
                    <TouchableOpacity
                      style={[styles.audioBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                      onPress={(e) => {
                        e.stopPropagation();
                        playTrack({
                          id: item.id,
                          title: item.title,
                          subtitle: `${item.location}, ${item.stateRegion}`,
                          category: 'teachings',
                          duration: item.audioDuration || 210,
                          audioUrl: item.audioUrl || '',
                          coverImage: item.image,
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.audioBtnText, { color: theme.primary }]}>🎧 कथा सुनें</Text>
                    </TouchableOpacity>
                  )}

                  <View style={[styles.viewBtn, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.viewBtnText, { color: theme.textWhite }]}>विस्तार देखें ➔</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: 100,
  },
  introBox: {
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  introSub: {
    fontSize: 12,
    marginTop: 2,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadows.soft,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bodyPartTag: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  locationTag: {
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  sourceNote: {
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  audioBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  audioBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewBtn: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
