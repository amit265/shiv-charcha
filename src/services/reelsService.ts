import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { ShivReel, shivReelsCatalog } from '../content/reelsCatalog';
import { safeShare } from './shareService';

const LIKED_REELS_KEY = '@shiv_charcha_liked_reels';
const CACHED_REELS_KEY = '@shiv_charcha_remote_reels_json';

// Remote API endpoint on Mahavyoma Studio website
export const REMOTE_REELS_JSON_URL =
  'https://mahavyomastudio.com/apps/shiv-charcha/data/reels.json';
export const REMOTE_REELS_API_FALLBACK =
  'https://mahavyomastudio.com/api/reels.json';

export const MAHAVYOMA_BHAKTI_YT_URL = 'https://youtube.com/@mahavyomabhakti';

export class ReelsService {
  /**
   * Returns curated list of Shiv Charcha Reels.
   * Fetches remote catalog from Mahavyoma Studio Website API endpoint with cached & local fallbacks.
   */
  static async getReels(): Promise<ShivReel[]> {
    const fetchFromUrl = async (url: string): Promise<ShivReel[] | null> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache', Accept: 'application/json' },
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const remoteData = await response.json();
          const items = Array.isArray(remoteData) ? remoteData : remoteData?.reels;
          if (Array.isArray(items) && items.length > 0) {
            await AsyncStorage.setItem(CACHED_REELS_KEY, JSON.stringify(items));
            return items as ShivReel[];
          }
        }
      } catch {
        // Continue fallback
      }
      return null;
    };

    // 1. Fetch from primary website API URL
    const primaryData = await fetchFromUrl(REMOTE_REELS_JSON_URL);
    if (primaryData) return primaryData;

    // 2. Fetch from secondary website API endpoint fallback
    const fallbackData = await fetchFromUrl(REMOTE_REELS_API_FALLBACK);
    if (fallbackData) return fallbackData;

    // 2. Try loading cached remote reels if available
    try {
      const cached = await AsyncStorage.getItem(CACHED_REELS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as ShivReel[];
        }
      }
    } catch {
      // Ignore cache parse error
    }

    // 3. Fallback to local catalog
    return shivReelsCatalog;
  }

  /**
   * Gets list of Reel IDs liked by the user.
   */
  static async getLikedReelIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(LIKED_REELS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Toggles like state for a reel.
   */
  static async toggleLikeReel(reelId: string): Promise<boolean> {
    try {
      const liked = await this.getLikedReelIds();
      const isLiked = liked.includes(reelId);
      let newLiked: string[];
      if (isLiked) {
        newLiked = liked.filter((id) => id !== reelId);
      } else {
        newLiked = [...liked, reelId];
      }
      await AsyncStorage.setItem(LIKED_REELS_KEY, JSON.stringify(newLiked));
      return !isLiked;
    } catch {
      return false;
    }
  }

  /**
   * Shares a Reel to WhatsApp / Social Media
   */
  static async shareReel(reel: ShivReel): Promise<void> {
    const message = `🎬 *शिव चर्चा 15-सेकंड रील*: "${reel.title}"\n\n${reel.subTitle}\n\n▶️ रील्स यहाँ देखें: ${reel.youtubeUrl}\n\n🌸 *महाव्योम भक्ति YouTube चैनल* • शिव चर्चा ऐप 🙏`;
    await safeShare({
      title: reel.title,
      message,
    });
  }

  /**
   * Opens Mahavyoma Bhakti YouTube Channel for subscribing
   */
  static async openYouTubeChannel(): Promise<void> {
    try {
      const supported = await Linking.canOpenURL(MAHAVYOMA_BHAKTI_YT_URL);
      if (supported) {
        await Linking.openURL(MAHAVYOMA_BHAKTI_YT_URL);
      }
    } catch (e) {
      console.warn('Failed to open YouTube Channel link:', e);
    }
  }
}
