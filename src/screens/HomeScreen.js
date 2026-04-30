import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Clock, Map, Sparkles, User, UtensilsCrossed, ArrowRight, Flame, Target, MapPin, History, Bookmark, Trophy, Star, Zap, BookOpen } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { getCultureRank, getCulturalAssets, getProvinceConnectionMap, getRecentlyViewed } from '../utils/culturalAssets';
import { getTypeIcon, getTypeScreen } from '../utils/contentTypes';
import { getRecommendedNextStep, getHomeScreenRecommendation } from '../utils/recommendations';
import { getWrongAnswers } from '../utils/wrongAnswers';
import { getUserInterests } from '../screens/OnboardingScreen';
import { logger } from '../utils/errorHandling';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';
import { getUpcomingFestivals } from '../data/festivals';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { PaperTexture } from '../components/PaperTexture';
import { PathsSection } from '../components/PathsSection';
import { BadgeSummaryCard } from '../components/BadgesSection';
import { SkeletonHomeScreen } from '../components/Skeleton';
import { calculateTotalXP, getXPLevel } from '../data/badges';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { XP_CONFIG } from '../config/constants';

const quickActions = [
  { id: 'history', label: 'History', labelCn: '历史', icon: Clock, target: 'History', color: '#B33B24' },
  { id: 'food', label: 'Food', labelCn: '美食', icon: UtensilsCrossed, target: 'Food', color: '#E2B05E' },
  { id: 'places', label: 'Places', labelCn: '城市', icon: Map, target: 'Places', color: '#6B8A94' },
  { id: 'people', label: 'People', labelCn: '人物', icon: User, target: 'History', color: '#8B7355' },
];

// Compact quick action chips for header
const quickChips = [
  { id: 'quiz', label: 'Quiz', labelCn: '问答', icon: CalendarDays, target: 'Seasons' },
  { id: 'collection', label: 'Collection', labelCn: '收藏', icon: Bookmark, target: 'Profile', screen: 'Collection' },
  { id: 'calendar', label: 'Calendar', labelCn: '日历', icon: CalendarDays, target: 'Seasons' },
];

