export interface DailyMessage {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  shortMessage: string;
  fullMessage: string;
  audioUrl: string; // MP3 URL or asset reference
  audioDuration: number; // in seconds
  author?: string;
  imageUrl: string;
  category: string;
  shareCardPrompt: string;
}

export interface TeachingTopic {
  id: string;
  title: string;
  subTitle: string;
  category: 'understanding' | 'sutras' | 'faq' | 'daily_life';
  summary: string;
  fullContent: string;
  audioUrl?: string;
  audioDuration?: number;
  keyTakeaways: string[];
  practicalExamples?: string[];
  imageUrl?: string;
}

export interface BookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  summaryHindi: string; // "आसान भाषा में समझें"
  keyLessons: string[];
  dailyLifeConnection: string;
  fullText: string;
  audioUrl?: string;
  audioDuration?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  easySummary: string; // Overview in simple terms
  chapters: BookChapter[];
  totalChapters: number;
  metadata?: {
    publisher?: string;
    edition?: string;
  };
}

export interface AudioItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'teachings' | 'bhajans' | 'mantra' | 'charcha_songs' | 'ambience' | 'special_day';
  duration: number; // in seconds
  audioUrl: string;
  coverImage: string;
  artist?: string;
  lyrics?: string;
  isPopular?: boolean;
}

export interface SacredDate {
  id: string;
  date: string; // MM-DD or YYYY-MM-DD
  title: string;
  subtitle: string;
  category: 'sahab_shri' | 'didi_maa' | 'shiv_charcha' | 'devotional';
  description: string;
  detailedText: string;
  audioUrl?: string;
  imageUrl: string;
  relatedBhajanId?: string;
  relatedTopicId?: string;
  shareCardTemplateId?: string;
}

export interface ShareTemplate {
  id: string;
  title: string;
  category: 'daily' | 'morning' | 'evening' | 'shiv_guru' | 'mantra' | 'special' | 'personal';
  style: 'minimal' | 'traditional' | 'premium' | 'special_day' | 'personal';
  bgGradient: [string, string];
  textColor: string;
  accentColor: string;
  borderStyle?: string;
  defaultText: string;
  defaultAuthor?: string;
  iconName?: string;
  artworkUrl?: string;
}

export interface WallpaperItem {
  id: string;
  title: string;
  category: 'shivling' | 'mantra' | 'art' | 'special';
  imageUrl: string;
  downloadUrl: string;
  previewUrl: string;
}

export interface RingtoneItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'bell' | 'shankh' | 'mantra' | 'notification';
  duration: number; // in seconds
  audioUrl: string;
  downloadUrl: string;
}

export interface DevotionalAction {
  id: string;
  type: 'flower' | 'belpatra' | 'water' | 'milk' | 'diya' | 'garland' | 'bell' | 'shankh';
  title: string;
  icon: string;
  soundAsset?: string;
}

export interface UserStats {
  activeDays: number;
  japCompletions: number;
  totalJapCount: number;
  audioListenedCount: number;
  booksReadCount: number;
  lastActiveDate: string;
}

import { ThemeId } from '../theme/themes';

export interface UserPreferences {
  userName: string;
  avatarIcon?: string;
  hasCompletedOnboarding?: boolean;
  favoriteColorTheme: ThemeId;
  fontSize: 'medium' | 'large' | 'extra_large';
  notificationsEnabled: boolean;
  dailyReminderTime: string; // HH:mm
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  shareCardDefaultName: string;
}
