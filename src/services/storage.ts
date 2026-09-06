import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, UserStats } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'shiv_charcha_user_prefs_v1',
  STATS: 'shiv_charcha_user_stats_v1',
  FAVORITES: 'shiv_charcha_favorites_v1',
  READING_PROGRESS: 'shiv_charcha_reading_progress_v1',
  JAP_HISTORY: 'shiv_charcha_jap_history_v1',
  SAVED_CARDS: 'shiv_charcha_saved_cards_v1',
};

export const defaultPreferences: UserPreferences = {
  userName: 'शिव शिष्य',
  avatarIcon: '🙏',
  hasCompletedOnboarding: false,
  favoriteColorTheme: 'divya_sukoon',
  fontSize: 'medium',
  notificationsEnabled: true,
  dailyReminderTime: '07:00',
  soundEnabled: true,
  hapticsEnabled: true,
  shareCardDefaultName: 'शिव शिष्य',
};

export const defaultStats: UserStats = {
  activeDays: 1,
  japCompletions: 0,
  totalJapCount: 0,
  audioListenedCount: 0,
  booksReadCount: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const StorageService = {
  // Preferences
  async getPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? { ...defaultPreferences, ...JSON.parse(data) } : defaultPreferences;
    } catch (e) {
      console.warn('Storage error:', e);
      return defaultPreferences;
    }
  },

  async savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...prefs };
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  // Stats
  async getStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) return defaultStats;
      const parsed: UserStats = JSON.parse(data);
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastActiveDate !== today) {
        parsed.activeDays += 1;
        parsed.lastActiveDate = today;
        await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return defaultStats;
    }
  },

  async recordJapCompletion(count: number = 108): Promise<UserStats> {
    try {
      const stats = await this.getStats();
      stats.japCompletions += 1;
      stats.totalJapCount += count;
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));

      // Also record Jap history timestamp
      const historyStr = (await AsyncStorage.getItem(STORAGE_KEYS.JAP_HISTORY)) || '[]';
      const history: Array<{ timestamp: string; count: number }> = JSON.parse(historyStr);
      history.unshift({ timestamp: new Date().toISOString(), count });
      await AsyncStorage.setItem(STORAGE_KEYS.JAP_HISTORY, JSON.stringify(history.slice(0, 100)));

      return stats;
    } catch (e) {
      return defaultStats;
    }
  },

  async recordAudioPlayed(): Promise<void> {
    try {
      const stats = await this.getStats();
      stats.audioListenedCount += 1;
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {}
  },

  // Favorites
  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async toggleFavorite(itemId: string): Promise<boolean> {
    try {
      const favs = await this.getFavorites();
      const isFav = favs.includes(itemId);
      const updated = isFav ? favs.filter(id => id !== itemId) : [...favs, itemId];
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return !isFav;
    } catch (e) {
      return false;
    }
  },

  // Bookmarks / Reading Progress
  async getReadingProgress(): Promise<Record<string, { lastChapterId: string; page: number }>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  async saveReadingProgress(bookId: string, chapterId: string, page: number = 1): Promise<void> {
    try {
      const current = await this.getReadingProgress();
      current[bookId] = { lastChapterId: chapterId, page };
      await AsyncStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(current));
    } catch (e) {}
  },

  // Jap History
  async getJapHistory(): Promise<Array<{ timestamp: string; count: number }>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JAP_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Daily 3 Sutras Tracking
  async getDaily3Sutras(): Promise<{ day: string; sutra1: boolean; sutra2: boolean; sutra3: boolean }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await AsyncStorage.getItem('shiv_charcha_daily_sutras_v1');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.day === today) return parsed;
      }
      return { day: today, sutra1: false, sutra2: false, sutra3: false };
    } catch (e) {
      return { day: new Date().toISOString().split('T')[0], sutra1: false, sutra2: false, sutra3: false };
    }
  },

  async saveDaily3Sutras(sutras: { sutra1?: boolean; sutra2?: boolean; sutra3?: boolean }): Promise<{ day: string; sutra1: boolean; sutra2: boolean; sutra3: boolean }> {
    try {
      const current = await this.getDaily3Sutras();
      const updated = { ...current, ...sutras };
      await AsyncStorage.setItem('shiv_charcha_daily_sutras_v1', JSON.stringify(updated));
      return updated;
    } catch (e) {
      return await this.getDaily3Sutras();
    }
  },
};
