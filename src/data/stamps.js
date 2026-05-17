/**
 * Stamp Definitions
 *
 * Defines all cultural stamps with their designs, rarity distribution,
 * and unlock conditions. Stamps are earned through deep exploration.
 */

import { RARITY, getRarityConfig } from '../config/rarity';

// Stamp types corresponding to content categories
export const STAMP_TYPES = {
  city: {
    id: 'city',
    nameEn: 'City Stamp',
    nameCn: '城市印章',
    icon: 'map-pin',
    color: '#6B8A94',
    descriptionEn: 'Earned by exploring cities',
    descriptionCn: '探索城市获得',
  },
  food: {
    id: 'food',
    nameEn: 'Food Stamp',
    nameCn: '美食印章',
    icon: 'utensils',
    color: '#E2B05E',
    descriptionEn: 'Earned by exploring recipes',
    descriptionCn: '探索美食获得',
  },
  dynasty: {
    id: 'dynasty',
    nameEn: 'Dynasty Stamp',
    nameCn: '朝代印章',
    icon: 'scroll',
    color: '#B33B24',
    descriptionEn: 'Earned by exploring dynasties',
    descriptionCn: '探索朝代获得',
  },
  person: {
    id: 'person',
    nameEn: 'Person Stamp',
    nameCn: '人物印章',
    icon: 'user',
    color: '#C23A2E',
    descriptionEn: 'Earned by exploring historical figures',
    descriptionCn: '探索人物获得',
  },
  festival: {
    id: 'festival',
    nameEn: 'Festival Stamp',
    nameCn: '节日印章',
    icon: 'sparkles',
    color: '#F59E0B',
    descriptionEn: 'Earned during special festivals',
    descriptionCn: '节日期间获得',
  },
};

// Stamp unlock thresholds
export const STAMP_THRESHOLDS = {
  VIEW_TIME_MS: 3000,       // 3 seconds viewing
  SCROLL_DEPTH: 0.7,        // 70% scroll depth
  INTERACTIONS: 2,          // Min interactions (tap, favorite, expand)
  DEEP_EXPLORE_SCORE: 3,    // Combined score threshold
};

// Rarity distribution for stamps
export const STAMP_RARITY_CHANCES = {
  common: 60,
  rare: 25,
  epic: 12,
  legendary: 3,
};

// Generate stamp ID from content
export function generateStampId(type, contentId, rarity) {
  return `${type}-${contentId}-${rarity}`;
}

// Determine stamp rarity based on engagement and festival bonus
export function determineStampRarity(engagementScore, festivalBonus = 0) {
  const adjustedScore = engagementScore + festivalBonus;

  // Higher engagement increases rarity chance
  let rarityChance = STAMP_RARITY_CHANCES;

  if (adjustedScore >= 10) {
    rarityChance = { common: 30, rare: 40, epic: 25, legendary: 5 };
  } else if (adjustedScore >= 7) {
    rarityChance = { common: 45, rare: 35, epic: 18, legendary: 2 };
  }

  // Random selection based on weighted chances
  const total = Object.values(rarityChance).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  for (const [rarity, chance] of Object.entries(rarityChance)) {
    random -= chance;
    if (random <= 0) {
      return rarity;
    }
  }

  return 'common';
}

// Stamp seal designs (SVG-like paths for rendering)
export const STAMP_SEAL_DESIGNS = {
  // Traditional square seal (印章)
  square: {
    viewBox: '0 0 100 100',
    path: 'M10,10 L90,10 L90,90 L10,90 Z',
    innerPath: 'M20,20 L80,20 L80,80 L20,80 Z',
    textPosition: { x: 50, y: 55 },
  },
  // Round seal (圆印)
  round: {
    viewBox: '0 0 100 100',
    path: 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10',
    innerPath: 'M50,20 A30,30 0 1,1 50,80 A30,30 0 1,1 50,20',
    textPosition: { x: 50, y: 55 },
  },
  // Oval seal (椭圆印)
  oval: {
    viewBox: '0 0 100 60',
    path: 'M50,5 A45,25 0 1,1 50,55 A45,25 0 1,1 50,5',
    innerPath: 'M50,12 A38,20 0 1,1 50,48 A38,20 0 1,1 50,12',
    textPosition: { x: 50, y: 32 },
  },
};

