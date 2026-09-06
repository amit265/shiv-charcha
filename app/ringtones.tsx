import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { ringtonesData } from '@/content/ringtones';
import { shadows } from '@/theme/colors';
import { useAudio } from '@/context/AudioContext';
import { RingtoneItem } from '@/types';

export default function RingtonesScreen() {
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  const handleSetRingtone = (item: RingtoneItem) => {
    if (Platform.OS === 'android') {
      Alert.alert(
        'रिंगटोन सेट करें',
        `"${item.title}" ऑडियो डाउनलोड हो रहा है। अपने फोन की साउंड सेटिंग्स से इसे रिंगटोन या नोटिफिकेशन टोन बनाएं।`,
        [{ text: 'ठीक है' }]
      );
    } else {
      Alert.alert(
        'ऑडियो सहेजें',
        'ऑडियो क्लिप डाउनलोड करें और अपने डिवाइस सेटिंग्स से रिंगटोन सेट करें।',
        [{ text: 'समझ गया' }]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🔔 भक्तिमय ध्वनियाँ" subtitle="शंख, घंटी व मंत्र रिंगटोन" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>भक्तिमय ध्वनियाँ व रिंगटोन 🔔</Text>
        <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
          मंदिर घंटी, शंखनाद व ॐ नमः शिवाय मंत्र रिंगटोन सुनें और डाउनलोड करें।
        </Text>

        {ringtonesData.map((item) => (
          <View key={item.id} style={[styles.rowCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
              <Text style={styles.iconText}>
                {item.category === 'bell' ? '🔔' : item.category === 'shankh' ? '🐚' : '📿'}
              </Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.subtitle, { color: theme.textMuted }]}>{item.subtitle} • {item.duration} सेकंड</Text>
            </View>

            <TouchableOpacity
              style={[styles.previewBtn, { backgroundColor: theme.primary }]}
              onPress={() =>
                playTrack({
                  id: item.id,
                  title: item.title,
                  subtitle: item.subtitle,
                  category: 'ambience',
                  duration: item.duration,
                  audioUrl: item.audioUrl,
                  coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
                })
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, { color: theme.textWhite }]}>▶️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.downloadBtn, { backgroundColor: theme.primaryDark }]}
              onPress={() => handleSetRingtone(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.downloadText, { color: theme.textGold }]}>📥</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    paddingBottom: 110,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
  },
  rowCard: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    ...shadows.soft,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  iconText: {
    fontSize: 20,
  },
  metaCol: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  previewBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  btnText: {
    fontSize: 14,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 14,
  },
});
