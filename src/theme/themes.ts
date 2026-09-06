export type ThemeId =
  | 'divya_sukoon'
  | 'kesariya_bhakti'
  | 'kailash_ratri'
  | 'harit_prakriti'
  | 'gulabi_bhakti'
  | 'saral_prakash'
  | 'system';

export interface ThemeTokens {
  id: ThemeId;
  nameHindi: string;
  nameEnglish: string;
  icon: string;
  descriptionHindi: string;

  // Primary Branding & Accent
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  accentGlow: string;

  // Background & Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  cardBg: string;
  cardBgAmber: string;
  cardBgMaroon: string;
  navigationBackground: string;
  tabBarBg: string;
  tabActive: string;
  tabInactive: string;

  // Text Tokens
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textWhite: string;
  textGold: string;
  textSaffron: string;

  // Borders & Dividers
  border: string;
  borderGold: string;
  borderFocus: string;

  // States & Utility
  success: string;
  warning: string;
  error: string;
  statusBar: 'light' | 'dark';
  isDark: boolean;

  // Visual gradients (colors array)
  headerGradient: readonly [string, string];
  cardGradient: readonly [string, string];
}

export const THEMES: Record<Exclude<ThemeId, 'system'>, ThemeTokens> = {
  divya_sukoon: {
    id: 'divya_sukoon',
    nameHindi: '🌅 दिव्य सुकून',
    nameEnglish: 'Divya Sukoon',
    icon: '🌅',
    descriptionHindi: 'गहरा मखमली मेरून, केसरिया व स्वर्णिम कांति (डिफ़ॉल्ट)',

    primary: '#4A0E17',
    primaryDark: '#260408',
    primaryLight: '#6A1B29',
    secondary: '#E65100',
    accent: '#D4AF37',
    accentGlow: '#FFD700',

    background: '#FFFDF7',
    surface: '#FFFFFF',
    surfaceElevated: '#FFF8E7',
    cardBg: '#FFFFFF',
    cardBgAmber: '#FFFBF0',
    cardBgMaroon: '#4A0E17',
    navigationBackground: '#4A0E17',
    tabBarBg: '#FFFDF7',
    tabActive: '#E65100',
    tabInactive: '#8D6E63',

    textPrimary: '#2C1810',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
    textWhite: '#FFFFFF',
    textGold: '#F5D061',
    textSaffron: '#D84315',

    border: '#F0E6D2',
    borderGold: '#E6C875',
    borderFocus: '#D4AF37',

    success: '#2E7D32',
    warning: '#FF9800',
    error: '#C62828',
    statusBar: 'light',
    isDark: false,

    headerGradient: ['#4A0E17', '#260408'],
    cardGradient: ['#FFF8E7', '#FFFDF7'],
  },

  kesariya_bhakti: {
    id: 'kesariya_bhakti',
    nameHindi: '🪔 केसरिया भक्ति',
    nameEnglish: 'Kesariya Bhakti',
    icon: '🪔',
    descriptionHindi: 'उज्ज्वल केसरिया, अग्नि शिखा व उष्ण सुनहरी आभा',

    primary: '#D84315',
    primaryDark: '#BF360C',
    primaryLight: '#FF6F00',
    secondary: '#4A0E17',
    accent: '#FFC107',
    accentGlow: '#FFE082',

    background: '#FFF9F0',
    surface: '#FFFFFF',
    surfaceElevated: '#FFF3E0',
    cardBg: '#FFFFFF',
    cardBgAmber: '#FFEFE0',
    cardBgMaroon: '#BF360C',
    navigationBackground: '#D84315',
    tabBarBg: '#FFF9F0',
    tabActive: '#D84315',
    tabInactive: '#A1887F',

    textPrimary: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
    textWhite: '#FFFFFF',
    textGold: '#FFD54F',
    textSaffron: '#BF360C',

    border: '#FFE0B2',
    borderGold: '#FFB74D',
    borderFocus: '#FF6F00',

    success: '#388E3C',
    warning: '#F57C00',
    error: '#D32F2F',
    statusBar: 'light',
    isDark: false,

    headerGradient: ['#D84315', '#BF360C'],
    cardGradient: ['#FFF3E0', '#FFF9F0'],
  },

  kailash_ratri: {
    id: 'kailash_ratri',
    nameHindi: '🌙 कैलाश रात्रि',
    nameEnglish: 'Kailash Ratri',
    icon: '🌙',
    descriptionHindi: 'शांत हिमालयी नील, इंडिगो व चंद्र-रजत कांति',

    primary: '#0F172A',
    primaryDark: '#020617',
    primaryLight: '#1E293B',
    secondary: '#6366F1',
    accent: '#38BDF8',
    accentGlow: '#7DD3FC',

    background: '#0B0F19',
    surface: '#151C2C',
    surfaceElevated: '#1E293B',
    cardBg: '#151C2C',
    cardBgAmber: '#1E293B',
    cardBgMaroon: '#0F172A',
    navigationBackground: '#0F172A',
    tabBarBg: '#0B0F19',
    tabActive: '#38BDF8',
    tabInactive: '#64748B',

    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    textWhite: '#FFFFFF',
    textGold: '#FDE047',
    textSaffron: '#FB923C',

    border: '#1E293B',
    borderGold: '#38BDF8',
    borderFocus: '#60A5FA',

    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    statusBar: 'light',
    isDark: true,

    headerGradient: ['#0F172A', '#020617'],
    cardGradient: ['#1E293B', '#151C2C'],
  },

  harit_prakriti: {
    id: 'harit_prakriti',
    nameHindi: '🌿 हरित प्रकृति',
    nameEnglish: 'Harit Prakriti',
    icon: '🌿',
    descriptionHindi: 'पावन बेलपत्र हरा, प्राकृतिक शांति व सुवर्ण स्पर्श',

    primary: '#1B4332',
    primaryDark: '#081C15',
    primaryLight: '#2D6A4F',
    secondary: '#D4AF37',
    accent: '#52B788',
    accentGlow: '#74C69D',

    background: '#F4F7F4',
    surface: '#FFFFFF',
    surfaceElevated: '#E8F5E9',
    cardBg: '#FFFFFF',
    cardBgAmber: '#F1F8F4',
    cardBgMaroon: '#1B4332',
    navigationBackground: '#1B4332',
    tabBarBg: '#F4F7F4',
    tabActive: '#1B4332',
    tabInactive: '#6B8E23',

    textPrimary: '#1A2E22',
    textSecondary: '#2D4A3E',
    textMuted: '#52796F',
    textWhite: '#FFFFFF',
    textGold: '#D4AF37',
    textSaffron: '#D84315',

    border: '#D8F3DC',
    borderGold: '#B7E4C7',
    borderFocus: '#40916C',

    success: '#2D6A4F',
    warning: '#E65100',
    error: '#C62828',
    statusBar: 'light',
    isDark: false,

    headerGradient: ['#1B4332', '#081C15'],
    cardGradient: ['#E8F5E9', '#F4F7F4'],
  },

  gulabi_bhakti: {
    id: 'gulabi_bhakti',
    nameHindi: '🌸 गुलाबी भक्ति',
    nameEnglish: 'Gulabi Bhakti',
    icon: '🌸',
    descriptionHindi: 'कोमल भक्तिमय कमल, सौम्य गुलाबी व स्वर्णिम लालित्य',

    primary: '#881337',
    primaryDark: '#4C0519',
    primaryLight: '#9F1239',
    secondary: '#E11D48',
    accent: '#F59E0B',
    accentGlow: '#FCD34D',

    background: '#FFF5F7',
    surface: '#FFFFFF',
    surfaceElevated: '#FFE4E6',
    cardBg: '#FFFFFF',
    cardBgAmber: '#FFF0F3',
    cardBgMaroon: '#881337',
    navigationBackground: '#881337',
    tabBarBg: '#FFF5F7',
    tabActive: '#9F1239',
    tabInactive: '#9C6672',

    textPrimary: '#3B0712',
    textSecondary: '#701A2E',
    textMuted: '#9F5265',
    textWhite: '#FFFFFF',
    textGold: '#F59E0B',
    textSaffron: '#E11D48',

    border: '#FECDD3',
    borderGold: '#FDA4AF',
    borderFocus: '#F43F5E',

    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    statusBar: 'light',
    isDark: false,

    headerGradient: ['#881337', '#4C0519'],
    cardGradient: ['#FFE4E6', '#FFF5F7'],
  },

  saral_prakash: {
    id: 'saral_prakash',
    nameHindi: '⚪ सरल प्रकाश',
    nameEnglish: 'Saral Prakash',
    icon: '⚪',
    descriptionHindi: 'उच्च स्पष्टता वाला न्यूनतम श्वेत व स्वर्ण रूप (सुगम पठन)',

    primary: '#1E293B',
    primaryDark: '#0F172A',
    primaryLight: '#334155',
    secondary: '#D97706',
    accent: '#B45309',
    accentGlow: '#F59E0B',

    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceElevated: '#F1F5F9',
    cardBg: '#FFFFFF',
    cardBgAmber: '#FEF3C7',
    cardBgMaroon: '#1E293B',
    navigationBackground: '#1E293B',
    tabBarBg: '#FFFFFF',
    tabActive: '#B45309',
    tabInactive: '#64748B',

    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    textWhite: '#FFFFFF',
    textGold: '#B45309',
    textSaffron: '#D97706',

    border: '#E2E8F0',
    borderGold: '#FDE68A',
    borderFocus: '#D97706',

    success: '#15803D',
    warning: '#D97706',
    error: '#B91C1C',
    statusBar: 'light',
    isDark: false,

    headerGradient: ['#1E293B', '#0F172A'],
    cardGradient: ['#F8FAFC', '#FFFFFF'],
  },
};
