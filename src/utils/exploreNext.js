/**
 * Explore Next — related content recommendations
 *
 * Returns a curated list of related items for a given reading surface so the
 * app can offer a seamless "Explore Next" journey. Item shapes match what the
 * ExploreNextSection component renders:
 *
 *   { type: 'city'|'recipe'|'dynasty'|'person', id, title?, reason }
 */
import { getCityRecipes, getCityDynasties, getDynastyPeople, getDynastyRecipes, getPersonCities, getCityPeople } from '../data/relations';
import { cities } from '../data/cities';
import { recipes } from '../data/recipes';
import { dynasties } from '../data/dynasties';
import { people } from '../data/people';

function byId(list, id) {
  return list.find((x) => x.id === id) || null;
}

/**
 * Get recommended related items for a source item.
 *
 * @param {string} sourceType - 'dynasty'|'city'|'recipe'|'person'|'season'
 * @param {string} sourceId   - id of the source item
 * @returns {Array<{type, id, title, reason}>}
 */
export function getExploreNextItems(sourceType, sourceId) {
  if (!sourceId) return [];
  const result = [];

  switch (sourceType) {
    case 'dynasty': {
      const recipeIds = getDynastyRecipes(sourceId);
      const personIds = getDynastyPeople(sourceId);
      for (const id of recipeIds) {
        const r = byId(recipes, id);
        if (r) result.push({ type: 'recipe', id: r.id, title: r.nameEn, reason: `Dishes that honor this dynasty` });
      }
      for (const id of personIds) {
        const p = byId(people, id);
        if (p) result.push({ type: 'person', id: p.id, title: p.nameEn, reason: `A notable figure of this dynasty` });
      }
      break;
    }
    case 'city': {
      const provinceId = byId(cities, sourceId)?.provinceId;
      const recipeIds = getCityRecipes(sourceId, provinceId);
      const personIds = getCityPeople(sourceId);
      for (const id of recipeIds) {
        const r = byId(recipes, id);
        if (r) result.push({ type: 'recipe', id: r.id, title: r.nameEn, reason: `A taste of this city` });
      }
      for (const id of personIds) {
        const p = byId(people, id);
        if (p) result.push({ type: 'person', id: p.id, title: p.nameEn, reason: `A name tied to this city` });
      }
      break;
    }
    case 'person': {
      const cityIds = getPersonCities(sourceId);
      for (const id of cityIds) {
        const c = byId(cities, id);
        if (c) result.push({ type: 'city', id: c.id, title: c.nameEn, reason: `Where this figure made history` });
      }
      break;
    }
    case 'recipe': {
      break;
    }
    default:
      break;
  }

  if (result.length >= 1) return result.slice(0, 3);

  // Fallback highlights so the section is never empty.
  const fallbackCity = cities.find((x) => x.isFeatured) || cities[0];
  const fallbackRecipe = recipes.find((x) => x.isFeatured) || recipes[0];
  if (fallbackCity) {
    result.push({ type: 'city', id: fallbackCity.id, title: fallbackCity.nameEn, reason: `Journey onward to ${fallbackCity.nameEn}` });
  }
  if (fallbackRecipe) {
    result.push({ type: 'recipe', id: fallbackRecipe.id, title: fallbackRecipe.nameEn, reason: `Keep discovering with ${fallbackRecipe.nameEn}` });
  }
  return result.slice(0, 3);
}
