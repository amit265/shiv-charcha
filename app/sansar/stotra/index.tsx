import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shivaStotras } from '@/content/sansar/stotras';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';

export default function ShivaStotraListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="📿 शिव स्तोत्र व मंत्र" subtitle="तांडव • रुद्राष्टकम • महामृत्युंजय • लिंगाष्टकम" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerInfo}>
          <Text style={[styles.infoTitle, { color: theme.primary }]}>दिव्य शिव स्तुति एवं मंत्र साधना</Text>
          <Text style={[styles.infoSub, { color: theme.textSecondary }]}>
            संस्कृत श्लोक, हिंदी भावार्थ, उच्चारण ऑडियो व पाठ के असीम लाभ।
          </Text>
        </View>

        {shivaStotras.map((stotra) => (
          <TouchableOpacity
            key={stotra.id}
            style={[styles.stotraCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => router.push(`/sansar/stotra/${stotra.id}` as any)}
            activeOpacity={0.88}
          >
            <Image source={{ uri: stotra.image }} style={styles.stotraCover} />

            <View style={styles.stotraContent}>
              <View style={styles.badgeRow}>
                <Text style={[styles.authorTag, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                  ✍️ {stotra.author}
                </Text>
                {stotra.audioDuration && (
                  <Text style={[styles.audioTimeTag, { color: theme.secondary }]}>
                    ⏱️ {Math.floor(stotra.audioDuration / 60)} मिनट
                  </Text>
                )}
              </View>

              <Text style={[styles.stotraTitle, { color: theme.textPrimary }]}>{stotra.title}</Text>
              <Text style={[styles.stotraSub, { color: theme.textSecondary }]}>{stotra.subtitle}</Text>
              <Text style={[styles.stotraSummary, { color: theme.textMuted }]} numberOfLines={2}>
                {stotra.summaryHindi}
              </Text>

              <View style={[styles.benefitBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                <Text style={[styles.benefitText, { color: theme.primary }]} numberOfLines={1}>
                  ✨ फल: {stotra.benefits}
                </Text>
              </View>

              <View style={styles.cardActions}>
                {stotra.audioUrl && (
                  <TouchableOpacity
                    style={[styles.playBtn, { backgroundColor: theme.primary }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      playTrack({
                        id: stotra.id,
                        title: stotra.title,
                        subtitle: stotra.subtitle,
                        category: 'teachings',
                        duration: stotra.audioDuration || 200,
                        audioUrl: stotra.audioUrl || '',
                        coverImage: stotra.image,
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.playBtnText, { color: theme.textWhite }]}>▶️ स्तोत्र पाठ सुनें</Text>
                  </TouchableOpacity>
                )}

                <View style={[styles.readLink, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                  <Text style={[styles.readLinkText, { color: theme.primary }]}>📜 श्लोक व अर्थ ➔</Text>
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
  stotraCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    ...shadows.medium,
  },
  stotraCover: {
    width: '100%',
    height: 160,
  },
  stotraContent: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  authorTag: {
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
  stotraTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  stotraSub: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  stotraSummary: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  benefitBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 12,
    fontWeight: '600',
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
