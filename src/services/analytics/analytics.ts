type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export const Analytics = {
  async track(eventName: string, params?: AnalyticsParams) {
    try {
      if (__DEV__) {
        console.log('[Analytics Log Event]', eventName, params);
      }
    } catch (e) {
      console.warn('[Analytics Error]', e);
    }
  },

  async logScreen(screenName: string, screenClass?: string) {
    try {
      if (__DEV__) {
        console.log('[Analytics Log Screen]', screenName, screenClass);
      }
    } catch (e) {
      console.warn('[Analytics Error]', e);
    }
  },

  async recordError(error: unknown) {
    try {
      if (__DEV__) {
        console.warn('[Analytics Log Error]', error);
      }
    } catch (e) {
      console.warn('[Analytics Error]', e);
    }
  },
};
