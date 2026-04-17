import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import {
  markQuizSolvedToday,
  getCulturalAssets,
} from '../utils/culturalAssets';

import { theme } from '../theme/theme';
import { PaperTexture } from '../components/PaperTexture';
import { getSolarTermForDate } from '../utils/calendar';
import { quizQuestions } from '../data/quiz';

export function CalendarScreen() {
  const now = useMemo(() => new Date(), []);
  const solarTerm = useMemo(() => getSolarTermForDate(now), [now]);
  const monthLabel = useMemo(
    () => now.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
    [now]
  );
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
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [solved, setSolved] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [loadingDailyState, setLoadingDailyState] = useState(true);
  const dailyQuestion = useMemo(() => {
    const index = now.getDate() % quizQuestions.length;
    return quizQuestions[index];
  }, [now]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();
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
      Animated.sequence([
        Animated.timing(rewardPulse, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(rewardPulse, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
      await markQuizSolvedToday({ solved: true }).catch(() => {});
    } else {
      await markQuizSolvedToday({ solved: false }).catch(() => {});
    }
    await Haptics.selectionAsync().catch(() => {});
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerMonth}>{monthLabel}</Text>
          <Text style={[styles.headerBrand, { fontFamily: serifFont }]}>Origin China</Text>
          <Text style={styles.headerYear}>{yearLabel}</Text>
        </View>

        <View style={styles.heroCard}>
          <PaperTexture />

          <View style={styles.heroInner}>
            <Text style={styles.gregorianDay}>{dayLabel}</Text>
            <View style={styles.hairline} />

            <Text style={styles.metaLabel}>Lunar Date / 农历</Text>
            <Text style={styles.lunarLine}>
              Third Month, First Day <Text style={styles.lunarCn}>(三月初一)</Text>
            </Text>

            <View style={styles.hairlineSoft} />

            <Text style={styles.metaLabel}>Solar Term / 节气</Text>
            <Animated.Text style={[styles.solarTerm, { opacity: fadeIn }]}>
              {solarTerm.nameEn} <Text style={styles.solarTermCn}>({solarTerm.nameZh})</Text>
            </Animated.Text>

            <Text style={styles.zen}>"{solarTerm.meaningEn}"</Text>
          </View>
        </View>

        <Animated.View style={[styles.dailyCard, { opacity: fadeIn, transform: [{ translateY: slide }] }]}>
          <Text style={styles.dailyLabel}>Today’s Season</Text>
          <Text style={styles.dailyHelper}>Answer one China-focused question a day and track your local progress.</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakText}>Streak {streakCount}</Text>
            <Text style={styles.streakText}>Solved {totalSolved}</Text>
          </View>
          <Text style={styles.dailyQuestion}>{dailyQuestion.question}</Text>
          <View style={styles.choiceWrap}>
            {dailyQuestion.options.map((option, index) => {
              const isCorrect = solved && index === dailyQuestion.correctIndex;
              const isWrong = selectedIndex === index && selectedIndex !== null && !isCorrect;
              return (
                <Pressable key={option} style={styles.choiceBtn} onPress={() => handleChoice(index)}>
                  <Text style={styles.choiceText}>{option}</Text>
                  {isCorrect ? (
                    <View style={styles.solvedStamp}>
                      <Text style={styles.solvedStampText}>Solved / 已完成</Text>
                    </View>
                  ) : null}
                  {isWrong ? <View style={styles.wrongTint} /> : null}
                </Pressable>
              );
            })}
          </View>
          {selectedIndex !== null ? (
            <Animated.View style={{ opacity: rewardPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] }) }}>
              <Text style={styles.explanation}>{dailyQuestion.explanation}</Text>
            </Animated.View>
          ) : null}
        </Animated.View>
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
    paddingHorizontal: 24,
    paddingTop: 10,
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
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  heroCard: {
    flex: 1,
    minHeight: 460,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  heroInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 22,
    justifyContent: 'flex-start',
  },
  gregorianDay: {
    color: theme.colors.text,
    fontSize: 82,
    lineHeight: 82,
    fontWeight: '600',
    letterSpacing: -1,
  },
  hairline: {
    height: 0.5,
    backgroundColor: theme.colors.border,
    marginTop: 16,
    marginBottom: 16,
  },
  hairlineSoft: {
    height: 0.5,
    backgroundColor: theme.colors.border,
    marginTop: 14,
    marginBottom: 14,
    opacity: 0.7,
  },
  metaLabel: {
    color: theme.colors.text,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.55,
    marginBottom: 8,
    fontWeight: '700',
  },
  lunarLine: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 26.8,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  lunarCn: { opacity: 0.82 },
  solarTerm: {
    color: theme.colors.primary,
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  solarTermCn: { color: theme.colors.primary, opacity: 0.9 },
  zen: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    opacity: 0.82,
    letterSpacing: 0.2,
  },
  dailyCard: {
    marginTop: 12,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dailyLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  dailyHelper: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18.4,
  },
  streakRow: {
    marginTop: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakText: {
    color: theme.colors.mutedText,
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dailyQuestion: {
    marginTop: 6,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  choiceWrap: {
    marginTop: 12,
    gap: 10,
  },
  choiceBtn: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  choiceText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  solvedStamp: {
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(179, 59, 36, 0.22)',
    borderWidth: 0.5,
    borderColor: 'rgba(179, 59, 36, 0.28)',
  },
  solvedStampText: {
    color: '#B33B24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  wrongTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(51, 51, 51, 0.04)',
  },
  explanation: {
    marginTop: 12,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18.4,
  },
});
