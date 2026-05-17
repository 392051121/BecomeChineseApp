/**
 * useUserProgress Hook
 *
 * Manages user progress statistics: XP calculation, province connections,
 * and collection counts.
 */

import { useState, useCallback } from 'react';
import { getCulturalAssets, getProvinceConnectionMap } from '../utils/culturalAssets';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';

/**
 * Calculate user stats from cultural assets
 */
export function calculateUserStats(assets) {
  const connectionMap = getProvinceConnectionMap({
    favorites: assets?.favorites,
    cities,
    recipes,
    dynasties,
  });

  return {
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
}

/**
 * Hook for managing user progress statistics
 */
export function useUserProgress() {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user stats from storage
  const loadUserStats = useCallback(async () => {
    try {
      const assets = await getCulturalAssets();
      const stats = calculateUserStats(assets);
      setUserStats(stats);
      return stats;
    } catch {
      const defaultStats = calculateUserStats(null);
      setUserStats(defaultStats);
      return defaultStats;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update stats with new values (e.g., after quiz completion)
  const updateStats = useCallback((updates) => {
    setUserStats((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  // Get connection map for province tracking
  const getConnectionMap = useCallback((assets) => {
    return getProvinceConnectionMap({
      favorites: assets?.favorites,
      cities,
      recipes,
      dynasties,
    });
  }, []);

  return {
    // State
    userStats,
    loading,

    // Actions
    loadUserStats,
    updateStats,
    getConnectionMap,
  };
}
