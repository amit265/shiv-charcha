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
  userName: '',
  avatarIcon: '🙏',
  userGender: 'male',
  discipleTitle: 'शिव शिष्य',
  hasCompletedOnboarding: false,
  favoriteColorTheme: 'divya_sukoon',
  fontSize: 'medium',
  notificationsEnabled: true,
  dailyReminderTime: '07:00',
  soundEnabled: true,
  hapticsEnabled: true,
  shareCardDefaultName: 'शिव शिष्य',
};

export const getDiscipleTitle = (prefsOrGender?: Partial<UserPreferences> | string | null): string => {
  if (typeof prefsOrGender === 'object' && prefsOrGender !== null) {
    if (prefsOrGender.discipleTitle) return prefsOrGender.discipleTitle;
    if (prefsOrGender.userGender === 'female') return 'शिव शिष्या';
    if (prefsOrGender.userGender === 'neutral') return 'शिव भक्त';
    return 'शिव शिष्य';
  }
  if (typeof prefsOrGender === 'string') {
    if (prefsOrGender === 'female' || prefsOrGender === 'शिव शिष्या' || prefsOrGender === 'गुरु बहिन') return 'शिव शिष्या';
    if (prefsOrGender === 'neutral' || prefsOrGender === 'शिव भक्त') return 'शिव भक्त';
  }
  return 'शिव शिष्य';
};

/**
 * Sanitizes raw user name by removing existing title words, emojis,
 * zero-width characters, and extraneous whitespace.
 */
export const sanitizeCleanName = (rawName?: string): string => {
  if (!rawName) return '';

  return rawName
    // Remove honorific titles wherever present (LONGER STRINGS FIRST to prevent leaving matra 'ा' behind)
    .replace(/(शिव शिष्या|शिव शिष्य|गुरु बहिन|गुरु भाई|शिव भक्त)/g, '')
    // Remove any orphaned/dangling Devanagari matras/vowel signs (e.g. standalone 'ा')
    .replace(/(^|\s)[\u0900-\u0903\u093A-\u094F\u0951-\u0957\u0962\u0963]+/g, ' ')
    // Remove emojis, symbols, and pictographs
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FACC}\u{1F300}-\u{1F5FF}]/gu, '')
    // Remove control/zero-width characters and non-breaking spaces
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
    // Collapse spaces
    .replace(/\s+/g, ' ')
    .trim();
};

export const getFormattedUserName = (prefs?: Partial<UserPreferences> | null): string => {
  const title = getDiscipleTitle(prefs);
  const cleanName = sanitizeCleanName(prefs?.userName);
  
  if (!cleanName) return title;
  return `${title} ${cleanName}`;
};

export const getFirstSutraText = (genderOrPrefs?: string | Partial<UserPreferences> | null): string => {
  const isObj = typeof genderOrPrefs === 'object' && genderOrPrefs !== null;
  const gender = isObj ? genderOrPrefs.userGender : typeof genderOrPrefs === 'string' ? genderOrPrefs : undefined;
  const title = isObj ? genderOrPrefs.discipleTitle : undefined;

  if (gender === 'female' || title === 'शिव शिष्या' || title === 'गुरु बहिन') {
    return 'हे शिव! आप मेरे गुरु हैं, मैं आपकी शिष्या हूँ। मुझ पर दया कर दीजिए।';
  }
  if (gender === 'neutral' || title === 'शिव भक्त') {
    return 'हे शिव! आप मेरे गुरु हैं, मैं आपका शिष्य / शिष्या हूँ। मुझ पर दया कर दीजिए।';
  }
  return 'हे शिव! आप मेरे गुरु हैं, मैं आपका शिष्य हूँ। मुझ पर दया कर दीजिए।';
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
      const history: { timestamp: string; count: number }[] = JSON.parse(historyStr);
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
  async getJapHistory(): Promise<{ timestamp: string; count: number }[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JAP_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Daily 3 Sutras Tracking & Streak Calculation
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

      // Save to historical record
      const historyStr = (await AsyncStorage.getItem('shiv_charcha_sutra_history_v1')) || '{}';
      const history = JSON.parse(historyStr);
      history[updated.day] = { sutra1: updated.sutra1, sutra2: updated.sutra2, sutra3: updated.sutra3 };
      await AsyncStorage.setItem('shiv_charcha_sutra_history_v1', JSON.stringify(history));

      return updated;
    } catch (e) {
      return await this.getDaily3Sutras();
    }
  },

  async getSutraStreak(): Promise<{ streak: number; past7Days: { date: string; dayName: string; completed: boolean }[] }> {
    try {
      const historyStr = (await AsyncStorage.getItem('shiv_charcha_sutra_history_v1')) || '{}';
      const history = JSON.parse(historyStr);
      const currentDaily = await this.getDaily3Sutras();
      const today = new Date();
      
      const dayNames = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
      const past7Days: { date: string; dayName: string; completed: boolean }[] = [];
      let streak = 0;

      // Generate 7 day status (from 6 days ago up to today)
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = dayNames[d.getDay()];

        const record = dateStr === currentDaily.day ? currentDaily : history[dateStr];
        const isComplete = Boolean(record && record.sutra1 && record.sutra2 && record.sutra3);

        past7Days.push({
          date: dateStr,
          dayName,
          completed: isComplete,
        });
      }

      // Calculate streak backwards starting from today
      let checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const rec = dateStr === currentDaily.day ? currentDaily : history[dateStr];
        if (rec && rec.sutra1 && rec.sutra2 && rec.sutra3) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // If today isn't completed yet, check yesterday to preserve ongoing streak
          if (streak === 0 && dateStr === currentDaily.day) {
            checkDate.setDate(checkDate.getDate() - 1);
            const yestStr = checkDate.toISOString().split('T')[0];
            const yestRec = history[yestStr];
            if (yestRec && yestRec.sutra1 && yestRec.sutra2 && yestRec.sutra3) {
              // Streak is preserved from yesterday
              continue;
            }
          }
          break;
        }
      }

      return { streak, past7Days };
    } catch (e) {
      return { streak: 0, past7Days: [] };
    }
  },
};
