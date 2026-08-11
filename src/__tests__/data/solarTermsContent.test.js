/**
 * Temp validation for P1#5: all relatedContent IDs must resolve to real records.
 */
import { solarTerms, getTermRecipeIds, getTermFestivalName } from '../../data/solarTerms';
import { recipes } from '../../data/recipes';
import { cities } from '../../data/cities';

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
