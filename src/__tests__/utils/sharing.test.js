/**
 * Tests for sharing utility functions - pure function tests
 */

jest.mock('../../utils/errorHandling', () => ({
  logger: {
    error: jest.fn(),
  },
}));

import {
  generateAtlasShareText,
  generateQuizShareText,
  generateCityShareText,
  generateRecipeShareText,
  generateDynastyShareText,
} from '../../utils/sharing';

describe('Sharing Utilities', () => {
  describe('generateAtlasShareText', () => {
    it('generates text with all required fields', () => {
      const data = {
        hanzi: '北京',
        pinyin: 'Běijīng',
        meaning: 'Northern Capital',
        rank: 'Explorer',
        regions: 5,
        savedCount: 12,
      };

      const result = generateAtlasShareText(data);

      expect(result).toContain('北京');
      expect(result).toContain('Běijīng');
      expect(result).toContain('Northern Capital');
      expect(result).toContain('5 regions');
      expect(result).toContain('Explorer');
      expect(result).toContain('12 items');
      expect(result).toContain('BecomeChinese Atlas');
    });

    it('includes app branding', () => {
      const data = {
        hanzi: '测试',
        pinyin: 'test',
        meaning: 'Test',
        rank: 'Test',
        regions: 0,
        savedCount: 0,
      };

      const result = generateAtlasShareText(data);
      expect(result).toContain('BecomeChinese');
    });
  });

  describe('generateQuizShareText', () => {
    it('generates correct answer text', () => {
      const data = {
        question: 'What is the capital of Tang Dynasty?',
        correct: true,
        streak: 7,
        totalSolved: 50,
        solarTerm: 'Spring Equinox',
      };

      const result = generateQuizShareText(data);

      expect(result).toContain('Correct!');
      expect(result).toContain('7 days');
      expect(result).toContain('50 solved');
      expect(result).toContain('Spring Equinox');
    });

    it('generates incorrect answer text', () => {
      const data = {
        question: 'Test question',
        correct: false,
        streak: 0,
        totalSolved: 10,
        solarTerm: 'Start of Spring',
      };

      const result = generateQuizShareText(data);

      expect(result).toContain('Learned something new');
      expect(result).toContain('0 days');
      expect(result).toContain('10 solved');
    });
  });

  describe('generateCityShareText', () => {
    it('generates city share text with highlights', () => {
      const data = {
        nameCn: '西安',
        nameEn: 'Xi\'an',
        province: 'Shaanxi',
        tagline: 'Ancient capital of China',
        highlights: ['Terracotta Army', 'City Wall', 'Muslim Quarter'],
      };

      const result = generateCityShareText(data);

      expect(result).toContain('西安');
      expect(result).toContain('Xi\'an');
      expect(result).toContain('Shaanxi');
      expect(result).toContain('Ancient capital');
      expect(result).toContain('Terracotta Army');
    });

    it('handles empty highlights', () => {
      const data = {
        nameCn: '测试',
        nameEn: 'Test',
        province: 'Test Province',
        tagline: 'Test tagline',
        highlights: [],
      };

      const result = generateCityShareText(data);
      expect(result).toContain('测试');
      expect(result).toContain('Test');
      expect(result).not.toContain('Highlights:');
    });
  });

  describe('generateRecipeShareText', () => {
    it('generates recipe share text', () => {
      const data = {
        nameCn: '宫保鸡丁',
        nameEn: 'Kung Pao Chicken',
        province: 'Sichuan',
        culturalStory: 'A classic Sichuan dish with spicy and nutty flavors...',
        tasteProfile: ['Spicy', 'Savory', 'Nutty'],
      };

      const result = generateRecipeShareText(data);

      expect(result).toContain('宫保鸡丁');
      expect(result).toContain('Kung Pao Chicken');
      expect(result).toContain('Sichuan');
      expect(result).toContain('Spicy');
    });

    it('handles missing taste profile', () => {
      const data = {
        nameCn: '测试',
        nameEn: 'Test',
        province: 'Test',
        culturalStory: 'Test story',
        tasteProfile: null,
      };

      const result = generateRecipeShareText(data);
      expect(result).toContain('Traditional');
    });
  });

  describe('generateDynastyShareText', () => {
    it('generates dynasty share text', () => {
      const data = {
        nameCn: '唐朝',
        nameEn: 'Tang Dynasty',
        period: '618-907 AD',
        tagline: 'Golden age of Chinese culture',
        contribution: { item: 'Poetry and art flourished' },
      };

      const result = generateDynastyShareText(data);

      expect(result).toContain('唐朝');
      expect(result).toContain('Tang Dynasty');
      expect(result).toContain('618-907 AD');
      expect(result).toContain('Golden age');
      expect(result).toContain('Poetry');
    });

    it('handles missing contribution', () => {
      const data = {
        nameCn: '测试',
        nameEn: 'Test',
        period: 'Test period',
        tagline: 'Test tagline',
        contribution: null,
      };

      const result = generateDynastyShareText(data);
      expect(result).toContain('Cultural legacy');
    });
  });
});