/**
 * Tests for cultural assets utility functions
 */

import {
  getProvinceId,
  buildProvinceStats,
  calculateNextStreak,
  getCultureRank,
  getProvinceConnectionMap,
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
      expect(getProvinceId({ province_id: 'guangdong' })).toBe('guangdong');
    });

    it('extracts provinceId', () => {
      expect(getProvinceId({ provinceId: 'sichuan' })).toBe('sichuan');
    });

    it('extracts province', () => {
      expect(getProvinceId({ province: 'beijing' })).toBe('beijing');
    });

    it('returns null for missing province', () => {
      expect(getProvinceId({})).toBeNull();
      expect(getProvinceId(null)).toBeNull();
      expect(getProvinceId(undefined)).toBeNull();
    });

    it('prioritizes province_id over other fields', () => {
      expect(getProvinceId({ province_id: 'first', provinceId: 'second', province: 'third' })).toBe('first');
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
      expect(result.provinces.find(p => p.province === 'guangdong').total).toBe(2);
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

      const gd = result.provinces.find(p => p.province === 'guangdong');
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
      expect(result.connectedProvinces.has('guangdong')).toBe(true);
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
});