import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [htmlAudio, setHtmlAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (htmlAudio) {
        htmlAudio.pause();
      }
    };
  }, [htmlAudio]);

  const playTrack = async (track: AudioItem) => {
    try {
      if (htmlAudio) {
        htmlAudio.pause();
        setHtmlAudio(null);
      }

      setCurrentTrack(track);
      setIsMiniPlayerVisible(true);
      StorageService.recordAudioPlayed();

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

        setHtmlAudio(audio);
      } else {
        setIsPlaying(true);
        setDuration(track.duration || 180);
        setPosition(0);
      }
    } catch (e) {
      console.warn('Error loading audio track:', e);
      setIsPlaying(true);
      setDuration(track.duration || 180);
      setPosition(0);
    }
  };

  const pauseTrack = async () => {
    if (htmlAudio) {
      htmlAudio.pause();
    }
    setIsPlaying(false);
  };

  const resumeTrack = async () => {
    if (htmlAudio) {
      htmlAudio.play().catch(() => {});
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
    if (htmlAudio) {
      htmlAudio.currentTime = seconds;
    }
    setPosition(seconds);
  };

  const dismissMiniPlayer = () => {
    if (htmlAudio) {
      htmlAudio.pause();
    }
    setIsPlaying(false);
    setIsMiniPlayerVisible(false);
  };

  const playSoundEffect = async (soundType: string) => {
    try {
      if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        
        if (soundType === 'bell') {
          // Temple Bell: Fundamental + Harmonic overtone
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1760, ctx.currentTime); // A6 overtone
          
          gain.gain.setValueAtTime(0.6, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);
          
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          
          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 2.8);
          osc2.stop(ctx.currentTime + 2.8);
        } else if (soundType === 'shankh') {
          // Shankh Naad: Low triangle wave swelling up
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(280, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 1.5);
          osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 3.2);
          
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 3.5);
        } else if (soundType === 'water') {
          // Water Stream: Modulated noise flow
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
          osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.8);
          
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 1.0);
        } else {
          // Chime / Flower Drop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
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
