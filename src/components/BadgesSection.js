import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Flame, Target, MapPin, Globe, UtensilsCrossed, Scroll, User, Award, Star, Sparkles, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SectionCard } from './SectionCard';
import { StampFeedback } from './StampFeedback';
import { badges, badgeCategories, checkBadgeUnlocked, calculateTotalXP, getXPLevel, getXPProgress } from '../data/badges';

/**
 * Calculate progress toward a badge
 * Returns { current, target, percentage, progressText }
 */
function getBadgeProgress(badge, stats) {
  const { type, value } = badge.condition;
  let current = 0;
  let target = value;

  switch (type) {
    case 'quizStreak':
      current = stats.quizStreak || 0;
      break;
    case 'quizTotal':
      current = stats.quizTotal || 0;
      break;
    case 'citiesCollected':
      current = stats.citiesCollected || 0;
      break;
    case 'recipesCollected':
      current = stats.recipesCollected || 0;
      break;
    case 'dynastiesCollected':
      current = stats.dynastiesCollected || 0;
      break;
    case 'provincesConnected':
      current = stats.provincesConnected || 0;
      break;
    case 'namesGenerated':
      current = stats.namesGenerated || 0;
      break;
    case 'namesSaved':
      current = stats.namesSaved || 0;
      break;
    case 'citiesViewed':
      current = stats.citiesViewed || 0;
      break;
    case 'recipesViewed':
      current = stats.recipesViewed || 0;
      break;
    case 'dynastiesViewed':
      current = stats.dynastiesViewed || 0;
      break;
    case 'provinceComplete':
      current = stats.provincesComplete || 0;
      break;
    default:
      return null;
  }

  if (typeof value !== 'number') return null;

  const percentage = Math.min((current / target) * 100, 100);
  const progressText = `${current}/${target}`;

  return { current, target, percentage, progressText };
}

function getBadgeIcon(iconName) {
  switch (iconName) {
    case 'flame': return Flame;
    case 'target': return Target;
    case 'map-pin': return MapPin;
    case 'globe': return Globe;
    case 'utensils': return UtensilsCrossed;
    case 'scroll': return Scroll;
    case 'user': return User;
    case 'award': return Award;
    case 'star': return Star;
    case 'sparkles': return Sparkles;
    default: return Award;
  }
}

function BadgeTile({ badge, isUnlocked, stats, onPress }) {
  const Icon = getBadgeIcon(badge.icon);
  const progress = !isUnlocked ? getBadgeProgress(badge, stats) : null;

  function handlePress() {
    Haptics.selectionAsync().catch(() => {});
    onPress?.(badge);
  }

  return (
    <Pressable
      style={[styles.badgeTile, isUnlocked && styles.badgeTileUnlocked]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={isUnlocked ? `${badge.nameEn} - ${badge.nameCn}. Unlocked` : `${badge.nameEn} - ${badge.nameCn}. ${progress ? `${progress.current}/${progress.target} progress` : 'Locked'}`}
      accessibilityHint="Double tap to view badge details"
    >
      <View style={[styles.badgeIconWrap, { backgroundColor: isUnlocked ? `${badge.color}20` : 'rgba(51, 51, 51, 0.06)' }]}>
        <Icon
          size={24}
          color={isUnlocked ? badge.color : theme.colors.mutedText}
          strokeWidth={2}
        />
        {!isUnlocked && (
          <View style={styles.lockOverlay}>
            <Lock size={12} color={theme.colors.mutedText} strokeWidth={2} />
          </View>
        )}
      </View>
      <Text style={[styles.badgeName, isUnlocked && styles.badgeNameUnlocked]} numberOfLines={1}>
        {badge.nameEn}
      </Text>
      <Text style={styles.badgeNameCn} numberOfLines={1}>{badge.nameCn}</Text>

      {/* Progress indicator for locked badges */}
      {!isUnlocked && progress && (
        <View style={styles.progressWrap}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.progressText}</Text>
        </View>
      )}

      <View style={[styles.xpPill, isUnlocked && styles.xpPillUnlocked]}>
        <Text style={[styles.xpText, isUnlocked && styles.xpTextUnlocked]}>+{badge.xp} XP</Text>
      </View>
      {isUnlocked && (
        <View style={styles.unlockedCheck}>
          <StampFeedback label="" active={true} size="small" />
        </View>
      )}
    </Pressable>
  );
}

