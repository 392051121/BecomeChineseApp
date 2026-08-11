/**
 * Unit tests for LinkedConceptText's pure text-parsing logic.
 *
 * parseConceptLinks is the heart of the glossary/wiki-link feature: it turns a
 * plain-text paragraph into an ordered list of segments where spans matching a
 * known cultural concept are flagged for linking. We test the algorithm with an
 * injected, controlled glossary so edge cases (word boundaries, CJK matching,
 * overlap resolution, escaping) are deterministic and not coupled to the
 * ever-growing real data set.
 */

let parseConceptLinks;

// Inject a small, fully-controlled glossary before loading the module.
const MOCK_CONCEPTS = [
  { key: 'harmony', english: 'Harmony', chinese: '和谐' },
  { key: 'confucianism', english: 'Confucianism', chinese: '儒家' },
  { key: 'chopsticks', english: 'Chopsticks', chinese: '筷子' },
  // English label containing regex metachars -> check escaping stays literal.
  // It starts and ends with alphanumerics so \b word boundaries still work,
  // while the embedded "." would be a regex metachar if not escaped.
  { key: 'ceDay', english: 'C.E. Day', chinese: '建号日' },
];

jest.mock('../../components/ConceptExplainer', () => ({
  getAllCulturalConcepts: () => MOCK_CONCEPTS,
  getCulturalConcept: (key) => MOCK_CONCEPTS.find((c) => c.key === key) || null,
  ConceptExplainerCard: () => null,
}));

jest.mock('../../theme/ThemeContext', () => ({
  useTheme: () => ({ colors: { primary: '#8B2D2D', surface: '#fff', border: '#ccc' } }),
}));

beforeAll(() => {
  ({ parseConceptLinks } = require('../../components/LinkedConceptText'));
});

describe('parseConceptLinks', () => {
  test('returns a single plain segment when text is empty/missing', () => {
    expect(parseConceptLinks('')).toEqual([{ text: '', conceptKey: null }]);
    expect(parseConceptLinks(undefined)).toEqual([{ text: '', conceptKey: null }]);
    expect(parseConceptLinks(123)).toEqual([{ text: '', conceptKey: null }]);
  });

  test('returns a single plain segment when no concept is present', () => {
    expect(parseConceptLinks('A completely unrelated sentence about rice.'))
      .toEqual([{ text: 'A completely unrelated sentence about rice.', conceptKey: null }]);
  });

  test('links an English label with word-boundary matching', () => {
    // "Harmony" should be captured regardless of case.
    const segs = parseConceptLinks('Live in harmony with nature.');
    expect(segs).toEqual([
      { text: 'Live in ', conceptKey: null },
      { text: 'harmony', conceptKey: 'harmony' },
      { text: ' with nature.', conceptKey: null },
    ]);
  });

  test('does NOT match a prefix of another word (word boundary)', () => {
    // "Harmonious" must not link to concept "Harmony".
    const segs = parseConceptLinks('She has a harmonious voice.');
    expect(segs.every((s) => s.conceptKey === null)).toBe(true);
  });

  test('links a Chinese label as an exact substring', () => {
    const segs = parseConceptLinks('传统儒家讲究尊师重道。');
    expect(segs).toContainEqual({ text: '儒家', conceptKey: 'confucianism' });
  });

  test('links multiple distinct concepts in one paragraph', () => {
    const segs = parseConceptLinks('Confucianism stresses harmony and chopsticks etiquette.');
    const linked = segs.filter((s) => s.conceptKey !== null).map((s) => s.conceptKey);
    expect(linked).toContain('confucianism');
    expect(linked).toContain('harmony');
    expect(linked).toContain('chopsticks');
  });

  test('reassembled concatenation equals original text', () => {
    const text = 'Confucianism stresses harmony; 用筷子吃饭。';
    const segs = parseConceptLinks(text);
    const rebuilt = segs.map((s) => s.text).join('');
    expect(rebuilt).toBe(text);
  });

  test('drop plain text preserves the source order of segments', () => {
    const text = 'Before 和谐, then harmony, then 筷子.';
    const segs = parseConceptLinks(text);
    expect(segs).toEqual([
      { text: 'Before ', conceptKey: null },
      { text: '和谐', conceptKey: 'harmony' },
      { text: ', then ', conceptKey: null },
      { text: 'harmony', conceptKey: 'harmony' },
      { text: ', then ', conceptKey: null },
      { text: '筷子', conceptKey: 'chopsticks' },
      { text: '.', conceptKey: null },
    ]);
  });

  test('escapes regex metacharacters in concept labels', () => {
    // "C.E. Day" contains a "." that is regex-special; if not escaped the "." 
    // would match any char. Word boundaries still work because the label is
    // alphanumeric at both ends.
    const segs = parseConceptLinks('Happy C.E. Day everyone!');
    expect(segs).toContainEqual({ text: 'C.E. Day', conceptKey: 'ceDay' });
  });
});
