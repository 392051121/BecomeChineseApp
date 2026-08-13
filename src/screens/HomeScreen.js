import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Platform, Pressable, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Clock, Map, UtensilsCrossed, ArrowRight, Flame, Bookmark, Star, Zap, Scroll, User, BookOpen, ChevronRight, Leaf } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { getCulturalAssets, getProvinceConnectionMap, getRecentlyViewed, todayKey } from '../utils/culturalAssets';
import { getWrongAnswers } from '../utils/wrongAnswers';
import { logger } from '../utils/errorHandling';
import { getSignInStatus } from '../utils/dailySignIn';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';
import { HandscrollContainer } from '../components/HandscrollContainer';
import { DailySignInModal, DailySignInButton } from '../components/DailySignInModal';
import { DailyTasksModal, DailyTasksButton } from '../components/DailyTasksModal';
import { getTasksSummary } from '../utils/dailyTasks';
import { SkeletonHomeScreen } from '../components/Skeleton';
import { calculateTotalXP } from '../data/badges';
import { getXPLevel } from '../config/gamification';
import { getCurrentSolarTerm, getCurrentSeason, getSeasonalColors, getFestivalBonus } from '../utils/solarTermContent';
import { PaperTexture } from '../components/PaperTexture';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { navigateApp } from '../utils/navigation';
import { availablePaths } from '../components/PathsSection';

const quickActions = [
  { id: 'history', label: 'History', labelCn: '历史', icon: Scroll, target: 'History', color: '#B33B24', seasonKey: 'autumn', prose: 'Rise and fall of dynasties' },
  { id: 'food', label: 'Food', labelCn: '美食', icon: UtensilsCrossed, target: 'Food', color: '#C88A2D', seasonKey: 'spring', prose: 'A taste of China' },
  { id: 'places', label: 'Places', labelCn: '城市', icon: Map, target: 'Places', color: '#6B8A94', seasonKey: 'summer', prose: 'Walk the land of China' },
];

