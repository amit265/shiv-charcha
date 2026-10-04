import { NativeModules, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

const { WallpaperModule } = NativeModules;

export type WallpaperDestination = 'home' | 'lock' | 'both';

/**
 * Direct Wallpaper Setting Service
 * Directly updates Android Home Screen, Lock Screen, or Both Screens using native WallpaperManager.
 */
export const setWallpaperDirect = async (
  imageUriOrUrl: string,
  destination: WallpaperDestination = 'both'
): Promise<boolean> => {
  if (Platform.OS === 'android' && WallpaperModule && typeof WallpaperModule.setWallpaper === 'function') {
    try {
      await WallpaperModule.setWallpaper(imageUriOrUrl, destination);
      return true;
    } catch (error) {
      console.warn('Native WallpaperModule error:', error);
    }
  }

  // Fallback for Expo Go or uncompiled dev clients
  if (Platform.OS === 'android' && (await Sharing.isAvailableAsync())) {
    try {
      await Sharing.shareAsync(imageUriOrUrl, {
        dialogTitle: 'वॉलपेपर के रूप में सेट करें',
        mimeType: 'image/jpeg',
      });
      return true;
    } catch (intentErr) {
      console.warn('Share intent fallback error:', intentErr);
    }
  }

  return false;
};
