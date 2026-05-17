/**
 * useDailyQuiz Hook
 *
 * Manages daily quiz state: question selection, answer submission,
 * streak tracking, and persistence.
 */

import { useState, useMemo, useCallback } from 'react';
import { quizQuestions } from '../data/quiz';
import {
  markQuizSolvedToday,
  getCulturalAssets,
} from '../utils/culturalAssets';
import { saveWrongAnswer } from '../utils/wrongAnswers';
import { XP_CONFIG } from '../config/constants';

/**
 * Get unique daily question index based on date
 * Ensures each day has a unique question across months
 */
export function getDailyQuestionIndex(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return (year * 12 * 31 + month * 31 + day) % quizQuestions.length;
}

/**
 * Get the daily question for a specific date
 */
export function getDailyQuestion(date) {
  const index = getDailyQuestionIndex(date);
  return quizQuestions[index];
}

/**
 * Hook for managing daily quiz state
 */
export function useDailyQuiz(currentDate) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [attemptedToday, setAttemptedToday] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get daily question based on current date
  const dailyQuestion = useMemo(() => getDailyQuestion(currentDate), [currentDate]);

  // Load initial state from storage
  const loadDailyState = useCallback(async () => {
    try {
      const assets = await getCulturalAssets();
      const today = currentDate.toISOString().slice(0, 10);
      const todayRecord = assets?.quiz?.solvedByDate?.[today];
      const attempted = Boolean(todayRecord);
      const correct = todayRecord?.correct === true;

      setSelectedIndex(attempted ? dailyQuestion.correctIndex : null);
      setAttemptedToday(attempted);
      setAnsweredCorrectly(correct);
      setStreakCount(assets?.quiz?.streak ?? 0);
      setTotalSolved(assets?.quiz?.totalSolved ?? 0);

      return { attempted, correct, streak: assets?.quiz?.streak ?? 0 };
    } catch {
      return { attempted: false, correct: false, streak: 0 };
    } finally {
      setLoading(false);
    }
  }, [currentDate, dailyQuestion.correctIndex]);

  // Handle answer submission
  const submitAnswer = useCallback(async (index, onSuccess) => {
    if (selectedIndex !== null || isSubmitting) return { submitted: false };

    setIsSubmitting(true);
    const correct = index === dailyQuestion.correctIndex;
    setSelectedIndex(index);
    setAttemptedToday(true);
    setAnsweredCorrectly(correct);

    let newStreak = streakCount;
    let newTotal = totalSolved;

    if (correct) {
      newStreak = streakCount + 1;
      newTotal = totalSolved + 1;
      setStreakCount(newStreak);
      setTotalSolved(newTotal);

      await markQuizSolvedToday({ solved: true, correct: true }).catch(() => {});

      if (onSuccess) {
        onSuccess({
          correct: true,
          xpGained: XP_CONFIG.QUIZ_CORRECT_BASE,
          newStreak,
          newTotal,
        });
      }
    } else {
      await saveWrongAnswer(dailyQuestion);
      await markQuizSolvedToday({ solved: true, correct: false }).catch(() => {});
    }

    setIsSubmitting(false);
    return {
      submitted: true,
      correct,
      newStreak,
      newTotal,
    };
  }, [selectedIndex, isSubmitting, dailyQuestion, streakCount, totalSolved]);

  return {
    // State
    dailyQuestion,
    selectedIndex,
    attemptedToday,
    answeredCorrectly,
    streakCount,
    totalSolved,
    loading,
    isSubmitting,

    // Actions
    loadDailyState,
    submitAnswer,
  };
}
