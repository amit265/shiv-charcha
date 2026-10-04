import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { ShivReel, shivReelsCatalog } from '../content/reelsCatalog';
import { safeShare } from './shareService';

const LIKED_REELS_KEY = '@shiv_charcha_liked_reels';
const CACHED_REELS_KEY = '@shiv_charcha_remote_reels_json';

// Remote API endpoint on Cloudflare R2 (Public CDN) with website fallback
export const REMOTE_REELS_JSON_URL =
  'https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/reels.json';
export const REMOTE_REELS_API_FALLBACK =
  'https://mahavyomastudio.com/apps/shiv-charcha/data/reels.json';

export const MAHAVYOMA_BHAKTI_YT_URL = 'https://youtube.com/@mahavyomabhakti';

export class ReelsService {
  /**
   * Returns cached reels instantly from AsyncStorage or local bundled fallback.
   * Runs instantly to eliminate screen loading delays on screen open.
   */
  static async getCachedReels(): Promise<ShivReel[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHED_REELS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as ShivReel[];
        }
      }
    } catch {
      // Ignore cache error
    }
    return shivReelsCatalog;
  }

  /**
   * Syncs latest remote reels catalog in background.
   * Enforces max item limit (LRU cache eviction) to prevent memory bloat when 100s of videos exist.
   */
  static async syncRemoteReels(maxCacheItems = 50): Promise<ShivReel[] | null> {
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
            // Cap items to maxCacheItems to optimize memory & disk usage
            const capped = items.slice(0, maxCacheItems) as ShivReel[];
            await AsyncStorage.setItem(CACHED_REELS_KEY, JSON.stringify(capped));
            return capped;
          }
        }
      } catch {
        // Fallback silently
      }
      return null;
    };

    const primary = await fetchFromUrl(REMOTE_REELS_JSON_URL);
    if (primary) return primary;

    return fetchFromUrl(REMOTE_REELS_API_FALLBACK);
  }

  /**
   * Returns curated list of Shiv Charcha Reels.
   */
  static async getReels(): Promise<ShivReel[]> {
    const cached = await this.getCachedReels();
    // Fire-and-forget background sync
    this.syncRemoteReels().catch(() => {});
    return cached;
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
