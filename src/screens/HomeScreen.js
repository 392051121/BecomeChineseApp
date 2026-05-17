import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Platform, Pressable, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Clock, Map, UtensilsCrossed, ArrowRight, Flame, Target, Bookmark, Trophy, Star, Zap, Scroll, User, BookOpen } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { getCultureRank, getCulturalAssets, getProvinceConnectionMap, getRecentlyViewed } from '../utils/culturalAssets';
import { getTypeScreen } from '../utils/contentTypes';
import { getRecommendedNextStep } from '../utils/recommendations';
import { getWrongAnswers } from '../utils/wrongAnswers';
import { logger } from '../utils/errorHandling';
import { getSignInStatus } from '../utils/dailySignIn';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { SectionCard } from '../components/SectionCard';
import { DailySignInModal, DailySignInButton } from '../components/DailySignInModal';
import { DailyTasksModal, DailyTasksButton } from '../components/DailyTasksModal';
import { getTasksSummary } from '../utils/dailyTasks';
import { SkeletonHomeScreen } from '../components/Skeleton';
import { calculateTotalXP, getXPLevel } from '../data/badges';
import { getXPProgress } from '../config/gamification';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const quickActions = [
  { id: 'history', label: 'History', labelCn: '历史', icon: Clock, target: 'History', color: '#B33B24' },
  { id: 'food', label: 'Food', labelCn: '美食', icon: UtensilsCrossed, target: 'Food', color: '#E2B05E' },
  { id: 'places', label: 'Places', labelCn: '城市', icon: Map, target: 'Places', color: '#6B8A94' },
];

