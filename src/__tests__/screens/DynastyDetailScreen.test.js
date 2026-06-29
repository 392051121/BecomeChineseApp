/**
 * Tests for DynastyDetailScreen data access
 */

// Mock data
jest.mock('../../data/dynasties', () => ({
  dynasties: [
    {
      id: 'tang',
      nameEn: 'Tang Dynasty',
      nameCn: '唐朝',
      period: '618-907 AD',
      tagline: 'Golden age of Chinese culture',
      summary: 'The Tang Dynasty is considered a golden age...',
      achievements: ['Poetry flourished', 'Art developed'],
      notableEmperors: [{ name: 'Emperor Taizong' }],
    },
    {
      id: 'han',
      nameEn: 'Han Dynasty',
      nameCn: '汉朝',
      period: '206 BC - 220 AD',
      tagline: 'Foundation of Chinese civilization',
      summary: 'The Han Dynasty established lasting systems...',
      achievements: ['Silk Road opened', 'Paper invented'],
      notableEmperors: [{ name: 'Emperor Wu' }],
    },
  ],
}));

jest.mock('../../utils/culturalContext', () => ({
  getWhyItMatters: jest.fn((type, item) => {
    if (type === 'dynasty' && item?.id === 'tang') {
      return 'The Tang Dynasty shaped Chinese civilization through poetry, art, and international exchange.';
    }
    return 'This dynasty shaped Chinese history.';
  }),
  getBeginnerNote: jest.fn((type) => {
    if (type === 'dynasty') {
      return 'A dynasty is a period in Chinese history ruled by one royal family.';
    }
    return 'A historical period.';
  }),
}));

jest.mock('../../utils/exploreNext', () => ({
  getExploreNextItems: jest.fn((sourceType, sourceId) => {
    if (sourceType === 'dynasty' && sourceId === 'tang') {
      return [
        { type: 'city', id: 'xian', title: 'Xi\'an', reason: 'Tang capital Chang\'an' },
        { type: 'person', id: 'libai', title: 'Li Bai', reason: 'Famous Tang poet' },
      ];
    }
    return [];
  }),
}));

describe('DynastyDetailScreen Data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can access dynasty data by ID', () => {
    const { dynasties } = require('../../data/dynasties');
    const tang = dynasties.find(d => d.id === 'tang');

    expect(tang).toBeDefined();
    expect(tang.nameEn).toBe('Tang Dynasty');
    expect(tang.period).toBe('618-907 AD');
  });

  it('dynasty has Chinese name', () => {
    const { dynasties } = require('../../data/dynasties');
    const tang = dynasties.find(d => d.id === 'tang');

    expect(tang.nameCn).toBeDefined();
    expect(tang.nameCn).toBe('唐朝');
  });

  it('dynasty has tagline', () => {
    const { dynasties } = require('../../data/dynasties');
    const tang = dynasties.find(d => d.id === 'tang');

    expect(tang.tagline).toBeDefined();
    expect(tang.tagline).toContain('Golden age');
  });

  it('dynasty has achievements', () => {
    const { dynasties } = require('../../data/dynasties');
    const tang = dynasties.find(d => d.id === 'tang');

    expect(tang.achievements).toBeDefined();
    expect(Array.isArray(tang.achievements)).toBe(true);
    expect(tang.achievements.length).toBeGreaterThan(0);
  });

  it('dynasty has notable emperors', () => {
    const { dynasties } = require('../../data/dynasties');
    const tang = dynasties.find(d => d.id === 'tang');

    expect(tang.notableEmperors).toBeDefined();
    expect(Array.isArray(tang.notableEmperors)).toBe(true);
  });

  it('can get why it matters text', () => {
    const { getWhyItMatters } = require('../../utils/culturalContext');
    const text = getWhyItMatters('dynasty', { id: 'tang' });

    expect(text).toBeDefined();
    expect(text).toContain('Tang');
  });

  it('can get beginner note', () => {
    const { getBeginnerNote } = require('../../utils/culturalContext');
    const note = getBeginnerNote('dynasty');

    expect(note).toBeDefined();
    expect(note).toContain('dynasty');
    expect(note).toContain('family');
  });

  it('can get explore next items', () => {
    const { getExploreNextItems } = require('../../utils/exploreNext');
    const items = getExploreNextItems('dynasty', 'tang');

    expect(items).toBeDefined();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it('explore next items have reasons', () => {
    const { getExploreNextItems } = require('../../utils/exploreNext');
    const items = getExploreNextItems('dynasty', 'tang');

    expect(items[0].reason).toBeDefined();
    expect(items[0].reason).toContain('capital');
  });

  it('can access multiple dynasties', () => {
    const { dynasties } = require('../../data/dynasties');

    expect(dynasties.length).toBeGreaterThanOrEqual(2);
    expect(dynasties.find(d => d.id === 'han')).toBeDefined();
  });
});