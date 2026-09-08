import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shivaFestivals } from '@/content/sansar/symbolsAndTemples';
import { resolveImageSource } from '@/constants/imageAssets';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';

export default function ShivaFestivalsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="📅 शिव पर्व एवं उत्सव" subtitle="महाशिवरात्रि, सावन सोमवार व प्रदोष व्रत विधि" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>शिवजी से जुड़े प्रमुख व्रत एवं पर्व 🌸</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>
            पर्वों का महत्व, व्रत विधि और कैलेंडर से जुड़ाव समझें।
          </Text>
        </View>

        <View style={styles.grid}>
          {shivaFestivals.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            >
              <Image
                source={resolveImageSource(item.id || item.image, 'festival')}
                style={styles.cardImage}
                resizeMode="contain"
              />

              <View style={styles.cardContent}>
                <Text style={[styles.tithiBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                  🗓️ तिथि/समय: {item.tithiMonth}
                </Text>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardSub, { color: theme.secondary }]}>✨ {item.significance}</Text>
                <Text style={[styles.bodyText, { color: theme.textPrimary }]}>{item.detailedGuide}</Text>

                <View style={styles.cardActions}>
                  {item.audioUrl && (
                    <TouchableOpacity
                      style={[styles.listenBtn, { backgroundColor: theme.primary }]}
                      onPress={() =>
                        playTrack({
                          id: item.id,
                          title: item.title,
                          subtitle: item.tithiMonth,
                          category: 'teachings',
                          duration: 210,
                          audioUrl: item.audioUrl || '',
                          coverImage: item.image,
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.listenBtnText, { color: theme.textWhite }]}>🎧 कथा सुनें</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.calendarBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                    onPress={() => router.push('/calendar' as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.calendarBtnText, { color: theme.primary }]}>📅 कैलेंडर देखें ➔</Text>
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
    backgroundColor: '#0F172A',
  },
  cardContent: {
    padding: 16,
  },
  tithiBadge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 20,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  listenBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  calendarBtn: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  calendarBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
