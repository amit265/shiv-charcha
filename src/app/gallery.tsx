import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { wallpapersData } from '../content/wallpapers';
import { colors, shadows } from '../theme/colors';
import { WallpaperItem } from '../types';

export default function GalleryScreen() {
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperItem | null>(null);

  const handleSetWallpaper = (item: WallpaperItem) => {
    if (Platform.OS === 'android') {
      Alert.alert(
        'वॉलपेपर सेट करें',
        `"${item.title}" को अपने फोन का वॉलपेपर बनाने के लिए चित्र सहेजें और गैलरी से वॉलपेपर के रूप में सेट करें।`,
        [{ text: 'ठीक है' }]
      );
    } else {
      Alert.alert(
        'चित्र सहेजें',
        'चित्र सहेजें और अपने फोन की वॉलपेपर सेटिंग से लगाएँ।',
        [{ text: 'समझ गया' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>पावन शिव वॉलपेपर संग्रह 🖼️</Text>
        <Text style={styles.sectionSub}>
          उच्च गुणवत्ता वाले भक्तिमय वॉलपेपर देखें और अपने फोन पर सजाएँ।
        </Text>

        <View style={styles.grid}>
          {wallpapersData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => setSelectedWallpaper(item)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <TouchableOpacity
                style={styles.setBtn}
                onPress={() => handleSetWallpaper(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.setBtnText}>📱 वॉलपेपर लगाएँ</Text>
              </TouchableOpacity>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  setBtn: {
    backgroundColor: colors.saffronPrimary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  setBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
});