export function HomeScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [assets, setAssets] = useState(null);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [signInStatus, setSignInStatus] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [tasksSummary, setTasksSummary] = useState(null);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const loadData = useCallback(async () => {
    const [assetsData, wrongData, signInData, tasksData, recentData] = await Promise.all([
      getCulturalAssets().catch((e) => { logger.error('HomeScreen', 'Failed to load cultural assets', e); return null; }),
      getWrongAnswers().catch((e) => { logger.error('HomeScreen', 'Failed to load wrong answers', e); return []; }),
      getSignInStatus().catch((e) => { logger.error('HomeScreen', 'Failed to load sign-in status', e); return null; }),
      getTasksSummary().catch((e) => { logger.error('HomeScreen', 'Failed to load tasks summary', e); return null; }),
      getRecentlyViewed().catch((e) => { logger.error('HomeScreen', 'Failed to load recently viewed', e); return []; }),
    ]);
    setAssets(assetsData);
    setWrongAnswersCount(wrongData.filter(a => !a.mastered).length);
    setSignInStatus(signInData);
    setTasksSummary(tasksData);
    setRecentlyViewed(recentData);
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

  const collectedCities = assets?.favorites?.cities ?? [];
  const collectedRecipes = assets?.favorites?.recipes ?? [];
  const collectedDynasties = assets?.favorites?.dynasties ?? [];

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
  const xpProgress = useMemo(() => getXPProgress(totalXP), [totalXP]);

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
          {/* Compact Header with Level */}
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
                  <View style={[styles.xpProgressFill, { width: `${xpProgress.percentage}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.xpLabel, { color: colors.mutedText }]}>{totalXP} XP</Text>
              </View>

              {/* Level Title */}
              <View style={styles.levelTitleWrap}>
                <Text style={[styles.levelTitle, { color: colors.text }]}>{xpLevel.title}</Text>
                <Text style={[styles.levelTitleCn, { color: colors.primary }]}>{xpLevel.titleCn}</Text>
              </View>
            </View>
          </View>

          {/* Daily Quiz Card */}
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
              </View>
              {!solvedToday && (
                <View style={styles.taskAction}>
                  <Text style={styles.taskActionText}>Start</Text>
                  <ArrowRight size={12} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              )}
            </View>
          </Pressable>

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
                    accessibilityLabel={`${action.label} - ${action.labelCn}`}
                    accessibilityHint={`Double tap to explore ${action.label}`}
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

          {/* Quick Links */}
          <View style={styles.quickLinksRow}>
            <Pressable
              style={[styles.quickLinkBtn, { backgroundColor: colors.cinnabarGlow }]}
              onPress={() => navigation.getParent()?.navigate('Profile', { screen: 'Collection' })}
              accessibilityRole="button"
              accessibilityLabel="View Collection"
              accessibilityHint="Double tap to see your saved items"
            >
              <Bookmark size={14} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.quickLinkText, { color: colors.primary }]}>Collection</Text>
            </Pressable>
            <Pressable
              style={[styles.quickLinkBtn, { backgroundColor: colors.cinnabarGlow }]}
              onPress={() => navigation.getParent()?.navigate('Seasons')}
              accessibilityRole="button"
              accessibilityLabel="Open Calendar"
              accessibilityHint="Double tap to view calendar and daily quiz"
            >
              <CalendarDays size={14} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.quickLinkText, { color: colors.primary }]}>Calendar</Text>
            </Pressable>
          </View>

          {/* Daily Sign-in & Tasks Buttons */}
          <View style={styles.dailyButtonsRow}>
            <DailySignInButton
              onPress={() => setShowSignInModal(true)}
              signedIn={signInStatus?.hasSignedInToday}
              streak={signInStatus?.currentStreak || 0}
            />
            <DailyTasksButton
              onPress={() => setShowTasksModal(true)}
              completedCount={tasksSummary?.completedCount || 0}
              totalCount={tasksSummary?.totalCount || 3}
            />
          </View>

          {/* Wrong Answers Review Prompt */}
          {wrongAnswersCount > 0 && (
            <Pressable
              style={({ pressed }) => [styles.reviewPromptCard, pressed && styles.reviewPromptPressed, { borderColor: colors.primary }]}
              onPress={() => navigation.getParent()?.navigate('Seasons', { screen: 'WrongAnswerReview' })}
              accessibilityRole="button"
              accessibilityLabel={`${wrongAnswersCount} questions waiting for review`}
            >
              <View style={styles.reviewPromptLeft}>
                <View style={[styles.reviewPromptIcon, { backgroundColor: colors.cinnabarGlow }]}>
                  <BookOpen size={16} color={colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.reviewPromptContent}>
                  <Text style={styles.reviewPromptTitle}>Review Wrong Answers</Text>
                  <Text style={styles.reviewPromptTitleCn}>复习错题</Text>
                  <Text style={[styles.reviewPromptHint, { color: colors.mutedText }]}>
                    {wrongAnswersCount} questions waiting
                  </Text>
                </View>
              </View>
              <View style={[styles.reviewPromptAction, { backgroundColor: colors.primary }]}>
                <Text style={styles.reviewPromptActionText}>Review</Text>
                <ArrowRight size={12} color="#FFFFFF" strokeWidth={2} />
              </View>
            </Pressable>
          )}

          {/* Recently Viewed - Continue Reading */}
          {recentlyViewed.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Clock size={14} color={colors.primary} strokeWidth={2} />
                <Text style={styles.recentTitle}>Continue Reading</Text>
                <Text style={styles.recentTitleCn}>继续浏览</Text>
              </View>
              <View style={styles.recentList}>
                {recentlyViewed.slice(0, 4).map((item) => {
                  const typeConfig = {
                    city: { icon: Map, color: '#6B8A94', screen: 'Places' },
                    recipe: { icon: UtensilsCrossed, color: '#E2B05E', screen: 'Food' },
                    dynasty: { icon: Scroll, color: '#B33B24', screen: 'History' },
                    person: { icon: User, color: '#8B7355', screen: 'History' },
                  };
                  const config = typeConfig[item.type] || typeConfig.city;
                  const IconComponent = config.icon;
                  return (
                    <Pressable
                      key={`${item.type}-${item.id}`}
                      style={({ pressed }) => [styles.recentCard, pressed && styles.recentCardPressed, { borderColor: colors.border }]}
                      onPress={() => navigation.getParent()?.navigate(config.screen)}
                      accessibilityRole="button"
                      accessibilityLabel={`${item.nameEn} - ${item.nameCn}`}
                    >
                      <View style={[styles.recentIconWrap, { backgroundColor: `${config.color}15` }]}>
                        <IconComponent size={16} color={config.color} strokeWidth={2} />
                      </View>
                      <View style={styles.recentCardContent}>
                        <Text style={[styles.recentCardName, { color: colors.text }]} numberOfLines={1}>{item.nameEn}</Text>
                        <Text style={[styles.recentCardNameCn, { color: colors.primary }]} numberOfLines={1}>{item.nameCn}</Text>
                      </View>
                      <ArrowRight size={12} color={colors.mutedText} strokeWidth={2} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </HandscrollContainer>

      {/* Daily Sign-in Modal */}
      <DailySignInModal
        visible={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={(result) => {
          loadData();
        }}
      />

      {/* Daily Tasks Modal */}
      <DailyTasksModal
        visible={showTasksModal}
        onClose={() => setShowTasksModal(false)}
        onClaim={(result) => {
          loadData();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollShell: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
  safeArea: { flex: 1, backgroundColor: theme.colors.background },

  // Compact Header
  compactHeader: {
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 16,
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

  // Task Card
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

  // Quick Links
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  quickLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  quickLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Daily Buttons Row
  dailyButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },

  // Review Prompt Card
  reviewPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    backgroundColor: theme.colors.cinnabarGlow,
    padding: 14,
  },
  reviewPromptPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  reviewPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reviewPromptIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPromptContent: {
    flex: 1,
  },
  reviewPromptTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  reviewPromptTitleCn: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  reviewPromptHint: {
    fontSize: 11,
    marginTop: 2,
  },
  reviewPromptAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  reviewPromptActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Recently Viewed Section
  recentSection: {
    marginTop: 18,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  recentTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  recentTitleCn: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  recentList: {
    gap: 8,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    backgroundColor: theme.colors.card,
    padding: 12,
  },
  recentCardPressed: {
    opacity: 0.95,
    backgroundColor: theme.colors.surface,
  },
  recentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCardContent: {
    flex: 1,
  },
  recentCardName: {
    fontSize: 13,
    fontWeight: '600',
  },
  recentCardNameCn: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
});
