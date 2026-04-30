import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Trophy, Star, MapPin, UtensilsCrossed, Scroll, Flame } from 'lucide-react-native';

import { theme } from '../theme/theme';
import { logger } from '../utils/errorHandling';

/**
 * Share Card Components
 * These are React Native views that can be captured using expo-view-shot
 * to generate shareable images.
 */

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

// Achievement Share Card
export function AchievementShareCard({ badge, xp, level }) {
  const iconMap = {
    flame: Flame,
    target: Trophy,
    'map-pin': MapPin,
    globe: MapPin,
    utensils: UtensilsCrossed,
    scroll: Scroll,
    user: Trophy,
    award: Trophy,
    star: Star,
    sparkles: Star,
  };
  const Icon = iconMap[badge?.icon] || Trophy;
  const color = badge?.color || theme.colors.primary;

  return (
    <View style={shareStyles.container}>
      <View style={shareStyles.background}>
        <View style={shareStyles.decorativeTop} />
        <View style={shareStyles.decorativeBottom} />
      </View>

      <View style={shareStyles.content}>
        <View style={[shareStyles.iconWrap, { backgroundColor: `${color}20` }]}>
          <Icon size={40} color={color} strokeWidth={2} />
        </View>

        <Text style={shareStyles.badgeTitle}>{badge?.nameEn || 'Achievement'}</Text>
        <Text style={shareStyles.badgeTitleCn}>{badge?.nameCn || '成就'}</Text>

        <View style={shareStyles.xpBadge}>
          <Star size={14} color={theme.colors.primary} strokeWidth={2} />
          <Text style={shareStyles.xpText}>+{badge?.xp || xp} XP</Text>
        </View>

        <Text style={shareStyles.description}>{badge?.descriptionEn || 'Unlocked a new achievement!'}</Text>

        <View style={shareStyles.footer}>
          <Text style={shareStyles.appName}>Become Chinese</Text>
          <Text style={shareStyles.levelText}>Level {level}</Text>
        </View>
      </View>
    </View>
  );
}

// Name Share Card
export function NameShareCard({ name, pinyin, meaning, rank }) {
  return (
    <View style={shareStyles.container}>
      <View style={shareStyles.background}>
        <View style={shareStyles.decorativeTop} />
        <View style={shareStyles.decorativeBottom} />
      </View>

      <View style={shareStyles.content}>
        <Text style={[shareStyles.hanzi, { fontFamily: serifFont }]}>{name}</Text>
        <Text style={shareStyles.pinyin}>{pinyin}</Text>

        <View style={shareStyles.meaningWrap}>
          <Text style={shareStyles.meaning}>{meaning}</Text>
        </View>

        <View style={shareStyles.rankRow}>
          <Trophy size={16} color={theme.colors.primary} strokeWidth={2} />
          <Text style={shareStyles.rankText}>Rank {rank}</Text>
        </View>

        <View style={shareStyles.footer}>
          <Text style={shareStyles.appName}>Become Chinese</Text>
        </View>
      </View>
    </View>
  );
}

// Collection Milestone Share Card
export function CollectionShareCard({ totalItems, cities, dishes, dynasties, rank }) {
  return (
    <View style={shareStyles.container}>
      <View style={shareStyles.background}>
        <View style={shareStyles.decorativeTop} />
        <View style={shareStyles.decorativeBottom} />
      </View>

      <View style={shareStyles.content}>
        <View style={shareStyles.milestoneHeader}>
          <Trophy size={32} color={theme.colors.primary} strokeWidth={2} />
        </View>

        <Text style={shareStyles.milestoneTitle}>Cultural Atlas</Text>
        <Text style={shareStyles.milestoneTitleCn}>文化地图集</Text>

        <Text style={shareStyles.totalCount}>{totalItems}</Text>
        <Text style={shareStyles.totalLabel}>Items Collected</Text>

        <View style={shareStyles.statsRow}>
          <View style={shareStyles.statItem}>
            <MapPin size={16} color='#6B8A94' strokeWidth={2} />
            <Text style={shareStyles.statValue}>{cities}</Text>
            <Text style={shareStyles.statLabel}>Cities</Text>
          </View>
          <View style={shareStyles.statItem}>
            <UtensilsCrossed size={16} color='#E2B05E' strokeWidth={2} />
            <Text style={shareStyles.statValue}>{dishes}</Text>
            <Text style={shareStyles.statLabel}>Dishes</Text>
          </View>
          <View style={shareStyles.statItem}>
            <Scroll size={16} color='#B33B24' strokeWidth={2} />
            <Text style={shareStyles.statValue}>{dynasties}</Text>
            <Text style={shareStyles.statLabel}>Dynasties</Text>
          </View>
        </View>

        <View style={shareStyles.footer}>
          <Text style={shareStyles.appName}>Become Chinese</Text>
          <Text style={shareStyles.levelText}>Rank {rank}</Text>
        </View>
      </View>
    </View>
  );
}

