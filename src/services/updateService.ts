import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { APP_LINKS } from '@/constants/links';

export interface UpdateManifest {
  latestVersion: string;
  versionCode: number;
  minRequiredVersion?: string;
  forceUpdate?: boolean;
  whatsNew: string[];
  updateUrl: string;
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  latestVersion: string;
  whatsNew: string[];
  forceUpdate: boolean;
  updateUrl: string;
}

// Fallback update URL / manifest endpoint (e.g. raw GitHub URL or static endpoint)
const UPDATE_MANIFEST_URL = 'https://raw.githubusercontent.com/amit265/shiv-charcha/main/version.json';

function isVersionNewer(current: string, latest: string): boolean {
  const cParts = current.split('.').map(n => parseInt(n, 10) || 0);
  const lParts = latest.split('.').map(n => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(cParts.length, lParts.length); i++) {
    const c = cParts[i] || 0;
    const l = lParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}

export const UpdateService = {
  getCurrentVersion(): string {
    return Constants.expoConfig?.version || '1.0.0';
  },

  async checkForUpdates(): Promise<UpdateCheckResult | null> {
    try {
      const currentVersion = this.getCurrentVersion();

      // Fetch remote version manifest with cache bypass
      const response = await fetch(UPDATE_MANIFEST_URL, {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!response.ok) return null;

      const manifest: UpdateManifest = await response.json();

      if (isVersionNewer(currentVersion, manifest.latestVersion)) {
        // Check if user previously dismissed this version prompt
        const dismissedKey = `ds_update_dismissed_${manifest.latestVersion}`;
        const isDismissed = await AsyncStorage.getItem(dismissedKey);

        if (isDismissed && !manifest.forceUpdate) {
          return null;
        }

        return {
          hasUpdate: true,
          latestVersion: manifest.latestVersion,
          whatsNew: manifest.whatsNew || [],
          forceUpdate: Boolean(manifest.forceUpdate),
          updateUrl: manifest.updateUrl || APP_LINKS.playStoreUrl,
        };
      }

      return null;
    } catch (e) {
      // Offline or network error
      return null;
    }
  },

  async dismissUpdate(version: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`ds_update_dismissed_${version}`, 'true');
    } catch (e) {}
  },
};
