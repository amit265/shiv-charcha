import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Platform, ToastAndroid, Alert } from 'react-native';
import { AudioItem } from '../types';
import { StorageService } from '../services/storage';

let createAudioPlayerModule: any = null;
const getCreateAudioPlayer = () => {
  if (!createAudioPlayerModule && Platform.OS !== 'web') {
    try {
      createAudioPlayerModule = require('expo-audio').createAudioPlayer;
    } catch (e) {
      console.warn('expo-audio failed to load dynamically:', e);
    }
  }
  return createAudioPlayerModule;
};

const showAudioErrorToast = (msg: string = 'ऑडियो वर्तमान में उपलब्ध नहीं है।') => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(msg);
    }
  } else {
    Alert.alert('सूचना', msg);
  }
};

const LOCAL_SOUNDS: Record<string, any> = {
  bell: require('../../assets/sounds/bell.mp3'),
  shankh: require('../../assets/sounds/shankh.mp3'),
  water: require('../../assets/sounds/water.mp3'),
  damru: require('../../assets/sounds/damru.mp3'),
  chime: require('../../assets/sounds/chime.mp3'),
};

const checkAudioUrlAvailability = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.status === 404 || res.status === 403 || res.status >= 500) {
      return false;
    }
    if (res.ok) {
      return true;
    }

    // Fallback if HEAD returned 405 or 400
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 4000);
    const resGet = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-10' },
      signal: controller2.signal,
    });
    clearTimeout(timeoutId2);

    return resGet.ok || resGet.status === 206;
  } catch (e) {
    console.warn('checkAudioUrlAvailability failed:', e);
    return false;
  }
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

  // Track player ref
  const nativePlayerRef = useRef<any>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (nativePlayerRef.current && nativePlayerRef.current.remove) {
          nativePlayerRef.current.remove();
        }
      } catch (e) {}
    };
  }, []);

  const handleAudioPlaybackError = () => {
    try {
      if (nativePlayerRef.current && nativePlayerRef.current.remove) {
        nativePlayerRef.current.remove();
      }
    } catch (e) {}
    nativePlayerRef.current = null;

    if (htmlAudioRef.current) {
      try { htmlAudioRef.current.pause(); } catch (e) {}
      htmlAudioRef.current = null;
    }

    setCurrentTrack(null);
    setIsMiniPlayerVisible(false);
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    showAudioErrorToast('ऑडियो वर्तमान में उपलब्ध नहीं है।');
  };

  const playSoundEffect = async (soundType: string) => {
    try {
      if (Platform.OS !== 'web') {
        const createPlayer = getCreateAudioPlayer();
        const soundSrc = LOCAL_SOUNDS[soundType];
        if (createPlayer && soundSrc) {
          const sfxPlayer = createPlayer(soundSrc);
          sfxPlayer.play();
        }
      } else {
        if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(soundType === 'chime' ? 1046.5 : 880, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.0);
        }
      }
    } catch (e) {
      console.warn('playSoundEffect error:', e);
    }
  };

  const playTrack = async (track: AudioItem) => {
    try {
      // Clean up any existing player before playing new track
      if (nativePlayerRef.current && nativePlayerRef.current.remove) {
        try { nativePlayerRef.current.remove(); } catch (e) {}
        nativePlayerRef.current = null;
      }
      if (htmlAudioRef.current) {
        try { htmlAudioRef.current.pause(); } catch (e) {}
        htmlAudioRef.current = null;
      }

      if (!track || !track.audioUrl || !track.audioUrl.startsWith('http')) {
        handleAudioPlaybackError();
        return;
      }

      // Pre-flight check: Verify remote audio URL actually exists before opening player
      const isAvailable = await checkAudioUrlAvailability(track.audioUrl);
      if (!isAvailable) {
        handleAudioPlaybackError();
        return;
      }

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Audio' in window) {
          const audio = new window.Audio(track.audioUrl);

          audio.onerror = () => {
            console.warn('Audio playback error (404/network):', track.audioUrl);
            handleAudioPlaybackError();
          };

          audio.play().then(() => {
            setCurrentTrack(track);
            setIsMiniPlayerVisible(true);
            setIsPlaying(true);
            setDuration(audio.duration || track.duration || 0);
            StorageService.recordAudioPlayed();
          }).catch((err) => {
            console.warn('Web Audio play failed:', err);
            handleAudioPlaybackError();
          });

          audio.ontimeupdate = () => {
            setPosition(Math.floor(audio.currentTime));
            if (audio.duration && !isNaN(audio.duration)) {
              setDuration(Math.floor(audio.duration));
            }
          };

          audio.onended = () => {
            setIsPlaying(false);
            setPosition(0);
          };

          htmlAudioRef.current = audio;
        } else {
          handleAudioPlaybackError();
        }
      } else {
        const createPlayer = getCreateAudioPlayer();
        if (createPlayer) {
          try {
            const player = createPlayer({ uri: track.audioUrl });

            if (player.addListener) {
              player.addListener('statusChange', (status: any) => {
                if (status?.error) {
                  console.warn('expo-audio native status error:', status.error);
                  handleAudioPlaybackError();
                } else {
                  if (status?.currentTime !== undefined) {
                    setPosition(Math.floor(status.currentTime));
                  }
                  if (status?.duration && status.duration > 0) {
                    setDuration(Math.floor(status.duration));
                  }
                }
              });
            }

            player.play();
            nativePlayerRef.current = player;

            setCurrentTrack(track);
            setIsMiniPlayerVisible(true);
            setIsPlaying(true);
            if (player.duration && player.duration > 0) {
              setDuration(Math.floor(player.duration));
            } else {
              setDuration(track.duration || 0);
            }
            StorageService.recordAudioPlayed();
          } catch (err) {
            console.warn('Native expo-audio track stream error:', err);
            handleAudioPlaybackError();
          }
        } else {
          handleAudioPlaybackError();
        }
      }
    } catch (e) {
      console.warn('Error loading audio track:', e);
      handleAudioPlaybackError();
    }
  };
  const pauseTrack = async () => {
    try {
      if (nativePlayerRef.current && nativePlayerRef.current.pause) {
        nativePlayerRef.current.pause();
      }
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
      }
    } catch (e) {}
    setIsPlaying(false);
  };

  const resumeTrack = async () => {
    try {
      if (nativePlayerRef.current && nativePlayerRef.current.play) {
        nativePlayerRef.current.play();
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
      if (nativePlayerRef.current && nativePlayerRef.current.seekTo) {
        nativePlayerRef.current.seekTo(seconds);
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
