/**
 * Solar Term Content Utility
 *
 * Matches content to current solar term and season for
 * dynamic content highlighting on home screen.
 */

import { getCurrentSolarTerm, getUpcomingFestivals, festivals } from '../data/festivals';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';

// Season content associations
const SEASON_ASSOCIATIONS = {
  spring: {
    tags: ['spring', 'new-year', 'qingming'],
    provinces: ['jiangsu', 'zhejiang', 'shanghai'],
    foodTypes: ['light', 'fresh', 'vegetable'],
    themes: ['renewal', 'growth', 'flowers'],
  },
  summer: {
    tags: ['summer', 'dragon-boat'],
    provinces: ['sichuan', 'hunan', 'guangdong'],
    foodTypes: ['cold', 'refreshing', 'spicy'],
    themes: ['heat', 'vitality', 'dragon'],
  },
  autumn: {
    tags: ['autumn', 'mid-autumn', 'harvest'],
    provinces: ['beijing', 'shandong', 'shanxi'],
    foodTypes: ['rich', 'warming', 'mooncake'],
    themes: ['moon', 'harvest', 'reflection'],
  },
  winter: {
    tags: ['winter', 'spring-festival', 'cold'],
    provinces: ['heilongjiang', 'jilin', 'liaoning'],
    foodTypes: ['hot', 'warming', 'dumpling'],
    themes: ['warmth', 'family', 'reunion'],
  },
};

// Solar term to season mapping
const SOLAR_TERM_SEASONS = {
  lichun: 'spring', yushui: 'spring', jingzhe: 'spring', chunfen: 'spring',
  qingming: 'spring', guyu: 'spring',
  lixia: 'summer', xiaoman: 'summer', mangzhong: 'summer', xiazhi: 'summer',
  xiaoshu: 'summer', dashu: 'summer',
  liqiu: 'autumn', chushu: 'autumn', bailu: 'autumn', qiufen: 'autumn',
  hanlu: 'autumn', shuangjiang: 'autumn',
  lidong: 'winter', xiaoxue: 'winter', daxue: 'winter', dongzhi: 'winter',
  xiaohan: 'winter', daohan: 'winter',
};

/**
 * Get current season from solar term
 */
export function getCurrentSeason(date = new Date()) {
  const solarTerm = getCurrentSolarTerm(date);
  return SOLAR_TERM_SEASONS[solarTerm?.id] || 'spring';
}

/**
 * Get content recommendations for current solar term
 */
export function getSolarTermContent(date = new Date(), options = {}) {
  const { maxCities = 3, maxRecipes = 3, maxDynasties = 2 } = options;

  const solarTerm = getCurrentSolarTerm(date);
  const season = getCurrentSeason(date);
  const associations = SEASON_ASSOCIATIONS[season] || SEASON_ASSOCIATIONS.spring;

  // Find cities matching season provinces
  const seasonCities = cities.filter((city) =>
    associations.provinces.some((p) => city.province_id?.includes(p))
  ).slice(0, maxCities);

  // Find recipes matching recommended foods for this solar term
  const solarTermFoods = solarTerm?.recommendedFoodIds || [];
  const seasonRecipes = recipes.filter((recipe) =>
    solarTermFoods.includes(recipe.id) ||
    recipe.tasteTags?.some((tag) => associations.foodTypes.includes(tag.toLowerCase()))
  ).slice(0, maxRecipes);

  // Find dynasties with relevant history
  const seasonDynasties = dynasties.filter((dynasty) =>
    dynasty.keyEvents?.some((event) =>
      associations.themes.some((theme) => event.toLowerCase().includes(theme))
    )
  ).slice(0, maxDynasties);

  return {
    solarTerm,
    season,
    cities: seasonCities,
    recipes: seasonRecipes,
    dynasties: seasonDynasties,
    associations,
  };
}

/**
 * Get featured content for current festival
 */
export function getFestivalContent(date = new Date()) {
  const upcomingFestivals = getUpcomingFestivals(date, 2);

  // Find content related to upcoming festivals
  const festivalContent = upcomingFestivals.map((festival) => {
    const relatedRecipes = recipes.filter((r) =>
      festival.recommendedFoodIds?.includes(r.id)
    );

    const relatedCities = cities.filter((c) =>
      festival.relatedCityIds?.includes(c.id)
    );

    return {
      festival,
      recipes: relatedRecipes,
      cities: relatedCities,
    };
  });

  return festivalContent;
}

/**
 * Check if today is a special festival day
 */
export function isFestivalDay(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Check for fixed-date festivals
  const fixedFestivals = [
    { id: 'qingming', month: 4, day: 5 },
    { id: 'lixia', month: 5, day: 6 },
    { id: 'xiazhi', month: 6, day: 21 },
    { id: 'liqiu', month: 8, day: 8 },
    { id: 'qiufen', month: 9, day: 23 },
    { id: 'lidong', month: 11, day: 8 },
    { id: 'dongzhi', month: 12, day: 22 },
  ];

  for (const festival of fixedFestivals) {
    if (festival.month === month && Math.abs(festival.day - day) <= 2) {
      return festivals.find((f) => f.id === festival.id);
    }
  }

  return null;
}

/**
 * Get festival bonus for stamps
 */
export function getFestivalBonus(date = new Date()) {
  const festival = isFestivalDay(date);
  const season = getCurrentSeason(date);

  return {
    isFestival: !!festival,
    festival,
    season,
    rarityBoost: festival ? 0.15 : 0,
    xpMultiplier: festival ? 1.5 : 1,
    themeColor: festival?.tags?.includes('spring') ? '#E2B05E' :
                festival?.tags?.includes('summer') ? '#6B8A94' :
                festival?.tags?.includes('autumn') ? '#B33B24' :
                festival?.tags?.includes('winter') ? '#3B82F6' :
                '#C23A2E',
  };
}

/**
 * Get seasonal theme colors
 */
export function getSeasonalColors(date = new Date()) {
  const season = getCurrentSeason(date);

  const colors = {
    spring: {
      primary: '#E2B05E',
      accent: '#F59E0B',
      background: '#FFF7EE',
      text: '春',
    },
    summer: {
      primary: '#6B8A94',
      accent: '#3B82F6',
      background: '#E8F4F8',
      text: '夏',
    },
    autumn: {
      primary: '#B33B24',
      accent: '#C23A2E',
      background: '#F5E8E0',
      text: '秋',
    },
    winter: {
      primary: '#3B82F6',
      accent: '#60A5FA',
      background: '#E8F0F8',
      text: '冬',
    },
  };

  return colors[season] || colors.spring;
}