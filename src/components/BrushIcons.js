import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle, Rect, Line } from 'react-native-svg';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// Brush stroke style icons - 毛笔风格图标
// Each icon is designed to look like it was painted with a Chinese brush

// Base size for icons
const BASE_SIZE = 24;

// Helper to create brush stroke effect
function BrushPath({ d, color, strokeWidth = 2, opacity = 1 }) {
  return (
    <Path
      d={d}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeOpacity={opacity}
    />
  );
}

// Home Icon - 家 (house with brush stroke roof)
export function BrushHomeIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;
  const s = size / BASE_SIZE;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <G transform={`scale(${s})`}>
          {/* Roof - brush stroke triangle */}
          <Path
            d="M3 12 L12 4 L21 12"
            stroke={iconColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
          />
          {/* House body */}
          <Path
            d="M5 12 L5 20 L19 20 L19 12"
            stroke={iconColor}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
          {/* Door */}
          <Path
            d="M10 20 L10 15 L14 15 L14 20"
            stroke={iconColor}
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
}

// History/Scroll Icon - 史 (scroll with brush strokes)
export function BrushScrollIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Scroll roll top */}
        <Rect x="4" y="3" width="16" height="3" rx="1.5" stroke={iconColor} strokeWidth={1.5} fill="none" />
        {/* Scroll roll bottom */}
        <Rect x="4" y="18" width="16" height="3" rx="1.5" stroke={iconColor} strokeWidth={1.5} fill="none" />
        {/* Paper */}
        <Path d="M6 6 L6 18 M18 6 L18 18" stroke={iconColor} strokeWidth={1} strokeOpacity={0.5} />
        {/* Text lines */}
        <Path d="M9 9 L15 9 M9 12 L15 12 M9 15 L13 15" stroke={iconColor} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

// Food/Rice Bowl Icon - 食 (rice bowl with chopsticks)
export function BrushFoodIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Bowl */}
        <Path
          d="M4 12 Q4 20 12 20 Q20 20 20 12"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        {/* Bowl rim */}
        <Path
          d="M3 12 L21 12"
          stroke={iconColor}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Steam/rice */}
        <Path d="M8 8 Q9 6 8 4" stroke={iconColor} strokeWidth={1.5} strokeLinecap="round" fill="none" strokeOpacity={0.6} />
        <Path d="M12 7 Q13 5 12 3" stroke={iconColor} strokeWidth={1.5} strokeLinecap="round" fill="none" strokeOpacity={0.6} />
        <Path d="M16 8 Q17 6 16 4" stroke={iconColor} strokeWidth={1.5} strokeLinecap="round" fill="none" strokeOpacity={0.6} />
      </Svg>
    </View>
  );
}

// Map/Places Icon - 地 (mountain and river)
export function BrushMapIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Mountain 1 */}
        <Path
          d="M2 20 L8 10 L14 20"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Mountain 2 */}
        <Path
          d="M10 20 L16 8 L22 20"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* River */}
        <Path
          d="M2 16 Q6 14 10 16 Q14 18 18 16 Q20 15 22 16"
          stroke={iconColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          strokeOpacity={0.5}
        />
      </Svg>
    </View>
  );
}

// User/Person Icon - 人 (brush stroke person)
export function BrushPersonIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Head */}
        <Circle cx="12" cy="7" r="3" stroke={iconColor} strokeWidth={2} fill="none" />
        {/* Body - brush stroke style */}
        <Path
          d="M12 10 L12 16"
          stroke={iconColor}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Arms */}
        <Path
          d="M7 14 L12 13 L17 14"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        {/* Legs */}
        <Path
          d="M12 16 L8 22 M12 16 L16 22"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

// Quiz/Question Icon - 问 (question mark with brush style)
export function BrushQuizIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Question mark curve */}
        <Path
          d="M8 8 Q8 4 12 4 Q16 4 16 8 Q16 12 12 12 L12 15"
          stroke={iconColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
        {/* Dot */}
        <Circle cx="12" cy="19" r="1.5" fill={iconColor} />
      </Svg>
    </View>
  );
}

// Calendar Icon - 历 (calendar with brush strokes)
export function BrushCalendarIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Calendar frame */}
        <Rect x="3" y="5" width="18" height="16" rx="2" stroke={iconColor} strokeWidth={2} fill="none" />
        {/* Top binding */}
        <Path d="M3 10 L21 10" stroke={iconColor} strokeWidth={1.5} />
        {/* Hooks */}
        <Path d="M8 3 L8 7" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
        <Path d="M16 3 L16 7" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
        {/* Date marks */}
        <Circle cx="8" cy="15" r="1" fill={iconColor} />
        <Circle cx="12" cy="15" r="1" fill={iconColor} />
        <Circle cx="16" cy="15" r="1" fill={iconColor} />
      </Svg>
    </View>
  );
}

