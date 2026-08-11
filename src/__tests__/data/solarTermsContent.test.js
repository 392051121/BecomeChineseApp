/**
 * Temp validation for P1#5: all relatedContent IDs must resolve to real records.
 * Also covers pinyin ↔ English dual-ID bridging used by deep links.
 */
import {
  solarTerms,
  getTermRecipeIds,
  getTermFestivalName,
  getSolarTermById,
  normalizeSolarTermId,
  SOLAR_TERM_PINYIN_TO_KEY,
  SOLAR_TERM_KEY_TO_PINYIN,
} from '../../data/solarTerms';
import { recipes } from '../../data/recipes';
import { cities } from '../../data/cities';
import { getCurrentSolarTerm, getCurrentSeason } from '../../utils/solarTermContent';

describe('P1#5 solar term related content', () => {
  const rids = new Set(recipes.map((r) => r.id));
  const cids = new Set(cities.map((c) => c.id));

  it('every term has relatedContent with resolvable IDs', () => {
    expect(solarTerms.length).toBe(24);
    const bad = [];
    for (const t of solarTerms) {
      expect(Array.isArray(t.relatedContent)).toBe(true);
      for (const item of t.relatedContent) {
        if (!item.id) { bad.push(`${t.id}->missing-id`); continue; }
        if (item.type === 'recipe' && !rids.has(item.id)) bad.push(`${t.id}->recipe:${item.id}`);
        if (item.type === 'city' && !cids.has(item.id)) bad.push(`${t.id}->city:${item.id}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('each term gets ~2-4 related items (recipe+city+dynasty)', () => {
    for (const t of solarTerms) {
      expect(t.relatedContent.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('getTermRecipeIds returns real recipe ids for every term', () => {
    for (const t of solarTerms) {
      const ids = getTermRecipeIds(t.key, t.season);
      expect(ids.length).toBeGreaterThan(0);
      for (const id of ids) expect(rids.has(id) || id === '').toBe(true);
    }
  });

  it('getTermFestivalName returns a name for key seasonal holidays', () => {
    expect(getTermFestivalName('pure-brightness')).toBe('Qingming Festival');
    expect(getTermFestivalName('winter-solstice')).toBe('Winter Solstice Festival');
    expect(getTermFestivalName('autumn-equinox')).toContain('Mid-Autumn');
  });
});

describe('solar term dual-ID bridge (pinyin ↔ English)', () => {
  it('maps all 24 pinyin festival IDs to canonical English keys', () => {
    expect(Object.keys(SOLAR_TERM_PINYIN_TO_KEY)).toHaveLength(24);
    expect(Object.keys(SOLAR_TERM_KEY_TO_PINYIN)).toHaveLength(24);
    for (const [pinyin, key] of Object.entries(SOLAR_TERM_PINYIN_TO_KEY)) {
      expect(SOLAR_TERM_KEY_TO_PINYIN[key]).toBe(pinyin);
      expect(normalizeSolarTermId(pinyin)).toBe(key);
      expect(normalizeSolarTermId(key)).toBe(key);
    }
  });

  it('getSolarTermById resolves both pinyin and English IDs to the same term', () => {
    const cases = [
      ['liqiu', 'start-of-autumn'],
      ['chushu', 'limit-of-heat'],
      ['chunfen', 'spring-equinox'],
      ['dongzhi', 'winter-solstice'],
      ['bailu', 'white-dew'],
    ];
    for (const [pinyin, english] of cases) {
      const byPinyin = getSolarTermById(pinyin);
      const byEnglish = getSolarTermById(english);
      expect(byPinyin).toBeTruthy();
      expect(byEnglish).toBeTruthy();
      expect(byPinyin.id).toBe(english);
      expect(byEnglish.id).toBe(english);
      expect(byPinyin).toBe(byEnglish);
    }
  });

  it('unknown or empty ids do not silently invent a term', () => {
    expect(getSolarTermById('not-a-real-term')).toBeUndefined();
    expect(getSolarTermById('')).toBeUndefined();
    expect(getSolarTermById(null)).toBeUndefined();
    expect(normalizeSolarTermId('')).toBeNull();
  });

  it('home solarTermContent returns festival shape + detailId for Seasons deep-link', () => {
    // Around Start of Autumn (Aug 11 in this session's calendar)
    const d = new Date(2026, 7, 11); // month is 0-indexed → August 11
    const term = getCurrentSolarTerm(d);
    expect(term).toBeTruthy();
    expect(term.nameEn).toBeTruthy();
    expect(term.nameCn).toBeTruthy();
    expect(term.detailId).toBe('start-of-autumn');
    expect(term.id === 'liqiu' || term.detailId === 'start-of-autumn').toBe(true);
    expect(getCurrentSeason(d)).toBe('autumn');
    // Deep-link target must resolve through SolarTermDetail path
    expect(getSolarTermById(term.detailId)?.id).toBe('start-of-autumn');
    expect(getSolarTermById(term.id)?.id).toBe('start-of-autumn');
  });
});
