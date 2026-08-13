import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Flame, Target, Sunrise, ArrowRight, Sparkles, Star, BookOpen, Zap, Check, X, Leaf, UtensilsCrossed, Map, CalendarDays } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { useDailyQuiz } from '../hooks/useDailyQuiz';
import { useUserProgress } from '../hooks/useUserProgress';
import { useCelebrationAnimation } from '../hooks/useCelebrationAnimation';
import { useRecommendation } from '../hooks/useRecommendation';
import { getReviewSummary } from '../utils/wrongAnswers';
import { checkAndNotifyBadges } from '../utils/badgeUnlock';
import { useBadgeNotification } from '../components/BadgeNotification';
import { TYPE_COLORS, getTypeScreen } from '../utils/contentTypes';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from '../components/PaperTexture';
import { StampFeedback } from '../components/StampFeedback';
import { getSolarTermForDate } from '../utils/calendar';
import { getCurrentSolarTerm, getSolarTermById, solarTerms } from '../data/solarTerms';
import { getBeginnerNote } from '../utils/culturalContext';
import { SectionCard } from '../components/SectionCard';
import { ExploreNextSection } from '../components/ExploreNextSection';
import { navigateApp } from '../utils/navigation';

export function CalendarScreen() {
  const navigation = useNavigation();
  const { showBadgeUnlock } = useBadgeNotification();
  const { colors } = useTheme();

  // Date state - refreshed on focus to handle midnight crossover
  const [currentDate, setCurrentDate] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      setCurrentDate(new Date());
    }, [])
  );

  const now = currentDate;

  // Custom hooks for business logic
  const {
    dailyQuestion,
    selectedIndex,
    attemptedToday,
    answeredCorrectly,
    streakCount,
    totalSolved,
    loading: loadingDailyState,
    isSubmitting,
    loadDailyState,
    submitAnswer,
  } = useDailyQuiz(now);

  const {
    userStats,
    loadUserStats,
    updateStats,
  } = useUserProgress();

  const {
    fadeIn,
    slide,
    celebrationOpacity,
    celebrationTransform,
    starRotateTransform,
    rewardPulseOpacity,
    startEntranceAnimation,
    triggerCelebration,
  } = useCelebrationAnimation();

  const { nextStep } = useRecommendation({
    userStats,
    attemptedToday,
    dailyQuestion,
  });

  // Local state
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  // Toggle the "All 24 Solar Terms" grid between the current season's terms
  // and the full 24-term Chinese calendar.
  const [showAllTerms, setShowAllTerms] = useState(false);

  // Get enriched solar term data
  const solarTermBasic = useMemo(() => getSolarTermForDate(now), [now]);
  const solarTerm = useMemo(() => {
    const enriched = getCurrentSolarTerm(now);
    return enriched || {
      id: solarTermBasic.id,
      englishName: solarTermBasic.nameEn,
      chineseName: solarTermBasic.nameZh,
      pinyin: '',
      meaning: solarTermBasic.nameEn,
      natureChange: '',
      custom: '',
      food: [],
      beginnerNote: getBeginnerNote('season'),
      dailyAction: 'Notice one seasonal change around you.',
      relatedContent: [],
    };
  }, [now, solarTermBasic]);

  // Date labels
  const monthLabel = useMemo(
    () => now.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
    [now]
  );
  const monthLabelZh = useMemo(() => {
    const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    return months[now.getMonth()] + '月';
  }, [now]);
  const yearLabel = useMemo(() => String(now.getFullYear()), [now]);
  const dayLabel = useMemo(() => String(now.getDate()), [now]);

  const serifFont = useMemo(
    () =>
      Platform.select({
        ios: 'Georgia',
        android: 'serif',
        default: 'serif',
      }),
    []
  );

  // Entrance animation
  useEffect(() => {
    const cleanup = startEntranceAnimation();
    return cleanup;
  }, [startEntranceAnimation]);

  // Load initial data
  useEffect(() => {
    let cancelled = false;

    (async () => {
      await loadDailyState();
      await loadUserStats();

      const summary = await getReviewSummary();
      if (!cancelled) setReviewSummary(summary);
    })();

    return () => {
      cancelled = true;
    };
  }, [now, loadDailyState, loadUserStats]);

  // Handle answer submission
  async function handleChoice(index) {
    if (selectedIndex !== null || isSubmitting) return;

    const result = await submitAnswer(index, async ({ correct, xpGained: xp, newStreak, newTotal }) => {
      if (correct) {
        setShowCelebration(true);
        setXpGained(xp);
        triggerCelebration();

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

        // Update stats for badge checking
        updateStats({ quizStreak: newStreak, quizTotal: newTotal });

        // Check for newly unlocked badges
        if (showBadgeUnlock && userStats) {
          const freshStats = {
            ...userStats,
            quizStreak: newStreak,
            quizTotal: newTotal,
          };
          const newBadges = await checkAndNotifyBadges(freshStats, showBadgeUnlock);
          if (newBadges.length > 0) {
            setXpGained((prev) => prev + newBadges.reduce((sum, b) => sum + b.xp, 0));
          }
        }
      }
    });

    if (!result.correct) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }

    await Haptics.selectionAsync().catch(() => {});
  }

  // Get season color
  const seasonColor = useMemo(() => {
    switch (solarTerm.season) {
      case 'spring': return '#6F8F72'; // Bamboo Green
      case 'summer': return '#C49A4A'; // Muted Gold
      case 'autumn': return '#8A6A4F'; // Tea Brown
      case 'winter': return '#5F8FA8'; // Lake Blue
      default: return colors.primary;
    }
  }, [solarTerm.season, colors.primary]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerMonth, { color: colors.text }]}>{monthLabel}</Text>
          <Text style={[styles.headerBrand, { fontFamily: serifFont, color: colors.text }]}>Seasonal Note</Text>
          <Text style={[styles.headerYear, { color: colors.text }]}>{yearLabel}</Text>
        </View>

        {/* Main Seasonal Card - The Hero */}
        <View style={[styles.seasonalHeroCard, { backgroundColor: colors.softCard, borderColor: colors.borderAccent }]}>
          <PaperTexture />

          <View style={styles.seasonalHeroInner}>
            {/* Date Display */}
            <View style={styles.seasonalDateRow}>
              <View style={styles.seasonalDateLeft}>
                <Text style={[styles.seasonalMonthZh, { color: colors.text }]}>{monthLabelZh}</Text>
                <Text style={[styles.seasonalDay, { color: colors.text }]}>{dayLabel}</Text>
              </View>
              <View style={styles.seasonalDateRight}>
                <Text style={[styles.seasonalTermEn, { color: colors.text }]}>{solarTerm.englishName}</Text>
                <Text style={[styles.seasonalTermZh, { color: seasonColor }]}>{solarTerm.chineseName}</Text>
                {!!solarTerm.pinyin && (
                  <Text style={[styles.seasonalPinyin, { color: colors.mutedText }]}>{solarTerm.pinyin}</Text>
                )}
              </View>
            </View>

            {/* Meaning */}
            <View style={styles.seasonalMeaningBox}>
              <Text style={[styles.seasonalMeaning, { color: colors.text }]}>{solarTerm.meaning}</Text>
            </View>

            {/* Nature Change */}
            {!!solarTerm.natureChange && (
              <View style={[styles.seasonalSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.seasonalSectionHeader}>
                  <Leaf size={16} color={seasonColor} strokeWidth={2} />
                  <Text style={[styles.seasonalSectionTitle, { color: seasonColor }]}>Nature</Text>
                </View>
                <Text style={[styles.seasonalSectionText, { color: colors.mutedText }]}>{solarTerm.natureChange}</Text>
              </View>
            )}

            {/* Custom */}
            {!!solarTerm.custom && (
              <View style={[styles.seasonalSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.seasonalSectionHeader}>
                  <Sparkles size={16} color={seasonColor} strokeWidth={2} />
                  <Text style={[styles.seasonalSectionTitle, { color: seasonColor }]}>Custom</Text>
                </View>
                <Text style={[styles.seasonalSectionText, { color: colors.mutedText }]}>{solarTerm.custom}</Text>
              </View>
            )}

            {/* Food */}
            {solarTerm.food && solarTerm.food.length > 0 && (
              <View style={[styles.seasonalSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.seasonalSectionHeader}>
                  <UtensilsCrossed size={16} color={seasonColor} strokeWidth={2} />
                  <Text style={[styles.seasonalSectionTitle, { color: seasonColor }]}>Seasonal Food</Text>
                </View>
                <View style={styles.seasonalFoodTags}>
                  {solarTerm.food.map((food, index) => (
                    <View key={index} style={[styles.seasonalFoodTag, { backgroundColor: colors.cinnabarGlow }]}>
                      <Text style={[styles.seasonalFoodTagText, { color: colors.primary }]}>{food}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Daily Action */}
            <View style={[styles.dailyActionCard, { backgroundColor: `${seasonColor}15`, borderColor: seasonColor }]}>
              <Text style={[styles.dailyActionLabel, { color: seasonColor }]}>Today's Gentle Action</Text>
              <Text style={[styles.dailyActionText, { color: colors.text }]}>{solarTerm.dailyAction}</Text>
            </View>

            {/* Beginner Note */}
            <Text style={[styles.beginnerNote, { color: colors.mutedText }]}>{solarTerm.beginnerNote}</Text>
          </View>
        </View>

        {/* Related Content */}
        {solarTerm.relatedContent && solarTerm.relatedContent.length > 0 && (
          <SectionCard style={styles.relatedSection} tone="soft">
            <Text style={[styles.relatedTitle, { color: colors.text }]}>Explore This Season</Text>
            <View style={styles.relatedItems}>
              {solarTerm.relatedContent.slice(0, 3).map((item, index) => (
                <Pressable
                  key={index}
                  style={[styles.relatedItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => {
                    const screen = getTypeScreen(item.type);
                    // Deep-link into a dedicated detail route when one exists,
                    // otherwise land on the tab (matches ExploreNextSection).
                    if (item.type === 'dynasty' && screen === 'History') {
                      navigateApp(navigation, 'History', {
                        screen: 'DynastyDetail',
                        params: { dynastyId: item.id },
                      });
                      return;
                    }
                    if (item.type === 'person' && screen === 'History') {
                      navigateApp(navigation, 'History', {
                        screen: 'PersonDetail',
                        params: { personId: item.id },
                      });
                      return;
                    }
                    if (item.type === 'recipe' && screen === 'Food') {
                      navigateApp(navigation, 'Food', { recipeId: item.id });
                      return;
                    }
                    if (item.type === 'city' && screen === 'Places') {
                      navigateApp(navigation, 'Places', { cityId: item.id });
                      return;
                    }
                    navigateApp(navigation, screen);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={item.reason}
                >
                  <View style={styles.relatedItemContent}>
                    <Text style={[styles.relatedItemReason, { color: colors.mutedText }]}>{item.reason}</Text>
                  </View>
                  <ArrowRight size={14} color={colors.mutedText} strokeWidth={2} />
                </Pressable>
              ))}
            </View>
          </SectionCard>
        )}

        {/* Browse All Solar Terms */}
        <SectionCard style={styles.browseTermsSection} tone="soft">
          <View style={styles.browseTermsHeader}>
            <CalendarDays size={16} color={seasonColor} strokeWidth={2} />
            <Text style={[styles.browseTermsTitle, { color: colors.primary }]}>All 24 Solar Terms</Text>
          </View>
          <Text style={[styles.browseTermsHint, { color: colors.mutedText }]}>
            Explore the full Chinese calendar through seasonal changes
          </Text>
          <View style={styles.termsGrid}>
            {(showAllTerms ? solarTerms : solarTerms.filter(t => t.season === solarTerm.season)).map((term) => (
              <Pressable
                key={term.id}
                style={({ pressed }) => [
                  styles.termCard,
                  { backgroundColor: colors.card, borderColor: term.id === solarTerm.id ? seasonColor : colors.border },
                  pressed && styles.termCardPressed,
                ]}
                onPress={() => navigation.navigate('SolarTermDetail', { termId: term.id })}
                accessibilityRole="button"
                accessibilityLabel={`${term.englishName} - ${term.chineseName}`}
              >
                <Text style={[styles.termNumber, { color: seasonColor }]}>#{term.order}</Text>
                <Text style={[styles.termNameEn, { color: colors.text }]} numberOfLines={1}>{term.englishName}</Text>
                <Text style={[styles.termNameZh, { color: seasonColor }]} numberOfLines={1}>{term.chineseName}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={({ pressed }) => [styles.browseAllBtn, { backgroundColor: `${seasonColor}15` }, pressed && styles.browseAllBtnPressed]}
            onPress={() => setShowAllTerms((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={showAllTerms ? 'Show only terms for the current season' : 'Browse all 24 solar terms'}
            accessibilityState={{ expanded: showAllTerms }}
          >
            <CalendarDays size={14} color={seasonColor} strokeWidth={2} />
            <Text style={[styles.browseAllText, { color: seasonColor }]}>
              {showAllTerms ? 'Show current season' : 'View all 24 terms'}
            </Text>
            <ArrowRight size={12} color={seasonColor} strokeWidth={2} />
          </Pressable>
        </SectionCard>

        {/* Optional Mini Quiz - Collapsed by default */}
        <Pressable
          style={[styles.quizToggleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowQuiz(!showQuiz)}
          accessibilityRole="button"
          accessibilityLabel={showQuiz ? "Hide daily quiz" : "Show daily quiz"}
        >
          <View style={styles.quizToggleHeader}>
            <View style={styles.quizToggleLeft}>
              <Zap size={18} color={colors.primary} strokeWidth={2} />
              <View>
                <Text style={[styles.quizToggleTitle, { color: colors.text }]}>Optional Quiz</Text>
                <Text style={[styles.quizToggleSubtitle, { color: colors.mutedText }]}>
                  {showQuiz ? 'Tap to hide' : 'Test your knowledge'}
                </Text>
              </View>
            </View>
            <View style={styles.quizToggleStats}>
              <View style={styles.quizStatItem}>
                <Flame size={12} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.quizStatValue, { color: colors.text }]}>{streakCount}</Text>
              </View>
              <View style={styles.quizStatItem}>
                <Target size={12} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.quizStatValue, { color: colors.text }]}>{totalSolved}</Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* Quiz Content - Only shown when expanded */}
        {showQuiz && (
          <Animated.View style={[styles.quizCard, { opacity: fadeIn, transform: [{ translateY: slide }] }]}>
            <Text style={styles.quizLabel}>Daily Question</Text>
            <Text style={styles.quizQuestion}>{dailyQuestion?.question}</Text>
            <View style={styles.choiceWrap}>
              {dailyQuestion?.options?.map((option, index) => {
                const isCorrect = selectedIndex !== null && index === dailyQuestion.correctIndex;
                const isWrong = selectedIndex === index && selectedIndex !== null && index !== dailyQuestion.correctIndex;
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.choiceBtn,
                      isCorrect && styles.choiceBtnCorrect,
                      isWrong && styles.choiceBtnWrong,
                    ]}
                    onPress={() => handleChoice(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`Option ${['A', 'B', 'C', 'D'][index]}: ${option}`}
                    accessibilityHint={selectedIndex !== null ? "Answer already submitted" : "Double tap to select this answer"}
                    disabled={selectedIndex !== null}
                  >
                    <View style={styles.choiceLetterWrap}>
                      <Text style={styles.choiceLetter}>{['A', 'B', 'C', 'D'][index]}</Text>
                    </View>
                    <Text style={styles.choiceText}>{option}</Text>
                    {isCorrect && <Check size={18} color={theme.colors.success} strokeWidth={2.5} />}
                    {isWrong && <X size={18} color={theme.colors.error} strokeWidth={2.5} />}
                  </Pressable>
                );
              })}
            </View>
            {selectedIndex !== null && dailyQuestion ? (
              <Animated.View style={{ opacity: rewardPulseOpacity }}>
                <Text style={styles.explanation}>{dailyQuestion.explanation}</Text>
                <StampFeedback
                  label={answeredCorrectly ? "Correct" : "Wrong"}
                  active={true}
                  style={styles.stampFeedback}
                  tone={answeredCorrectly ? "gold" : "error"}
                />
              </Animated.View>
            ) : null}
          </Animated.View>
        )}

        {/* Celebration Card */}
        {showCelebration && answeredCorrectly && (
          <Animated.View style={[
            styles.celebrationCard,
            {
              opacity: celebrationOpacity,
              transform: celebrationTransform,
            }
          ]}>
            <View style={styles.celebrationHeader}>
              <Animated.View style={{ transform: [{ rotate: starRotateTransform }] }}>
                <Star size={28} color={theme.colors.primary} strokeWidth={2} fill={theme.colors.primary} />
              </Animated.View>
              <Text style={styles.celebrationTitle}>Well Done!</Text>
              <Text style={styles.celebrationTitleCn}>做得好</Text>
            </View>

            <View style={styles.xpGainRow}>
              <View style={styles.xpGainPill}>
                <Sparkles size={14} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.xpGainText}>+{xpGained} XP</Text>
              </View>
              {streakCount > 1 && (
                <View style={styles.streakPill}>
                  <Flame size={14} color="#E2B05E" strokeWidth={2} />
                  <Text style={styles.streakPillText}>{streakCount} day streak!</Text>
                </View>
              )}
            </View>

            <View style={styles.celebrationActions}>
              <Pressable
                style={styles.continueBtn}
                onPress={() => {
                  setShowCelebration(false);
                  setShowQuiz(false);
                }}
                accessibilityRole="button"
                accessibilityLabel="Continue"
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Wrong answer encouragement */}
        {showQuiz && selectedIndex !== null && !answeredCorrectly && (
          <Animated.View style={[
            styles.encouragementCard,
            {
              opacity: fadeIn,
              transform: [{ translateY: slide }],
            }
          ]}>
            <Text style={styles.encouragementTitle}>Keep Going!</Text>
            <Text style={styles.encouragementTitleCn}>继续加油</Text>
            <Text style={styles.encouragementText}>
              Every question teaches something new. Try again tomorrow!
            </Text>
          </Animated.View>
        )}

        {/* Review Prompt - Only if there are wrong answers */}
        {reviewSummary && reviewSummary.pending > 0 && (
          <Pressable
            style={[styles.reviewPromptCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('WrongAnswerReview')}
            accessibilityRole="button"
            accessibilityLabel={`${reviewSummary.pending} questions to review`}
          >
            <View style={styles.reviewPromptLeft}>
              <View style={[styles.reviewPromptIcon, { backgroundColor: colors.cinnabarGlow }]}>
                <BookOpen size={16} color={colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.reviewPromptContent}>
                <Text style={[styles.reviewPromptTitle, { color: colors.text }]}>Review Wrong Answers</Text>
                <Text style={[styles.reviewPromptHint, { color: colors.mutedText }]}>
                  {reviewSummary.pending} questions waiting
                </Text>
              </View>
            </View>
            <ArrowRight size={16} color={colors.mutedText} strokeWidth={2} />
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMonth: {
    position: 'absolute',
    left: 0,
    top: 12,
    color: theme.colors.text,
    fontSize: 11,
    letterSpacing: 2.0,
    fontWeight: '700',
    opacity: 0.85,
  },
  headerYear: {
    position: 'absolute',
    right: 0,
    top: 12,
    color: theme.colors.text,
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '700',
    opacity: 0.68,
  },
  headerBrand: {
    color: theme.colors.text,
    fontSize: 22,
    letterSpacing: theme.typography.hanziLetterSpacing * 0.5,
    fontWeight: '600',
  },

  // Seasonal Hero Card
  seasonalHeroCard: {
    backgroundColor: theme.colors.softCard,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  seasonalHeroInner: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  seasonalDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  seasonalDateLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  seasonalMonthZh: {
    fontSize: 14,
    fontWeight: '600',
  },
  seasonalDay: {
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 50,
  },
  seasonalDateRight: {
    flex: 1,
  },
  seasonalTermEn: {
    fontSize: 22,
    fontWeight: '800',
  },
  seasonalTermZh: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  seasonalPinyin: {
    fontSize: 12,
    marginTop: 2,
  },
  seasonalMeaningBox: {
    marginTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  seasonalMeaning: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },

  // Seasonal Sections
  seasonalSection: {
    marginTop: 12,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 12,
  },
  seasonalSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  seasonalSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  seasonalSectionText: {
    fontSize: 13,
    lineHeight: 20,
  },
  seasonalFoodTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  seasonalFoodTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  seasonalFoodTagText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Daily Action
  dailyActionCard: {
    marginTop: 16,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    padding: 14,
  },
  dailyActionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dailyActionText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  beginnerNote: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // Related Section
  relatedSection: {
    marginTop: 14,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  relatedItems: {
    gap: 8,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 12,
  },
  relatedItemContent: {
    flex: 1,
  },
  relatedItemReason: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Quiz Toggle
  quizToggleCard: {
    marginTop: 14,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    padding: 14,
    ...theme.shadows.subtle,
  },
  quizToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quizToggleTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  quizToggleSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  quizToggleStats: {
    flexDirection: 'row',
    gap: 12,
  },
  quizStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quizStatValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Quiz Content
  quizCard: {
    marginTop: 8,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quizLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  quizQuestion: {
    marginTop: 10,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  choiceWrap: {
    marginTop: 14,
    gap: 10,
  },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  choiceBtnCorrect: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.goldLeaf,
  },
  choiceBtnWrong: {
    borderColor: theme.colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  choiceLetterWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLetter: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  choiceText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  explanation: {
    marginTop: 14,
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 20,
  },
  stampFeedback: {
    marginTop: 12,
    alignItems: 'center',
  },

  // Celebration
  celebrationCard: {
    marginTop: 14,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
    backgroundColor: theme.colors.goldLeaf,
    paddingHorizontal: 18,
    paddingVertical: 20,
    ...theme.shadows.strong,
  },
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  celebrationTitle: {
    marginTop: 8,
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  celebrationTitleCn: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  xpGainRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  xpGainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  xpGainText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(226, 176, 94, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  streakPillText: {
    color: '#B88733',
    fontSize: 12,
    fontWeight: '700',
  },
  celebrationActions: {
    marginTop: 8,
    alignItems: 'center',
  },
  continueBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Encouragement
  encouragementCard: {
    marginTop: 14,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 18,
    paddingVertical: 20,
    alignItems: 'center',
    ...theme.shadows.subtle,
  },
  encouragementTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  encouragementTitleCn: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  encouragementText: {
    marginTop: 10,
    color: theme.colors.mutedText,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Review Prompt
  reviewPromptCard: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 14,
  },
  reviewPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reviewPromptIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPromptContent: {
    flex: 1,
  },
  reviewPromptTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewPromptHint: {
    fontSize: 12,
    marginTop: 2,
  },

  // Browse Solar Terms Section
  browseTermsSection: {
    marginTop: 14,
    padding: 16,
    borderRadius: 20,
  },
  browseTermsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  browseTermsTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  browseTermsHint: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  termsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  termCard: {
    width: '31%',
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 10,
    alignItems: 'center',
  },
  termCardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  termNumber: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 4,
  },
  termNameEn: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  termNameZh: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  browseAllBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  browseAllBtnPressed: {
    transform: [{ scale: 0.97 }],
  },
  browseAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
