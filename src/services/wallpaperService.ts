import { NativeModules, Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system/legacy';

const { WallpaperModule } = NativeModules;

export type WallpaperDestination = 'home' | 'lock' | 'both';

/**
 * Direct Wallpaper Setting Service
 * Directly updates Android Home Screen, Lock Screen, or Both Screens using native WallpaperManager.
 * Falls back to Android System Wallpaper Chooser via IntentLauncher when native module is unavailable.
 */
export const setWallpaperDirect = async (
  imageUriOrUrl: string,
  destination: WallpaperDestination = 'both'
): Promise<boolean> => {
  // 1. Try Native Kotlin WallpaperModule (Direct silent update for compiled APK)
  if (Platform.OS === 'android' && WallpaperModule && typeof WallpaperModule.setWallpaper === 'function') {
    try {
      await WallpaperModule.setWallpaper(imageUriOrUrl, destination);
      return true;
    } catch (error) {
      console.warn('Native WallpaperModule error:', error);
    }
  }

  // 2. Android System Intent Chooser Fallback (Opens Android native "Set as Wallpaper" screen)
  if (Platform.OS === 'android') {
    try {
      let contentUri = imageUriOrUrl;
      if (imageUriOrUrl.startsWith('file://')) {
        contentUri = await FileSystem.getContentUriAsync(imageUriOrUrl);
      }

      await IntentLauncher.startActivityAsync('android.intent.action.ATTACH_DATA', {
        data: contentUri,
        type: 'image/*',
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
      });
      return true;
    } catch (intentErr) {
      console.warn('IntentLauncher ATTACH_DATA error:', intentErr);
    }
  }

  return false;
};
