/**
 * Recommendations Utility
 *
 * Shared logic for generating personalized next step recommendations.
 */

import { MapPin, UtensilsCrossed, Scroll, CalendarDays, History, BookOpen, Target } from 'lucide-react-native';
import { MIN_COLLECTION_THRESHOLD } from '../config/constants';
import { getUserInterests } from '../screens/OnboardingScreen';

/**
 * Interest type weights for recommendation scoring
 */
const INTEREST_WEIGHTS = {
  history: { dynasties: 3, cities: 1, recipes: 1 },
  food: { recipes: 3, cities: 1.5, dynasties: 0.5 },
  places: { cities: 3, recipes: 1, dynasties: 1 },
  comprehensive: { dynasties: 1, cities: 1, recipes: 1 },
};

/**
 * Goal type modifiers
 */
const GOAL_MODIFIERS = {
  casual: { thresholdMultiplier: 0.5, pathRecommendationChance: 0.3 },
  focused: { thresholdMultiplier: 1, pathRecommendationChance: 0.7 },
};

/**
 * Get user preference modifiers
 * @returns {Object} User preferences or defaults
 */
async function getUserPreferences() {
  try {
    const interests = await getUserInterests();
    if (!interests) {
      return {
        primaryInterest: 'comprehensive',
        goal: 'casual',
      };
    }
    return {
      primaryInterest: interests.interests?.[0] || 'comprehensive',
      goal: interests.goal || 'casual',
    };
  } catch {
    return {
      primaryInterest: 'comprehensive',
      goal: 'casual',
    };
  }
}

/**
 * Get personalized next step recommendation based on user stats and preferences
 * @param {Object} params - Parameters for recommendation
 * @param {boolean} params.solvedToday - Whether user solved quiz today
 * @param {number} params.citiesCollected - Number of cities collected
 * @param {number} params.recipesCollected - Number of recipes collected
 * @param {number} params.dynastiesCollected - Number of dynasties collected
 * @param {number} params.wrongAnswersCount - Number of pending wrong answers to review
 * @param {string} [params.quizRegion] - Optional quiz region for contextual suggestions
 * @param {Object} [params.userPreferences] - Optional user preferences from onboarding
 * @returns {Object|null} Recommendation object or null
 */
