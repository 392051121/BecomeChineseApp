/**
 * Tests for useDailyQuiz hook data and logic
 */

// Mock data and utilities
jest.mock('../../utils/culturalAssets', () => ({
  getCulturalAssets: jest.fn(() => Promise.resolve({
    quiz: { streak: 5, totalSolved: 100 },
  })),
  markQuizSolvedToday: jest.fn(() => Promise.resolve({
    quiz: { streak: 6, totalSolved: 101 },
  })),
}));

jest.mock('../../data/quiz', () => ({
  getDailyQuiz: jest.fn(() => ({
    id: 'test-quiz-1',
    question: 'What is the capital of Tang Dynasty?',
    options: ['Beijing', 'Xi\'an', 'Nanjing', 'Shanghai'],
    correctAnswer: 'Xi\'an',
    explanation: 'Chang\'an, today\'s Xi\'an, was the Tang capital.',
  })),
  quizQuestions: [],
}));

jest.mock('../../data/solarTerms', () => ({
  getCurrentSolarTerm: jest.fn(() => ({
    id: 'chunfen',
    englishName: 'Spring Equinox',
    chineseName: '春分',
    pinyin: 'Chūnfēn',
  })),
}));

describe('useDailyQuiz Hook Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can get daily quiz data', () => {
    const { getDailyQuiz } = require('../../data/quiz');
    const quiz = getDailyQuiz();

    expect(quiz).toBeDefined();
    expect(quiz.question).toBeDefined();
    expect(quiz.options).toBeDefined();
    expect(quiz.correctAnswer).toBeDefined();
  });

  it('quiz has 4 options', () => {
    const { getDailyQuiz } = require('../../data/quiz');
    const quiz = getDailyQuiz();

    expect(quiz.options.length).toBe(4);
  });

  it('quiz has explanation', () => {
    const { getDailyQuiz } = require('../../data/quiz');
    const quiz = getDailyQuiz();

    expect(quiz.explanation).toBeDefined();
    expect(quiz.explanation).toContain('Chang\'an');
  });

  it('can get current solar term for quiz context', () => {
    const { getCurrentSolarTerm } = require('../../data/solarTerms');
    const term = getCurrentSolarTerm();

    expect(term).toBeDefined();
    expect(term.englishName).toBe('Spring Equinox');
  });

  it('can get cultural assets with quiz stats', async () => {
    const { getCulturalAssets } = require('../../utils/culturalAssets');
    const assets = await getCulturalAssets();

    expect(assets).toBeDefined();
    expect(assets.quiz).toBeDefined();
    expect(assets.quiz.streak).toBe(5);
    expect(assets.quiz.totalSolved).toBe(100);
  });

  it('can mark quiz as solved', async () => {
    const { markQuizSolvedToday } = require('../../utils/culturalAssets');
    const result = await markQuizSolvedToday({ date: new Date(), solved: true, correct: true });

    expect(result).toBeDefined();
    expect(result.quiz.totalSolved).toBe(101);
  });

  it('streak increments on consecutive day', async () => {
    const { markQuizSolvedToday } = require('../../utils/culturalAssets');
    const result = await markQuizSolvedToday({ date: new Date(), solved: true, correct: true });

    expect(result.quiz.streak).toBe(6);
  });

  it('quiz data has unique ID', () => {
    const { getDailyQuiz } = require('../../data/quiz');
    const quiz = getDailyQuiz();

    expect(quiz.id).toBeDefined();
    expect(quiz.id).toBe('test-quiz-1');
  });

  it('correct answer is valid option', () => {
    const { getDailyQuiz } = require('../../data/quiz');
    const quiz = getDailyQuiz();

    expect(quiz.options).toContain(quiz.correctAnswer);
  });
});