export function HomeScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [assets, setAssets] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [userPreferences, setUserPreferences] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [assetsData, recentData, wrongData, prefsData] = await Promise.all([
      getCulturalAssets().catch((e) => { logger.error('HomeScreen', 'Failed to load cultural assets', e); return null; }),
      getRecentlyViewed().catch((e) => { logger.error('HomeScreen', 'Failed to load recently viewed', e); return []; }),
      getWrongAnswers().catch((e) => { logger.error('HomeScreen', 'Failed to load wrong answers', e); return []; }),
      getUserInterests().catch((e) => { logger.error('HomeScreen', 'Failed to load user interests', e); return null; }),
    ]);
    setAssets(assetsData);
    setRecentlyViewed(recentData);
    setWrongAnswersCount(wrongData.filter(a => !a.mastered).length);
    setUserPreferences(prefsData);
    setIsLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  const streak = assets?.quiz?.streak ?? 0;
  const solved = assets?.quiz?.totalSolved ?? 0;
  const solvedToday = Boolean(assets?.quiz?.solvedByDate?.[new Date().toISOString().slice(0, 10)]);
  const connectionMap = useMemo(
    () => getProvinceConnectionMap({ favorites: assets?.favorites, cities, recipes, dynasties }),
    [assets]
  );
  const connected = connectionMap.collectedCount;
  const rank = getCultureRank(connected);

  const collectedCities = assets?.favorites?.cities ?? [];
  const collectedRecipes = assets?.favorites?.recipes ?? [];
  const collectedDynasties = assets?.favorites?.dynasties ?? [];
  const totalCollected = collectedCities.length + collectedRecipes.length + collectedDynasties.length;

  const lastViewedItem = recentlyViewed[0];

  // Calculate XP and level
  const userStats = useMemo(() => ({
    quizStreak: streak,
    quizTotal: solved,
    citiesCollected: collectedCities.length,
    recipesCollected: collectedRecipes.length,
    dynastiesCollected: collectedDynasties.length,
    provincesConnected: connected,
    namesGenerated: assets?.stats?.namesGenerated ?? 0,
    namesSaved: assets?.favorites?.names?.length ?? 0,
    usedHistory: true,
    usedFood: true,
    usedPlaces: true,
    usedQuiz: true,
  }), [streak, solved, collectedCities, collectedRecipes, collectedDynasties, connected, assets]);

  const totalXP = useMemo(() => calculateTotalXP(userStats), [userStats]);
  const xpLevel = useMemo(() => getXPLevel(totalXP), [totalXP]);

  // Get upcoming festivals
  const upcomingFestivals = useMemo(() => getUpcomingFestivals(new Date(), 2), []);

  // Get personalized next step recommendation
  const nextStepRecommendation = useMemo(() => {
    return getRecommendedNextStep({
      solvedToday,
      citiesCollected: collectedCities.length,
      recipesCollected: collectedRecipes.length,
      dynastiesCollected: collectedDynasties.length,
      wrongAnswersCount,
      userPreferences: userPreferences ? {
        primaryInterest: userPreferences.interests?.[0] || 'comprehensive',
        goal: userPreferences.goal || 'casual',
      } : undefined,
    });
  }, [solvedToday, collectedCities, collectedRecipes, collectedDynasties, wrongAnswersCount, userPreferences]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <SkeletonHomeScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <HandscrollContainer
        style={styles.scrollShell}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.container}>
          {/* Compact Header with Level & Quick Chips */}
          <View style={styles.compactHeader}>
            <View style={styles.headerTopRow}>
              {/* Level Badge */}
              <View style={[styles.levelBadge, { backgroundColor: colors.cinnabarGlow }]}>
                <Trophy size={12} color={colors.primary} strokeWidth={2.5} />
                <Text style={[styles.levelBadgeText, { color: colors.primary }]}>Lv.{xpLevel.level}</Text>
              </View>

              {/* XP Progress */}
              <View style={styles.xpProgressWrap}>
                <View style={[styles.xpProgressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(51,51,51,0.08)' }]}>
                  <View style={[styles.xpProgressFill, { width: `${Math.min(totalXP / XP_CONFIG.MAX_LEVEL_THRESHOLD * 100, 100)}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.xpLabel, { color: colors.mutedText }]}>{totalXP} XP</Text>
              </View>

              {/* Level Title */}
              <View style={styles.levelTitleWrap}>
                <Text style={[styles.levelTitle, { color: colors.text }]}>{xpLevel.title}</Text>
                <Text style={[styles.levelTitleCn, { color: colors.primary }]}>{xpLevel.titleCn}</Text>
              </View>
            </View>

            {/* Quick Chips Row */}
            <View style={styles.quickChipsRow}>
              {quickChips.map((chip) => {
                const ChipIcon = chip.icon;
                return (
                  <Pressable
                    key={chip.id}
                    style={({ pressed }) => [styles.quickChip, pressed && styles.quickChipPressed]}
                    onPress={() => {
                      if (chip.screen) {
                        navigation.getParent()?.navigate(chip.target, { screen: chip.screen });
                      } else {
                        navigation.getParent()?.navigate(chip.target);
                      }
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${chip.label} - ${chip.labelCn}`}
                    accessibilityHint={`Double tap to go to ${chip.label}`}
                  >
                    <ChipIcon size={12} color={colors.primary} strokeWidth={2} />
                    <Text style={styles.quickChipLabel}>{chip.label}</Text>
                    <Text style={styles.quickChipLabelCn}>{chip.labelCn}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Compact Task Card */}
          <Pressable
            style={({ pressed }) => [styles.taskCard, pressed && styles.taskCardPressed, !solvedToday && styles.taskCardPending]}
            onPress={() => navigation.getParent()?.navigate('Seasons')}
            accessibilityRole="button"
            accessibilityLabel={!solvedToday ? "Priority task: Complete daily quiz" : "Today's task completed"}
          >
            <View style={styles.taskContent}>
              <View style={styles.taskLeft}>
                <View style={[styles.taskIconWrap, solvedToday && styles.taskIconDone]}>
                  {solvedToday ? (
                    <Star size={16} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
                  ) : (
                    <Zap size={16} color={colors.primary} strokeWidth={2.5} fill={colors.primary} />
                  )}
                </View>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{solvedToday ? 'Task Complete!' : 'Daily Quiz'}</Text>
                  <Text style={styles.taskTitleCn}>{solvedToday ? '今日完成' : '每日问答'}</Text>
                </View>
              </View>
              <View style={styles.taskStats}>
                <View style={styles.taskStatItem}>
                  <Flame size={12} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.taskStatValue}>{streak}</Text>
                </View>
                <View style={styles.taskStatItem}>
                  <Target size={12} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.taskStatValue}>{solved}</Text>
                </View>
                <View style={styles.taskStatItem}>
                  <MapPin size={12} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.taskStatValue}>{connected}</Text>
                </View>
              </View>
              {!solvedToday && (
                <View style={styles.taskAction}>
                  <Text style={styles.taskActionText}>Start</Text>
                  <ArrowRight size={12} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              )}
            </View>
          </Pressable>

          {/* Next Step Recommendation */}
          {solvedToday && nextStepRecommendation && (
            <Pressable
              style={({ pressed }) => [styles.nextStepCard, pressed && styles.nextStepCardPressed]}
              onPress={() => navigation.navigate(nextStepRecommendation.screen)}
              accessibilityRole="button"
              accessibilityLabel={`Next step: ${nextStepRecommendation.label} - ${nextStepRecommendation.labelCn}`}
              accessibilityHint={`Double tap to ${nextStepRecommendation.reason}`}
            >
              <View style={styles.nextStepIconWrap}>
                <nextStepRecommendation.icon size={20} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.nextStepContent}>
                <View style={styles.nextStepHeader}>
                  <Text style={styles.nextStepLabel}>{nextStepRecommendation.label}</Text>
                  {nextStepRecommendation.priority === 'high' && (
                    <View style={styles.priorityBadge}>
                      <Zap size={10} color="#FFFFFF" strokeWidth={2} />
                    </View>
                  )}
                </View>
                <Text style={styles.nextStepLabelCn}>{nextStepRecommendation.labelCn}</Text>
                <Text style={styles.nextStepReason}>{nextStepRecommendation.reason}</Text>
              </View>
              <ArrowRight size={16} color={theme.colors.primary} strokeWidth={2} />
            </Pressable>
          )}

          {/* Achievement Summary - Compact */}
          <BadgeSummaryCard stats={userStats} compact />

          {/* Upcoming Festivals */}
          {upcomingFestivals.length > 0 && (
            <View style={styles.festivalSection}>
              <View style={styles.festivalHeader}>
                <CalendarDays size={14} color={colors.primary} strokeWidth={2} />
                <Text style={styles.festivalTitle}>Upcoming</Text>
                <Text style={styles.festivalTitleCn}>节日</Text>
              </View>
              <View style={styles.festivalRow}>
                {upcomingFestivals.map((festival) => (
                  <Pressable
                    key={festival.id}
                    style={[styles.festivalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => navigation.getParent()?.navigate('Seasons')}
                    accessibilityRole="button"
                    accessibilityLabel={`${festival.nameEn} - ${festival.nameCn}`}
                  >
                    <Text style={styles.festivalNameCn}>{festival.nameCn}</Text>
                    <Text style={styles.festivalNameEn}>{festival.nameEn}</Text>
                    <Text style={styles.festivalDays}>{festival.daysUntil === 0 ? 'Today' : `${festival.daysUntil}d`}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Explore Grid - 2x2 Cards */}
          <View style={styles.exploreSection}>
            <View style={styles.exploreHeader}>
              <Text style={styles.exploreTitle}>Explore</Text>
              <Text style={styles.exploreTitleCn}>探索</Text>
            </View>
            <View style={styles.exploreGrid}>
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Pressable
                    key={action.id}
                    style={({ pressed }) => [styles.exploreCard, pressed && styles.exploreCardPressed]}
                    onPress={() => navigation.navigate(action.target)}
                    accessibilityRole="button"
                  >
                    <View style={[styles.exploreIconWrap, { backgroundColor: `${action.color}15` }]}>
                      <ActionIcon size={24} color={action.color} strokeWidth={2} />
                    </View>
                    <Text style={styles.exploreCardTitle}>{action.label}</Text>
                    <Text style={styles.exploreCardTitleCn}>{action.labelCn}</Text>
                    <View style={styles.exploreCardArrow}>
                      <ArrowRight size={14} color={colors.mutedText} strokeWidth={2} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </HandscrollContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollShell: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
  safeArea: { flex: 1, backgroundColor: theme.colors.background },

  // Compact Header
  compactHeader: {
    marginBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  levelBadgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  xpProgressWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  xpProgressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: 3,
    borderRadius: 1.5,
  },
  xpLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  levelTitleWrap: {
    alignItems: 'flex-end',
  },
  levelTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  levelTitleCn: {
    fontSize: 9,
    fontWeight: '600',
  },

  // Quick Chips
  quickChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
  },
  quickChipPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  quickChipLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  quickChipLabelCn: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: '600',
    opacity: 0.8,
  },

  // Compact Task Card
  taskCard: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
    backgroundColor: theme.colors.softCard,
    padding: 12,
    marginBottom: 10,
    ...theme.shadows.subtle,
  },
  taskCardPending: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
    backgroundColor: theme.colors.cinnabarGlow,
  },
  taskCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  taskIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIconDone: {
    backgroundColor: theme.colors.success,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  taskTitleCn: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  taskStats: {
    flexDirection: 'row',
    gap: 8,
  },
  taskStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  taskStatValue: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  taskAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  taskActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // Explore Section
  exploreSection: {
    marginTop: 10,
  },
  exploreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  exploreTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  exploreTitleCn: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  exploreCard: {
    width: '48%',
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: 14,
    minHeight: 90,
  },
  exploreCardPressed: {
    opacity: 0.94,
    transform: [{ scale: theme.motion.tapScale }],
  },
  exploreIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  exploreCardTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  exploreCardTitleCn: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  exploreCardArrow: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },

  // Next Step Card
  nextStepCard: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
    backgroundColor: theme.colors.softCard,
    padding: 12,
    ...theme.shadows.subtle,
  },
  nextStepCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
  nextStepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextStepLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  priorityBadge: {
    backgroundColor: theme.colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepLabelCn: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  nextStepReason: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 1,
  },

  // Resume Card
  resumeCard: {
    marginTop: 10,
  },
  resumeCardPressed: {
    opacity: 0.94,
  },
  resumeCardInner: {
    padding: 12,
    backgroundColor: theme.colors.surface,
  },
  resumeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  resumeLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  resumeItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  resumeItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeItemContent: {
    flex: 1,
  },
  resumeItemTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  resumeItemTitleZh: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  resumeItemSub: {
    color: theme.colors.mutedText,
    fontSize: 10,
    marginTop: 1,
  },
  resumeMetaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  rankPill: {
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  rankPillText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  collectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.inkWash,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  collectedPillText: {
    color: theme.colors.mutedText,
    fontSize: 9,
    fontWeight: '700',
  },

  // Recent Card
  recentCard: {
    marginTop: 10,
    padding: 12,
    backgroundColor: theme.colors.softCard,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recentLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  recentCount: {
    color: theme.colors.mutedText,
    fontSize: 10,
    fontWeight: '700',
  },
  recentList: {
    gap: 6,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  recentItemPressed: {
    opacity: 0.9,
    backgroundColor: theme.colors.card,
  },
  recentItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemName: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  recentItemNameZh: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },

  // Festival Section
  festivalSection: {
    marginTop: 10,
  },
  festivalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  festivalTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  festivalTitleCn: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  festivalRow: {
    flexDirection: 'row',
    gap: 8,
  },
  festivalCard: {
    flex: 1,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 10,
    alignItems: 'center',
  },
  festivalNameCn: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  festivalNameEn: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  festivalDays: {
    color: theme.colors.mutedText,
    fontSize: 9,
    marginTop: 4,
    fontWeight: '700',
  },
});
