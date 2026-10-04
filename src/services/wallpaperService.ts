import { NativeModules, Platform } from 'react-native';

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
      throw error;
    }
  }

  // Fallback if native module not supported on current platform
  return false;
};