function BadgeDetailCard({ badge, isUnlocked }) {
  const Icon = getBadgeIcon(badge.icon);

  return (
    <SectionCard style={styles.detailCard} tone={isUnlocked ? 'soft' : 'panel'}>
      <View style={styles.detailHeader}>
        <View style={[styles.detailIconWrap, { backgroundColor: `${badge.color}18` }]}>
          <Icon size={32} color={isUnlocked ? badge.color : theme.colors.mutedText} strokeWidth={2} />
        </View>
        <View style={styles.detailTitleWrap}>
          <Text style={styles.detailTitle}>{badge.nameEn}</Text>
          <Text style={styles.detailTitleCn}>{badge.nameCn}</Text>
        </View>
        {isUnlocked && (
          <View style={styles.detailBadge}>
            <StampFeedback label="Unlocked" active={true} />
          </View>
        )}
      </View>

      <Text style={styles.detailDescription}>{badge.descriptionEn}</Text>
      <Text style={styles.detailDescriptionCn}>{badge.descriptionCn}</Text>

      <View style={styles.detailStats}>
        <View style={styles.detailStatItem}>
          <Text style={styles.detailStatLabel}>XP Reward</Text>
          <Text style={styles.detailStatValue}>+{badge.xp}</Text>
        </View>
        <View style={styles.detailStatItem}>
          <Text style={styles.detailStatLabel}>Category</Text>
          <Text style={styles.detailStatValue}>{badgeCategories[badge.category]}</Text>
        </View>
      </View>

      {!isUnlocked && (
        <View style={styles.lockedHint}>
          <Lock size={14} color={theme.colors.mutedText} strokeWidth={2} />
          <Text style={styles.lockedHintText}>Keep exploring to unlock this badge!</Text>
        </View>
      )}
    </SectionCard>
  );
}

