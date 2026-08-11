/**
 * Data-integrity tests for the CULTURAL_CONCEPTS glossary.
 *
 * After expanding the real glossary from ~14 to 61 concepts we assert the
 * invariants the UI relies on: every relatedConcepts target resolves, every
 * entry carries the fields the ConceptExplainerCard / ConceptGlossary render,
 * and the total count matches the curated scope.
 */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children, style }) => React.createElement(View, { style }, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

const REQUIRED_FIELDS = [
  'chinese',
  'pinyin',
  'english',
  'shortDesc',
  'longDesc',
  'westernEquivalent',
  'examples',
  'relatedConcepts',
  'category',
];

describe('CULTURAL_CONCEPTS data integrity', () => {
  let concepts;
  let byKey;

  beforeEach(() => {
    const mod = require('../../components/ConceptExplainer');
    concepts = mod.getAllCulturalConcepts();
    byKey = Object.fromEntries(concepts.map((c) => [c.key, c]));
  });

  test('the glossary is expanded to 61 curated concepts', () => {
    expect(concepts.length).toBe(61);
    expect(new Set(concepts.map((c) => c.key)).size).toBe(61); // no duplicate keys
  });

  test('every concept has all required display fields', () => {
    const problems = [];
    for (const c of concepts) {
      for (const f of REQUIRED_FIELDS) {
        if (c[f] === undefined || c[f] === null || c[f] === '') {
          problems.push(`${c.key}.${f} is empty`);
        }
      }
      if (!Array.isArray(c.examples) || c.examples.length === 0) {
        problems.push(`${c.key}.examples must be a non-empty array`);
      }
    }
    expect(problems).toEqual([]);
  });

  test('every relatedConcepts reference resolves to a known concept', () => {
    const dangling = [];
    for (const c of concepts) {
      for (const ref of c.relatedConcepts) {
        if (!byKey[ref]) dangling.push(`${c.key} -> ${ref}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  test('the known concept keys are present', () => {
    for (const key of ['harmony', 'confucianism', 'daoism', 'tea', 'zodiac', 'weiqi', 'guanxi', 'buddhism']) {
      expect(byKey[key]).toBeDefined();
    }
  });
});
