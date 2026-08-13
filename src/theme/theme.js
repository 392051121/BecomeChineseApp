import { Platform } from 'react-native';

import { colors } from './colors';

export const theme = {
  colors,

  // Typography - Chinese aesthetic with modern readability
  typography: {
    titleSerif: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    // Bundled CJK serif (subsetted Source Han Serif CN / Noto Serif SC) loaded
    // via useFonts in App.js. Guarantees beautiful 宋体 rendering of Chinese
    // characters on every device, independent of the OS default fonts.
    hanziSerif: 'NotoSerifSC-Regular',
    hanziSerifBold: 'NotoSerifSC-Bold',
    body: 'System',
    pinyin: 'System',
    lineHeight: 1.56,
    titleLetterSpacing: 0.2,
    labelLetterSpacing: 1.1,
    // Chinese character specific
    hanziLetterSpacing: 2.5,
    hanziLineHeight: 1.3,
  },

  // Spacing - inspired by traditional Chinese layout proportions
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    pageX: 20,
    pageY: 14,
    sectionGap: 14,
    cardGap: 12,
    stack: 12,
    sectionTitleGap: 8,
    blockGap: 12,
    sheetGap: 12,
  },

  // Motion - subtle and elegant, like brush strokes
  motion: {
    tapScale: 0.985,
    springTension: 90,
    springFriction: 8,
    durationFast: 180,
    durationNormal: 280,
    durationSlow: 420,
  },

  // Border radii - soft curves inspired by traditional ceramics
  radii: {
    xs: 2,
    sm: 4,
    md: 12,
    lg: 18,
    xl: 24,
    pill: 999,
  },

  // Shadows - subtle depth like ink wash layers
  shadows: {
    subtle: {
      shadowColor: '#1B1715',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 1,
    },
    medium: {
      shadowColor: '#1B1715',
      shadowOpacity: 0.07,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 5 },
      elevation: 2,
    },
    strong: {
      shadowColor: '#1B1715',
      shadowOpacity: 0.10,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 7 },
      elevation: 3,
    },
    modal: {
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: -8 },
      elevation: 10,
    },
  },

  // Chinese aesthetic specific
  chinese: {
    // Brush stroke widths
    brushThin: 0.5,
    brushNormal: 1,
    brushThick: 1.5,

    // Ink wash opacity levels
    inkLight: 0.04,
    inkMedium: 0.08,
    inkStrong: 0.12,

    // Traditional pattern spacing
    patternSpacing: 28,
  },
};

