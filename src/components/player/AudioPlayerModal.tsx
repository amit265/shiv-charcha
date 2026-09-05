import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ScrollView, Share, Platform } from 'react-native';
import { useAudio } from '../../context/AudioContext';
import { colors, shadows } from '../../theme/colors';

interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ visible, onClose }) => {
  const { currentTrack, isPlaying, position, duration, togglePlayPause, seekTo } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎧 शिव चर्चा ऑडियो सुनें: "${currentTrack.title}" — ${currentTrack.artist || 'शिव गुरु संदेश'}\n\nशिव चर्चा ऐप डाउनलोड करें।`,
      });
    } catch (e) {}
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>शिव गुरु ऑडियो खिलाड़ी</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.7}>
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Devotional Cover Artwork */}
          <View style={styles.artContainer}>
            <Image source={{ uri: currentTrack.coverImage }} style={styles.coverImage} />
            <View style={styles.omWatermark}>
              <Text style={styles.omText}>ॐ</Text>
            </View>
          </View>

          {/* Title & Artist */}
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.artistName}>
            {currentTrack.artist || currentTrack.subtitle || 'शिव चर्चा भक्ति ध्वनि'}
          </Text>

          {/* Progress Slider */}
          <View style={styles.progressContainer}>
            <TouchableOpacity
              style={styles.sliderTrackBg}
              activeOpacity={1}
              onPress={(e) => {
                const clickX = e.nativeEvent.locationX;
                // Simple percentage calculate
                const pct = clickX / 300;
                seekTo(Math.floor(pct * (duration || 180)));
              }}
            >
              <View
                style={[
                  styles.sliderTrackFill,
                  { width: `${duration > 0 ? (position / duration) * 100 : 0}%` },
                ]}
              />
            </TouchableOpacity>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.secBtn}
              onPress={() => seekTo(Math.max(0, position - 15))}
              activeOpacity={0.7}
            >
              <Text style={styles.secIcon}>⏪ 15s</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mainPlayBtn} onPress={togglePlayPause} activeOpacity={0.8}>
              <Text style={styles.mainPlayIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secBtn}
              onPress={() => seekTo(Math.min(duration, position + 15))}
              activeOpacity={0.7}
            >
              <Text style={styles.secIcon}>15s ⏩</Text>
            </TouchableOpacity>
          </View>

          {/* Lyrics / Description if available */}
          {currentTrack.lyrics && (
            <View style={styles.lyricsCard}>
              <Text style={styles.lyricsHeader}>📖 भजन बोल / भाव</Text>
              <Text style={styles.lyricsText}>{currentTrack.lyrics}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.maroonDark,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 16,
    color: colors.bgIvory,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.goldPrimary,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 16,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  artContainer: {
    width: 260,
    height: 260,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.goldPrimary,
    marginVertical: 16,
    ...shadows.gold,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  omWatermark: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 14, 23, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.goldPrimary,
  },
  omText: {
    fontSize: 20,
    color: colors.goldPrimary,
    fontWeight: 'bold',
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.goldLight,
    textAlign: 'center',
    marginTop: 12,
  },
  artistName: {
    fontSize: 15,
    color: colors.bgIvory,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: 6,
  },
  progressContainer: {
    width: '100%',
    marginTop: 28,
  },
  sliderTrackBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderTrackFill: {
    height: '100%',
    backgroundColor: colors.goldPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.bgIvory,
    opacity: 0.8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  secBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secIcon: {
    fontSize: 13,
    color: colors.bgIvory,
    fontWeight: '600',
  },
  mainPlayBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    ...shadows.gold,
  },
  mainPlayIcon: {
    fontSize: 28,
    color: colors.maroonDark,
  },
  lyricsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 18,
    marginTop: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  lyricsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.goldPrimary,
    marginBottom: 10,
  },
  lyricsText: {
    fontSize: 14,
    color: colors.bgIvory,
    lineHeight: 22,
  },
});
