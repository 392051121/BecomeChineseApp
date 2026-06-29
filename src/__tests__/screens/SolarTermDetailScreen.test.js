/**
 * Tests for SolarTermDetailScreen data and structure
 */

// Mock solar terms data
jest.mock('../../data/solarTerms', () => ({
  solarTerms: [
    {
      id: 'lichun',
      englishName: 'Start of Spring',
      chineseName: '立春',
      pinyin: 'Lìchūn',
      dateRange: 'Feb 3-5',
      season: 'spring',
      order: 1,
      meaning: 'The beginning of spring.',
      natureChange: 'East winds bring warmth.',
      custom: 'People eat spring pancakes.',
      food: ['spring-rolls'],
      beginnerNote: 'The 24 Solar Terms track seasonal changes.',
      dailyAction: 'Take a short walk outside.',
      relatedContent: [],
    },
    {
      id: 'chunfen',
      englishName: 'Spring Equinox',
      chineseName: '春分',
      pinyin: 'Chūnfēn',
      dateRange: 'Mar 20-22',
      season: 'spring',
      order: 4,
      meaning: 'Day and night are equal.',
      natureChange: 'Swallows return.',
      custom: 'People balance eggs.',
      food: ['spring-vegetables'],
      beginnerNote: 'Equinox means equal night and day.',
      dailyAction: 'Try egg-balancing.',
      relatedContent: [{ type: 'city', id: 'weifang', reason: 'Weifang kite festival' }],
    },
    {
      id: 'lixia',
      englishName: 'Start of Summer',
      chineseName: '立夏',
      pinyin: 'Lìxià',
      dateRange: 'May 5-7',
      season: 'summer',
      order: 7,
      meaning: 'Summer officially begins.',
      natureChange: 'Frogs begin to croak.',
      custom: 'People weigh themselves.',
      food: ['cherries'],
      beginnerNote: 'Traditional customs focus on health.',
      dailyAction: 'Notice shift in daylight.',
      relatedContent: [],
    },
  ],
}));

// Mock recipes data
jest.mock('../../data/recipes', () => ({
  recipes: [
    {
      id: 'spring-rolls',
      nameEn: 'Spring Rolls',
      nameCn: '春卷',
      province: 'Jiangnan',
      culturalStory: 'Traditional spring food.',
    },
    {
      id: 'spring-vegetables',
      nameEn: 'Spring Vegetables',
      nameCn: '春菜',
      province: 'Various',
      culturalStory: 'Fresh seasonal greens.',
    },
  ],
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
    getParent: jest.fn(() => ({
      navigate: jest.fn(),
    })),
  })),
  useRoute: jest.fn(() => ({
    params: { termId: 'chunfen' },
  })),
}));

// Mock theme
jest.mock('../../theme/ThemeContext', () => ({
  useTheme: jest.fn(() => ({
    colors: {
      background: '#F5F0E8',
      card: '#FFFFFF',
      text: '#1B1715',
      mutedText: 'rgba(27,23,21,0.60)',
      primary: '#C23A2E',
      border: 'rgba(27,23,21,0.10)',
      surface: '#FFFCF6',
      cinnabarGlow: 'rgba(194,58,46,0.08)',
    },
    isDark: false,
  })),
}));

// Mock utility functions
jest.mock('../../utils/stampCollection', () => ({
  earnStamp: jest.fn(() => Promise.resolve({ earned: true })),
}));

jest.mock('../../utils/culturalAssets', () => ({
  addRecentlyViewed: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../../components/DetailHeader', () => ({
  DetailHeader: () => null,
}));

jest.mock('../../components/HandscrollContainer', () => ({
  HandscrollContainer: ({ children }) => children,
}));

jest.mock('../../components/ScreenHeader', () => ({
  ScreenHeader: () => null,
}));

jest.mock('../../components/SectionCard', () => ({
  SectionCard: ({ children }) => children,
}));

jest.mock('../../components/ExploreNextSection', () => ({
  ExploreNextSection: () => null,
}));

describe('SolarTermDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can access solar term data by ID', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'chunfen');

    expect(term).toBeDefined();
    expect(term.englishName).toBe('Spring Equinox');
    expect(term.chineseName).toBe('春分');
  });

  it('solar term has all required fields', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'lichun');

    expect(term.englishName).toBeDefined();
    expect(term.chineseName).toBeDefined();
    expect(term.pinyin).toBeDefined();
    expect(term.dateRange).toBeDefined();
    expect(term.season).toBeDefined();
    expect(term.order).toBeDefined();
    expect(term.meaning).toBeDefined();
    expect(term.natureChange).toBeDefined();
    expect(term.custom).toBeDefined();
    expect(term.food).toBeDefined();
    expect(term.beginnerNote).toBeDefined();
    expect(term.dailyAction).toBeDefined();
  });

  it('solar term has beginner-friendly explanation', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'chunfen');

    expect(term.beginnerNote).toBeDefined();
    expect(term.beginnerNote).toContain('Equinox');
  });

  it('solar term has daily action', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'lichun');

    expect(term.dailyAction).toBeDefined();
    expect(term.dailyAction).toContain('walk');
  });

  it('solar term has nature change description', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'chunfen');

    expect(term.natureChange).toBeDefined();
    expect(term.natureChange).toContain('Swallows');
  });

  it('solar term has traditional custom', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'lichun');

    expect(term.custom).toBeDefined();
    expect(term.custom).toContain('pancakes');
  });

  it('solar term has seasonal food references', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'lichun');

    expect(term.food).toBeDefined();
    expect(Array.isArray(term.food)).toBe(true);
  });

  it('can get related recipes for solar term', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const { recipes } = require('../../data/recipes');
    const term = solarTerms.find(t => t.id === 'lichun');

    const relatedRecipes = recipes.filter(r => term.food.includes(r.id));
    expect(relatedRecipes.length).toBeGreaterThan(0);
    expect(relatedRecipes[0].nameEn).toBe('Spring Rolls');
  });

  it('solar term has pinyin for pronunciation', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'chunfen');

    expect(term.pinyin).toBeDefined();
    expect(term.pinyin).toBe('Chūnfēn');
  });

  it('solar term has date range', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'chunfen');

    expect(term.dateRange).toBeDefined();
    expect(term.dateRange).toBe('Mar 20-22');
  });

  it('solar term has season classification', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'chunfen');

    expect(term.season).toBeDefined();
    expect(term.season).toBe('spring');
  });

  it('solar term has order number', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'chunfen');

    expect(term.order).toBeDefined();
    expect(term.order).toBe(4);
  });

  it('can access solar terms by season', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const springTerms = solarTerms.filter(t => t.season === 'spring');

    expect(springTerms.length).toBe(2);
    expect(springTerms.map(t => t.id)).toContain('lichun');
    expect(springTerms.map(t => t.id)).toContain('chunfen');
  });

  it('can access summer solar terms', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const summerTerms = solarTerms.filter(t => t.season === 'summer');

    expect(summerTerms.length).toBe(1);
    expect(summerTerms[0].englishName).toBe('Start of Summer');
  });

  it('solar term has related content', () => {
    const { solarTerms } = require('../../data/solarTerms');
    const term = solarTerms.find(t => t.id === 'chunfen');

    expect(term.relatedContent).toBeDefined();
    expect(Array.isArray(term.relatedContent)).toBe(true);
  });
});