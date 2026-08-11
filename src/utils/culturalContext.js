/**
 * Cultural Context Utilities
 *
 * Helpers that surface plain-language "why it matters" blurbs and beginner
 * notes for the app's content types (city, recipe, dynasty, person, season).
 */

// Beginner notes by content type. These introduce a reader who is brand new
// to Chinese culture, so they stay short and friendly.
const BEGINNER_NOTES = {
  season:
    '节气 (jiéqì) means "seasonal node". Ancient farmers used these 24 markers to time planting, harvest and daily living.',
  dynasty:
    'A dynasty (朝代) is a period in Chinese history ruled by one royal family, guiding art, thought and daily life.',
  person:
    'A historical person here is someone whose story shaped Chinese culture — scholars, sailors, poets and strategists.',
  city:
    'A city here is a window into Chinese culture — its cuisine, dialect, history and the lives of its people.',
  recipe:
    'A dish here carries more than flavor — every recipe reflects the climate, history and habits of a region.',
  default:
    'This is your first step into the story — take your time and explore freely.',
};

/**
 * Get a short, welcoming beginner note for a content type.
 * @param {string} type - 'season' | 'dynasty' | 'person' | 'city' | 'recipe'
 * @returns {string} helpful note
 */
export function getBeginnerNote(type = 'default') {
  return BEGINNER_NOTES[type] || BEGINNER_NOTES.default;
}

/**
 * Get a one-line "why it matters" summary for a content item.
 * Falls back to a type-level generic line when no specific knowledge exists.
 *
 * @param {string} type - content type
 * @param {object} item - content item (dynasty/person/city/recipe …)
 * @returns {string} why-it-matters line
 */
export function getWhyItMatters(type, item = {}) {
  switch (type) {
    case 'dynasty':
      if (item?.nameEn) return `${item.nameEn} shaped Chinese civilization through its politics, art and daily customs.`;
      return 'This dynasty shaped Chinese history through its rule and culture.';
    case 'person':
      if (item?.nameEn) return `${item.nameEn} left a lasting mark on Chinese thought and culture.`;
      return 'This figure helped shape the course of Chinese culture.';
    case 'city':
      if (item?.nameEn) return `${item.nameEn} offers a living window into a distinct slice of Chinese life.`;
      return 'This city reflects a distinct regional culture and way of life.';
    case 'recipe':
      if (item?.nameEn) return `${item.nameEn} carries the climate and history of its home region in every bite.`;
      return 'This dish reflects the climate, history and habits of its region.';
    default:
      return 'This piece of Chinese culture is part of a much larger story.';
  }
}

export default { getBeginnerNote, getWhyItMatters };
