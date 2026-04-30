import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors as lightColors } from './colors';
import { darkColors } from './colors.dark';
import { theme as baseTheme } from './theme';
import { STORAGE_KEYS } from '../config/storageKeys';

export const ThemeContext = createContext({
  isDark: false,
  colors: lightColors,
  theme: baseTheme,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreference] = useState('system'); // 'light', 'dark', 'system'
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.THEME).then((saved) => {
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setPreference(saved);
      }
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const isDark = useMemo(() => {
    if (preference === 'system') {
      return systemColorScheme === 'dark';
    }
    return preference === 'dark';
  }, [preference, systemColorScheme]);

  const colors = useMemo(() => isDark ? darkColors : lightColors, [isDark]);

  const theme = useMemo(() => ({
    ...baseTheme,
    colors,
    isDark,
  }), [colors, isDark]);

  async function setTheme(mode) {
    setPreference(mode);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode).catch(() => {});
  }

  async function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    await setTheme(next);
  }

  // Don't render until theme is loaded to avoid flash
  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDark, colors, theme, setTheme, toggleTheme, preference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}
