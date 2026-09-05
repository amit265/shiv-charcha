export const colors = {
  // Primary Saffron Palette
  saffronPrimary: '#E65100',
  saffronLight: '#FF8F00',
  saffronDark: '#BF360C',
  saffronGradient: ['#FF6F00', '#D84315'] as const,

  // Deep Maroon / Plum Palette
  maroonPrimary: '#4A0E17',
  maroonLight: '#6A1B29',
  maroonDark: '#3B070C',
  maroonDeep: '#260408',
  maroonGradient: ['#6A1B29', '#3B070C'] as const,

  // Devotional Gold
  goldPrimary: '#D4AF37',
  goldLight: '#FFD700',
  goldDark: '#B8860B',
  goldGradient: ['#FFE58F', '#D4AF37'] as const,

  // Background & Surfaces
  bgIvory: '#FFFDF7',
  bgCream: '#FAFAF2',
  bgSoftAmber: '#FFF8E7',
  cardBg: '#FFFFFF',
  cardBgAmber: '#FFFBF0',
  cardBgMaroon: '#4A0E17',

  // Text Colors
  textDark: '#2C1810',
  textMedium: '#5D4037',
  textLight: '#8D6E63',
  textWhite: '#FFFFFF',
  textGold: '#F5D061',
  textSaffron: '#D84315',

  // Accents & Nature
  greenLeaf: '#2E7D32',
  greenSoft: '#E8F5E9',
  blueWater: '#0288D1',
  blueSoft: '#E1F5FE',
  milkWhite: '#F8F9FA',
  diyaFlame: '#FF9800',

  // UI States
  borderLight: '#F0E6D2',
  borderGold: '#E6C875',
  overlayDark: 'rgba(38, 4, 8, 0.65)',
  overlayLight: 'rgba(255, 253, 247, 0.85)',
  shadowColor: '#3B070C',

  // Tab Bar
  tabActive: '#E65100',
  tabInactive: '#8D6E63',
  tabBg: '#FFFDF7',
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 26,
    hero: 32,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
};

export const shadows = {
  soft: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 6,
  },
  gold: {
    shadowColor: colors.goldDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
};
