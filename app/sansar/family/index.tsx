import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shivaFamilyMembers } from '@/content/sansar/familyAndForms';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';

export default function ShivFamilyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="👨‍👩‍👧 शिव परिवार" subtitle="कैलाशपति शिव, पार्वती, गणेश, कार्तिकेय व नंदी" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>पावन शिव परिवार दर्शन 🌸</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>
            विरोधी प्रकृतियों का अद्भुत मेल और परम प्रेम, समरसता व गृहस्थ धर्म का आदर्श।
          </Text>
        </View>

        <View style={styles.grid}>
          {shivaFamilyMembers.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <Text style={[styles.relationBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                  {item.relation}
                </Text>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardSub, { color: theme.textSecondary }]}>{item.summaryHindi}</Text>
                <Text style={[styles.detailedText, { color: theme.textPrimary }]}>{item.detailedText}</Text>

                {item.symbols && item.symbols.length > 0 && (
                  <View style={styles.symbolsRow}>
                    <Text style={[styles.symbolsLabel, { color: theme.textMuted }]}>मुख्य प्रतीक / सवारी: </Text>
                    <Text style={[styles.symbolsText, { color: theme.primary }]}>{item.symbols.join(' • ')}</Text>
                  </View>
                )}

                {item.audioUrl && (
                  <TouchableOpacity
                    style={[styles.listenBtn, { backgroundColor: theme.primary }]}
                    onPress={() =>
                      playTrack({
                        id: item.id,
                        title: item.title,
                        subtitle: item.relation,
                        category: 'teachings',
                        duration: item.audioDuration || 180,
                        audioUrl: item.audioUrl || '',
                        coverImage: item.image,
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.listenBtnText, { color: theme.textWhite }]}>🎧 महिमा सुनें</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
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
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadows.medium,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  relationBadge: {
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
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailedText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  symbolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  symbolsLabel: {
    fontSize: 12,
  },
  symbolsText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  listenBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  listenBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
