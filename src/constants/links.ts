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
  playStoreSearchBase: 'https://play.google.com/store/search?q=Mahavyoma+Studio',
  publisherUrl: 'https://play.google.com/store/apps/developer?id=Mahavyoma+Studio',

  // Legal & Policy Web Links
  privacyPolicyUrl: 'https://mahavyomastudio.com/legal/shiv-charcha-privacy',
  termsOfServiceUrl: 'https://mahavyomastudio.com/legal/shiv-charcha-terms',
  supportPageUrl: 'https://mahavyomastudio.com/support',

  // Remote Manifest for In-App Updates
  versionJsonUrl: 'https://mahavyomastudio.com/apps/shiv-charcha/version.json',
  assetLinksJsonUrl: 'https://mahavyomastudio.com/.well-known/assetlinks.json',
} as const;

export const MEDIA_LINKS = {
  r2PublicBaseUrl: 'https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev',
  r2AudioBaseUrl: 'https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/audio',
} as const;

export const SOCIAL_LINKS = {
  instagramUrl: 'https://www.instagram.com/mahavyomabhakti/',
  youtubeChannelUrl: 'https://youtube.com/@Mahavyomabhakti',
} as const;

export const CROSS_PROMO_APPS = [
  {
    id: 'hindi-calendar-2027',
    title: 'Hindi Calendar 2027: Panchang',
    titleHindi: 'हिंदी कैलेंडर 2027 - पंचांग',
    descriptionHindi: 'ठाकुर प्रसाद पंचांग स्टाइल कैलेंडर, 20-शहर पंचांग एवं व्रत तिथियाँ',
    url: 'https://play.google.com/store/apps/details?id=com.mahavyomastudio.hindicalendar',
    icon: '📅',
    badgeText: 'Live',
  },
  {
    id: 'hanuman-chalisa',
    title: 'Hanuman Chalisa: Audio & Path',
    titleHindi: 'हनुमान चालीसा - ऑडियो व पाठ',
    descriptionHindi: 'हनुमान चालीसा, बजरंग बाण, संकटमोचन एवं ऑडियो साधना',
    url: 'https://mahavyomastudio.com',
    icon: '📿',
    badgeText: 'Soon',
  },
  {
    id: 'shiva-bhakti',
    title: 'Shiva Bhakti: Tandav & Aarti',
    titleHindi: 'शिव भक्ति - तांडव व आरती',
    descriptionHindi: 'शिव तांडव स्तोत्र, शिव चालीसा, महामृत्युंजय मंत्र व 108 जाप साधना',
    url: 'https://mahavyomastudio.com',
    icon: '🔱',
    badgeText: 'Soon',
  },
] as const;
