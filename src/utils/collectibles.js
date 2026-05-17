/**
 * Collectibles Utility
 *
 * Adds rarity and collection metadata to existing data items.
 * This allows us to gamify the collection system without modifying original data files.
 */

import { RARITY, getRarityConfig, getRandomRarity } from '../config/rarity';

// Predefined rarity assignments for special items
// These are manually curated to ensure important items have appropriate rarity
const SPECIAL_RARITY_MAP = {
  // Legendary cities (most famous/iconic)
  cities: {
    legendary: ['beijing', 'xian', 'chengdu'],
    epic: ['shanghai', 'hangzhou', 'suzhou', 'guilin', 'lijiang'],
    rare: ['nanjing', 'guangzhou', 'chongqing', 'wuhan', 'kunming', 'lhasa'],
  },
  // Legendary dishes (most famous Chinese dishes globally)
  recipes: {
    legendary: ['kung-pao-chicken', 'peking-duck', 'hot-pot', 'dumplings'],
    epic: ['mapo-tofu', 'sweet-and-sour-pork', 'char-siu', 'xiaolongbao', 'fried-rice'],
    rare: ['kung-pao-shrimp', 'twice-cooked-pork', 'dan-dan-noodles', 'spring-rolls', 'wontons'],
  },
  // Legendary dynasties (most influential)
  dynasties: {
    legendary: ['tang', 'han', 'qing'],
    epic: ['song', 'ming', 'qin', 'zhou'],
    rare: ['yuan', 'sui', 'jin', 'three-kingdoms'],
  },
  // Legendary people (most famous historical figures)
  people: {
    legendary: ['libai', 'confucius', 'qinshihuang', 'laozi'],
    epic: ['dufu', 'sunwu', 'zhugeliang', 'caocao', 'liubang', 'wuzetian'],
    rare: ['simaqian', 'banchao', 'yuefei', 'sushi', 'wangxizhi'],
  },
};

/**
 * Get rarity for a specific item
 * Uses predefined map for special items, otherwise assigns based on rules
 */
export function getItemRarity(type, itemId) {
  const typeMap = SPECIAL_RARITY_MAP[type];
  if (!typeMap) return 'common';

  // Check predefined rarity
  for (const [rarity, items] of Object.entries(typeMap)) {
    if (items.includes(itemId)) {
      return rarity;
    }
  }

  // Default to common for items not in the map
  return 'common';
}

/**
 * Add rarity to a collection item
 */
export function addRarityToItem(item, type) {
  const rarity = getItemRarity(type, item.id);
  const rarityConfig = getRarityConfig(rarity);

  return {
    ...item,
    rarity,
    rarityColor: rarityConfig.color,
    rarityName: rarityConfig.name,
    rarityNameCn: rarityConfig.nameCn,
  };
}

/**
 * Add rarity to all items in a collection
 */
export function addRarityToCollection(items, type) {
  return items.map(item => addRarityToItem(item, type));
}

/**
 * Group items by rarity
 */
export function groupByRarity(items) {
  const groups = {
    legendary: [],
    epic: [],
    rare: [],
    common: [],
  };

  items.forEach(item => {
    const rarity = item.rarity || 'common';
    if (groups[rarity]) {
      groups[rarity].push(item);
    }
  });

  return groups;
}

/**
 * Calculate collection completion stats
 */
export function getCollectionStats(collectedItems, allItems, type) {
  const itemsWithRarity = addRarityToCollection(allItems, type);
  const collectedIds = new Set(collectedItems.map(item => item.id));

  const stats = {
    total: itemsWithRarity.length,
    collected: collectedItems.length,
    percentage: 0,
    byRarity: {
      legendary: { total: 0, collected: 0 },
      epic: { total: 0, collected: 0 },
      rare: { total: 0, collected: 0 },
      common: { total: 0, collected: 0 },
    },
  };

  itemsWithRarity.forEach(item => {
    const rarity = item.rarity || 'common';
    stats.byRarity[rarity].total += 1;
    if (collectedIds.has(item.id)) {
      stats.byRarity[rarity].collected += 1;
    }
  });

  stats.percentage = stats.total > 0
    ? Math.round((stats.collected / stats.total) * 100)
    : 0;

  return stats;
}

/**
 * Get XP reward for collecting an item
 */
export function getCollectionXP(item, type) {
  const rarity = getItemRarity(type, item.id);
  const config = getRarityConfig(rarity);
  const baseXP = 10;
  return baseXP * config.xpMultiplier;
}

/**
 * Sort items by rarity (legendary first)
 */
export function sortByRarity(items, ascending = false) {
  const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
  return [...items].sort((a, b) => {
    const aOrder = rarityOrder[a.rarity] || 1;
    const bOrder = rarityOrder[b.rarity] || 1;
    return ascending ? aOrder - bOrder : bOrder - aOrder;
  });
}

/**
 * Filter items by rarity
 */
export function filterByRarity(items, rarity) {
  if (!rarity || rarity === 'all') return items;
  return items.filter(item => item.rarity === rarity);
}