export function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [assets, setAssets] = useState(null);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [signInStatus, setSignInStatus] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [tasksSummary, setTasksSummary] = useState(null);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [seasonMeta, setSeasonMeta] = useState(null);

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

  // Load current solar term + seasonal identity for the hero
  useEffect(() => {
    const term = getCurrentSolarTerm();
    const season = getCurrentSeason();
    const seasonColors = getSeasonalColors();
    const bonus = getFestivalBonus();
    setSeasonMeta({ term, season, seasonColors, bonus });
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
  const solvedToday = Boolean(assets?.quiz?.solvedByDate?.[todayKey()]);
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

  // Hero seasonal styling
  const seasonText = seasonMeta?.seasonColors?.text || '·';
  const seasonName = seasonMeta?.season || 'autumn';
  const heroTermCn = seasonMeta?.term?.nameCn || '';
  const heroTermEn = seasonMeta?.term?.nameEn || '';
  const heroSummary = seasonMeta?.term?.summaryEn || '';
  const isFestival = seasonMeta?.bonus?.isFestival;

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
      {/* Global 宣纸背景质感 */}
      <View pointerEvents="none" style={styles.paperWrap}>
        <PaperTexture style={styles.paperTexture} idPrefix="home_bg" />
      </View>

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
          {/* ============ HERO 主视觉区 ============ */}
          <Pressable
            style={[
              styles.heroCard,
              styles.heroCardLight,
            ]}
            onPress={() => {
              // Prefer canonical Seasons detail key (detailId); fall back to pinyin id
              // which SolarTermDetailScreen now resolves via normalizeSolarTermId.
              const termId = seasonMeta?.term?.detailId || seasonMeta?.term?.id;
              if (termId) {
                navigateApp(navigation, 'Seasons', {
                  screen: 'SolarTermDetail',
                  params: { termId },
                });
              } else {
                navigateApp(navigation, 'Seasons');
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={
              heroTermEn
                ? `Current solar term ${heroTermEn}${heroTermCn ? `, ${heroTermCn}` : ''}`
                : 'Open solar terms'
            }
          >
            <View style={styles.heroGlow} />
            <PaperTexture style={styles.heroTexture} intensity="strong" idPrefix="home_hero" />

            {/* 顶部：节日标记为主，等级弱化为角落小字 */}
            <View style={styles.heroTopRow}>
              <View style={styles.heroKickerBadge}>
                <Text style={styles.heroKickerText}>TODAY'S SOLAR TERM · 今日节气</Text>
              </View>
              {isFestival && (
                <View style={styles.heroFestivalBadge}>
                  <Star size={11} color="#F5D78A" strokeWidth={2.5} fill="#F5D78A" />
                  <Text style={styles.heroFestivalText}>Festival</Text>
                </View>
              )}
            </View>

            {/* 中央季节大字 + 节气 */}
            <View style={styles.heroMainRow}>
              <Text style={styles.heroSeasonChar}>{seasonText}</Text>
              <View style={styles.heroTermGroup}>
                <Text style={styles.heroTermEnMain}>{heroTermEn}</Text>
                <Text style={styles.heroTermCnSub}>{heroTermCn}</Text>
              </View>
            </View>
            <View style={styles.heroDivider} />
            <Text style={styles.heroSummary} numberOfLines={3}>
              {heroSummary || 'Learn Chinese culture, one story at a time.'}
            </Text>

            {/* XP 进度（弱化为一行轻量小字） */}
            <View style={styles.heroFooter}>
              <Text style={styles.heroXpLabel}>
                {xpLevel.title || 'Explorer'} · {totalXP} XP
              </Text>
            </View>

            {/* 角落印章 */}
            <View style={styles.heroSeal}>
              <Text style={styles.heroSealText}>{xpLevel.titleCn || '行者'}</Text>
            </View>
          </Pressable>

          {/* ============ 今日任务卡（轻量描边，弱化任务感） ============ */}
          <Pressable
            style={({ pressed }) => [styles.taskCard, { borderColor: colors.borderAccent, backgroundColor: colors.surface }, pressed && styles.taskCardPressed]}
            onPress={() => navigateApp(navigation, 'Seasons')}
            accessibilityRole="button"
            accessibilityLabel={!solvedToday ? "Priority task: Complete daily quiz" : "Today's task completed"}
          >
            <View style={[styles.taskIconWrap, solvedToday && styles.taskIconDone]}>
              {solvedToday ? (
                <Star size={18} color={colors.primary} strokeWidth={2.5} fill={colors.primary} />
              ) : (
                <Zap size={18} color={colors.primary} strokeWidth={2.5} fill={colors.primary} />
              )}
            </View>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskTitle, { color: colors.text }]}>
                {solvedToday ? "Today's Quiz Done" : 'Daily Quiz'}
              </Text>
              <Text style={[styles.taskTitleCn, { color: colors.primary }]}>
                {solvedToday ? '今日已完成' : '每日一问'}
              </Text>
            </View>
            <View style={styles.taskStats}>
              {!solvedToday && (
                <View style={styles.taskStatItem}>
                  <Flame size={13} color={colors.primary} strokeWidth={2} />
                  <Text style={[styles.taskStatValue, { color: colors.primary }]}>{streak}</Text>
                </View>
              )}
            </View>
            {!solvedToday && (
              <ChevronRight size={18} color={colors.mutedText} strokeWidth={2.5} />
            )}
          </Pressable>

          {/* ============ 探索区 ============ */}
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <Text style={styles.sectionTitleCn}>探索</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.exploreGrid}>
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              const isHighlight = action.id === 'history';
              return (
                <Pressable
                  key={action.id}
                  style={({ pressed }) => [
                    styles.exploreCard,
                    pressed && styles.exploreCardPressed,
                    isHighlight && styles.exploreCardHighlight,
                    { borderColor: colors.border },
                  ]}
                  onPress={() => navigateApp(navigation, action.target)}
                  accessibilityRole="button"
                  accessibilityLabel={`${action.label} - ${action.labelCn}`}
                >
                  <View style={[styles.exploreIconWrap, { backgroundColor: `${action.color}1A` }]}>
                    <ActionIcon size={22} color={action.color} strokeWidth={2} />
                  </View>
                  <View style={styles.exploreText}>
                    <Text style={[styles.exploreCardTitle, { color: colors.text }]}>{action.label}</Text>
                    <Text style={[styles.exploreCardTitleCn, { color: colors.primary }]}>{action.labelCn}</Text>
                    <Text style={[styles.exploreProse, { color: colors.mutedText }]}>{action.prose}</Text>
                  </View>
                  <ArrowRight size={14} color={colors.mutedText} strokeWidth={2} />
                </Pressable>
              );
            })}
          </View>

          {/* ============ Featured Journey（首推旅程） ============ */}
          {(() => {
            const featured = availablePaths.find((p) => p.id === 'silk-road') || availablePaths[0];
            if (!featured) return null;
            const FeaturedIcon = featured.icon;
            return (
              <Pressable
                style={({ pressed }) => [styles.featuredJourneyCard, { borderColor: colors.border }, pressed && styles.featuredJourneyPressed]}
                onPress={() => navigation.navigate('PathDetail', { pathId: featured.id })}
                accessibilityRole="button"
                accessibilityLabel={`Featured journey: ${featured.title}`}
              >
                <View style={[styles.featuredJourneyIcon, { backgroundColor: `${featured.color}18` }]}>
                  <FeaturedIcon size={22} color={featured.color} strokeWidth={2} />
                </View>
                <View style={styles.featuredJourneyContent}>
                  <Text style={[styles.featuredJourneyKicker, { color: colors.primary }]}>FEATURED JOURNEY · 特色旅程</Text>
                  <Text style={[styles.featuredJourneyTitle, { color: colors.text }]}>{featured.title}</Text>
                  <Text style={[styles.featuredJourneyDesc, { color: colors.mutedText }]} numberOfLines={2}>
                    {featured.description}
                  </Text>
                  <View style={styles.featuredJourneySteps}>
                    {featured.steps.slice(0, 3).map((s, i) => (
                      <Text key={`${s.type}-${s.id}`} style={styles.featuredJourneyStep}>
                        {i > 0 ? '  →  ' : ''}{s.label}
                      </Text>
                    ))}
                  </View>
                </View>
                <ArrowRight size={18} color={colors.mutedText} strokeWidth={2} />
              </Pressable>
            );
          })()}

          {/* ============ 快捷入口行 ============ */}
          <View style={styles.quickRow}>
            <Pressable
              style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigateApp(navigation, 'Profile', { screen: 'Collection' })}
              accessibilityRole="button"
              accessibilityLabel="View Collection"
            >
              <Bookmark size={15} color={colors.primary} strokeWidth={2.2} />
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Favorites</Text>
            </Pressable>
            <Pressable
              style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigateApp(navigation, 'Seasons')}
              accessibilityRole="button"
              accessibilityLabel="Open Calendar"
            >
              <CalendarDays size={15} color={colors.primary} strokeWidth={2.2} />
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Season</Text>
            </Pressable>
            <DailySignInButton
              signedIn={signInStatus?.hasSignedInToday}
              streak={signInStatus?.currentStreak || 0}
              onPress={() => setShowSignInModal(true)}
            />
          </View>

          {/* 每日任务独立入口 */}
          <View style={styles.dailyTasksWrap}>
            <DailyTasksButton
              onPress={() => setShowTasksModal(true)}
              completedCount={tasksSummary?.completedCount || 0}
              totalCount={tasksSummary?.totalCount || 3}
            />
          </View>

          {/* ============ 错题复习 ============ */}
          {wrongAnswersCount > 0 && (
            <Pressable
              style={({ pressed }) => [styles.reviewPromptCard, pressed && styles.reviewPromptPressed]}
              onPress={() => navigateApp(navigation, 'Seasons', { screen: 'WrongAnswerReview' })}
              accessibilityRole="button"
              accessibilityLabel={`${wrongAnswersCount} questions waiting for review`}
            >
              <View style={[styles.reviewPromptIcon, { backgroundColor: colors.cinnabarGlow }]}>
                <BookOpen size={16} color={colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.reviewPromptContent}>
                <Text style={[styles.reviewPromptTitle, { color: colors.text }]}>Review Wrong Answers</Text>
                <Text style={[styles.reviewPromptHint, { color: colors.mutedText }]}>
                  {wrongAnswersCount} question{wrongAnswersCount > 1 ? 's' : ''} to review
                </Text>
              </View>
              <View style={[styles.reviewPromptAction, { backgroundColor: colors.primary }]}>
                <Text style={styles.reviewPromptActionText}>Review</Text>
                <ArrowRight size={12} color="#FFFFFF" strokeWidth={2.2} />
              </View>
            </Pressable>
          )}

          {/* ============ 继续浏览 ============ */}
          {recentlyViewed.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Clock size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={[styles.recentTitle, { color: colors.text }]}>Continue</Text>
                <Text style={[styles.recentTitleCn, { color: colors.primary }]}>继续浏览</Text>
              </View>
              <View style={styles.recentList}>
                {recentlyViewed.slice(0, 4).map((item) => {
                  // Every Continue card must deep-link into the right detail surface
                  // (Food/Places are modal-by-id tabs; History has nested stacks).
                  const typeConfig = {
                    city: {
                      icon: Map,
                      color: '#6B8A94',
                      goTo: (nav, id) => nav?.navigate('Places', { cityId: id }),
                    },
                    recipe: {
                      icon: UtensilsCrossed,
                      color: '#C88A2D',
                      goTo: (nav, id) => nav?.navigate('Food', { recipeId: id }),
                    },
                    dynasty: {
                      icon: Scroll,
                      color: '#B33B24',
                      goTo: (nav, id) => nav?.navigate('History', {
                        screen: 'DynastyDetail',
                        params: { dynastyId: id },
                      }),
                    },
                    person: {
                      icon: User,
                      color: '#8B7355',
                      goTo: (nav, id) => nav?.navigate('History', {
                        screen: 'PersonDetail',
                        params: { personId: id },
                      }),
                    },
                    season: {
                      icon: Leaf,
                      color: '#C49A4A',
                      goTo: (nav, id) => nav?.navigate('Seasons', {
                        screen: 'SolarTermDetail',
                        params: { termId: id },
                      }),
                    },
                  };
                  const config = typeConfig[item.type] || typeConfig.city;
                  const IconComponent = config.icon;
                  return (
                    <Pressable
                      key={`${item.type}-${item.id}`}
                      style={({ pressed }) => [styles.recentCard, pressed && styles.recentCardPressed, { backgroundColor: colors.card, borderColor: colors.border }]}
                      onPress={() => config.goTo?.(navigation.getParent(), item.id)}
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
  container: { flexGrow: 1, paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 4 : 8, paddingBottom: 100 },
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  paperWrap: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  paperTexture: { opacity: 0.35 },

  // ===== HERO =====
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 14,
    position: 'relative',
  },
  heroCardLight: {
    backgroundColor: '#7A2418',
  },
  heroGlow: {
    position: 'absolute',
    right: -70,
    top: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(229, 74, 62, 0.32)',
  },
  heroTexture: {
    opacity: 0.5,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroKickerBadge: {
    paddingHorizontal: 0,
    paddingVertical: 2,
  },
  heroKickerText: {
    color: 'rgba(245, 215, 138, 0.85)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  heroFestivalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.22)',
  },
  heroFestivalText: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '700',
  },
  heroMainRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 18,
    marginBottom: 6,
  },
  heroSeasonChar: {
    color: '#F5D78A',
    fontSize: 72,
    fontWeight: '600',
    lineHeight: 78,
    opacity: 0.95,
  },
  heroTermGroup: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 4,
  },
  heroTermCn: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '600',
    letterSpacing: 4,
  },
  heroTermEnMain: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTermCnSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 4,
    marginTop: 4,
  },
  heroDivider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(245, 215, 138, 0.7)',
    marginVertical: 12,
  },
  heroSummary: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    lineHeight: 20,
  },
  heroFooter: {
    marginTop: 'auto',
    paddingTop: 10,
  },
  heroXpLabel: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  heroSeal: {
    position: 'absolute',
    right: 18,
    bottom: 40,
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#C23A2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    transform: [{ rotate: '-6deg' }],
  },
  heroSealText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    fontWeight: '700',
  },

  // ===== 今日任务 =====
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 6,
    marginTop: 14,
    ...theme.shadows.subtle,
  },
  taskCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.985 }],
  },
  taskIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(194, 58, 46, 0.10)',
  },
  taskIconDone: {
    backgroundColor: 'rgba(184, 115, 51, 0.14)',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  taskTitleCn: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  taskStats: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 4,
  },
  taskStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  taskStatValue: {
    fontSize: 13,
    fontWeight: '800',
  },

  // ===== 探索区 =====
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sectionTitleCn: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 1.5,
    marginTop: 3,
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: theme.colors.border,
    marginLeft: 4,
  },
  exploreGrid: {
    gap: 10,
  },
  exploreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 0.5,
    backgroundColor: theme.colors.card,
    padding: 14,
  },
  exploreCardHighlight: {
    ...theme.shadows.subtle,
  },
  exploreCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  exploreIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreText: {
    flex: 1,
  },
  exploreCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  exploreCardTitleCn: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  exploreProse: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  // ===== Featured Journey =====
  featuredJourneyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 0.5,
    backgroundColor: theme.colors.card,
    padding: 14,
    ...theme.shadows.subtle,
  },
  featuredJourneyPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  featuredJourneyIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredJourneyContent: {
    flex: 1,
  },
  featuredJourneyKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  featuredJourneyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  featuredJourneyDesc: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  featuredJourneySteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  featuredJourneyStep: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.mutedText,
  },

  // ===== 快捷入口 =====
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 0.5,
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dailyTasksWrap: {
    marginTop: 10,
  },

  // ===== 错题复习 =====
  reviewPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cinnabarGlow,
    padding: 12,
  },
  reviewPromptPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.985 }],
  },
  reviewPromptIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPromptContent: {
    flex: 1,
    marginLeft: 12,
  },
  reviewPromptTitle: {
    fontSize: 15,
    fontWeight: '700',
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

  // ===== 继续浏览 =====
  recentSection: {
    marginTop: 22,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  recentTitleCn: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 3,
  },
  recentList: {
    gap: 8,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 12,
  },
  recentCardPressed: {
    opacity: 0.95,
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