// Streak Share Card
export function StreakShareCard({ streak, totalSolved, rank }) {
  return (
    <View style={shareStyles.container}>
      <View style={shareStyles.background}>
        <View style={shareStyles.decorativeTop} />
        <View style={shareStyles.decorativeBottom} />
      </View>

      <View style={shareStyles.content}>
        <View style={shareStyles.streakIconWrap}>
          <Flame size={48} color='#E2B05E' strokeWidth={2} />
        </View>

        <Text style={shareStyles.streakTitle}>{streak} Day Streak!</Text>
        <Text style={shareStyles.streakTitleCn}>连续{streak}天!</Text>

        <View style={shareStyles.streakStats}>
          <View style={shareStyles.streakStat}>
            <Text style={shareStyles.streakStatValue}>{totalSolved}</Text>
            <Text style={shareStyles.streakStatLabel}>Total Solved</Text>
          </View>
          <View style={shareStyles.streakStat}>
            <Text style={shareStyles.streakStatValue}>{rank}</Text>
            <Text style={shareStyles.streakStatLabel}>Rank</Text>
          </View>
        </View>

        <Text style={shareStyles.streakMessage}>Building cultural knowledge, one day at a time.</Text>

        <View style={shareStyles.footer}>
          <Text style={shareStyles.appName}>Become Chinese</Text>
        </View>
      </View>
    </View>
  );
}

const shareStyles = StyleSheet.create({
  container: {
    width: 320,
    height: 400,
    backgroundColor: theme.colors.shareCardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeTop: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(179, 59, 36, 0.06)',
  },
  decorativeBottom: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(226, 176, 94, 0.08)',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Achievement styles
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  badgeTitleCn: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 12,
  },
  xpText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  description: {
    color: theme.colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },

  // Name styles
  hanzi: {
    color: theme.colors.text,
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: 8,
  },
  pinyin: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  meaningWrap: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(51, 51, 51, 0.04)',
    borderRadius: 8,
  },
  meaning: {
    color: theme.colors.text,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  rankText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  // Collection styles
  milestoneHeader: {
    marginBottom: 12,
  },
  milestoneTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  milestoneTitleCn: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  totalCount: {
    color: theme.colors.primary,
    fontSize: 48,
    fontWeight: '800',
    marginTop: 16,
  },
  totalLabel: {
    color: theme.colors.mutedText,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 2,
  },

  // Streak styles
  streakIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(226, 176, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  streakTitle: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  streakTitleCn: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  streakStats: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 20,
  },
  streakStat: {
    alignItems: 'center',
  },
  streakStatValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  streakStatLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  streakMessage: {
    color: theme.colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  levelText: {
    color: theme.colors.mutedText,
    fontSize: 10,
    fontWeight: '600',
  },
});

/**
 * Helper function to capture a view as an image
 * Usage:
 *   import { captureRef } from 'react-native-view-shot';
 *   const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
 *   await Sharing.shareAsync(uri);
 */
export async function captureAndShareShareCard(cardRef) {
  try {
    const { captureRef } = require('react-native-view-shot');
    const { Sharing } = require('expo-sharing');

    const uri = await captureRef(cardRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }

    return uri;
  } catch (error) {
    logger.error('ShareCards', 'Failed to share card', error);
    return null;
  }
}
