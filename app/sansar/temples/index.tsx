import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { famousTemples } from '@/content/sansar/symbolsAndTemples';
import { resolveImageSource } from '@/constants/imageAssets';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';
import { shadows } from '@/theme/colors';

export default function FamousTemplesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  const handleShare = async (title: string, loc: string, history: string) => {
    await safeShare({
      title,
      message: `🛕 *${title}*\n📍 ${loc}\n\n${history}\n\nशिव चर्चा ऐप - प्रसिद्ध शिव मंदिर निर्देशिका 🔱`,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🛕 प्रसिद्ध शिव मंदिर" subtitle="पशुपतिनाथ, तुंगनाथ, अमरनाथ व देश-विदेश के शिवालय" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>विश्व के पावन शिव मंदिर निर्देशिका</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>
            हिमालय की ऊँचाइयों से लेकर सागर तटों तक स्थापित अलौकिक शिवालय।
          </Text>
        </View>

        <View style={styles.grid}>
          {famousTemples.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            >
              <Image source={resolveImageSource(item.id || item.image, 'temple')} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <Text style={[styles.locationBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                  📍 {item.location}, {item.region}
                </Text>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardSub, { color: theme.secondary }]}>✨ {item.significance}</Text>
                <Text style={[styles.bodyText, { color: theme.textPrimary }]}>{item.history}</Text>

                <View style={styles.cardActions}>
                  {item.audioUrl && (
                    <TouchableOpacity
                      style={[styles.listenBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                      onPress={() =>
                        playTrack({
                          id: item.id,
                          title: item.title,
                          subtitle: `${item.location}, ${item.region}`,
                          category: 'teachings',
                          duration: 180,
                          audioUrl: item.audioUrl || '',
                          coverImage: item.image,
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.listenBtnText, { color: theme.primary }]}>🎧 कथा सुनें</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.mapBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(`/sansar/yatra?focusId=${item.id}` as any)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.mapBtnText, { color: theme.textWhite }]}>📍 नक्शा देखें</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.shareIconBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
                    onPress={() => handleShare(item.title, `${item.location}, ${item.region}`, item.history)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 14 }}>📤</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
  locationBadge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  mapBtn: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  mapBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  shareIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
