import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { ShivReel, shivReelsCatalog } from '../content/reelsCatalog';
import { safeShare } from './shareService';

const LIKED_REELS_KEY = '@shiv_charcha_liked_reels';
const CACHED_REELS_KEY = '@shiv_charcha_remote_reels_json';

// Remote JSON URL hosted on GitHub raw repository - edit this file anytime to update reels instantly in app!
export const REMOTE_REELS_JSON_URL =
  'https://raw.githubusercontent.com/amit265/shiv-charcha/main/assets/data/reels.json';

export const MAHAVYOMA_BHAKTI_YT_URL = 'https://youtube.com/@mahavyomabhakti';

export class ReelsService {
  /**
   * Returns curated list of Shiv Charcha Reels.
   * Fetches remote catalog from API/JSON endpoint with cached & local fallbacks.
   */
  static async getReels(): Promise<ShivReel[]> {
    try {
      // 1. Fetch remote JSON catalog with 4s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(REMOTE_REELS_JSON_URL, {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const remoteData = await response.json();
        if (Array.isArray(remoteData) && remoteData.length > 0) {
          await AsyncStorage.setItem(CACHED_REELS_KEY, JSON.stringify(remoteData));
          return remoteData as ShivReel[];
        }
      }
    } catch {
      // Network offline or fetch failed - proceed to fallback cache
    }

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