export function BadgesSection({ stats, onBadgePress }) {
  const unlockedBadges = useMemo(() => badges.filter((b) => checkBadgeUnlocked(b, stats)), [stats]);
  const totalXP = useMemo(() => calculateTotalXP(stats), [stats]);
  const xpLevel = useMemo(() => getXPLevel(totalXP), [totalXP]);
  const xpProgress = useMemo(() => getXPProgress(totalXP), [totalXP]);

  const categoryOrder = ['streak', 'exploration', 'collection', 'mastery', 'special'];

  return (
    <View style={styles.section}>
      {/* XP Summary */}
      <SectionCard style={styles.xpCard} tone="soft">
        <View style={styles.xpHeader}>
          <View style={styles.xpLevelWrap}>
            <Award size={20} color={theme.colors.primary} strokeWidth={2} />
            <Text style={styles.xpLevelLabel}>Level {xpLevel.level}</Text>
          </View>
          <Text style={styles.xpTitle}>{xpLevel.title}</Text>
          <Text style={styles.xpTitleCn}>{xpLevel.titleCn}</Text>
        </View>

        <View style={styles.xpProgressWrap}>
          <View style={styles.xpProgressBar}>
            <View style={[styles.xpProgressFill, { width: `${xpProgress.percentage}%` }]} />
          </View>
          <Text style={styles.xpProgressText}>
            {totalXP} XP{xpLevel.level < 10 ? ` · ${xpProgress.needed - xpProgress.current} XP to next` : ' · Max Level'}
          </Text>
        </View>

        <View style={styles.xpStatsRow}>
          <View style={styles.xpStat}>
            <Text style={styles.xpStatValue}>{unlockedBadges.length}</Text>
            <Text style={styles.xpStatLabel}>Badges</Text>
          </View>
          <View style={styles.xpStat}>
            <Text style={styles.xpStatValue}>{badges.length}</Text>
            <Text style={styles.xpStatLabel}>Total</Text>
          </View>
          <View style={styles.xpStat}>
            <Text style={styles.xpStatValue}>{totalXP}</Text>
            <Text style={styles.xpStatLabel}>XP</Text>
          </View>
        </View>
      </SectionCard>

      {/* Badge Categories */}
      {categoryOrder.map((category) => {
        const categoryBadges = badges.filter((b) => b.category === category);
        if (categoryBadges.length === 0) return null;

        return (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryLabel}>{badgeCategories[category]}</Text>
            <View style={styles.badgesGrid}>
              {categoryBadges.map((badge) => {
                const isUnlocked = checkBadgeUnlocked(badge, stats);
                return (
                  <BadgeTile
                    key={badge.id}
                    badge={badge}
                    isUnlocked={isUnlocked}
                    stats={stats}
                    onPress={onBadgePress}
                  />
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function BadgeSummaryCard({ stats, compact = false }) {
  const unlockedBadges = useMemo(() => badges.filter((b) => checkBadgeUnlocked(b, stats)), [stats]);
  const totalXP = useMemo(() => calculateTotalXP(stats), [stats]);
  const xpLevel = useMemo(() => getXPLevel(totalXP), [totalXP]);

  // Get recent unlocked badges (last 3)
  const recentBadges = unlockedBadges.slice(-3).reverse();

  // Compact mode - simplified display
  if (compact) {
    return (
      <SectionCard style={styles.summaryCardCompact} tone="soft">
        <View style={styles.summaryHeader}>
          <View style={styles.summaryTitleWrap}>
            <Award size={14} color={theme.colors.primary} strokeWidth={2} />
            <Text style={styles.summaryTitleCompact}>Achievements</Text>
            <Text style={styles.summaryTitleCnCompact}>成就</Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>{unlockedBadges.length}/{badges.length}</Text>
          </View>
        </View>

        <View style={styles.summaryStatsCompact}>
          <View style={styles.summaryStatCompact}>
            <Text style={styles.summaryStatValueCompact}>Lv.{xpLevel.level}</Text>
            <Text style={styles.summaryStatLabelCompact}>{xpLevel.titleCn}</Text>
          </View>
          <View style={styles.summaryStatCompact}>
            <Text style={styles.summaryStatValueCompact}>{totalXP}</Text>
            <Text style={styles.summaryStatLabelCompact}>XP</Text>
          </View>
        </View>
      </SectionCard>
    );
  }

  return (
    <SectionCard style={styles.summaryCard} tone="soft">
      <View style={styles.summaryHeader}>
        <View style={styles.summaryTitleWrap}>
          <Award size={16} color={theme.colors.primary} strokeWidth={2} />
          <Text style={styles.summaryTitle}>Achievements</Text>
        </View>
        <View style={styles.summaryBadge}>
          <Text style={styles.summaryBadgeText}>{unlockedBadges.length}/{badges.length}</Text>
        </View>
      </View>

      <View style={styles.summaryStats}>
        <View style={styles.summaryStat}>
          <Text style={styles.summaryStatValue}>Lv.{xpLevel.level}</Text>
          <Text style={styles.summaryStatLabel}>{xpLevel.title}</Text>
        </View>
        <View style={styles.summaryStat}>
          <Text style={styles.summaryStatValue}>{totalXP}</Text>
          <Text style={styles.summaryStatLabel}>XP</Text>
        </View>
      </View>

      {recentBadges.length > 0 && (
        <View style={styles.recentBadges}>
          <Text style={styles.recentLabel}>Recent Unlocks</Text>
          <View style={styles.recentList}>
            {recentBadges.map((badge) => {
              const Icon = getBadgeIcon(badge.icon);
              return (
                <View key={badge.id} style={styles.recentItem}>
                  <View style={[styles.recentIcon, { backgroundColor: `${badge.color}18` }]}>
                    <Icon size={14} color={badge.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.recentName} numberOfLines={1}>{badge.nameCn}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </SectionCard>
  );
}

export { BadgeDetailCard, checkBadgeUnlocked, calculateTotalXP, getXPLevel, badges };

const styles = StyleSheet.create({
  section: {
    marginTop: 14,
  },

  // XP Card
  xpCard: {
    padding: 16,
  },
  xpHeader: {
    alignItems: 'center',
  },
  xpLevelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  xpLevelLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  xpTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  xpTitleCn: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  xpProgressWrap: {
    marginTop: 16,
  },
  xpProgressBar: {
    height: 6,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  xpProgressText: {
    marginTop: 6,
    color: theme.colors.mutedText,
    fontSize: 11,
    textAlign: 'center',
  },
  xpStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  xpStat: {
    alignItems: 'center',
  },
  xpStatValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  xpStatLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Category Section
  categorySection: {
    marginTop: 20,
  },
  categoryLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 10,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // Badge Tile
  badgeTile: {
    width: '48%',
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  badgeTileUnlocked: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF9F5',
  },
  badgeIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  badgeName: {
    marginTop: 8,
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeNameUnlocked: {
    color: theme.colors.text,
  },
  badgeNameCn: {
    marginTop: 2,
    color: theme.colors.mutedText,
    fontSize: 10,
    textAlign: 'center',
  },
  progressWrap: {
    marginTop: 6,
    width: '100%',
    paddingHorizontal: 4,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(51, 51, 51, 0.08)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 1.5,
  },
  progressText: {
    marginTop: 3,
    color: theme.colors.mutedText,
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '600',
  },
  xpPill: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(51, 51, 51, 0.06)',
  },
  xpPillUnlocked: {
    backgroundColor: theme.colors.cinnabarGlow,
  },
  xpText: {
    color: theme.colors.mutedText,
    fontSize: 10,
    fontWeight: '700',
  },
  xpTextUnlocked: {
    color: theme.colors.primary,
  },
  unlockedCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // Detail Card
  detailCard: {
    padding: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitleWrap: {
    flex: 1,
  },
  detailTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  detailTitleCn: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  detailBadge: {
    marginLeft: 8,
  },
  detailDescription: {
    marginTop: 14,
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  detailDescriptionCn: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },
  detailStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },
  detailStatItem: {
    flex: 1,
  },
  detailStatLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  detailStatValue: {
    marginTop: 4,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  lockedHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    padding: 10,
    borderRadius: theme.radii.sm,
    backgroundColor: 'rgba(51, 51, 51, 0.04)',
  },
  lockedHintText: {
    color: theme.colors.mutedText,
    fontSize: 12,
  },

  // Summary Card
  summaryCard: {
    padding: 14,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  summaryBadge: {
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  summaryBadgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  summaryStatLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 2,
  },
  recentBadges: {
    marginTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  recentLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 8,
  },
  recentList: {
    gap: 6,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentName: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },

  // Compact styles
  summaryCardCompact: {
    padding: 12,
    marginTop: 10,
  },
  summaryTitleCompact: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryTitleCnCompact: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  summaryStatsCompact: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  summaryStatCompact: {
    alignItems: 'center',
  },
  summaryStatValueCompact: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  summaryStatLabelCompact: {
    color: theme.colors.mutedText,
    fontSize: 9,
    marginTop: 1,
  },
});