// Stamp visual styles by type
export const STAMP_VISUAL_STYLES = {
  city: {
    shape: 'square',
    borderColor: '#6B8A94',
    backgroundColor: '#E8F4F8',
    textColor: '#1B1715',
    accentColor: '#6B8A94',
  },
  food: {
    shape: 'round',
    borderColor: '#E2B05E',
    backgroundColor: '#FFF7EE',
    textColor: '#1B1715',
    accentColor: '#E2B05E',
  },
  dynasty: {
    shape: 'square',
    borderColor: '#B33B24',
    backgroundColor: '#F5E8E0',
    textColor: '#1B1715',
    accentColor: '#B33B24',
  },
  person: {
    shape: 'oval',
    borderColor: '#C23A2E',
    backgroundColor: '#F5F0E8',
    textColor: '#1B1715',
    accentColor: '#C23A2E',
  },
  festival: {
    shape: 'round',
    borderColor: '#F59E0B',
    backgroundColor: '#FFF7EE',
    textColor: '#1B1715',
    accentColor: '#F59E0B',
  },
};

// Get stamp visual style with rarity adjustments
export function getStampVisualStyle(type, rarity) {
  const baseStyle = STAMP_VISUAL_STYLES[type] || STAMP_VISUAL_STYLES.city;
  const rarityConfig = getRarityConfig(rarity);

  // Legendary stamps have gold accent
  if (rarity === 'legendary') {
    return {
      ...baseStyle,
      borderColor: '#F59E0B',
      accentColor: '#F59E0B',
      glow: true,
    };
  }

  // Epic stamps have subtle glow
  if (rarity === 'epic') {
    return {
      ...baseStyle,
      glow: true,
      glowColor: rarityConfig.color,
    };
  }

  return baseStyle;
}

// XP values for stamps by rarity
export const STAMP_XP_VALUES = {
  common: 5,
  rare: 15,
  epic: 40,
  legendary: 100,
};

// Calculate stamp XP
export function calculateStampXP(rarity) {
  return STAMP_XP_VALUES[rarity] || STAMP_XP_VALUES.common;
}

// Create a stamp object from content
export function createStamp(type, content, rarity, engagementScore = 0) {
  const stampId = generateStampId(type, content.id, rarity);
  const visualStyle = getStampVisualStyle(type, rarity);
  const xp = calculateStampXP(rarity);

  return {
    id: stampId,
    type,
    contentId: content.id,
    contentNameEn: content.nameEn,
    contentNameCn: content.nameCn,
    rarity,
    xp,
    visualStyle,
    earnedAt: new Date().toISOString(),
    engagementScore,
  };
}

// Festival exclusive stamps
export const FESTIVAL_EXCLUSIVE_STAMPS = {
  'spring-festival': {
    id: 'spring-festival-2026',
    type: 'festival',
    nameEn: 'Spring Festival 2026',
    nameCn: '春节印章',
    rarity: 'epic',
    xp: 50,
    availableDuring: 'spring-festival',
  },
  'mid-autumn-festival': {
    id: 'mid-autumn-2026',
    type: 'festival',
    nameEn: 'Mid-Autumn 2026',
    nameCn: '中秋印章',
    rarity: 'epic',
    xp: 50,
    availableDuring: 'mid-autumn-festival',
  },
  'dragon-boat-festival': {
    id: 'dragon-boat-2026',
    type: 'festival',
    nameEn: 'Dragon Boat 2026',
    nameCn: '端午印章',
    rarity: 'rare',
    xp: 25,
    availableDuring: 'dragon-boat-festival',
  },
};

export default {
  STAMP_TYPES,
  STAMP_THRESHOLDS,
  STAMP_RARITY_CHANCES,
  STAMP_SEAL_DESIGNS,
  STAMP_VISUAL_STYLES,
  STAMP_XP_VALUES,
  FESTIVAL_EXCLUSIVE_STAMPS,
};