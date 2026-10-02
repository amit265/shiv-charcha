import { getAnalytics, logEvent, logScreenView } from '@react-native-firebase/analytics';
import { getCrashlytics, log, recordError } from '@react-native-firebase/crashlytics';

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

function sanitizeParams(params?: AnalyticsParams) {
  if (!params) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, string | number | boolean] =>
        entry[1] !== undefined && entry[1] !== null
    )
  );
}

export const Analytics = {
  async track(eventName: string, params?: AnalyticsParams) {
    try {
      const analytics = getAnalytics();
      await logEvent(analytics, eventName as never, sanitizeParams(params));
    } catch (e) {
      if (__DEV__) {
        console.warn('[Analytics Native Track Error]', e);
      }
    }
  },

  async logScreen(screenName: string, screenClass?: string) {
    try {
      const analytics = getAnalytics();
      await logScreenView(analytics, {
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (e) {
      if (__DEV__) {
        console.warn('[Analytics Native Screen Error]', e);
      }
    }
  },

  async recordError(error: unknown) {
    try {
      const message = error instanceof Error ? error.message : String(error);
      const crashlytics = getCrashlytics();
      log(crashlytics, message);

      if (error instanceof Error) {
        recordError(crashlytics, error);
      }
    } catch (e) {
      if (__DEV__) {
        console.warn('[Analytics Native RecordError Error]', e);
      }
    }
  },
};
