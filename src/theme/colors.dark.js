// Dark mode color palette
// Inspired by traditional Chinese aesthetics: ink black, moonlight silver, lantern glow
// Maintains the warm, cultural feeling while being comfortable for night use

export const darkColors = {
  // Primary palette - Lantern glow red (灯笼红)
  primary: '#E54A3E',        // 灯笼红 - main accent, brighter for dark mode
  primaryLight: '#F55A4E',   // 灯笼浅 - hover/pressed states
  primaryDark: '#C43A2E',    // 灯笼深 - emphasis states

  // Background palette - Ink black tones (墨色系)
  background: '#1A1714',     // 墨黑 - main background, deep and warm
  backgroundLight: '#242018', // 墨浅 - elevated surfaces
  backgroundDark: '#12100D', // 墨深 - pressed states

  // Surface palette - Rice paper in moonlight (月下宣纸)
  surface: '#2A2620',        // 月纸 - primary card surface
  card: '#2E2A24',           // 灰纸 - main content cards
  softCard: '#322E28',       // 暖纸 - supporting surfaces
  panel: '#26221C',          // 深纸 - secondary grouped content

  // Text palette - Moonlight silver (月银色系)
  text: '#F5F0E8',           // 月白 - primary text
  textLight: '#D5D0C8',      // 月浅 - secondary text
  mutedText: 'rgba(245, 240, 232, 0.60)', // 月淡 - hint text

  // Border palette - Ink brush strokes (墨笔色系)
  border: 'rgba(245, 240, 232, 0.12)',     // 淡笔 - subtle separation
  borderStrong: 'rgba(245, 240, 232, 0.20)', // 浓笔 - emphasis borders
  borderAccent: 'rgba(229, 74, 62, 0.35)', // 朱笔 - accent borders

  // Status palette - Traditional auspicious colors adapted for dark
  success: '#D4914A',        // 鎏金 - completion/achievement (warm gold)
  successLight: '#E4A15A',   // 鎏金浅 - hover states
  warning: '#E4B584',        // 杏黄 - caution states
  error: '#E54A3E',          // 灯笼红 - error

  // Special Chinese aesthetic colors
  inkWash: 'rgba(245, 240, 232, 0.06)',    // 水墨晕染 - subtle overlays
  cinnabarGlow: 'rgba(229, 74, 62, 0.12)', // 朱砂晕 - warm highlights
  goldLeaf: 'rgba(212, 145, 74, 0.18)',    // 金箔 - premium accents

  // Legacy compatibility
  accent: '#E54A3E',
};
