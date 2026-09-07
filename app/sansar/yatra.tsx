import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { jyotirlingas } from '@/content/sansar/jyotirlingas';
import { shaktiPeethas } from '@/content/sansar/shaktiPeethas';
import { famousTemples } from '@/content/sansar/symbolsAndTemples';
import { useAudio } from '@/context/AudioContext';
import { shadows } from '@/theme/colors';

interface MapPin {
  id: string;
  title: string;
  category: 'jyotirlinga' | 'shakti_peeth' | 'temple';
  location: string;
  state: string;
  lat: number;
  lng: number;
  // Normalized 0-100% position on India Map graphic canvas
  xPercent: number;
  yPercent: number;
  image: string;
  summary: string;
  routePath: string;
  audioUrl?: string;
}

export default function ShivYatraMapScreen() {
  const router = useRouter();
  const { focusId } = useLocalSearchParams<{ focusId?: string }>();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  const [activeFilter, setActiveFilter] = useState<'all' | 'jyotirlinga' | 'shakti_peeth' | 'temple'>('all');

  // Convert raw items into mapped pin positions (mapped to standard 0-100% bounds across India coordinates: Lat ~8-36N, Lng ~68-96E)
  const pins: MapPin[] = [
    // 12 Jyotirlingas
    ...jyotirlingas.map((item) => ({
      id: item.id,
      title: item.title,
      category: 'jyotirlinga' as const,
      location: item.location,
      state: item.state,
      lat: item.latitude,
      lng: item.longitude,
      xPercent: Math.max(10, Math.min(90, ((item.longitude - 68) / (96 - 68)) * 100)),
      yPercent: Math.max(10, Math.min(90, (1 - (item.latitude - 8) / (36 - 8)) * 100)),
      image: item.image,
      summary: item.summaryHindi,
      routePath: `/sansar/jyotirlinga/${item.id}`,
      audioUrl: item.audioUrl,
    })),
    // Shakti Peethas
    ...shaktiPeethas.map((item) => ({
      id: item.id,
      title: item.title,
      category: 'shakti_peeth' as const,
      location: item.location,
      state: item.stateRegion,
      lat: item.latitude,
      lng: item.longitude,
      xPercent: Math.max(10, Math.min(90, ((item.longitude - 68) / (96 - 68)) * 100)),
      yPercent: Math.max(10, Math.min(90, (1 - (item.latitude - 8) / (36 - 8)) * 100)),
      image: item.image,
      summary: item.summaryHindi,
      routePath: `/sansar/shakti-peeth/${item.id}`,
      audioUrl: item.audioUrl,
    })),
    // Famous Temples
    ...famousTemples.map((item) => ({
      id: item.id,
      title: item.title,
      category: 'temple' as const,
      location: item.location,
      state: item.region,
      lat: item.latitude,
      lng: item.longitude,
      xPercent: Math.max(10, Math.min(90, ((item.longitude - 68) / (96 - 68)) * 100)),
      yPercent: Math.max(10, Math.min(90, (1 - (item.latitude - 8) / (36 - 8)) * 100)),
      image: item.image,
      summary: item.history,
      routePath: `/sansar/temples`,
      audioUrl: item.audioUrl,
    })),
  ];

  const [selectedPin, setSelectedPin] = useState<MapPin>(pins[0]);

  useEffect(() => {
    if (focusId) {
      const match = pins.find((p) => p.id === focusId);
      if (match) {
        setSelectedPin(match);
      }
    }
  }, [focusId]);

  const filteredPins = pins.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="📍 शिव यात्रा" subtitle="डिजिटल भारत तीर्थ मानचित्र (Interactive Map)" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>भारत भर के पावन शिव तीर्थ दर्शन</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>
            नक्शे पर स्थित पिन (Pin) पर टैप करके तीर्थ की महिमा व ऑडियो सुनें।
          </Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFilter === 'all' ? theme.primary : theme.surfaceElevated,
                borderColor: activeFilter === 'all' ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, { color: activeFilter === 'all' ? theme.textWhite : theme.textPrimary }]}>
              सभी ({pins.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFilter === 'jyotirlinga' ? theme.primary : theme.surfaceElevated,
                borderColor: activeFilter === 'jyotirlinga' ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setActiveFilter('jyotirlinga')}
          >
            <Text style={[styles.filterText, { color: activeFilter === 'jyotirlinga' ? theme.textWhite : theme.textPrimary }]}>
              🛕 12 ज्योतिर्लिंग
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFilter === 'shakti_peeth' ? theme.primary : theme.surfaceElevated,
                borderColor: activeFilter === 'shakti_peeth' ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setActiveFilter('shakti_peeth')}
          >
            <Text style={[styles.filterText, { color: activeFilter === 'shakti_peeth' ? theme.textWhite : theme.textPrimary }]}>
              🌺 शक्ति पीठ
            </Text>
          </TouchableOpacity>
        </View>

        {/* MAP CANVAS CONTAINER */}
        <View style={[styles.mapContainer, { backgroundColor: theme.cardBgMaroon, borderColor: theme.borderGold }]}>
          {/* Stylized India Subcontinent Contour Outline / Compass */}
          <View style={styles.mapCompassHeader}>
            <Text style={[styles.compassText, { color: theme.textGold }]}>🧭 भारतवर्ष शिव यात्रा मानचित्र</Text>
            <Text style={[styles.pinCountText, { color: theme.textWhite }]}>{filteredPins.length} तीर्थ चिन्हित</Text>
          </View>

          {/* Interactive Map Surface */}
          <View style={styles.mapCanvas}>
            {/* Background Grid Accent */}
            <View style={styles.mapGridPattern} />

            {/* Mapped Pins */}
            {filteredPins.map((pin) => {
              const isSelected = selectedPin.id === pin.id;

              return (
                <TouchableOpacity
                  key={pin.id}
                  style={[
                    styles.mapMarker,
                    {
                      left: `${pin.xPercent}%`,
                      top: `${pin.yPercent}%`,
                      backgroundColor: isSelected ? theme.accentGlow : pin.category === 'jyotirlinga' ? '#FF6F00' : '#E11D48',
                      transform: [{ scale: isSelected ? 1.3 : 1 }],
                      zIndex: isSelected ? 99 : 10,
                    },
                  ]}
                  onPress={() => setSelectedPin(pin)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.markerEmoji}>
                    {pin.category === 'jyotirlinga' ? '🛕' : pin.category === 'shakti_peeth' ? '🌺' : '🔱'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SELECTED PIN DETAILS BOTTOM CARD */}
        {selectedPin && (
          <View style={[styles.pinDetailCard, { backgroundColor: theme.cardBg, borderColor: theme.primary }]}>
            <View style={styles.cardHeaderRow}>
              <Image source={{ uri: selectedPin.image }} style={styles.pinImage} />
              <View style={styles.pinTextCol}>
                <Text style={[styles.pinCategoryTag, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                  {selectedPin.category === 'jyotirlinga' ? '🛕 ज्योतिर्लिंग' : selectedPin.category === 'shakti_peeth' ? '🌺 शक्ति पीठ' : '🛕 प्रसिद्ध मंदिर'}
                </Text>
                <Text style={[styles.pinTitle, { color: theme.textPrimary }]}>{selectedPin.title}</Text>
                <Text style={[styles.pinLocation, { color: theme.textSecondary }]}>
                  📍 {selectedPin.location}, {selectedPin.state}
                </Text>
              </View>
            </View>

            <Text style={[styles.pinSummary, { color: theme.textMuted }]} numberOfLines={2}>
              {selectedPin.summary}
            </Text>

            <View style={styles.pinActionsRow}>
              {selectedPin.audioUrl && (
                <TouchableOpacity
                  style={[styles.audioBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                  onPress={() =>
                    playTrack({
                      id: selectedPin.id,
                      title: selectedPin.title,
                      subtitle: `${selectedPin.location}, ${selectedPin.state}`,
                      category: 'teachings',
                      duration: 210,
                      audioUrl: selectedPin.audioUrl || '',
                      coverImage: selectedPin.image,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={[styles.audioBtnText, { color: theme.primary }]}>🎧 कथा सुनें</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.fullDetailBtn, { backgroundColor: theme.primary }]}
                onPress={() => router.push(selectedPin.routePath as any)}
                activeOpacity={0.85}
              >
                <Text style={[styles.fullDetailText, { color: theme.textWhite }]}>विस्तृत दर्शन करें ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  introSub: {
    fontSize: 12,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 380,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    marginBottom: 16,
    ...shadows.medium,
  },
  mapCompassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  compassText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  pinCountText: {
    fontSize: 11,
    opacity: 0.85,
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
  },
  mapGridPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.15,
    backgroundColor: '#1E293B',
  },
  mapMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -16,
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 16,
  },
  pinDetailCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pinImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  pinTextCol: {
    flex: 1,
  },
  pinCategoryTag: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  pinTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  pinLocation: {
    fontSize: 12,
    marginTop: 1,
  },
  pinSummary: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  pinActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  audioBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  audioBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  fullDetailBtn: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  fullDetailText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
