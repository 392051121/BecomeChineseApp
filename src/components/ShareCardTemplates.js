import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Path, G, RadialGradient, Stop, ClipPath } from 'react-native-svg';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SealTexture } from './SealTexture';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

// ============================================
// INK WASH STYLE - 水墨风格
// ============================================

export function InkWashShareCard({
  title,
  titleCn,
  subtitle,
  subtitleCn,
  description,
  level,
  xp,
  stats = [],
}) {
  const { colors } = useTheme();

  return (
    <View style={[inkStyles.container, { backgroundColor: colors.shareCardBackground }]}>
      {/* Ink wash background pattern */}
      <View style={inkStyles.inkBg}>
        <Svg width="100%" height="100%" viewBox="0 0 320 400">
          <Defs>
            <RadialGradient id="inkGrad1" cx="20%" cy="20%" r="50%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.08" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="inkGrad2" cx="80%" cy="80%" r="40%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.05" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          {/* Ink wash circles */}
          <Circle cx="60" cy="80" r="100" fill="url(#inkGrad1)" />
          <Circle cx="280" cy="320" r="80" fill="url(#inkGrad2)" />
          {/* Mountain silhouette */}
          <Path
            d="M0 380 Q40 340 80 360 T160 350 T240 365 T320 340 L320 400 L0 400 Z"
            fill={colors.primary}
            fillOpacity="0.04"
          />
          <Path
            d="M0 390 Q60 360 120 375 T200 365 T280 380 T320 360 L320 400 L0 400 Z"
            fill={colors.primary}
            fillOpacity="0.06"
          />
        </Svg>
      </View>

      {/* Content */}
      <View style={inkStyles.content}>
        {/* Header with level badge */}
        {level != null && level !== '' && (
          <View style={[inkStyles.levelBadge, { backgroundColor: colors.cinnabarGlow, borderColor: colors.primary }]}>
            <Text style={[inkStyles.levelText, { color: colors.primary }]}>Lv.{level}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={[inkStyles.title, { color: colors.text }]}>{title}</Text>
        {titleCn && <Text style={[inkStyles.titleCn, { color: colors.primary }]}>{titleCn}</Text>}

        {/* Subtitle */}
        {subtitle && (
          <Text style={[inkStyles.subtitle, { color: colors.mutedText }]}>{subtitle}</Text>
        )}
        {subtitleCn && (
          <Text style={[inkStyles.subtitleCn, { color: colors.primary }]}>{subtitleCn}</Text>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <View style={inkStyles.statsRow}>
            {stats.map((stat, index) => (
              <View key={index} style={[inkStyles.statItem, { borderColor: colors.border }]}>
                <Text style={[inkStyles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[inkStyles.statLabel, { color: colors.mutedText }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* XP Badge */}
        {xp && (
          <View style={[inkStyles.xpBadge, { backgroundColor: colors.cinnabarGlow }]}>
            <Text style={[inkStyles.xpText, { color: colors.primary }]}>+{xp} XP</Text>
          </View>
        )}

        {/* Description */}
        {description && (
          <Text style={[inkStyles.description, { color: colors.mutedText }]}>{description}</Text>
        )}

        {/* Footer */}
        <View style={inkStyles.footer}>
          <Text style={[inkStyles.appName, { color: colors.primary }]}>Become Chinese</Text>
          <View style={[inkStyles.footerLine, { backgroundColor: colors.border }]} />
        </View>
      </View>
    </View>
  );
}

const inkStyles = StyleSheet.create({
  container: {
    width: 320,
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  inkBg: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 16,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  titleCn: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  subtitleCn: {
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  xpBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 20,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '800',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerLine: {
    width: 60,
    height: 0.5,
    marginTop: 6,
  },
});

// ============================================
// SEAL STAMP STYLE - 印章风格
// ============================================

export function SealStampShareCard({
  title,
  titleCn,
  sealChar = '印',
  message,
  messageCn,
  xp,
  rank,
}) {
  const { colors } = useTheme();

  return (
    <View style={[sealStyles.container, { backgroundColor: colors.shareCardBackground }]}>
      {/* Seal texture background */}
      <SealTexture opacity={0.04} variant="minimal" />

      {/* Decorative corner seals */}
      <View style={[sealStyles.cornerSeal, sealStyles.topLeft]}>
        <View style={[sealStyles.miniSeal, { borderColor: colors.primary }]}>
          <Text style={[sealStyles.miniSealChar, { color: colors.primary }]}>文</Text>
        </View>
      </View>
      <View style={[sealStyles.cornerSeal, sealStyles.bottomRight]}>
        <View style={[sealStyles.miniSeal, { borderColor: colors.primary }]}>
          <Text style={[sealStyles.miniSealChar, { color: colors.primary }]}>化</Text>
        </View>
      </View>

      {/* Main seal stamp */}
      <View style={sealStyles.content}>
        <View style={[sealStyles.mainSeal, { borderColor: colors.primary }]}>
          <View style={[sealStyles.sealInnerRing, { borderColor: colors.primary }]} />
          <Text style={[sealStyles.sealChar, { color: colors.primary }]}>{sealChar}</Text>
        </View>

        <Text style={[sealStyles.title, { color: colors.text }]}>{title}</Text>
        {titleCn && <Text style={[sealStyles.titleCn, { color: colors.primary }]}>{titleCn}</Text>}

        {message && (
          <View style={[sealStyles.messageBox, { borderColor: colors.border }]}>
            <Text style={[sealStyles.message, { color: colors.mutedText }]}>{message}</Text>
            {messageCn && <Text style={[sealStyles.messageCn, { color: colors.primary }]}>{messageCn}</Text>}
          </View>
        )}

        {/* Stats row */}
        <View style={sealStyles.statsRow}>
          {xp != null && xp !== '' && (
            <View style={[sealStyles.statPill, { backgroundColor: colors.cinnabarGlow }]}>
              <Text style={[sealStyles.statPillText, { color: colors.primary }]}>+{xp} XP</Text>
            </View>
          )}
          {rank != null && rank !== '' && (
            <View style={[sealStyles.statPill, { backgroundColor: colors.inkWash }]}>
              <Text style={[sealStyles.statPillText, { color: colors.mutedText }]}>Rank {rank}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={sealStyles.footer}>
          <Text style={[sealStyles.appName, { color: colors.primary }]}>Become Chinese</Text>
        </View>
      </View>
    </View>
  );
}

const sealStyles = StyleSheet.create({
  container: {
    width: 320,
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  cornerSeal: {
    position: 'absolute',
  },
  topLeft: {
    top: 16,
    left: 16,
  },
  bottomRight: {
    bottom: 16,
    right: 16,
  },
  miniSeal: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-5deg' }],
  },
  miniSealChar: {
    fontSize: 14,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainSeal: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(194, 58, 46, 0.05)',
    marginBottom: 20,
    transform: [{ rotate: '-3deg' }],
  },
  sealInnerRing: {
    position: 'absolute',
    left: 8,
    top: 8,
    right: 8,
    bottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(194, 58, 46, 0.2)',
  },
  sealChar: {
    fontSize: 48,
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  titleCn: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  messageBox: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
  },
  messageCn: {
    fontSize: 11,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  statPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  appName: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

// ============================================
// PAPER CUT STYLE - 剪纸风格
// ============================================

export function PaperCutShareCard({
  title,
  titleCn,
  mainChar,
  message,
  xp,
  level,
}) {
  const { colors } = useTheme();

  return (
    <View style={[paperStyles.container, { backgroundColor: colors.shareCardBackground }]}>
      {/* Paper cut decorative border */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} viewBox="0 0 320 400">
        <Defs>
          <ClipPath id="paperClip">
            <Rect x="0" y="0" width="320" height="400" rx="16" />
          </ClipPath>
        </Defs>
        {/* Decorative paper cut patterns */}
        <G clipPath="url(#paperClip)">
          {/* Corner flourishes */}
          <Path
            d="M0 0 L60 0 Q40 30 0 60 Z"
            fill={colors.primary}
            fillOpacity="0.08"
          />
          <Path
            d="M320 0 L320 60 Q280 40 260 0 Z"
            fill={colors.primary}
            fillOpacity="0.08"
          />
          <Path
            d="M0 400 L0 340 Q40 360 60 400 Z"
            fill={colors.primary}
            fillOpacity="0.08"
          />
          <Path
            d="M320 400 L260 400 Q280 360 320 340 Z"
            fill={colors.primary}
            fillOpacity="0.08"
          />
          {/* Border pattern */}
          <Rect x="12" y="12" width="296" height="376" rx="12" fill="none" stroke={colors.primary} strokeWidth="1" strokeOpacity="0.15" />
          <Rect x="20" y="20" width="280" height="360" rx="10" fill="none" stroke={colors.primary} strokeWidth="0.5" strokeOpacity="0.1" />
        </G>
      </Svg>

      {/* Content */}
      <View style={paperStyles.content}>
        {/* Main character display */}
        {mainChar && (
          <View style={[paperStyles.charCircle, { borderColor: colors.primary }]}>
            <Text style={[paperStyles.mainChar, { color: colors.primary }]}>{mainChar}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={[paperStyles.title, { color: colors.text }]}>{title}</Text>
        {titleCn && <Text style={[paperStyles.titleCn, { color: colors.primary }]}>{titleCn}</Text>}

        {/* Message */}
        {message && (
          <Text style={[paperStyles.message, { color: colors.mutedText }]}>{message}</Text>
        )}

        {/* Stats */}
        <View style={paperStyles.statsRow}>
          {level != null && level !== '' && (
            <View style={[paperStyles.statBox, { borderColor: colors.primary }]}>
              <Text style={[paperStyles.statValue, { color: colors.primary }]}>Lv.{level}</Text>
            </View>
          )}
          {xp != null && xp !== '' && (
            <View style={[paperStyles.statBox, { backgroundColor: colors.cinnabarGlow, borderColor: colors.border }]}>
              <Text style={[paperStyles.statValue, { color: colors.primary }]}>+{xp} XP</Text>
            </View>
          )}
        </View>

        {/* Decorative paper cut elements */}
        <View style={paperStyles.decorativeRow}>
          <View style={[paperStyles.decorativeLine, { backgroundColor: colors.primary }]} />
          <View style={[paperStyles.decorativeDiamond, { borderColor: colors.primary }]} />
          <View style={[paperStyles.decorativeLine, { backgroundColor: colors.primary }]} />
        </View>

        {/* Footer */}
        <View style={paperStyles.footer}>
          <Text style={[paperStyles.appName, { color: colors.primary }]}>Become Chinese</Text>
        </View>
      </View>
    </View>
  );
}

const paperStyles = StyleSheet.create({
  container: {
    width: 320,
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  charCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainChar: {
    fontSize: 36,
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  titleCn: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  statBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  decorativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  decorativeLine: {
    width: 40,
    height: 1,
  },
  decorativeDiamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    transform: [{ rotate: '45deg' }],
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  appName: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

// ============================================
// COMBINED SHARE CARD FACTORY
// ============================================

export function createShareCard({ type = 'ink', ...props }) {
  switch (type) {
    case 'seal':
      return <SealStampShareCard {...props} />;
    case 'paper':
      return <PaperCutShareCard {...props} />;
    case 'ink':
    default:
      return <InkWashShareCard {...props} />;
  }
}

// Pre-configured share cards for common use cases
export function LevelUpShareCard({ level, title, titleCn, xp }) {
  return (
    <SealStampShareCard
      title={title || 'Level Up!'}
      titleCn={titleCn || '升级'}
      sealChar="升"
      message={`Reached Level ${level}`}
      messageCn={`达到 ${level} 级`}
      xp={xp}
      rank={level}
    />
  );
}

export function AchievementShareCard({ badge, xp, level }) {
  return (
    <InkWashShareCard
      title={badge?.nameEn || 'Achievement Unlocked'}
      titleCn={badge?.nameCn || '成就解锁'}
      subtitle={badge?.descriptionEn}
      xp={xp || badge?.xp}
      level={level}
    />
  );
}

export function StreakShareCard({ streak, totalSolved }) {
  return (
    <PaperCutShareCard
      title={`${streak} Day Streak!`}
      titleCn={`连续${streak}天`}
      mainChar="火"
      message={`${totalSolved} questions answered`}
      xp={streak * 5}
    />
  );
}

export function CollectionShareCard({ totalItems, cities, dishes, dynasties }) {
  return (
    <InkWashShareCard
      title="Cultural Atlas"
      titleCn="文化地图集"
      subtitle={`${totalItems} items collected`}
      stats={[
        { label: 'Cities', value: cities },
        { label: 'Dishes', value: dishes },
        { label: 'Dynasties', value: dynasties },
      ]}
    />
  );
}