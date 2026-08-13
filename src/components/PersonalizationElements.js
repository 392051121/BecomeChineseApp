import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, G, ClipPath, Rect } from 'react-native-svg';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// ============================================
// AVATAR FRAME - 头像框
// ============================================

// Avatar frame variants
const AVATAR_FRAMES = {
  default: null,
  bronze: {
    borderColor: '#CD7F32',
    gradientColors: ['#CD7F32', '#8B4513'],
    pattern: 'simple',
  },
  silver: {
    borderColor: '#C0C0C0',
    gradientColors: ['#E8E8E8', '#A0A0A0'],
    pattern: 'wave',
  },
  gold: {
    borderColor: '#FFD700',
    gradientColors: ['#FFD700', '#FFA500'],
    pattern: 'cloud',
  },
  jade: {
    borderColor: '#00A86B',
    gradientColors: ['#00C896', '#008B69'],
    pattern: 'seal',
  },
  royal: {
    borderColor: '#8B008B',
    gradientColors: ['#9932CC', '#4B0082'],
    pattern: 'dragon',
  },
};

export function AvatarFrame({
  children,
  size = 64,
  frameType = 'default',
  level,
  showLevel = true,
  style,
}) {
  const { colors } = useTheme();
  const frame = AVATAR_FRAMES[frameType];

  if (!frame) {
    return (
      <View style={[styles.avatarContainer, { width: size, height: size }, style]}>
        <View style={[styles.avatarInner, { borderRadius: size / 2 }]}>
          {children}
        </View>
        {showLevel && level && (
          <View style={[styles.levelBadge, { backgroundColor: colors.cinnabarGlow }]}>
            <Text style={[styles.levelText, { color: colors.primary }]}>{level}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }, style]}>
      {/* Frame SVG */}
      <Svg width={size} height={size} viewBox="0 0 64 64" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={`frameGrad_${frameType}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={frame.gradientColors[0]} />
            <Stop offset="100%" stopColor={frame.gradientColors[1]} />
          </RadialGradient>
          <ClipPath id="avatarClip">
            <Circle cx="32" cy="32" r="28" />
          </ClipPath>
        </Defs>

        {/* Outer ring */}
        <Circle
          cx="32"
          cy="32"
          r="31"
          stroke={`url(#frameGrad_${frameType})`}
          strokeWidth="3"
          fill="none"
        />

        {/* Inner decorative ring */}
        <Circle
          cx="32"
          cy="32"
          r="27"
          stroke={frame.borderColor}
          strokeWidth="1"
          fill="none"
          strokeOpacity="0.5"
        />

        {/* Pattern decorations based on frame type */}
        {frame.pattern === 'wave' && (
          <G>
            <Path d="M10 32 Q16 28 22 32 T34 32 T46 32 T54 32" stroke={frame.borderColor} strokeWidth="1" fill="none" strokeOpacity="0.3" />
          </G>
        )}
        {frame.pattern === 'cloud' && (
          <G>
            <Circle cx="32" cy="8" r="3" fill={frame.borderColor} fillOpacity="0.4" />
            <Circle cx="32" cy="56" r="3" fill={frame.borderColor} fillOpacity="0.4" />
            <Circle cx="8" cy="32" r="3" fill={frame.borderColor} fillOpacity="0.4" />
            <Circle cx="56" cy="32" r="3" fill={frame.borderColor} fillOpacity="0.4" />
          </G>
        )}
        {frame.pattern === 'seal' && (
          <G>
            <Rect x="28" y="4" width="8" height="8" fill={frame.borderColor} fillOpacity="0.3" transform="rotate(45 32 8)" />
            <Rect x="28" y="52" width="8" height="8" fill={frame.borderColor} fillOpacity="0.3" transform="rotate(45 32 56)" />
          </G>
        )}
        {frame.pattern === 'dragon' && (
          <G>
            <Path d="M8 20 Q12 16 16 20 T24 20" stroke={frame.borderColor} strokeWidth="1" fill="none" strokeOpacity="0.3" />
            <Path d="M40 44 Q44 48 48 44 T56 44" stroke={frame.borderColor} strokeWidth="1" fill="none" strokeOpacity="0.3" />
          </G>
        )}
      </Svg>

      {/* Avatar content */}
      <View style={[styles.avatarInner, { borderRadius: size / 2, width: size - 8, height: size - 8 }]}>
        {children}
      </View>

      {/* Level badge */}
      {showLevel && level != null && level !== '' && (
        <View style={[styles.levelBadge, { backgroundColor: frame.borderColor || colors.cinnabarGlow }]}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      )}
    </View>
  );
}

// ============================================
// LEVEL BADGE - 等级徽章
// ============================================

// Level badge configurations
const LEVEL_CONFIGS = {
  1: { title: 'Novice', titleCn: '新手', color: '#8B7355', icon: 'seed' },
  5: { title: 'Apprentice', titleCn: '学徒', color: '#6B8A94', icon: 'sprout' },
  10: { title: 'Explorer', titleCn: '探索者', color: '#CD7F32', icon: 'compass' },
  20: { title: 'Scholar', titleCn: '学者', color: '#C0C0C0', icon: 'scroll' },
  30: { title: 'Master', titleCn: '大师', color: '#FFD700', icon: 'seal' },
  40: { title: 'Sage', titleCn: '圣贤', color: '#00A86B', icon: 'mountain' },
  50: { title: 'Legend', titleCn: '传奇', color: '#8B008B', icon: 'dragon' },
};

export function getLevelConfig(level) {
  let config = LEVEL_CONFIGS[1];
  for (const threshold of Object.keys(LEVEL_CONFIGS).map(Number).sort((a, b) => a - b)) {
    if (level >= threshold) {
      config = LEVEL_CONFIGS[threshold];
    }
  }
  return config;
}

export function LevelBadge({
  level,
  size = 'medium', // 'small', 'medium', 'large'
  showTitle = false,
  style,
}) {
  const { colors } = useTheme();
  const config = getLevelConfig(level);

  const sizes = {
    small: { badge: 32, text: 10, icon: 12 },
    medium: { badge: 44, text: 12, icon: 16 },
    large: { badge: 60, text: 14, icon: 20 },
  };

  const s = sizes[size];

  return (
    <View style={[styles.levelBadgeContainer, style]}>
      <View style={[
        styles.levelBadgeInner,
        {
          width: s.badge,
          height: s.badge,
          borderRadius: s.badge / 2,
          borderColor: config.color,
          backgroundColor: `${config.color}15`,
        },
      ]}>
        {/* Level number */}
        <Text style={[styles.levelBadgeNumber, { color: config.color, fontSize: s.text }]}>
          {level}
        </Text>
      </View>

      {showTitle && (
        <View style={styles.levelTitleWrap}>
          <Text style={[styles.levelTitle, { color: colors.text }]}>{config.title}</Text>
          <Text style={[styles.levelTitleCn, { color: config.color }]}>{config.titleCn}</Text>
        </View>
      )}
    </View>
  );
}

// ============================================
// ACHIEVEMENT BADGE - 成就徽章
// ============================================

export function AchievementBadge({
  icon,
  title,
  titleCn,
  description,
  color,
  earned = false,
  size = 64,
  style,
}) {
  const { colors } = useTheme();
  const badgeColor = color || colors.primary;

  return (
    <View style={[styles.achievementContainer, { width: size + 20 }, style]}>
      <View style={[
        styles.achievementBadge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: earned ? badgeColor : colors.border,
          backgroundColor: earned ? `${badgeColor}10` : colors.surface,
          opacity: earned ? 1 : 0.5,
        },
      ]}>
        {/* Badge icon */}
        <Text style={[styles.achievementIcon, { color: earned ? badgeColor : colors.mutedText }]}>
          {icon}
        </Text>

        {/* Earned glow effect */}
        {earned && (
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient id="badgeGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="70%" stopColor={badgeColor} stopOpacity="0" />
                <Stop offset="100%" stopColor={badgeColor} stopOpacity="0.2" />
              </RadialGradient>
            </Defs>
            <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#badgeGlow)" />
          </Svg>
        )}
      </View>

      {/* Title */}
      <Text style={[styles.achievementTitle, { color: earned ? colors.text : colors.mutedText }]}>
        {title}
      </Text>
      {titleCn && (
        <Text style={[styles.achievementTitleCn, { color: earned ? badgeColor : colors.mutedText }]}>
          {titleCn}
        </Text>
      )}
    </View>
  );
}

// ============================================
// RANK INSIGNIA - 段位徽章
// ============================================

const RANK_CONFIGS = {
  beginner: { label: 'Beginner', labelCn: '初学者', color: '#8B7355', stars: 1 },
  apprentice: { label: 'Apprentice', labelCn: '学徒', color: '#6B8A94', stars: 2 },
  explorer: { label: 'Explorer', labelCn: '探索者', color: '#CD7F32', stars: 3 },
  scholar: { label: 'Scholar', labelCn: '学者', color: '#C0C0C0', stars: 4 },
  master: { label: 'Master', labelCn: '大师', color: '#FFD700', stars: 5 },
  sage: { label: 'Sage', labelCn: '圣贤', color: '#00A86B', stars: 6 },
  legend: { label: 'Legend', labelCn: '传奇', color: '#8B008B', stars: 7 },
};

export function getRankConfig(rank) {
  if (rank <= 3) return RANK_CONFIGS.beginner;
  if (rank <= 6) return RANK_CONFIGS.apprentice;
  if (rank <= 10) return RANK_CONFIGS.explorer;
  if (rank <= 15) return RANK_CONFIGS.scholar;
  if (rank <= 20) return RANK_CONFIGS.master;
  if (rank <= 25) return RANK_CONFIGS.sage;
  return RANK_CONFIGS.legend;
}

export function RankInsignia({
  rank,
  showLabel = true,
  size = 'medium',
  style,
}) {
  const { colors } = useTheme();
  const config = getRankConfig(rank);

  const sizes = {
    small: { container: 60, star: 8, text: 10 },
    medium: { container: 80, star: 10, text: 12 },
    large: { container: 100, star: 12, text: 14 },
  };

  const s = sizes[size];

  return (
    <View style={[styles.rankContainer, style]}>
      {/* Stars */}
      <View style={[styles.rankStars, { gap: 2 }]}>
        {Array.from({ length: config.stars }, (_, i) => (
          <Svg key={i} width={s.star} height={s.star} viewBox="0 0 12 12">
            <Path
              d="M6 1 L7.5 4.5 L11 5 L8.5 7.5 L9 11 L6 9.5 L3 11 L3.5 7.5 L1 5 L4.5 4.5 Z"
              fill={config.color}
            />
          </Svg>
        ))}
      </View>

      {/* Rank number */}
      <Text style={[styles.rankNumber, { color: config.color, fontSize: s.text }]}>
        Rank {rank}
      </Text>

      {/* Label */}
      {showLabel && (
        <View style={styles.rankLabelWrap}>
          <Text style={[styles.rankLabel, { color: colors.text }]}>{config.label}</Text>
          <Text style={[styles.rankLabelCn, { color: config.color }]}>{config.labelCn}</Text>
        </View>
      )}
    </View>
  );
}

// ============================================
// STREAK BADGE - 连续打卡徽章
// ============================================

export function StreakBadge({
  streak,
  size = 'medium',
  showFlame = true,
  style,
}) {
  const { colors } = useTheme();

  const sizes = {
    small: { container: 50, text: 14, icon: 16 },
    medium: { container: 70, text: 20, icon: 24 },
    large: { container: 90, text: 28, icon: 32 },
  };

  const s = sizes[size];
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  const flameColor = isOnFire ? '#FF4500' : isHot ? '#FF6B35' : '#E2B05E';

  return (
    <View style={[
      styles.streakContainer,
      {
        width: s.container,
        height: s.container,
        borderRadius: s.container / 2,
        backgroundColor: isOnFire ? `${flameColor}20` : isHot ? `${flameColor}15` : colors.cinnabarGlow,
        borderColor: flameColor,
      },
      style,
    ]}>
      {showFlame && (
        <Svg width={s.icon} height={s.icon} viewBox="0 0 24 24">
          <Path
            d="M12 2 Q8 8 8 12 Q8 18 12 20 Q16 18 16 12 Q16 8 12 2"
            fill={flameColor}
          />
          <Path
            d="M12 8 Q10 11 10 13 Q10 16 12 17 Q14 16 14 13 Q14 11 12 8"
            fill={isOnFire ? '#FFD700' : isHot ? '#FFA500' : '#FFFFFF'}
            fillOpacity="0.6"
          />
        </Svg>
      )}
      <Text style={[styles.streakNumber, { color: flameColor, fontSize: s.text }]}>
        {streak}
      </Text>
    </View>
  );
}

// ============================================
// XP PROGRESS RING - XP 进度环
// ============================================

export function XPProgressRing({
  current,
  max,
  size = 80,
  strokeWidth = 6,
  color,
  showLabel = true,
  style,
}) {
  const { colors } = useTheme();
  const progress = Math.min(current / max, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - progress);

  const ringColor = color || colors.primary;

  return (
    <View style={[styles.xpRingContainer, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {showLabel && (
        <View style={styles.xpRingLabel}>
          <Text style={[styles.xpRingValue, { color: colors.text }]}>{current}</Text>
          <Text style={[styles.xpRingMax, { color: colors.mutedText }]}>/{max}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Avatar Frame
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Level Badge
  levelBadgeContainer: {
    alignItems: 'center',
  },
  levelBadgeInner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  levelBadgeNumber: {
    fontWeight: '900',
  },
  levelTitleWrap: {
    alignItems: 'center',
    marginTop: 4,
  },
  levelTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  levelTitleCn: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },

  // Achievement Badge
  achievementContainer: {
    alignItems: 'center',
  },
  achievementBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  achievementTitleCn: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },

  // Rank Insignia
  rankContainer: {
    alignItems: 'center',
  },
  rankStars: {
    flexDirection: 'row',
  },
  rankNumber: {
    fontWeight: '800',
    marginTop: 4,
  },
  rankLabelWrap: {
    alignItems: 'center',
    marginTop: 2,
  },
  rankLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  rankLabelCn: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },

  // Streak Badge
  streakContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  streakNumber: {
    fontWeight: '900',
  },

  // XP Ring
  xpRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpRingLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  xpRingValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  xpRingMax: {
    fontSize: 10,
    fontWeight: '600',
  },
});