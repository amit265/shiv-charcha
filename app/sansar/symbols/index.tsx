import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shivaSymbols } from '@/content/sansar/symbolsAndTemples';
import { resolveImageSource } from '@/constants/imageAssets';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';

export default function ShivaSymbolsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🕉️ शिव के प्रतीक" subtitle="त्रिशूल, डमरू, रुद्राक्ष, भस्म व त्रिनेत्र का अर्थ" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>शिवजी के पावन प्रतीकों का आध्यात्मिक अर्थ</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>
            आसान और दृश्य रूप में समझें कि त्रिशूल, डमरू और रुद्राक्ष हमारे जीवन में क्या संदेश देते हैं।
          </Text>
        </View>

        <View style={styles.grid}>
          {shivaSymbols.map((item) => (
            <View
              key={item.id}
              style={[styles.symbolCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            >
              <Image source={resolveImageSource(item.id || item.image, 'symbol')} style={styles.symbolImage} />

              <View style={styles.cardContent}>
                <Text style={[styles.symbolTitle, { color: theme.textPrimary }]}>{item.title}</Text>

                {/* 🎧 AUDIO CTA */}
                {item.audioUrl && (
                  <TouchableOpacity
                    style={[styles.audioBanner, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                    onPress={() =>
                      playTrack({
                        id: item.id,
                        title: item.title,
                        subtitle: item.simpleMeaning,
                        category: 'teachings',
                        duration: item.audioDuration || 180,
                        audioUrl: item.audioUrl || '',
                        coverImage: item.image,
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.audioText, { color: theme.primary }]}>🎧 इसका अर्थ सुनें (Audio)</Text>
                    <Text style={[styles.playIcon, { color: theme.primary }]}>▶️</Text>
                  </TouchableOpacity>
                )}

                {/* 📖 सरल भाषा में */}
                <View style={[styles.meaningBox, { backgroundColor: theme.surfaceElevated }]}>
                  <Text style={[styles.meaningHeader, { color: theme.primary }]}>📖 सरल भाषा में अर्थ:</Text>
                  <Text style={[styles.meaningText, { color: theme.textPrimary }]}>{item.simpleMeaning}</Text>
                </View>

                {/* अध्यात्मिक गहराई */}
                <Text style={[styles.deepHeader, { color: theme.primary }]}>💡 आध्यात्मिक महिमा:</Text>
                <Text style={[styles.deepText, { color: theme.textSecondary }]}>{item.spiritualSignificance}</Text>
                <Text style={[styles.detailedText, { color: theme.textPrimary }]}>{item.detailedText}</Text>
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
    gap: 18,
  },
  symbolCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadows.medium,
  },
  symbolImage: {
    width: '100%',
    height: 170,
  },
  cardContent: {
    padding: 16,
  },
  symbolTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  audioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  audioText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  playIcon: {
    fontSize: 16,
  },
  meaningBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  meaningHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  meaningText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  deepHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  deepText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailedText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
