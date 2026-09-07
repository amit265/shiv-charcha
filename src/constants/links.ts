/**
 * Centralized Application & Studio Links Constants for Shiv Charcha
 */

export const APP_CONFIG = {
  appName: 'Shiv Charcha',
  appNameHindi: 'शिव चर्चा - शिव गुरु साधना',
  packageName: 'com.mahavyomastudio.shivcharcha',
  version: '1.0.0',
  buildNumber: 100,
  developerName: 'Mahavyoma Studio',
  supportEmail: 'support@mahavyomastudio.com',
} as const;

export const APP_LINKS = {
  // Official Website Domains & Deep Linking
  studioWebsite: 'https://mahavyomastudio.com',
  appLandingPage: 'https://mahavyomastudio.com/apps/shiv-charcha',
  deepLinkScheme: 'shivcharcha://',

  // Google Play Store Links
  playStoreUrl: `https://play.google.com/store/apps/details?id=${APP_CONFIG.packageName}`,
  playStoreSearchBase: 'https://play.google.com/store/search?q=',

  // Legal & Policy Web Links
  privacyPolicyUrl: 'https://mahavyomastudio.com/apps/shiv-charcha/privacy',
  termsOfServiceUrl: 'https://mahavyomastudio.com/apps/shiv-charcha/terms',
  supportPageUrl: 'https://mahavyomastudio.com/support',

  // Remote Manifest for In-App Updates
  versionJsonUrl: 'https://mahavyomastudio.com/apps/shiv-charcha/version.json',
  assetLinksJsonUrl: 'https://mahavyomastudio.com/.well-known/assetlinks.json',
} as const;

export const CROSS_PROMO_LINKS = {
  bhaktiMala: 'https://play.google.com/store/search?q=bhakti%20mala%20mahavyoma',
  gitaCharcha: 'https://play.google.com/store/search?q=gita%20charcha%20mahavyoma',
  hanumanSadhana: 'https://play.google.com/store/search?q=hanuman%20sadhana%20mahavyoma',
} as const;
