/**
 * Tests for cultural assets utility functions
 */

import {
  getProvinceId,
  normalizeProvinceId,
  buildProvinceStats,
  calculateNextStreak,
  getCultureRank,
  getProvinceConnectionMap,
  setCollectionActive,
  invalidateAssetsCache,
} from '../../utils/culturalAssets';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../../config/gamification', () => ({
  getCultureRank: jest.fn((connected) => {
    if (connected >= 20) return { title: 'Master Explorer', tier: 5 };
    if (connected >= 15) return { title: 'Senior Explorer', tier: 4 };
    if (connected >= 10) return { title: 'Explorer', tier: 3 };
    if (connected >= 5) return { title: 'Traveler', tier: 2 };
    return { title: 'Beginner', tier: 1 };
  }),
  STORAGE_LIMITS: {
    MAX_RECENT_ITEMS: 50,
  },
}));

jest.mock('../../utils/dailyTasks', () => ({
  updateTaskProgress: jest.fn(),
}));

jest.mock('../../utils/errorHandling', () => ({
  showError: jest.fn(),
  ERROR_MESSAGES: {
    LOAD_FAILED: 'Failed to load',
    SAVE_FAILED: 'Failed to save',
  },
  logger: {
    error: jest.fn(),
  },
}));

describe('Cultural Assets Utilities', () => {
  describe('getProvinceId', () => {
    it('extracts province_id', () => {
      expect(getProvinceId({ province_id: 'guangdong' })).toBe('Guangdong');
    });

    it('extracts provinceId', () => {
      expect(getProvinceId({ provinceId: 'sichuan' })).toBe('Sichuan');
    });

    it('extracts province', () => {
      expect(getProvinceId({ province: 'beijing' })).toBe('Beijing');
    });

    it('returns null for missing province', () => {
      expect(getProvinceId({})).toBeNull();
      expect(getProvinceId(null)).toBeNull();
      expect(getProvinceId(undefined)).toBeNull();
    });

    it('prioritizes province_id over other fields', () => {
      expect(getProvinceId({ province_id: 'Guangdong', provinceId: 'Sichuan', province: 'Beijing' })).toBe('Guangdong');
    });

    it('parses display province strings', () => {
      expect(getProvinceId({ province: 'Guangdong / Guangdong' })).toBe('Guangdong');
      expect(getProvinceId({ province: 'Chengdu / Sichuan' })).toBe('Sichuan');
    });
  });

  describe('buildProvinceStats', () => {
    it('builds province stats from cities and recipes', () => {
      const favorites = { names: [] };
      const cities = [
        { id: '1', province: 'guangdong' },
        { id: '2', province: 'sichuan' },
      ];
      const recipes = [
        { id: '1', province: 'guangdong' },
        { id: '2', province: 'beijing' },
      ];

      const result = buildProvinceStats({ favorites, cities, recipes });

      expect(result.total).toBe(3);
      expect(result.provinces).toHaveLength(3);
      expect(result.provinces.find(p => p.province === 'Guangdong').total).toBe(2);
    });

    it('marks visited provinces from favorites', () => {
      const favorites = {
        names: [],
        cities: [{ id: '1', province: 'guangdong' }],
        recipes: [],
        dynasties: [],
      };
      const cities = [{ id: '1', province: 'guangdong' }];
      const recipes = [];

      const result = buildProvinceStats({ favorites, cities, recipes });

      const gd = result.provinces.find(p => p.province === 'Guangdong');
      expect(gd.visited).toBe(true);
    });

    it('handles empty arrays', () => {
      const result = buildProvinceStats({
        favorites: {},
        cities: [],
        recipes: [],
      });

      expect(result.total).toBe(0);
      expect(result.connected).toBe(0);
    });
  });

  describe('calculateNextStreak', () => {
    it('returns 1 for no previous date', () => {
      const result = calculateNextStreak(null, new Date());
      expect(result).toBe(1);
    });

    it('returns "increment" for consecutive day', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = calculateNextStreak(yesterday.toISOString(), new Date());
      expect(result).toBe('increment');
    });

    it('returns "reset" for gap in days', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const result = calculateNextStreak(threeDaysAgo.toISOString(), new Date());
      expect(result).toBe('reset');
    });

    it('returns null for same day', () => {
      const today = new Date();

      const result = calculateNextStreak(today.toISOString(), today);
      expect(result).toBeNull();
    });
  });

  describe('getCultureRank', () => {
    it('returns Beginner for 0 connections', () => {
      const result = getCultureRank(0);
      expect(result.title).toBe('Beginner');
    });

    it('returns Traveler for 5+ connections', () => {
      const result = getCultureRank(5);
      expect(result.title).toBe('Traveler');
    });

    it('returns Explorer for 10+ connections', () => {
      const result = getCultureRank(10);
      expect(result.title).toBe('Explorer');
    });

    it('returns Senior Explorer for 15+ connections', () => {
      const result = getCultureRank(15);
      expect(result.title).toBe('Senior Explorer');
    });

    it('returns Master Explorer for 20+ connections', () => {
      const result = getCultureRank(20);
      expect(result.title).toBe('Master Explorer');
    });
  });

  describe('getProvinceConnectionMap', () => {
    it('builds connection map from data', () => {
      const favorites = {
        cities: [{ id: '1', province: 'guangdong' }],
        recipes: [],
        dynasties: [],
        names: [],
      };
      const cities = [
        { id: '1', province: 'guangdong' },
        { id: '2', province: 'sichuan' },
      ];
      const recipes = [{ id: '1', province: 'sichuan' }];
      const dynasties = [];

      const result = getProvinceConnectionMap({ favorites, cities, recipes, dynasties });

      expect(result.totalCount).toBe(2);
      expect(result.collectedCount).toBe(1);
      expect(result.connectedProvinces.has('Guangdong')).toBe(true);
    });

    it('handles empty data', () => {
      const result = getProvinceConnectionMap({
        favorites: {},
        cities: [],
        recipes: [],
        dynasties: [],
      });

      expect(result.totalCount).toBe(0);
      expect(result.collectedCount).toBe(0);
      expect(result.connectedProvinces.size).toBe(0);
    });
  });

  describe('setCollectionActive', () => {
    const STORAGE_KEY_MOCK = expect.any(String);
    let lastSaved;

    beforeEach(() => {
      lastSaved = null;
      invalidateAssetsCache();
      // Reset AsyncStorage mock behaviour
      const storage = require('@react-native-async-storage/async-storage');
      storage.getItem.mockReset();
      storage.setItem.mockReset();
      storage.setItem.mockImplementation(async (key, value) => { lastSaved = JSON.parse(value); });
    });

    it('collects every item in the category without truncating beyond the per-type limit', async () => {
      const storage = require('@react-native-async-storage/async-storage');
      storage.getItem.mockResolvedValue(JSON.stringify({
        favorites: { cities: [{ id: 'beijing' }], recipes: [], dynasties: [], people: [], names: [] },
      }));
      const allCities = Array.from({ length: 102 }, (_, i) => ({ id: `city-${i}` }));

      const result = await setCollectionActive('cities', true, allCities);

      // 1 pre-existing (beijing) + 102 collected = 103, no per-type truncation
      expect(result.favorites.cities.length).toBe(103);
      // persisted payload matches
      expect(lastSaved.favorites.cities.length).toBe(103);
    });

    it('merges with existing favourites without duplicating ids', async () => {
      const storage = require('@react-native-async-storage/async-storage');
      storage.getItem.mockResolvedValue(JSON.stringify({
        favorites: {
          cities: [{ id: 'beijing' }, { id: 'shanghai' }],
          recipes: [], dynasties: [], people: [], names: [],
        },
      }));
      const allCities = [{ id: 'beijing' }, { id: 'chengdu' }, { id: 'guangzhou' }];

      const result = await setCollectionActive('cities', true, allCities);

      expect(result.favorites.cities.map(c => c.id).sort())
        .toEqual(['beijing', 'chengdu', 'guangzhou', 'shanghai']);
    });

    it('clears the whole category when nextActive is false', async () => {
      const storage = require('@react-native-async-storage/async-storage');
      storage.getItem.mockResolvedValue(JSON.stringify({
        favorites: {
          recipes: [{ id: 'dumplings' }, { id: 'tangyuan' }],
          cities: [], dynasties: [], people: [], names: [],
        },
      }));

      const result = await setCollectionActive('recipes', false, []);

      expect(result.favorites.recipes).toEqual([]);
    });

    it('returns current state when type is missing', async () => {
      const storage = require('@react-native-async-storage/async-storage');
      storage.getItem.mockResolvedValue(JSON.stringify({
        favorites: { cities: [], recipes: [], dynasties: [], people: [], names: [] },
      }));
      const result = await setCollectionActive('', true, [{ id: 'x' }]);
      expect(result.favorites.cities).toEqual([]);
    });
  });
});