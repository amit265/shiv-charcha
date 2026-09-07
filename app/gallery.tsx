import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { resolveImageSource } from '@/constants/imageAssets';
import { wallpapersData } from '@/content/wallpapers';
import { shadows } from '@/theme/colors';
import { WallpaperItem } from '@/types';

export default function GalleryScreen() {
  const { theme } = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🖼️ पावन गैलरी व वॉलपेपर" subtitle="शिव वॉलपेपर देखें व डाउनलोड करें" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>पावन शिव वॉलपेपर संग्रह 🖼️</Text>
        <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
          उच्च गुणवत्ता वाले भक्तिमय वॉलपेपर देखें और अपने फोन पर सजाएँ।
        </Text>

        <View style={styles.grid}>
          {wallpapersData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              onPress={() => setSelectedWallpaper(item)}
              activeOpacity={0.9}
            >
              <Image source={resolveImageSource(item.id || item.imageUrl, 'hero')} style={styles.image} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <TouchableOpacity
                style={[styles.setBtn, { backgroundColor: theme.primary }]}
                onPress={() => handleSetWallpaper(item)}
                activeOpacity={0.8}
              >
                <Text style={[styles.setBtnText, { color: theme.textWhite }]}>📱 वॉलपेपर लगाएँ</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
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
    textAlign: 'center',
    marginBottom: 8,
  },
  setBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  setBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
