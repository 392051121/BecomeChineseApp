/**
 * P0#2 — Collection bulk actions
 * Verifies the CollectionScreen module loads (syntax/JSX valid) and that the
 * bulk-action data capability is wired through without runtime resolution errors.
 */

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('../../utils/culturalAssets', () => {
  const actual = jest.requireActual('../../utils/culturalAssets');
  return {
    ...actual,
    getCulturalAssets: jest.fn().mockResolvedValue({
      favorites: { cities: [], recipes: [], dynasties: [], people: [], names: [] },
      quiz: { streak: 0, totalSolved: 0 },
      stats: { namesGenerated: 0 },
      meta: { updatedAt: null },
    }),
    getStampCollection: jest.fn().mockResolvedValue([]),
    getStampStats: jest.fn().mockResolvedValue({ total: 0, byRarity: {} }),
  };
});

jest.mock('../../utils/stampCollection', () => ({
  getStampCollection: jest.fn().mockResolvedValue([]),
  getStampStats: jest.fn().mockResolvedValue({ total: 0, byRarity: {} }),
}));

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('CollectionScreen Module', () => {
  it('loads and requires the CollectionScreen module without syntax errors', () => {
    const mod = require('../../screens/CollectionScreen');
    expect(mod.CollectionScreen).toBeDefined();
    // Bulk data capability is exported from the data layer the screen uses
    const assets = require('../../utils/culturalAssets');
    expect(typeof assets.setCollectionActive).toBe('function');
  });

  it('exposes setCollectionActive bulk API', () => {
    const assets = require('../../utils/culturalAssets');
    expect(assets.setCollectionActive).toBeDefined();
  });
});
