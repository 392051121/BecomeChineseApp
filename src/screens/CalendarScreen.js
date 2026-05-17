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
import { Flame, Target, Sunrise, ArrowRight, Sparkles, Star, BookOpen, Zap, Check, X } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { useDailyQuiz } from '../hooks/useDailyQuiz';
import { useUserProgress } from '../hooks/useUserProgress';
import { useCelebrationAnimation } from '../hooks/useCelebrationAnimation';
import { useRecommendation } from '../hooks/useRecommendation';
import { getReviewSummary } from '../utils/wrongAnswers';
import { checkAndNotifyBadges } from '../utils/badgeUnlock';
import { useBadgeNotification } from '../components/BadgeNotification';
import { TYPE_COLORS } from '../utils/contentTypes';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from '../components/PaperTexture';
import { StampFeedback } from '../components/StampFeedback';
import { getSolarTermForDate } from '../utils/calendar';

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

  // Date labels
  const solarTerm = useMemo(() => getSolarTermForDate(now), [now]);
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerMonth, { color: colors.text }]}>{monthLabel}</Text>
          <Text style={[styles.headerBrand, { fontFamily: serifFont, color: colors.text }]}>Daily Ritual</Text>
          <Text style={[styles.headerYear, { color: colors.text }]}>{yearLabel}</Text>
        </View>

        <View style={[styles.heroCard, { backgroundColor: colors.softCard, borderColor: colors.borderAccent }]}>
          <PaperTexture />

          <View style={styles.heroInner}>
            <View style={styles.statusTopRow}>
              <View style={styles.statusLabelWrap}>
                <Sunrise size={14} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.statusLabel, { color: colors.primary }]}>Today</Text>
              </View>
              <View style={[styles.statusBadge, answeredCorrectly && styles.statusBadgeDone, { backgroundColor: answeredCorrectly ? colors.goldLeaf : colors.cinnabarGlow }]}>
                {loadingDailyState ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={[styles.statusBadgeText, answeredCorrectly && styles.statusBadgeTextDone, { color: answeredCorrectly ? colors.success : colors.primary }]}>
                    {attemptedToday ? (answeredCorrectly ? 'Done' : 'Reviewed') : 'Pending'}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.dateRow}>
              <Text style={[styles.statusTitleZh, { color: colors.text }]}>{monthLabelZh}{dayLabel}日</Text>
              <Text style={[styles.statusTitle, { color: colors.mutedText }]}>{monthLabel} {dayLabel}</Text>
            </View>
            <View style={styles.solarTermRow}>
              <Text style={[styles.solarTermEn, { color: colors.text }]}>{solarTerm.nameEn}</Text>
              <Text style={[styles.solarTermZh, { color: colors.primary }]}>{solarTerm.nameZh}</Text>
            </View>
            <Text style={[styles.statusYear, { color: colors.mutedText }]}>{yearLabel}</Text>
            <View style={styles.statusStatsRow}>
              <View style={[styles.statusStat, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Flame size={14} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.statusStatValue, { color: colors.text }]}>{streakCount}</Text>
                <Text style={[styles.statusStatLabel, { color: colors.mutedText }]}>Streak</Text>
              </View>
              <View style={[styles.statusStat, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Target size={14} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.statusStatValue, { color: colors.text }]}>{totalSolved}</Text>
                <Text style={[styles.statusStatLabel, { color: colors.mutedText }]}>Solved</Text>
              </View>
              {reviewSummary && reviewSummary.pending > 0 && (
                <Pressable
                  style={styles.reviewStat}
                  onPress={() => navigation.navigate('WrongAnswerReview')}
                  accessibilityRole="button"
                  accessibilityLabel={`${reviewSummary.pending} questions to review`}
                  accessibilityHint="Double tap to review wrong answers"
                >
                  <BookOpen size={14} color={TYPE_COLORS.dynasty} strokeWidth={2} />
                  <Text style={styles.reviewStatValue}>{reviewSummary.pending}</Text>
                  <Text style={styles.reviewStatLabel}>Review</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        <Animated.View style={[styles.dailyCard, { opacity: fadeIn, transform: [{ translateY: slide }] }]}>
          <Text style={styles.dailyLabel}>Daily Question</Text>
          <Text style={styles.dailyQuestion}>{dailyQuestion?.question}</Text>
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
              <Text style={styles.celebrationTitle}>Excellent!</Text>
              <Text style={styles.celebrationTitleCn}>太棒了</Text>
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

            {nextStep && (
              <Pressable
                style={styles.nextStepCard}
                onPress={() => navigation.navigate(nextStep.screen)}
                accessibilityRole="button"
                accessibilityLabel={`Next step: ${nextStep.label} - ${nextStep.labelCn}`}
                accessibilityHint={`Double tap to ${nextStep.reason}`}
              >
                <View style={styles.nextStepIconWrap}>
                  <nextStep.icon size={20} color={theme.colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.nextStepContent}>
                  <Text style={styles.nextStepLabel}>{nextStep.label}</Text>
                  <Text style={styles.nextStepLabelCn}>{nextStep.labelCn}</Text>
                  <Text style={styles.nextStepReason}>{nextStep.reason}</Text>
                </View>
                <ArrowRight size={16} color={theme.colors.primary} strokeWidth={2} />
              </Pressable>
            )}

            <View style={styles.celebrationActions}>
              <Pressable
                style={styles.continueBtn}
                onPress={() => navigation.getParent()?.navigate('Home')}
                accessibilityRole="button"
                accessibilityLabel="Back to Home"
                accessibilityHint="Double tap to return to home screen"
              >
                <Text style={styles.continueBtnText}>Back to Home</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Wrong answer encouragement */}
        {selectedIndex !== null && !answeredCorrectly && (
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
            {nextStep && (
              <Pressable
                style={styles.encourageExploreBtn}
                onPress={() => navigation.navigate(nextStep.screen)}
                accessibilityRole="button"
                accessibilityLabel={`Explore ${nextStep.screen}`}
                accessibilityHint="Double tap to continue learning"
              >
                <nextStep.icon size={16} color={theme.colors.primary} strokeWidth={2} />
                <Text style={styles.encourageExploreText}>Explore {nextStep.screen}</Text>
                <ArrowRight size={14} color={theme.colors.primary} strokeWidth={2} />
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* Infinite Quiz Mode Entry */}
        <View style={styles.infiniteQuizCard}>
          <View style={styles.infiniteQuizHeader}>
            <Zap size={20} color={colors.primary} strokeWidth={2} />
            <Text style={styles.infiniteQuizTitle}>Infinite Challenge</Text>
            <Text style={styles.infiniteQuizTitleCn}>无限挑战</Text>
          </View>
          <Text style={styles.infiniteQuizDesc}>
            How many can you answer correctly in a row? Build combos for bonus XP!
          </Text>
          <Pressable
            style={({ pressed }) => [styles.infiniteQuizBtn, pressed && styles.infiniteQuizBtnPressed]}
            onPress={() => navigation.navigate('InfiniteQuiz')}
            accessibilityRole="button"
            accessibilityLabel="Start Infinite Quiz Challenge"
            accessibilityHint="Double tap to start endless quiz mode"
          >
            <Text style={styles.infiniteQuizBtnText}>Start Challenge</Text>
            <ArrowRight size={14} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>
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
  heroCard: {
    minHeight: 280,
    backgroundColor: theme.colors.softCard,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
    overflow: 'hidden',
    ...theme.shadows.strong,
  },
  heroInner: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  statusTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  statusBadge: {
    backgroundColor: theme.colors.cinnabarGlow,
    borderWidth: 0.5,
    borderColor: theme.colors.borderAccent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusBadgeDone: {
    backgroundColor: theme.colors.goldLeaf,
    borderColor: 'rgba(184, 115, 51, 0.30)',
  },
  statusBadgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadgeTextDone: {
    color: theme.colors.success,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  statusTitleZh: {
    color: theme.colors.text,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: theme.typography.hanziLetterSpacing * 0.5,
  },
  statusTitle: {
    color: theme.colors.mutedText,
    fontSize: 16,
    fontWeight: '600',
  },
  solarTermRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 8,
  },
  solarTermEn: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  solarTermZh: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  statusYear: {
    marginTop: 6,
    color: theme.colors.mutedText,
    fontSize: 12,
    letterSpacing: 0.8,
  },
  statusStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  statusStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusStatValue: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  statusStatLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  reviewStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: TYPE_COLORS.dynasty,
    backgroundColor: 'rgba(179, 59, 36, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  reviewStatValue: {
    color: TYPE_COLORS.dynasty,
    fontSize: 16,
    fontWeight: '800',
  },
  reviewStatLabel: {
    color: TYPE_COLORS.dynasty,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  dailyCard: {
    marginTop: 14,
    borderRadius: theme.radii.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...theme.shadows.subtle,
  },
  dailyLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  dailyQuestion: {
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
  nextStepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 14,
  },
  nextStepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.cinnabarGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepLabel: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  nextStepLabelCn: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  nextStepReason: {
    color: theme.colors.mutedText,
    fontSize: 11,
    marginTop: 2,
  },
  celebrationActions: {
    marginTop: 16,
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
  encourageExploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    backgroundColor: theme.colors.cinnabarGlow,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  encourageExploreText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  infiniteQuizCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infiniteQuizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infiniteQuizTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  infiniteQuizTitleCn: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  infiniteQuizDesc: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.mutedText,
    lineHeight: 18,
  },
  infiniteQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 999,
  },
  infiniteQuizBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  infiniteQuizBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});