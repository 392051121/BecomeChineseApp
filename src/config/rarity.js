/**
 * Rarity System Configuration
 *
 * Defines rarity levels, colors, and probability for collectibles.
 */

export const RARITY = {
  COMMON: {
    id: 'common',
    name: 'Common',
    nameCn: '普通',
    color: '#9CA3AF',
    glowColor: 'rgba(156, 163, 175, 0.3)',
    chance: 60,
    xpMultiplier: 1,
  },
  RARE: {
    id: 'rare',
    name: 'Rare',
    nameCn: '稀有',
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    chance: 25,
    xpMultiplier: 2,
  },
  EPIC: {
    id: 'epic',
    name: 'Epic',
    nameCn: '史诗',
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    chance: 12,
    xpMultiplier: 5,
  },
  LEGENDARY: {
    id: 'legendary',
    name: 'Legendary',
    nameCn: '传说',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    chance: 3,
    xpMultiplier: 10,
  },
};

export const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'];

/**
 * Get rarity config by id
 */
export function getRarityConfig(rarityId) {
  return RARITY[rarityId?.toUpperCase()] || RARITY.COMMON;
}

/**
 * Get rarity color
 */
export function getRarityColor(rarityId) {
  return getRarityConfig(rarityId).color;
}

/**
 * Calculate XP reward based on rarity
 */
export function calculateRarityXP(baseXP, rarityId) {
  const config = getRarityConfig(rarityId);
  return baseXP * config.xpMultiplier;
}

/**
 * Random rarity based on probability
 */
export function getRandomRarity() {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const rarityKey of RARITY_ORDER) {
    const config = RARITY[rarityKey.toUpperCase()];
    cumulative += config.chance;
    if (roll < cumulative) {
      return config.id;
    }
  }

  return 'common';
}

/**
 * Rarity badge styles for UI
 */
export const RARITY_STYLES = {
  common: {
    borderWidth: 1,
    shadowOpacity: 0,
  },
  rare: {
    borderWidth: 1.5,
    shadowOpacity: 0.2,
  },
  epic: {
    borderWidth: 2,
    shadowOpacity: 0.3,
  },
  legendary: {
    borderWidth: 2.5,
    shadowOpacity: 0.5,
    animated: true, // Legendary items have animated glow
  },
};