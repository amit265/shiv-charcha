import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { ShivReel, shivReelsCatalog } from '../content/reelsCatalog';
import { safeShare } from './shareService';

const LIKED_REELS_KEY = '@shiv_charcha_liked_reels';
export const MAHAVYOMA_BHAKTI_YT_URL = 'https://youtube.com/@mahavyomabhakti';

export class ReelsService {
  /**
   * Returns curated list of Shiv Charcha Reels.
   * Can fetch remote catalog from CDN / GitHub Raw in future.
   */
  static async getReels(): Promise<ShivReel[]> {
    try {
      // Return curated catalog
      return shivReelsCatalog;
    } catch {
      return shivReelsCatalog;
    }
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
