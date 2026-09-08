import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { AudioItem } from '../types';
import { StorageService } from '../services/storage';

// Dynamic safe loader for expo-av to prevent cold-start crashes on native startup
let CachedAudioModule: any = null;
const getAudioModule = () => {
  if (!CachedAudioModule && Platform.OS !== 'web') {
    try {
      CachedAudioModule = require('expo-av').Audio;
    } catch (e) {
      console.warn('expo-av failed to load dynamically:', e);
    }
  }
  return CachedAudioModule;
};

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
  playSoundEffect: (soundType: string) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState<boolean>(false);

  // Track sound ref for audio tracks
  const trackSoundRef = useRef<any>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  // Purely non-blocking cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (trackSoundRef.current) {
          trackSoundRef.current.unloadAsync().catch(() => {});
        }
      } catch (e) {}
    };
  }, []);

  const playSoundEffect = async (_soundType: string) => {
    // Sound effects are handled directly within screen components (spin-the-wheel pattern)
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }
      } catch (e) {}
    }
  };

  const playTrack = async (track: AudioItem) => {
    try {
      // Unload previous track
      if (trackSoundRef.current) {
        await trackSoundRef.current.unloadAsync().catch(() => {});
        trackSoundRef.current = null;
      }
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
        htmlAudioRef.current = null;
      }

      setCurrentTrack(track);
      setIsMiniPlayerVisible(true);
      StorageService.recordAudioPlayed();

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Audio' in window && track.audioUrl.startsWith('http')) {
          const audio = new window.Audio(track.audioUrl);
          audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(true));

          audio.ontimeupdate = () => {
            setPosition(Math.floor(audio.currentTime));
            setDuration(Math.floor(audio.duration || track.duration || 180));
          };

          audio.onended = () => {
            setIsPlaying(false);
            setPosition(0);
          };

          htmlAudioRef.current = audio;
        } else {
          setIsPlaying(true);
          setDuration(track.duration || 180);
          setPosition(0);
        }
      } else {
        // Native Android / iOS track playback via expo-av
        const AudioMod = getAudioModule();
        if (AudioMod && track.audioUrl.startsWith('http')) {
          try {
            await AudioMod.setAudioModeAsync({
              playsInSilentModeIOS: true,
              staysActiveInBackground: true,
            }).catch(() => {});

            const { sound } = await AudioMod.Sound.createAsync(
              { uri: track.audioUrl },
              { shouldPlay: true }
            );
            trackSoundRef.current = sound;
            setIsPlaying(true);

            sound.setOnPlaybackStatusUpdate((status: any) => {
              if (status.isLoaded) {
                if (status.durationMillis) {
                  setDuration(Math.floor(status.durationMillis / 1000));
                }
                if (status.positionMillis) {
                  setPosition(Math.floor(status.positionMillis / 1000));
                }
                setIsPlaying(status.isPlaying);

                if (status.didJustFinish) {
                  setIsPlaying(false);
                  setPosition(0);
                }
              }
            });
          } catch (err) {
            console.warn('Native track stream error:', err);
            setIsPlaying(true);
            setDuration(track.duration || 180);
            setPosition(0);
          }
        } else {
          setIsPlaying(true);
          setDuration(track.duration || 180);
          setPosition(0);
        }
      }
    } catch (e) {
      console.warn('Error loading audio track:', e);
      setIsPlaying(true);
      setDuration(track.duration || 180);
      setPosition(0);
    }
  };

  const pauseTrack = async () => {
    try {
      if (trackSoundRef.current) {
        await trackSoundRef.current.pauseAsync().catch(() => {});
      }
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
      }
    } catch (e) {}
    setIsPlaying(false);
  };

  const resumeTrack = async () => {
    try {
      if (trackSoundRef.current) {
        await trackSoundRef.current.playAsync().catch(() => {});
      }
      if (htmlAudioRef.current) {
        htmlAudioRef.current.play().catch(() => {});
      }
    } catch (e) {}
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
    try {
      if (trackSoundRef.current) {
        await trackSoundRef.current.setPositionAsync(seconds * 1000).catch(() => {});
      }
      if (htmlAudioRef.current) {
        htmlAudioRef.current.currentTime = seconds;
      }
    } catch (e) {}
    setPosition(seconds);
  };

  const dismissMiniPlayer = () => {
    pauseTrack().catch(() => {});
    setIsMiniPlayerVisible(false);
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
