import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { resolveImageSource } from '@/constants/imageAssets';
import { shadows } from '@/theme/colors';
import { pravachanLibrary, PravachanItem } from '@/content/pravachanLibrary';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';

type AudioFilter = 'all' | 'sahab_shri' | 'didi_maa' | 'mantra' | 'bhajans';

export default function AudioHubScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [activeFilter, setActiveFilter] = useState<AudioFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAudios = pravachanLibrary.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'sahab_shri') return item.speaker === 'sahab_shri';
    if (activeFilter === 'didi_maa') return item.speaker === 'didi_maa';
    if (activeFilter === 'mantra') return item.category === 'mantra';
    if (activeFilter === 'bhajans') return item.category === 'charcha_songs' || item.category === 'bhajans';

    return true;
  });

  const handleShareAudio = async (item: PravachanItem) => {
    await safeShare({
      title: item.title,
      message: `🎧 *शिव चर्चा ऑडियो*: "${item.title}"\n${item.subtitle || ''}\n- ${item.artist || 'शिव चर्चा'}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="ऑडियो अमृत वाणी" subtitle="साहब श्री व दीदी माँ के प्रवचन व भजन" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.surfaceElevated,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
            placeholder="🔍 प्रवचन, अमृत वाणी या भजन खोजें..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setSearchQuery('')}>
              <Text style={{ color: theme.textMuted }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'all' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, { color: activeFilter === 'all' ? theme.textWhite : theme.textPrimary }]}>
              🔥 सभी ({pravachanLibrary.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'sahab_shri' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('sahab_shri')}
          >
            <Text style={[styles.filterText, { color: activeFilter === 'sahab_shri' ? theme.textWhite : theme.textPrimary }]}>
              🎙️ साहब श्री
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'didi_maa' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('didi_maa')}
          >
            <Text style={[styles.filterText, { color: activeFilter === 'didi_maa' ? theme.textWhite : theme.textPrimary }]}>
              🌸 दीदी माँ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'mantra' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('mantra')}
          >
            <Text style={[styles.filterText, { color: activeFilter === 'mantra' ? theme.textWhite : theme.textPrimary }]}>
              📿 जाप व मंत्र
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'bhajans' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('bhajans')}
          >
            <Text style={[styles.filterText, { color: activeFilter === 'bhajans' ? theme.textWhite : theme.textPrimary }]}>
              🎵 शिव भजन
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Audio Tracks List */}
        <View style={styles.listContainer}>
          {filteredAudios.map((item) => {
            const isThisPlaying = currentTrack?.id === item.id && isPlaying;
            return (
              <View
                key={item.id}
                style={[
                  styles.audioCard,
                  { backgroundColor: theme.cardBg, borderColor: isThisPlaying ? theme.accent : theme.border },
                ]}
              >
                <Image source={resolveImageSource(item.id || item.coverImage, 'stotra')} style={styles.coverImage} />

                <View style={styles.metaCol}>
                  <View style={styles.speakerRow}>
                    <Text style={[styles.speakerBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
                      {item.speaker === 'sahab_shri' ? '🎙️ साहब श्री' : item.speaker === 'didi_maa' ? '🌸 दीदी माँ' : '🎵 भजन'}
                    </Text>
                    <Text style={[styles.durationText, { color: theme.textMuted }]}>
                      {Math.floor(item.duration / 60)} मि
                    </Text>
                  </View>

                  <Text style={[styles.trackTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.trackSub, { color: theme.textSecondary }]}>{item.subtitle}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.playBtn, { backgroundColor: isThisPlaying ? theme.accent : theme.primary }]}
                    onPress={() => playTrack(item)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.playBtnText, { color: isThisPlaying ? theme.primaryDark : theme.textWhite }]}>
                      {isThisPlaying ? '⏸️' : '▶️'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.shareBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
                    onPress={() => handleShareAudio(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 13 }}>📲</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
    paddingBottom: 120,
  },
  searchRow: {
    position: 'relative',
    marginBottom: 12,
  },
  searchInput: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 14,
    top: 12,
  },
  filterScroll: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 12,
  },
  audioCard: {
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    ...shadows.soft,
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  metaCol: {
    flex: 1,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  speakerBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 10,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  trackSub: {
    fontSize: 11,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnText: {
    fontSize: 14,
  },
  shareBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