// Collection/Bookmark Icon - 藏 (bookmark with brush style)
export function BrushBookmarkIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Bookmark shape */}
        <Path
          d="M6 3 L18 3 L18 21 L12 17 L6 21 Z"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

// Trophy/Achievement Icon - 胜 (trophy with brush strokes)
export function BrushTrophyIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Cup body */}
        <Path
          d="M7 3 L17 3 L15 12 Q12 14 9 12 Z"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Left handle */}
        <Path d="M7 5 Q4 5 4 8 Q4 11 7 11" stroke={iconColor} strokeWidth={1.5} fill="none" />
        {/* Right handle */}
        <Path d="M17 5 Q20 5 20 8 Q20 11 17 11" stroke={iconColor} strokeWidth={1.5} fill="none" />
        {/* Stem */}
        <Path d="M12 12 L12 17" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
        {/* Base */}
        <Path d="M8 17 L16 17" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
        <Path d="M9 20 L15 20" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

// Fire/Streak Icon - 火 (flame with brush strokes)
export function BrushFireIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Flame outer */}
        <Path
          d="M12 2 Q8 8 8 12 Q8 18 12 20 Q16 18 16 12 Q16 8 12 2"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        {/* Flame inner */}
        <Path
          d="M12 8 Q10 11 10 13 Q10 16 12 17 Q14 16 14 13 Q14 11 12 8"
          stroke={iconColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          strokeOpacity={0.6}
        />
      </Svg>
    </View>
  );
}

// Star Icon - 星 (star with brush style)
export function BrushStarIcon({ size = BASE_SIZE, color, style, filled = false }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2 L14.5 9 L22 9 L16 14 L18 21 L12 17 L6 21 L8 14 L2 9 L9.5 9 Z"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={filled ? iconColor : 'none'}
          fillOpacity={filled ? 0.3 : 0}
        />
      </Svg>
    </View>
  );
}

// Settings Icon - 设 (gear with brush style)
export function BrushSettingsIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Outer gear teeth */}
        <Path
          d="M12 2 L14 4 L17 3 L18 6 L21 7 L20 10 L22 12 L20 14 L21 17 L18 18 L17 21 L14 20 L12 22 L10 20 L7 21 L6 18 L3 17 L4 14 L2 12 L4 10 L3 7 L6 6 L7 3 L10 4 Z"
          stroke={iconColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner circle */}
        <Circle cx="12" cy="12" r="3" stroke={iconColor} strokeWidth={2} fill="none" />
      </Svg>
    </View>
  );
}

// Search Icon - 搜 (magnifying glass with brush style)
export function BrushSearchIcon({ size = BASE_SIZE, color, style }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Lens */}
        <Circle cx="10" cy="10" r="7" stroke={iconColor} strokeWidth={2} fill="none" />
        {/* Handle */}
        <Path
          d="M15 15 L21 21"
          stroke={iconColor}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

// Heart/Favorite Icon - 心 (heart with brush strokes)
export function BrushHeartIcon({ size = BASE_SIZE, color, style, filled = false }) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 21 Q4 14 4 9 Q4 4 8 4 Q12 4 12 9 Q12 4 16 4 Q20 4 20 9 Q20 14 12 21"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={filled ? iconColor : 'none'}
          fillOpacity={filled ? 0.3 : 0}
        />
      </Svg>
    </View>
  );
}

// Export all icons as a map for easy access
export const BrushIcons = {
  home: BrushHomeIcon,
  scroll: BrushScrollIcon,
  history: BrushScrollIcon,
  food: BrushFoodIcon,
  map: BrushMapIcon,
  places: BrushMapIcon,
  person: BrushPersonIcon,
  user: BrushPersonIcon,
  quiz: BrushQuizIcon,
  calendar: BrushCalendarIcon,
  bookmark: BrushBookmarkIcon,
  collection: BrushBookmarkIcon,
  trophy: BrushTrophyIcon,
  achievement: BrushTrophyIcon,
  fire: BrushFireIcon,
  streak: BrushFireIcon,
  star: BrushStarIcon,
  settings: BrushSettingsIcon,
  search: BrushSearchIcon,
  heart: BrushHeartIcon,
  favorite: BrushHeartIcon,
};

// Helper function to get icon by name
export function getBrushIcon(name, props = {}) {
  const IconComponent = BrushIcons[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});