import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudio } from '../../context/AudioContext';
import { useTheme } from '../../context/ThemeContext';
import { resolveImageSource } from '@/constants/imageAssets';
import { shadows } from '../../theme/colors';
import { AudioPlayerModal } from './AudioPlayerModal';

export const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, position, duration, isMiniPlayerVisible, togglePlayPause, dismissMiniPlayer } = useAudio();
  const { theme } = useTheme();
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  if (!isMiniPlayerVisible || !currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 6);
  const miniPlayerBottom = 64 + bottomInset + 18;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            bottom: miniPlayerBottom,
            backgroundColor: theme.primary,
            borderColor: theme.accent,
          },
        ]}
        activeOpacity={0.9}
        onPress={() => setIsFullModalVisible(true)}
      >
        {/* Top Progress Line */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(0, progressPercent))}%`, backgroundColor: theme.accent },
            ]}
          />
        </View>

        <View style={styles.contentRow}>
          <Image source={resolveImageSource(currentTrack.id || currentTrack.coverImage, 'stotra')} style={styles.coverImage} />

          <View style={styles.textContainer}>
            <Text style={[styles.trackTitle, { color: theme.textGold }]} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={[styles.trackSubtitle, { color: theme.textWhite }]} numberOfLines={1}>
              🎧 {currentTrack.artist || currentTrack.subtitle || 'शिव चर्चा ऑडियो'}
            </Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: theme.accent }]}
              onPress={togglePlayPause}
              activeOpacity={0.7}
            >
              <Text style={[styles.playIcon, { color: theme.primaryDark }]}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={dismissMiniPlayer} activeOpacity={0.7}>
              <Text style={[styles.closeIcon, { color: theme.textWhite }]}>✕</Text>
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
    left: 12,
    right: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
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
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trackSubtitle: {
    fontSize: 11,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  playIcon: {
    fontSize: 16,
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
    fontWeight: 'bold',
  },
});
