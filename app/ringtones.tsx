import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { ringtonesData } from '@/content/ringtones';
import { colors, shadows } from '@/theme/colors';
import { useAudio } from '@/context/AudioContext';
import { RingtoneItem } from '@/types';

export default function RingtonesScreen() {
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>भक्तिमय ध्वनियाँ व रिंगटोन 🔔</Text>
        <Text style={styles.sectionSub}>
          मंदिर घंटी, शंखनाद व ॐ नमः शिवाय मंत्र रिंगटोन सुनें और डाउनलोड करें।
        </Text>

        {ringtonesData.map((item) => (
          <View key={item.id} style={styles.rowCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>
                {item.category === 'bell' ? '🔔' : item.category === 'shankh' ? '🐚' : '📿'}
              </Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle} • {item.duration} सेकंड</Text>
            </View>

            <TouchableOpacity
              style={styles.previewBtn}
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
              <Text style={styles.btnText}>▶️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => handleSetRingtone(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.downloadText}>📥</Text>
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
    backgroundColor: colors.bgIvory,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textMedium,
    marginTop: 2,
    marginBottom: 16,
  },
  rowCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgSoftAmber,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderGold,
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
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  previewBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldPrimary,
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
    backgroundColor: colors.maroonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 14,
  },
});
