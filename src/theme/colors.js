// Chinese traditional color palette
// Inspired by traditional Chinese art: cinnabar red, ink black, rice paper white
// Balanced with modern UI requirements for readability and hierarchy

export const colors = {
  // Primary palette - Cinnabar red (朱砂红)
  primary: '#C23A2E',        // 朱砂 - main accent, used sparingly
  primaryLight: '#D64A3E',   // 朱砂浅 - hover/pressed states
  primaryDark: '#A32A1E',    // 朱砂深 - emphasis states

  // Background palette - Rice paper tones (宣纸色系)
  background: '#F5F0E8',     // 宣纸白 - main background, warm and quiet
  backgroundLight: '#FAF7F2', // 宣纸浅 - elevated surfaces
  backgroundDark: '#EDE8E0', // 宣纸深 - pressed states

  // Surface palette - Ink wash tones (水墨色系)
  surface: '#FFFCF6',        // 留白 - primary card surface
  card: '#FFFFFF',           // 白纸 - main content cards
  softCard: '#FFF7EE',       // 暖纸 - supporting surfaces
  panel: '#F5EEE4',          // 灰纸 - secondary grouped content

  // Text palette - Ink tones (墨色系)
  text: '#1B1715',           // 墨黑 - primary text
  textLight: '#3A3634',      // 墨浅 - secondary text
  mutedText: 'rgba(27, 23, 21, 0.60)', // 墨淡 - hint text

  // Border palette - Brush stroke tones (笔触色系)
  border: 'rgba(27, 23, 21, 0.10)',     // 淡笔 - subtle separation
  borderStrong: 'rgba(27, 23, 21, 0.16)', // 浓笔 - emphasis borders
  borderAccent: 'rgba(194, 58, 46, 0.25)', // 朱笔 - accent borders

  // Status palette - Traditional auspicious colors
  success: '#B87333',        // 鎏金 - completion/achievement (warm gold)
  successLight: '#C88343',   // 鎏金浅 - hover states
  warning: '#D4A574',        // 杏黄 - caution states
  error: '#C23A2E',          // 朱砂 - error (same as primary for cohesion)

  // Special Chinese aesthetic colors
  inkWash: 'rgba(27, 23, 21, 0.04)',    // 水墨晕染 - subtle overlays
  cinnabarGlow: 'rgba(194, 58, 46, 0.08)', // 朱砂晕 - warm highlights
  goldLeaf: 'rgba(184, 115, 51, 0.12)',   // 金箔 - premium accents

  // Image overlay colors
  imageOverlay: 'rgba(24, 18, 16, 0.12)', // Local image overlay
  imageOverlayRemote: 'rgba(51, 51, 51, 0.35)', // Remote image overlay

  // Map colors
  mapGradientStart: '#C23A2E', // Map gradient start
  mapGradientEnd: '#E8D4C8',   // Map gradient end
  mapProvinceFill: '#C23A2E',  // Province fill color
  mapProvinceStroke: '#8B2520', // Province stroke color
  mapConnectionLine: '#C23A2E', // Connection line color

  // Share card colors
  shareCardBackground: '#F8F5EE', // Share card background

  // Legacy compatibility
  accent: '#C23A2E',
};

