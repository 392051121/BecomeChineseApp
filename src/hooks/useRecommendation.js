/**
 * useRecommendation Hook
 *
 * Manages next step recommendations based on user progress
 * and quiz region context.
 */

import { useMemo } from 'react';
import { getRecommendedNextStep, getRegionBasedRecommendation } from '../utils/recommendations';

/**
 * Hook for managing recommendations
 * @param {object} params - Parameters for recommendation
 * @param {object} params.userStats - User statistics
 * @param {boolean} params.attemptedToday - Whether user attempted today's quiz
 * @param {object} params.dailyQuestion - Current daily question (for region)
 */
export function useRecommendation({ userStats, attemptedToday, dailyQuestion }) {
  // Calculate recommendation based on user progress
  const recommendation = useMemo(() => {
    if (!userStats) return null;

    // Use shared recommendation logic
    const baseRecommendation = getRecommendedNextStep({
      solvedToday: attemptedToday,
      citiesCollected: userStats.citiesCollected,
      recipesCollected: userStats.recipesCollected,
      dynastiesCollected: userStats.dynastiesCollected,
    });

    // Override with region-based suggestion if available
    if (dailyQuestion?.region) {
      const regionRec = getRegionBasedRecommendation(dailyQuestion.region);
      if (regionRec) {
        return {
          ...regionRec,
          priority: baseRecommendation?.priority || 'low',
        };
      }
    }

    return baseRecommendation;
  }, [userStats, attemptedToday, dailyQuestion]);

  return {
    nextStep: recommendation,
    hasRecommendation: recommendation !== null,
  };
}

/**
 * Get recommendation for wrong answer encouragement
 * @param {object} userStats - User statistics
 * @param {object} dailyQuestion - Current daily question
 */
export function useWrongAnswerRecommendation(userStats, dailyQuestion) {
  return useMemo(() => {
    if (!dailyQuestion?.region) return null;
    return getRegionBasedRecommendation(dailyQuestion.region);
  }, [dailyQuestion]);
}
