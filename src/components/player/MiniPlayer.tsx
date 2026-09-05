import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform } from 'react-native';
import { useAudio } from '../../context/AudioContext';
import { colors, shadows } from '../../theme/colors';
import { AudioPlayerModal } from './AudioPlayerModal';

export const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, position, duration, isMiniPlayerVisible, togglePlayPause, dismissMiniPlayer } = useAudio();
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);

  if (!isMiniPlayerVisible || !currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.9}
        onPress={() => setIsFullModalVisible(true)}
      >
        {/* Top Progress Line */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, progressPercent))}%` }]} />
        </View>

        <View style={styles.contentRow}>
          <Image source={{ uri: currentTrack.coverImage }} style={styles.coverImage} />

          <View style={styles.textContainer}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.trackSubtitle} numberOfLines={1}>
              🎧 {currentTrack.artist || currentTrack.subtitle || 'शिव चर्चा ऑडियो'}
            </Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.playBtn} onPress={togglePlayPause} activeOpacity={0.7}>
              <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={dismissMiniPlayer} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Full player modal */}
      <AudioPlayerModal
        visible={isFullModalVisible}
        onClose={() => setIsFullModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 82 : 62,
    left: 12,
    right: 12,
    backgroundColor: colors.maroonPrimary,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
    ...shadows.medium,
    zIndex: 9999,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.goldPrimary,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  coverImage: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.maroonDark,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  trackSubtitle: {
    fontSize: 11,
    color: colors.bgIvory,
    opacity: 0.85,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  playIcon: {
    fontSize: 16,
    color: colors.maroonDark,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 12,
    color: colors.bgIvory,
    fontWeight: 'bold',
  },
});