export function getRecommendedNextStep({
  solvedToday,
  citiesCollected,
  recipesCollected,
  dynastiesCollected,
  wrongAnswersCount = 0,
  quizRegion,
  userPreferences,
}) {
  // Priority 0: Review wrong answers if any pending
  if (wrongAnswersCount > 0) {
    return {
      screen: 'WrongAnswerReview',
      label: 'Review Wrong Answers',
      labelCn: '复习错题',
      icon: BookOpen,
      priority: 'high',
      reason: `${wrongAnswersCount} questions to review`,
      badge: `${wrongAnswersCount}`,
    };
  }

  // Priority 1: Daily quiz if not done
  if (!solvedToday) {
    return {
      screen: 'Seasons',
      label: 'Complete Daily Quiz',
      labelCn: '完成每日问答',
      icon: CalendarDays,
      priority: 'high',
      reason: 'Keep your streak going!',
    };
  }

  // Get user preferences for personalized recommendations
  const prefs = userPreferences || { primaryInterest: 'comprehensive', goal: 'casual' };
  const weights = INTEREST_WEIGHTS[prefs.primaryInterest] || INTEREST_WEIGHTS.comprehensive;
  const goalMod = GOAL_MODIFIERS[prefs.goal] || GOAL_MODIFIERS.casual;

  // Adjust threshold based on goal
  const adjustedThreshold = Math.floor(MIN_COLLECTION_THRESHOLD * goalMod.thresholdMultiplier);

  // Calculate weighted scores for each category
  const scores = {
    cities: citiesCollected * weights.cities,
    recipes: recipesCollected * weights.recipes,
    dynasties: dynastiesCollected * weights.dynasties,
  };

  // Find the category with lowest weighted score (needs most attention)
  const minScoreCategory = Object.entries(scores).reduce((min, [key, value]) =>
    value < min.score ? { category: key, score: value } : min,
    { category: 'cities', score: scores.cities }
  );

  // Priority 2: Explore based on user interest preference
  if (minScoreCategory.category === 'cities' && citiesCollected < adjustedThreshold) {
    return {
      screen: 'Places',
      label: 'Explore Cities',
      labelCn: '探索城市',
      icon: MapPin,
      priority: 'medium',
      reason: prefs.primaryInterest === 'places' ? 'Your focus area' : 'Discover your first cities',
    };
  }

  if (minScoreCategory.category === 'recipes' && recipesCollected < adjustedThreshold) {
    return {
      screen: 'Food',
      label: 'Try Food',
      labelCn: '品尝美食',
      icon: UtensilsCrossed,
      priority: 'medium',
      reason: prefs.primaryInterest === 'food' ? 'Your focus area' : 'Save your first dishes',
    };
  }

  if (minScoreCategory.category === 'dynasties' && dynastiesCollected < adjustedThreshold) {
    return {
      screen: 'History',
      label: 'Learn History',
      labelCn: '学习历史',
      icon: History,
      priority: 'medium',
      reason: prefs.primaryInterest === 'history' ? 'Your focus area' : 'Explore dynasties',
    };
  }

  // Priority 3: Suggest learning path for focused learners
  if (prefs.goal === 'focused' && Math.random() < goalMod.pathRecommendationChance) {
    return {
      screen: 'Paths',
      label: 'Start a Learning Path',
      labelCn: '开始学习路径',
      icon: Target,
      priority: 'medium',
      reason: 'Structured learning for deeper knowledge',
    };
  }

  // Default: suggest based on what's least explored relative to interest
  const rawCounts = { cities: citiesCollected, recipes: recipesCollected, dynasties: dynastiesCollected };
  const weightedMin = Object.entries(rawCounts).reduce((min, [key, value]) =>
    value / weights[key] < min.ratio ? { category: key, ratio: value / weights[key] } : min,
    { category: 'cities', ratio: citiesCollected / weights.cities }
  );

  const recommendations = {
    cities: {
      screen: 'Places',
      label: 'Explore More Cities',
      labelCn: '探索更多城市',
      icon: MapPin,
      reason: `${citiesCollected} cities saved`,
    },
    recipes: {
      screen: 'Food',
      label: 'Discover More Dishes',
      labelCn: '发现更多美食',
      icon: UtensilsCrossed,
      reason: `${recipesCollected} dishes saved`,
    },
    dynasties: {
      screen: 'History',
      label: 'Deepen Your Knowledge',
      labelCn: '深入学习历史',
      icon: Scroll,
      reason: `${dynastiesCollected} dynasties saved`,
    },
  };

  return {
    ...recommendations[weightedMin.category],
    priority: 'low',
  };
}

/**
 * Get contextual recommendation based on quiz region
 * @param {string} region - Quiz region
 * @returns {Object} Recommendation object
 */
export function getRegionBasedRecommendation(region) {
  const regionLower = region?.toLowerCase();

  // City-focused regions
  if (['beijing', 'shanghai', 'shaanxi', 'xian'].some(r => regionLower?.includes(r))) {
    return {
      screen: 'Places',
      label: 'Explore More',
      labelCn: '继续探索',
      icon: MapPin,
      reason: `Discover ${region}`,
    };
  }

  // Food-focused regions
  if (['sichuan', 'guangdong', 'hunan', 'shandong'].some(r => regionLower?.includes(r))) {
    return {
      screen: 'Food',
      label: 'Explore Cuisine',
      labelCn: '探索菜系',
      icon: UtensilsCrossed,
      reason: `Try ${region} cuisine`,
    };
  }

  // Default to history
  return {
    screen: 'History',
    label: 'Continue Journey',
    labelCn: '继续旅程',
    icon: Scroll,
    reason: 'Deepen your knowledge',
  };
}

/**
 * Get recommendations for home screen with user preferences
 * @returns {Promise<Object|null>} Recommendation with user preferences applied
 */
export async function getHomeScreenRecommendation(stats) {
  const preferences = await getUserPreferences();
  return getRecommendedNextStep({
    ...stats,
    userPreferences: preferences,
  });
}
