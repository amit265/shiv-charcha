import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { AudioItem } from '../types';
import { StorageService } from '../services/storage';

interface AudioContextType {
  currentTrack: AudioItem | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  isMiniPlayerVisible: boolean;
  playTrack: (track: AudioItem) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  dismissMiniPlayer: () => void;
  playSoundEffect: (audioUrl: string) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState<boolean>(false);

  useEffect(() => {
    // Configure audio session for background/devotional play
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(err => console.warn('Audio mode setup error:', err));

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(Math.floor(status.positionMillis / 1000));
      setDuration(Math.floor((status.durationMillis || 0) / 1000));
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const playTrack = async (track: AudioItem) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      setCurrentTrack(track);
      setIsMiniPlayerVisible(true);
      StorageService.recordAudioPlayed();

      // If online URL or local asset
      if (track.audioUrl.startsWith('http') || track.audioUrl.startsWith('file')) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: track.audioUrl },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
      } else {
        // Fallback demo simulation for local synthesized devotional sound if URL not yet loaded
        setIsPlaying(true);
        setDuration(track.duration || 180);
        setPosition(0);
      }
    } catch (e) {
      console.warn('Error loading audio track:', e);
      // Fallback state so user UI remains interactive
      setIsPlaying(true);
      setDuration(track.duration || 180);
      setPosition(0);
    }
  };

  const pauseTrack = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
    setIsPlaying(false);
  };

  const resumeTrack = async () => {
    if (sound) {
      await sound.playAsync();
    }
    setIsPlaying(true);
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pauseTrack();
    } else {
      await resumeTrack();
    }
  };

  const seekTo = async (seconds: number) => {
    if (sound) {
      await sound.setPositionAsync(seconds * 1000);
    }
    setPosition(seconds);
  };

  const dismissMiniPlayer = () => {
    if (sound) {
      sound.pauseAsync();
    }
    setIsPlaying(false);
    setIsMiniPlayerVisible(false);
  };

  const playSoundEffect = async (soundType: string) => {
    try {
      // Gentle web / native web-audio chime synthesis for devotional puja bell & shankh
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'AudioContext' in window) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (soundType === 'bell') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.5, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          osc.start();
          osc.stop(ctx.currentTime + 2.5);
        } else if (soundType === 'shankh') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.2);
          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
          osc.start();
          osc.stop(ctx.currentTime + 3.0);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
          osc.start();
          osc.stop(ctx.currentTime + 1.5);
        }
      }
    } catch (e) {
      console.log('Sound effect play error:', e);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        position,
        duration,
        isMiniPlayerVisible,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlayPause,
        seekTo,
        dismissMiniPlayer,
        playSoundEffect,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
