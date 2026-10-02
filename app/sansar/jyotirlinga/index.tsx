import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { jyotirlingas } from '@/content/sansar/jyotirlingas';
import { resolveImageSource } from '@/constants/imageAssets';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';
import { SmartBanner } from '@/components/common/SmartBanner';

export default function JyotirlingaListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🛕 12 ज्योतिर्लिंग" subtitle="द्वादश पावन धाम दर्शन व महिमा" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>सौराष्ट्र सोमनाथं च श्रीशैले मल्लिकार्जुनम्</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>
            द्वादश ज्योतिर्लिंगों के दर्शन मात्र से पापों का शमन होता है।
          </Text>

          <TouchableOpacity
            style={[styles.mapShortcutBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/sansar/yatra' as any)}
            activeOpacity={0.85}
          >
            <Text style={[styles.mapShortcutText, { color: theme.textWhite }]}>📍 शिव यात्रा (Interactive Map) में देखें</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {jyotirlingas.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              onPress={() => router.push(`/sansar/jyotirlinga/${item.id}` as any)}
              activeOpacity={0.88}
            >
              <Image
                source={resolveImageSource(item.image || item.id, 'jyotirlinga')}
                style={styles.cardImage}
                resizeMode="contain"
              />

              <View style={styles.cardContent}>
                <View style={styles.numBadgeRow}>
                  <Text style={[styles.numBadge, { backgroundColor: theme.primary, color: theme.textWhite }]}>
                    #{idx + 1}
                  </Text>
                  <Text style={[styles.locationText, { color: theme.textMuted }]}>
                    📍 {item.location}, {item.state}
                  </Text>
                </View>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardSub, { color: theme.textSecondary }]} numberOfLines={2}>
                  {item.summaryHindi}
                </Text>

                <View style={styles.cardActions}>
                  {item.audioUrl && (
                    <TouchableOpacity
                      style={[styles.listenBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                      onPress={(e) => {
                        e.stopPropagation();
                        playTrack({
                          id: item.id,
                          title: item.title,
                          subtitle: `${item.location}, ${item.state}`,
                          category: 'teachings',
                          duration: item.audioDuration || 240,
                          audioUrl: item.audioUrl || '',
                          coverImage: item.image,
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.listenBtnText, { color: theme.primary }]}>🎧 कथा सुनें</Text>
                    </TouchableOpacity>
                  )}

                  <View style={[styles.detailBtn, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.detailBtnText, { color: theme.textWhite }]}>दर्शन ➔</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  introBox: {
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  introSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  mapShortcutBtn: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...shadows.soft,
  },
  mapShortcutText: {
    fontSize: 13,
    fontWeight: 'bold',
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
    backgroundColor: '#0F172A',
  },
  cardContent: {
    padding: 16,
  },
  numBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  numBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  locationText: {
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
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  listenBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  listenBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailBtn: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
