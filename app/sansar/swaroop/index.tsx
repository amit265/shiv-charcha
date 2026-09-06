import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shivaForms } from '@/content/sansar/familyAndForms';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';

export default function ShivSwaroopScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🔱 शिव के स्वरूप" subtitle="महादेव, नीलकंठ, नटराज, अर्धनारीश्वर व महाकाल" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>शिवजी के अनेक दिव्य स्वरूप 🌸</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>
            देखें → सुनें → सरल अर्थ जानें → विस्तार से पढ़ें
          </Text>
        </View>

        <View style={styles.grid}>
          {shivaForms.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <Text style={[styles.meaningBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                  ✨ {item.meaning}
                </Text>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.simpleText, { color: theme.textSecondary }]}>
                  💡 <Text style={{ fontWeight: 'bold' }}>सरल अर्थ:</Text> {item.simpleHindi}
                </Text>
                <Text style={[styles.detailedText, { color: theme.textPrimary }]}>{item.detailedText}</Text>

                <View style={styles.cardActions}>
                  {item.audioUrl && (
                    <TouchableOpacity
                      style={[styles.listenBtn, { backgroundColor: theme.primary }]}
                      onPress={() =>
                        playTrack({
                          id: item.id,
                          title: item.title,
                          subtitle: item.meaning,
                          category: 'teachings',
                          duration: item.audioDuration || 180,
                          audioUrl: item.audioUrl || '',
                          coverImage: item.image,
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.listenBtnText, { color: theme.textWhite }]}>🎧 सुनें</Text>
                    </TouchableOpacity>
                  )}
                </View>
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
    height: 170,
  },
  cardContent: {
    padding: 16,
  },
  meaningBadge: {
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
    marginBottom: 6,
  },
  simpleText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  detailedText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
  },
  listenBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  listenBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
