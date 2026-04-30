import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Flame, Target, Sunrise, ArrowRight, MapPin, UtensilsCrossed, Scroll, Sparkles, Trophy, Star, BookOpen } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import {
  markQuizSolvedToday,
  getCulturalAssets,
  getProvinceConnectionMap,
} from '../utils/culturalAssets';
import { saveWrongAnswer, getReviewSummary } from '../utils/wrongAnswers';
import { checkAndNotifyBadges } from '../utils/badgeUnlock';
import { useBadgeNotification } from '../components/BadgeNotification';
import { getRecommendedNextStep, getRegionBasedRecommendation } from '../utils/recommendations';
import { TYPE_COLORS } from '../utils/contentTypes';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { PaperTexture } from '../components/PaperTexture';
import { StampFeedback } from '../components/StampFeedback';
import { getSolarTermForDate } from '../utils/calendar';
import { quizQuestions } from '../data/quiz';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';
import { calculateTotalXP, getXPLevel, getUnlockedBadges } from '../data/badges';
import { XP_CONFIG } from '../config/constants';

export function CalendarScreen() {
  const navigation = useNavigation();
  const { showBadgeUnlock } = useBadgeNotification();
  const { colors, isDark } = useTheme();
  const now = useMemo(() => new Date(), []);
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

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const rewardPulse = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const starRotate = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [solved, setSolved] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [loadingDailyState, setLoadingDailyState] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [userStats, setUserStats] = useState(null);
  const [reviewSummary, setReviewSummary] = useState(null);
  const dailyQuestion = useMemo(() => {
    const index = now.getDate() % quizQuestions.length;
    return quizQuestions[index];
  }, [now]);

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: theme.motion.durationSlow,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: theme.motion.durationSlow,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
      fadeIn.stopAnimation();
      slide.stopAnimation();
    };
  }, [fadeIn, slide]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const assets = await getCulturalAssets();
        if (!cancelled) {
          const today = now.toISOString().slice(0, 10);
          const solvedToday = Boolean(assets?.quiz?.solvedByDate?.[today]);
          setSelectedIndex(solvedToday ? dailyQuestion.correctIndex : null);
          setSolved(solvedToday);
          setStreakCount(assets?.quiz?.streak ?? 0);
          setTotalSolved(assets?.quiz?.totalSolved ?? 0);

          // Calculate user stats for XP
          const connectionMap = getProvinceConnectionMap({
            favorites: assets?.favorites,
            cities,
            recipes,
            dynasties,
          });
          const stats = {
            quizStreak: assets?.quiz?.streak ?? 0,
            quizTotal: assets?.quiz?.totalSolved ?? 0,
            citiesCollected: assets?.favorites?.cities?.length ?? 0,
            recipesCollected: assets?.favorites?.recipes?.length ?? 0,
            dynastiesCollected: assets?.favorites?.dynasties?.length ?? 0,
            provincesConnected: connectionMap.collectedCount,
            namesGenerated: assets?.stats?.namesGenerated ?? 0,
            namesSaved: assets?.favorites?.names?.length ?? 0,
            usedHistory: true,
            usedFood: true,
            usedPlaces: true,
            usedQuiz: true,
          };
          setUserStats(stats);

          // Load review summary
          const summary = await getReviewSummary();
          if (!cancelled) setReviewSummary(summary);
        }
      } catch {
        // ignore storage issues
      } finally {
        if (!cancelled) setLoadingDailyState(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [now, dailyQuestion.correctIndex]);

  async function handleChoice(index) {
    if (selectedIndex !== null) return;
    const correct = index === dailyQuestion.correctIndex;
    setSelectedIndex(index);
    setSolved(correct);
    if (correct) {
      setStreakCount((prev) => prev + 1);
      setTotalSolved((prev) => prev + 1);

      // Trigger celebration
      setShowCelebration(true);
      setXpGained(XP_CONFIG.QUIZ_CORRECT_BASE); // Base XP for correct answer

      // Animate celebration
      Animated.parallel([
        Animated.sequence([
          Animated.timing(rewardPulse, { toValue: 1, duration: theme.motion.durationFast, useNativeDriver: true }),
          Animated.timing(rewardPulse, { toValue: 0, duration: theme.motion.durationFast, useNativeDriver: true }),
        ]),
        Animated.spring(celebrationScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(starRotate, {
          toValue: 1,
          duration: theme.motion.durationSlow * 2,
          useNativeDriver: true,
        }),
      ]).start();

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      await markQuizSolvedToday({ solved: true }).catch(() => {});

      // Check for newly unlocked badges
      if (userStats && showBadgeUnlock) {
        const newBadges = await checkAndNotifyBadges(userStats, showBadgeUnlock);
        if (newBadges.length > 0) {
          // Add bonus XP for new badge
          setXpGained((prev) => prev + newBadges.reduce((sum, b) => sum + b.xp, 0));
        }
      }
    } else {
      // Save wrong answer for review
      await saveWrongAnswer(dailyQuestion);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      await markQuizSolvedToday({ solved: false }).catch(() => {});
    }
    await Haptics.selectionAsync().catch(() => {});
  }

  function getRecommendedNextStepLocal() {
    if (!userStats) return null;

    // Use shared recommendation logic
    const recommendation = getRecommendedNextStep({
      solvedToday: true, // Already solved, so skip quiz recommendation
      citiesCollected: userStats.citiesCollected,
      recipesCollected: userStats.recipesCollected,
      dynastiesCollected: userStats.dynastiesCollected,
    });

    // Override with region-based suggestion if available
    if (dailyQuestion.region) {
      const regionRec = getRegionBasedRecommendation(dailyQuestion.region);
      return {
        ...regionRec,
        priority: recommendation?.priority || 'low',
      };
    }

    return recommendation;
  }

  const nextStep = getRecommendedNextStepLocal();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
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
              <View style={[styles.statusBadge, solved && styles.statusBadgeDone, { backgroundColor: solved ? colors.goldLeaf : colors.cinnabarGlow }]}>
                {loadingDailyState ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={[styles.statusBadgeText, solved && styles.statusBadgeTextDone, { color: solved ? colors.success : colors.primary }]}>
                    {solved ? 'Done' : 'Pending'}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.dateRow}>
              <Text style={[styles.statusTitleZh, { color: colors.text }]}>{monthLabelZh}{dayLabel}日</Text>
              <Text style={[styles.statusTitle, { color: colors.mutedText }]}>{monthLabel} {dayLabel}</Text>
            </View>
            <View style={styles.solarTermRow}>
              <Text style={[styles.solarTermZh, { color: colors.primary }]}>{solarTerm.nameZh}</Text>
              <Text style={[styles.solarTermEn, { color: colors.mutedText }]}>{solarTerm.nameEn}</Text>
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
          <Text style={styles.dailyQuestion}>{dailyQuestion.question}</Text>
          <View style={styles.choiceWrap}>
            {dailyQuestion.options.map((option, index) => {
              const isCorrect = solved && index === dailyQuestion.correctIndex;
              const isWrong = selectedIndex === index && selectedIndex !== null && !isCorrect;
              return (
                <Pressable
                  key={option}
                  style={[styles.choiceBtn, isCorrect && styles.choiceBtnCorrect]}
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
                  {isWrong ? <View style={styles.wrongTint} /> : null}
                </Pressable>
              );
            })}
          </View>
          {selectedIndex !== null ? (
            <Animated.View style={{ opacity: rewardPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] }) }}>
              <Text style={styles.explanation}>{dailyQuestion.explanation}</Text>
              {solved ? <StampFeedback label="Correct" active={true} style={styles.stampFeedback} tone="gold" /> : null}
            </Animated.View>
          ) : null}
        </Animated.View>

        {/* Celebration & Next Step Guidance */}
        {showCelebration && solved && (
          <Animated.View style={[
            styles.celebrationCard,
            {
              opacity: celebrationScale,
              transform: [{ scale: celebrationScale }],
            }
          ]}>
            <View style={styles.celebrationHeader}>
              <Animated.View style={{
                transform: [{
                  rotate: starRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              }}>
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
        {selectedIndex !== null && !solved && (
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
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
  solarTermZh: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: theme.typography.hanziLetterSpacing * 0.3,
  },
  solarTermEn: {
    color: theme.colors.mutedText,
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
  wrongTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(51, 51, 51, 0.04)',
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

  // Celebration Card
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

  // Encouragement Card
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
});
