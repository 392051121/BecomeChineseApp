/**
 * Exploration stats — multi-province tracking for maps / Profile
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  trackViewedItem,
  getExplorationStats,
  clearExplorationStats,
  scrubExplorationProvinces,
} from '../../utils/explorationStats';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('explorationStats', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue(undefined);
    AsyncStorage.removeItem.mockResolvedValue(undefined);
    await clearExplorationStats();
  });

  it('tracks a city province with canonical id', async () => {
    const stats = await trackViewedItem('city', {
      id: 'chengdu',
      province_id: 'Sichuan',
    });
    expect(stats.citiesViewed).toContain('chengdu');
    expect(Object.keys(stats.provincesExplored)).toContain('Sichuan');
    expect(stats.provincesExplored.Sichuan).toContain('chengdu');
  });

  it('normalizes display province strings', async () => {
    const stats = await trackViewedItem('recipe', {
      id: 'mapo-tofu',
      province: 'Chengdu / Sichuan',
    });
    expect(Object.keys(stats.provincesExplored)).toContain('Sichuan');
  });

  it('writes heartland provinces only when provided for a dynasty', async () => {
    const stats = await trackViewedItem('dynasty', {
      id: 'zhou',
      province_id: 'Shaanxi',
      heartlandProvinces: ['Shaanxi', 'Henan', 'Shandong', 'Shanxi', 'Hubei'],
    });
    expect(stats.dynastiesViewed).toContain('zhou');
    expect(Object.keys(stats.provincesExplored).sort()).toEqual(
      ['Henan', 'Hubei', 'Shaanxi', 'Shandong', 'Shanxi'].sort()
    );
    for (const id of ['Shaanxi', 'Henan', 'Shandong', 'Shanxi', 'Hubei']) {
      expect(stats.provincesExplored[id]).toContain('zhou');
    }
  });

  it('tracks only capital province for dynasty without heartland payload', async () => {
    const stats = await trackViewedItem('dynasty', {
      id: 'qin',
      province_id: 'Shaanxi',
    });
    expect(stats.dynastiesViewed).toContain('qin');
    expect(Object.keys(stats.provincesExplored)).toEqual(['Shaanxi']);
  });

  it('does not apply heartlandProvinces extras on city items', async () => {
    const stats = await trackViewedItem('city', {
      id: 'mystery',
      province_id: 'Beijing',
      heartlandProvinces: ['Sichuan', 'Yunnan', 'Tibet'],
    });
    expect(Object.keys(stats.provincesExplored)).toEqual(['Beijing']);
  });

  it('ignores General and blank province keys', async () => {
    const stats = await trackViewedItem('city', {
      id: 'mystery',
      province_id: 'General',
      heartlandProvinces: ['General', '', null],
    });
    expect(stats.citiesViewed).toContain('mystery');
    expect(Object.keys(stats.provincesExplored || {})).toHaveLength(0);
  });

  it('scrubExplorationProvinces drops invalid keys and merges aliases', () => {
    const { stats, changed } = scrubExplorationProvinces({
      citiesViewed: ['a'],
      provincesExplored: {
        sichuan: ['x'],
        Sichuan: ['y'],
        General: ['z'],
        'Chengdu / Sichuan': ['w'],
        nonsense: ['n'],
      },
    });
    expect(changed).toBe(true);
    expect(Object.keys(stats.provincesExplored)).toEqual(['Sichuan']);
    expect(stats.provincesExplored.Sichuan.sort()).toEqual(['w', 'x', 'y'].sort());
  });

  it('getExplorationStats returns defaults when empty', async () => {
    const stats = await getExplorationStats();
    expect(stats).toMatchObject({
      citiesViewed: [],
      recipesViewed: [],
      dynastiesViewed: [],
      peopleViewed: [],
      provincesExplored: {},
    });
  });
});
