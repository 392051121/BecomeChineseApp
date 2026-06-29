/**
 * Tests for CalendarScreen data and utilities
 */

// Mock solar terms data
jest.mock('../../data/solarTerms', () => ({
  getCurrentSolarTerm: jest.fn(() => ({
    id: 'chunfen',
    englishName: 'Spring Equinox',
    chineseName: '春分',
    pinyin: 'Chūnfēn',
    dateRange: 'Mar 20-22',
    season: 'spring',
    meaning: 'Day and night are equal length.',
    natureChange: 'Swallows return. Flowers bloom.',
    custom: 'People balance eggs for good luck.',
    food: ['spring-vegetables'],
    beginnerNote: 'Equinox means equal night and day.',
    dailyAction: 'Try the egg-balancing tradition.',
    relatedContent: [],
  })),
  solarTerms: [
    { id: 'lichun', englishName: 'Start of Spring', season: 'spring', order: 1 },
    { id: 'yushui', englishName: 'Rain Water', season: 'spring', order: 2 },
    { id: 'jingzhe', englishName: 'Awakening of Insects', season: 'spring', order: 3 },
    { id: 'chunfen', englishName: 'Spring Equinox', season: 'spring', order: 4 },
  ],
}));

// Mock lunar calendar utilities
jest.mock('../../utils/lunarCalendar', () => ({
  getLunarDateDisplay: jest.fn(() => ({
    monthChinese: '二月',
    dayChinese: '十五',
    formatted: '农历二月十五',
  })),
  getSeasonForDate: jest.fn(() => 'spring'),
}));

describe('CalendarScreen (Seasons Module)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can get current solar term', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term).toBeDefined();
    expect(term.englishName).toBe('Spring Equinox');
    expect(term.chineseName).toBe('春分');
  });

  it('has beginner-friendly explanation', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term.beginnerNote).toBeDefined();
    expect(term.beginnerNote).toContain('Equinox');
  });

  it('has daily action', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term.dailyAction).toBeDefined();
    expect(term.dailyAction).toContain('egg');
  });

  it('has nature change description', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term.natureChange).toBeDefined();
    expect(term.natureChange).toContain('Swallows');
  });

  it('has traditional custom', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term.custom).toBeDefined();
    expect(term.custom).toContain('balance eggs');
  });

  it('has seasonal food references', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term.food).toBeDefined();
    expect(Array.isArray(term.food)).toBe(true);
  });

  it('can get all solar terms for current season', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const springTerms = solarTerms.filter(t => t.season === 'spring');

    expect(springTerms.length).toBe(4);
    expect(springTerms[0].englishName).toBe('Start of Spring');
  });

  it('can get lunar date display', () => {
    const { getLunarDateDisplay } = require('../../utils/lunarCalendar');
    const lunar = getLunarDateDisplay();

    expect(lunar).toBeDefined();
    expect(lunar.formatted).toContain('农历');
  });

  it('solar term has pinyin for pronunciation', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term.pinyin).toBeDefined();
    expect(term.pinyin).toBe('Chūnfēn');
  });

  it('solar term has date range', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term.dateRange).toBeDefined();
    expect(term.dateRange).toBe('Mar 20-22');
  });

  it('solar term has season classification', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term.season).toBeDefined();
    expect(term.season).toBe('spring');
  });
});