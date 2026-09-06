import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { THEMES, ThemeId, ThemeTokens } from '@/theme/themes';
import { StorageService } from '@/services/storage';

interface ThemeContextType {
  theme: ThemeTokens;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeId, setThemeIdState] = useState<ThemeId>('divya_sukoon');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const prefs = await StorageService.getPreferences();
      if (prefs.favoriteColorTheme) {
        setThemeIdState(prefs.favoriteColorTheme);
      }
    } catch (e) {
      console.warn('Failed to load saved theme preference:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const setThemeId = async (id: ThemeId) => {
    setThemeIdState(id);
    await StorageService.savePreferences({ favoriteColorTheme: id });
  };

  const getEffectiveTheme = (): ThemeTokens => {
    if (themeId === 'system') {
      return systemColorScheme === 'dark' ? THEMES.kailash_ratri : THEMES.divya_sukoon;
    }
    return THEMES[themeId] || THEMES.divya_sukoon;
  };

  const activeTheme = getEffectiveTheme();

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        themeId,
        setThemeId,
        isDark: activeTheme.isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
