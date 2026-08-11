/**
 * Wrong Answer Review System
 *
 * Manages storage and retrieval of incorrectly answered quiz questions
 * for later review and learning.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/storageKeys';
import { QUIZ_CONFIG } from '../config/constants';
import { showError, ERROR_MESSAGES, logger } from './errorHandling';
import { notifyBadgeRefresh } from '../components/CustomTabBar';
import { todayKey } from './culturalAssets';

/**
 * Save a wrong answer for later review
 */
export async function saveWrongAnswer(question) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS);
    const wrongAnswers = stored ? JSON.parse(stored) : [];

    // Prefer stable question.id; fall back to legacyId then question text so
    // reworded stems don't silently fork the same item, and pre-id entries still match.
    const qId = question?.id || question?.legacyId || null;
    const existingIndex = wrongAnswers.findIndex((a) => {
      if (qId && (a.id === qId || a.legacyId === qId)) return true;
      if (question?.legacyId && (a.id === question.legacyId || a.legacyId === question.legacyId)) {
        return true;
      }
      return a.question === question.question;
    });

    // Preserve review/mastery progress when the same question is missed again.
    // Overwriting correctReviewCount / mastered would undo partial mastery work.
    const prev = existingIndex >= 0 ? wrongAnswers[existingIndex] : null;
    const wrongEntry = {
      id: qId || prev?.id || `wrong-${Date.now()}`,
      legacyId: question?.legacyId || prev?.legacyId || null,
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      region: question.region,
      category: question.category || prev?.category || null,
      addedAt: prev?.addedAt || new Date().toISOString(),
      reviewCount: prev?.reviewCount || 0,
      correctReviewCount: prev?.correctReviewCount || 0,
      lastReviewedAt: prev?.lastReviewedAt || null,
      // Re-miss after mastery: put it back into the review queue
      mastered: false,
    };

    if (existingIndex >= 0) {
      // Update existing entry
      wrongAnswers[existingIndex] = wrongEntry;
    } else {
      // Add new entry at the beginning
      wrongAnswers.unshift(wrongEntry);
    }

    // Keep only last N wrong answers
    const trimmed = wrongAnswers.slice(0, QUIZ_CONFIG.MAX_WRONG_ANSWERS);
    await AsyncStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(trimmed));

    // Notify TabBar to refresh badge
    notifyBadgeRefresh();

    return true;
  } catch (error) {
    logger.error('WrongAnswers', 'Failed to save wrong answer', error);
    showError(ERROR_MESSAGES.SAVE_FAILED);
    return false;
  }
}

/**
 * Get all wrong answers for review
 */
export async function getWrongAnswers() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    logger.error('WrongAnswers', 'Failed to get wrong answers', error);
    return [];
  }
}

/**
 * Mark a wrong answer as reviewed
 */
export async function markAsReviewed(questionId, correct) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS);
    const wrongAnswers = stored ? JSON.parse(stored) : [];

    const index = wrongAnswers.findIndex(
      (a) => a.id === questionId || a.legacyId === questionId
    );
    if (index >= 0) {
      // reviewCount = total review attempts (UI/stats)
      wrongAnswers[index].reviewCount += 1;
      wrongAnswers[index].lastReviewedAt = new Date().toISOString();

      // correctReviewCount only advances on correct answers — mastery is correct-only
      const prevCorrect = wrongAnswers[index].correctReviewCount || 0;
      if (correct) {
        wrongAnswers[index].correctReviewCount = prevCorrect + 1;
      }
      if (
        correct &&
        (wrongAnswers[index].correctReviewCount || 0) >= QUIZ_CONFIG.MASTERY_THRESHOLD
      ) {
        wrongAnswers[index].mastered = true;
      }

      await AsyncStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(wrongAnswers));
    }

    // Update review stats
    await updateReviewStats(correct);

    // Notify TabBar to refresh badge
    notifyBadgeRefresh();

    return true;
  } catch (error) {
    logger.error('WrongAnswers', 'Failed to mark as reviewed', error);
    return false;
  }
}

/**
 * Remove a wrong answer (mastered or user deleted)
 */
export async function removeWrongAnswer(questionId) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS);
    const wrongAnswers = stored ? JSON.parse(stored) : [];

    const filtered = wrongAnswers.filter(
      (a) => a.id !== questionId && a.legacyId !== questionId
    );
    await AsyncStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(filtered));

    // Notify TabBar to refresh badge
    notifyBadgeRefresh();

    return true;
  } catch (error) {
    logger.error('WrongAnswers', 'Failed to remove wrong answer', error);
    return false;
  }
}

/**
 * Get review statistics
 */
export async function getReviewStats() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.REVIEW_STATS);
    return stored ? JSON.parse(stored) : {
      totalReviewed: 0,
      correctReviews: 0,
      streak: 0,
      lastReviewDate: null,
    };
  } catch (error) {
    logger.error('WrongAnswers', 'Failed to get review stats', error);
    return {
      totalReviewed: 0,
      correctReviews: 0,
      streak: 0,
      lastReviewDate: null,
    };
  }
}

/**
 * Update review statistics
 */
async function updateReviewStats(correct) {
  try {
    const stats = await getReviewStats();
    const today = todayKey();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = todayKey(yesterdayDate);

    let newStreak = stats.streak;
    if (stats.lastReviewDate === today) {
      // Same day - keep current streak
    } else if (stats.lastReviewDate === yesterday && correct) {
      // Consecutive day and correct - increment streak
      newStreak = stats.streak + 1;
    } else if (correct) {
      // Gap in days but correct - restart streak
      newStreak = 1;
    } else {
      // Incorrect - reset streak
      newStreak = 0;
    }

    const newStats = {
      totalReviewed: stats.totalReviewed + 1,
      correctReviews: stats.correctReviews + (correct ? 1 : 0),
      streak: newStreak,
      lastReviewDate: today,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.REVIEW_STATS, JSON.stringify(newStats));
  } catch (error) {
    logger.error('WrongAnswers', 'Failed to update review stats', error);
  }
}

/**
 * Get wrong answers grouped by region
 */
export async function getWrongAnswersByRegion() {
  const wrongAnswers = await getWrongAnswers();

  const grouped = {};
  wrongAnswers.forEach((answer) => {
    const region = answer.region || 'General';
    if (!grouped[region]) {
      grouped[region] = [];
    }
    grouped[region].push(answer);
  });

  return grouped;
}

/**
 * Get review summary for display
 */
export async function getReviewSummary() {
  const wrongAnswers = await getWrongAnswers();
  const stats = await getReviewStats();

  const pending = wrongAnswers.filter((a) => !a.mastered).length;
  const mastered = wrongAnswers.filter((a) => a.mastered).length;
  const accuracy = stats.totalReviewed > 0
    ? Math.round((stats.correctReviews / stats.totalReviewed) * 100)
    : 0;

  return {
    total: wrongAnswers.length,
    pending,
    mastered,
    accuracy,
    streak: stats.streak,
  };
}
