import React, { createContext, useContext, useMemo } from 'react';

import { colors as lightColors } from './colors';
import { theme as baseTheme } from './theme';

// Dark mode has been removed. The app is light-only by design (rice-paper
// aesthetic); `isDark` is retained as a constant `false` for any callers that
// still reference it, but it can never flip to true.
export const ThemeContext = createContext({
  isDark: false,
  colors: lightColors,
  theme: { ...baseTheme, colors: lightColors, isDark: false },
});

export function ThemeProvider({ children }) {
  const colors = lightColors;

  const theme = useMemo(
    () => ({
      ...baseTheme,
      colors,
      isDark: false,
    }),
    [colors]
  );

  return (
    <ThemeContext.Provider value={{ isDark: false, colors, theme }}>
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
