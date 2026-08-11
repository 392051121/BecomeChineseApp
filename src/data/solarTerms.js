/**
 * Solar Terms (二十四节气) Data
 *
 * The 24 solar terms form the traditional Chinese lunisolar calendar.
 * Each term is enriched with season, food, actions, poetry and related content
 * so it can power the Seasons/Calendar experience across the app.
 *
 * This module is the single source of truth for full solar term detail data.
 * Calendar entry dates are kept in sync with src/utils/calendar.js (SOLAR_TERMS).
 */
import { recipes } from './recipes';
import { cities } from './cities';
import { dynasties } from './dynasties';

// Season buckets for the 24 terms.
const SPRING = 'spring';
const SUMMER = 'summer';
const AUTUMN = 'autumn';
const WINTER = 'winter';

export const SOLAR_TERM_SEASONS = {
  [SPRING]: { en: 'Spring', cn: '春', order: 1 },
  [SUMMER]: { en: 'Summer', cn: '夏', order: 2 },
  [AUTUMN]: { en: 'Autumn', cn: '秋', order: 3 },
  [WINTER]: { en: 'Winter', cn: '冬', order: 4 },
};

// A small pool of beginner notes reused across terms. `getBeginnerNote` lives in
// src/utils/culturalContext.js and surfaces notes like these to first-time readers.
const beginnerNotes = [
  '节气 (jiéqì) means "seasonal node". Ancient farmers used these 24 markers to time planting and harvest.',
  'Each solar term falls on a fixed point in the tropical year, roughly every 15 days.',
  'The Chinese calendar weaves solar observation with lunar months — solar terms keep farmers in sync with the sun.',
  'Traditional Chinese medicine and daily living still follow the flow of solar terms for balance and wellness.',
];

function pickNote(seed) {
  return beginnerNotes[(seed.charCodeAt(0) + seed.charCodeAt(seed.length - 1)) % beginnerNotes.length];
}

// Curated per-term relationships so "Explore Next" points at dishes the term is
// genuinely known for. Every ID references a real record in recipes.json /
// cities.json / festivals.js (validated), so deep links always resolve.
// Values: recipes -> seasonal dishes tied to the term's food customs.
const TERM_RECIPE_MAP = {
  'minor-cold': ['hot-pot', 'dumplings'],
  'major-cold': ['dumplings', 'red-bean-soup'],
  'start-of-spring': ['stewed-pork-buns', 'tangyuan'],
  'rain-water': ['tangyuan', 'eight-treasure-rice'],
  'insects-awaken': ['red-bean-soup', 'congee'],
  'spring-equinox': ['eight-treasure-rice', 'longjing-shrimp'],
  'pure-brightness': ['tangyuan', 'stewed-pork-buns'],
  'grain-rain': ['longjing-shrimp', 'dan-dan-noodles'],
  'start-of-summer': ['congee', 'scrambled-eggs-tomatoes'],
  'grain-buds': ['scrambled-eggs-tomatoes', 'stewed-pork-buns'],
  'grain-in-ear': ['zhajiang-noodles'],
  'summer-solstice': ['zhajiang-noodles', 'sour-spicy-pot'],
  'minor-heat': ['sour-spicy-pot', 'mango-pudding'],
  'major-heat': ['mango-pudding', 'egg-tarts'],
  'start-of-autumn': ['peking-duck', 'stewed-pork-buns'],
  'limit-of-heat': ['peking-duck', 'egg-tarts'],
  'white-dew': ['longjing-shrimp', 'red-bean-soup'],
  'autumn-equinox': ['eight-treasure-rice', 'mooncake'],
  'cold-dew': ['stewed-pork-buns', 'zhajiang-noodles'],
  'frost-descent': ['red-bean-soup', 'black-sesame-soup'],
  'start-of-winter': ['dumplings', 'hot-pot'],
  'minor-snow': ['hot-pot', 'black-sesame-soup'],
  'major-snow': ['hot-pot', 'red-braised-beef'],
  'winter-solstice': ['dumplings', 'tangyuan'],
};

// A representative city for each term (seasonal / regional relevance).
const TERM_CITY_MAP = {
  'minor-cold': 'harbin',
  'major-cold': 'harbin',
  'start-of-spring': 'suzhou',
  'rain-water': 'hangzhou',
  'insects-awaken': 'hangzhou',
  'spring-equinox': 'hangzhou',
  'pure-brightness': 'yangzhou',
  'grain-rain': 'hangzhou',
  'start-of-summer': 'wuhan',
  'grain-buds': 'suzhou',
  'grain-in-ear': 'beijing',
  'summer-solstice': 'beijing',
  'minor-heat': 'chengdu',
  'major-heat': 'sanya',
  'start-of-autumn': 'beijing',
  'limit-of-heat': 'beijing',
  'white-dew': 'hangzhou',
  'autumn-equinox': 'suzhou',
  'cold-dew': 'xian',
  'frost-descent': 'xian',
  'start-of-winter': 'harbin',
  'minor-snow': 'chengdu',
  'major-snow': 'chongqing',
  'winter-solstice': 'xian',
};

// The folk festival most closely tied to each term, shown as context in the
// "reason" line so readers connect the term to its associated holiday.
const TERM_FESTIVAL_NAME = {
  'minor-cold': 'Minor Cold',
  'major-cold': 'the eve of Spring Festival',
  'start-of-spring': 'Start of Spring',
  'rain-water': 'Rain Water',
  'insects-awaken': 'Insects Awaken',
  'spring-equinox': 'Spring Equinox',
  'pure-brightness': 'Qingming Festival',
  'grain-rain': 'Grain Rain',
  'start-of-summer': 'Start of Summer',
  'grain-buds': 'Grain Buds',
  'grain-in-ear': 'Grain in Ear',
  'summer-solstice': 'Summer Solstice',
  'minor-heat': 'Minor Heat',
  'major-heat': 'Major Heat',
  'start-of-autumn': 'Start of Autumn',
  'limit-of-heat': 'Limit of Heat',
  'white-dew': 'White Dew',
  'autumn-equinox': 'Mid-Autumn Festival',
  'cold-dew': 'Cold Dew',
  'frost-descent': 'Frost Descent',
  'start-of-winter': 'Start of Winter',
  'minor-snow': 'Minor Snow',
  'major-snow': 'Major Snow',
  'winter-solstice': 'Winter Solstice Festival',
};

// Fallback pools indexed by season when a term has no curate entry.
const SEASON_RECIPE_POOL = {
  spring: ['stewed-pork-buns', 'tangyuan', 'longjing-shrimp'],
  summer: ['sour-spicy-pot', 'mango-pudding', 'zhajiang-noodles'],
  autumn: ['peking-duck', 'eight-treasure-rice', 'mooncake'],
  winter: ['hot-pot', 'dumplings', 'red-bean-soup'],
};
const SEASON_CITY_POOL = {
  spring: ['hangzhou', 'suzhou', 'yangzhou'],
  summer: ['chengdu', 'sanya', 'wuhan'],
  autumn: ['beijing', 'xian', 'suzhou'],
  winter: ['harbin', 'chongqing', 'xian'],
};

/**
 * Build a rich relatedContent list for a term.
 * Each item references an existing Content ID so the app can deep-link to it.
 * The recipe/city links are curated per term (real seasonal associations);
 * dynasty links fall back to a season-appropriate pick.
 */
function buildRelatedContent(termKey, season, recipesList, citiesList, dynastiesList) {
  const related = [];

  const byId = (arr, id) => arr.find((x) => x.id === id) || null;

  const termRecipes = TERM_RECIPE_MAP[termKey] || SEASON_RECIPE_POOL[season] || [];
  const recipeIds = termRecipes.length ? termRecipes : [termRecipes[0]].filter(Boolean);
  const seenRecipes = new Set();
  for (const id of recipeIds) {
    if (seenRecipes.has(id)) continue;
    seenRecipes.add(id);
    const r = byId(recipesList, id);
    if (r) related.push({ type: 'recipe', id: r.id, reason: `${r.nameEn} — a dish tied to ${season} season` });
  }

  const cityId = TERM_CITY_MAP[termKey] || SEASON_CITY_POOL[season]?.[termKey.length % 3];
  const c = byId(citiesList, cityId);
  if (c) related.push({ type: 'city', id: c.id, reason: `Visit ${c.nameEn} to experience ${season} season` });

  const d = (dynastiesList && dynastiesList.length) ? dynastiesList[termKey.length % dynastiesList.length] : null;
  if (d) related.push({ type: 'dynasty', id: d.id, reason: `Read how the ${d.nameZh} people honored ${season} season` });

  return related;
}

/**
 * Expose the folk festival tied to a term (used to enrich related reading copy).
 */
export function getTermFestivalName(termKey) {
  return TERM_FESTIVAL_NAME[termKey] || '';
}

/**
 * Return the curated recipe IDs appropriate for a term's seasonal food.
 * Falls back to the season pool when a term has no explicit entry.
 */
export function getTermRecipeIds(termKey, season) {
  const list = TERM_RECIPE_MAP[termKey] || SEASON_RECIPE_POOL[season] || [];
  return list.length ? list : [];
}

export const solarTerms = [
  {
    id: 'minor-cold',
    key: 'minor-cold',
    season: WINTER,
    order: 23,
    englishName: 'Minor Cold',
    chineseName: '小寒',
    pinyin: 'Xiǎohán',
    meaning: 'Cold grows but spring is still hidden.',
    dateRange: 'Jan 5 – Jan 19',
    natureChange: 'Cold reaches a sharp intensity; rivers freeze and birds begin to sense returning yang.',
    custom: 'People nourish warmth, eat hotpot and sesame-honey treats to guard against the chill.',
    food: ['Hotpot', 'Sticky rice', 'Sesame sweets'],
    dailyAction: 'Savour one warm, nourishing meal and notice the crisp air.',
    beginnerNote: pickNote('minor-cold'),
    relatedContent: [],
  },
  {
    id: 'major-cold',
    key: 'major-cold',
    season: WINTER,
    order: 24,
    englishName: 'Major Cold',
    chineseName: '大寒',
    pinyin: 'Dàhán',
    meaning: 'Deep winter reaches its quiet peak.',
    dateRange: 'Jan 20 – Feb 3',
    natureChange: 'The coldest stretch of the year; snow is thickest and days are short.',
    custom: 'The year draws to a close; families prepare for the Spring Festival.',
    food: ['Laba porridge', 'Dumplings', 'Winter melon soup'],
    dailyAction: 'Gently stretch and breathe deeply to keep energy flowing in the cold.',
    beginnerNote: pickNote('major-cold'),
    relatedContent: [],
  },
  {
    id: 'start-of-spring',
    key: 'start-of-spring',
    season: SPRING,
    order: 1,
    englishName: 'Start of Spring',
    chineseName: '立春',
    pinyin: 'Lìchūn',
    meaning: 'Life begins to stir beneath the soil.',
    dateRange: 'Feb 4 – Feb 18',
    natureChange: 'Ice thaws, buds swell, and the first breath of spring arrives.',
    custom: 'Eating spring pancakes ("chūn bǐng") welcomes the new season.',
    food: ['Spring pancakes', 'Spring rolls', 'Fresh greens'],
    dailyAction: 'Open a window and take in the first gentle change of season.',
    beginnerNote: pickNote('start-of-spring'),
    relatedContent: [],
  },
  {
    id: 'rain-water',
    key: 'rain-water',
    season: SPRING,
    order: 2,
    englishName: 'Rain Water',
    chineseName: '雨水',
    pinyin: 'Yǔshuǐ',
    meaning: 'Snow turns to rain and nourishes fields.',
    dateRange: 'Feb 19 – Mar 5',
    natureChange: 'Warmer air brings drizzle; moisture wakes the dormant earth.',
    custom: 'Families enjoy sweet steamed treats and forecast the year by rainfall.',
    food: ['Sweet rice balls', 'Steamed vegetables'],
    dailyAction: 'Notice one new green shoot or the scent of damp soil.',
    beginnerNote: pickNote('rain-water'),
    relatedContent: [],
  },
  {
    id: 'insects-awaken',
    key: 'insects-awaken',
    season: SPRING,
    order: 3,
    englishName: 'Awakening of Insects',
    chineseName: '惊蛰',
    pinyin: 'Jīngzhé',
    meaning: 'Thunder wakes insects and spring energy rises.',
    dateRange: 'Mar 6 – Mar 20',
    natureChange: 'Thunder rolls, insects stir from winter sleep, and life bursts upward.',
    custom: 'Eating pear is said to soothe the throat and clear spring heat.',
    food: ['Pears', 'Light soups'],
    dailyAction: 'Step outside and listen for the first signs of insect life.',
    beginnerNote: pickNote('insects-awaken'),
    relatedContent: [],
  },
  {
    id: 'spring-equinox',
    key: 'spring-equinox',
    season: SPRING,
    order: 4,
    englishName: 'Spring Equinox',
    chineseName: '春分',
    pinyin: 'Chūnfēn',
    meaning: 'Day and night meet in perfect balance.',
    dateRange: 'Mar 21 – Apr 4',
    natureChange: 'Sunlight and darkness balance; blossom carpets the land.',
    custom: 'Families try to stand an egg on end — a favourite equinox custom.',
    food: ['Fresh bamboo shoots', 'Eggs'],
    dailyAction: 'Stand an egg upright and share one moment of seasonal balance.',
    beginnerNote: pickNote('spring-equinox'),
    relatedContent: [],
  },
  {
    id: 'pure-brightness',
    key: 'pure-brightness',
    season: SPRING,
    order: 5,
    englishName: 'Pure Brightness',
    chineseName: '清明',
    pinyin: 'Qīngmíng',
    meaning: 'Clear skies and tender green invite remembrance.',
    dateRange: 'Apr 5 – Apr 19',
    natureChange: 'Skies clear and grass greens; a time for remembrance and renewal.',
    custom: 'Families visit ancestors, fly kites, and enjoy spring outings.',
    food: ['Green rice balls', 'Tea eggs'],
    dailyAction: 'Remember a loved memory and spend time outdoors.',
    beginnerNote: pickNote('pure-brightness'),
    relatedContent: [],
  },
  {
    id: 'grain-rain',
    key: 'grain-rain',
    season: SPRING,
    order: 6,
    englishName: 'Grain Rain',
    chineseName: '谷雨',
    pinyin: 'Gǔyǔ',
    meaning: 'Rain feeds grain and spring reaches fullness.',
    dateRange: 'Apr 20 – May 5',
    natureChange: 'Warm showers nourish the grain; spring ripens into summer.',
    custom: 'Tea picked around this time is prized for its fresh fragrance.',
    food: ['Fresh tea', 'New vegetables'],
    dailyAction: 'Sip a fresh tea and savour a seasonal green.',
    beginnerNote: pickNote('grain-rain'),
    relatedContent: [],
  },
  {
    id: 'start-of-summer',
    key: 'start-of-summer',
    season: SUMMER,
    order: 7,
    englishName: 'Start of Summer',
    chineseName: '立夏',
    pinyin: 'Lìxià',
    meaning: 'Warmth rises and summer opens gently.',
    dateRange: 'May 6 – May 20',
    natureChange: 'Temperatures climb; crops grow fast and greenery deepens.',
    custom: 'Eating eggs and weighing oneself mark the passing of spring.',
    food: ['Tea eggs', 'Fresh peas'],
    dailyAction: 'Greet the warmer air and plan for lighter days.',
    beginnerNote: pickNote('start-of-summer'),
    relatedContent: [],
  },
  {
    id: 'grain-buds',
    key: 'grain-buds',
    season: SUMMER,
    order: 8,
    englishName: 'Grain Buds',
    chineseName: '小满',
    pinyin: 'Xiǎomǎn',
    meaning: 'Kernels swell; growth is visible but incomplete.',
    dateRange: 'May 21 – Jun 5',
    natureChange: 'Grain fills out; the fields turn lush with promise.',
    custom: 'Eating bitter greens helps the body adapt to rising damp heat.',
    food: ['Bitter melon', 'Fresh greens'],
    dailyAction: 'Taste something slightly bitter for balance.',
    beginnerNote: pickNote('grain-buds'),
    relatedContent: [],
  },
  {
    id: 'grain-in-ear',
    key: 'grain-in-ear',
    season: SUMMER,
    order: 9,
    englishName: 'Grain in Ear',
    chineseName: '芒种',
    pinyin: 'Mángzhòng',
    meaning: 'A season for sowing and racing the rain.',
    dateRange: 'Jun 6 – Jun 20',
    natureChange: 'Wheat is harvested and rice planted while rains gather.',
    custom: 'The busiest farming stretch — every hour counts.',
    food: ['Noodles', 'Cooling teas'],
    dailyAction: 'Keep momentum and stay hydrated.',
    beginnerNote: pickNote('grain-in-ear'),
    relatedContent: [],
  },
  {
    id: 'summer-solstice',
    key: 'summer-solstice',
    season: SUMMER,
    order: 10,
    englishName: 'Summer Solstice',
    chineseName: '夏至',
    pinyin: 'Xiàzhì',
    meaning: 'The longest day glows at full strength.',
    dateRange: 'Jun 21 – Jul 6',
    natureChange: 'Daylight peaks; heat and humidity build across the south.',
    custom: 'Eating "summer solstice noodles" refreshes and cools the body.',
    food: ['Cold noodles', 'Watermelon'],
    dailyAction: 'Rest during the hottest hours and drink plenty of water.',
    beginnerNote: pickNote('summer-solstice'),
    relatedContent: [],
  },
  {
    id: 'minor-heat',
    key: 'minor-heat',
    season: SUMMER,
    order: 11,
    englishName: 'Minor Heat',
    chineseName: '小暑',
    pinyin: 'Xiǎoshǔ',
    meaning: 'Summer heat gathers with humid breath.',
    dateRange: 'Jul 7 – Jul 22',
    natureChange: 'Hot and humid; cicadas sing and evening breezes are prized.',
    custom: 'Cooling soups and lotus help the body resist heat.',
    food: ['Lotus soup', 'Mung bean tea'],
    dailyAction: 'Stay cool and share a refreshing seasonal drink.',
    beginnerNote: pickNote('minor-heat'),
    relatedContent: [],
  },
  {
    id: 'major-heat',
    key: 'major-heat',
    season: SUMMER,
    order: 12,
    englishName: 'Major Heat',
    chineseName: '大暑',
    pinyin: 'Dàshǔ',
    meaning: 'The hottest days demand patience and shade.',
    dateRange: 'Jul 23 – Aug 7',
    natureChange: 'Peak summer heat and thunderstorms; the year holds its breath.',
    custom: 'Families stay indoors at midday and enjoy cold treats at night.',
    food: ['Watermelon', 'Herbal cool drinks'],
    dailyAction: 'Protect yourself from the heat and rest generously.',
    beginnerNote: pickNote('major-heat'),
    relatedContent: [],
  },
  {
    id: 'start-of-autumn',
    key: 'start-of-autumn',
    season: AUTUMN,
    order: 13,
    englishName: 'Start of Autumn',
    chineseName: '立秋',
    pinyin: 'Lìqiū',
    meaning: 'Autumn arrives though warmth still lingers.',
    dateRange: 'Aug 8 – Aug 22',
    natureChange: 'A first cool edge appears; the harvest draws near.',
    custom: '"Eating autumn" with hearty food is said to strengthen the body.',
    food: ['Roasted duck', 'Melon'],
    dailyAction: 'Feel the change of shade and light.',
    beginnerNote: pickNote('start-of-autumn'),
    relatedContent: [],
  },
  {
    id: 'limit-of-heat',
    key: 'limit-of-heat',
    season: AUTUMN,
    order: 14,
    englishName: 'Limit of Heat',
    chineseName: '处暑',
    pinyin: 'Chǔshǔ',
    meaning: 'Heat withdraws and evenings turn cooler.',
    dateRange: 'Aug 23 – Sep 7',
    natureChange: 'Summer heat recedes; crisp mornings return.',
    custom: 'Families enjoy late-summer fruit and air-dry the home.',
    food: ['Pears', 'Late peaches'],
    dailyAction: 'Enjoy a cooler evening walk.',
    beginnerNote: pickNote('limit-of-heat'),
    relatedContent: [],
  },
  {
    id: 'white-dew',
    key: 'white-dew',
    season: AUTUMN,
    order: 15,
    englishName: 'White Dew',
    chineseName: '白露',
    pinyin: 'Báilù',
    meaning: 'Morning dew appears like pale pearls.',
    dateRange: 'Sep 8 – Sep 22',
    natureChange: 'Dew forms by morning; the air turns noticeably dry and cool.',
    custom: 'Eating pears and honey soothes the dry autumn throat.',
    food: ['Pears', 'Honey', 'Longan tea'],
    dailyAction: 'Sip warm honey water and notice the dew.',
    beginnerNote: pickNote('white-dew'),
    relatedContent: [],
  },
  {
    id: 'autumn-equinox',
    key: 'autumn-equinox',
    season: AUTUMN,
    order: 16,
    englishName: 'Autumn Equinox',
    chineseName: '秋分',
    pinyin: 'Qiūfēn',
    meaning: 'Light and dark balance before late harvest.',
    dateRange: 'Sep 23 – Oct 7',
    natureChange: 'Day and night balance again; fields ripen gold.',
    custom: 'Crab and sweet osmanthus mark the height of autumn feasting.',
    food: ['Hairy crab', 'Osmanthus wine'],
    dailyAction: 'Share a seasonal table with friends.',
    beginnerNote: pickNote('autumn-equinox'),
    relatedContent: [],
  },
  {
    id: 'cold-dew',
    key: 'cold-dew',
    season: AUTUMN,
    order: 17,
    englishName: 'Cold Dew',
    chineseName: '寒露',
    pinyin: 'Hánlù',
    meaning: 'Dew cools, hinting at approaching frost.',
    dateRange: 'Oct 8 – Oct 22',
    natureChange: 'Dew turns cold; the landscape dons vivid autumn colour.',
    custom: 'Climbing high and drinking chrysanthemum tea honour the season.',
    food: ['Chrysanthemum tea', 'Pomegranate'],
    dailyAction: 'Take a walk where autumn colours are brightest.',
    beginnerNote: pickNote('cold-dew'),
    relatedContent: [],
  },
  {
    id: 'frost-descent',
    key: 'frost-descent',
    season: AUTUMN,
    order: 18,
    englishName: 'Frost Descent',
    chineseName: '霜降',
    pinyin: 'Shuāngjiàng',
    meaning: 'Frost appears; fields prepare for rest.',
    dateRange: 'Oct 23 – Nov 6',
    natureChange: 'The first frost falls and the year begins to settle.',
    custom: 'Eating persimmon and hunting game are traditional in autumn.',
    food: ['Persimmon', 'Roasted chestnuts'],
    dailyAction: 'Lay in a warm, grounding meal.',
    beginnerNote: pickNote('frost-descent'),
    relatedContent: [],
  },
  {
    id: 'start-of-winter',
    key: 'start-of-winter',
    season: WINTER,
    order: 19,
    englishName: 'Start of Winter',
    chineseName: '立冬',
    pinyin: 'Lìdōng',
    meaning: 'The season turns inward toward quiet warmth.',
    dateRange: 'Nov 7 – Nov 21',
    natureChange: 'Cold returns; nature stores energy for the winter ahead.',
    custom: '"Replenishing winter" with hearty stews and dumplings is a family rite.',
    food: ['Dumplings', 'Mutton stew'],
    dailyAction: 'Share a warming meal and conserve your energy.',
    beginnerNote: pickNote('start-of-winter'),
    relatedContent: [],
  },
  {
    id: 'minor-snow',
    key: 'minor-snow',
    season: WINTER,
    order: 20,
    englishName: 'Minor Snow',
    chineseName: '小雪',
    pinyin: 'Xiǎoxuě',
    meaning: 'Light snow hints at deep winter ahead.',
    dateRange: 'Nov 22 – Dec 6',
    natureChange: 'Flurries dust the north; the cold hardens day by day.',
    custom: 'Preserved meats and pickled vegetables prepare the pantry.',
    food: ['Pickled greens', 'Rice cakes'],
    dailyAction: 'Prepare something cozy for the colder days.',
    beginnerNote: pickNote('minor-snow'),
    relatedContent: [],
  },
  {
    id: 'major-snow',
    key: 'major-snow',
    season: WINTER,
    order: 21,
    englishName: 'Major Snow',
    chineseName: '大雪',
    pinyin: 'Dàxuě',
    meaning: 'Heavy snow marks the depth of winter rhythm.',
    dateRange: 'Dec 7 – Dec 20',
    natureChange: 'Snow falls more thickly; rivers freeze and the world turns still.',
    custom: 'Hot broths and braised dishes warm hearts through the cold.',
    food: ['Hot broth', 'Braised lamb'],
    dailyAction: 'Breathe in the cold air and feel the quiet.',
    beginnerNote: pickNote('major-snow'),
    relatedContent: [],
  },
  {
    id: 'winter-solstice',
    key: 'winter-solstice',
    season: WINTER,
    order: 22,
    englishName: 'Winter Solstice',
    chineseName: '冬至',
    pinyin: 'Dōngzhì',
    meaning: 'The longest night births returning light.',
    dateRange: 'Dec 21 – Jan 4',
    natureChange: 'The year\'s longest night gives way to slowly lengthening days.',
    custom: 'Eating dumplings protects the ears from the cold, or so the saying goes.',
    food: ['Dumplings', 'Tangyuan'],
    dailyAction: 'Celebrate the return of light with a warm meal.',
    beginnerNote: pickNote('winter-solstice'),
    relatedContent: [],
  },
];

/**
 * Get the current solar term object (rich detail form) for a given date.
 * Falls back to the plain calendar entry if no rich term is matched.
 *
 * @param {Date} date
 * @returns {object} enriched solar term detail
 */
export function getCurrentSolarTerm(date = new Date()) {
  const basic = getSolarTermForDateCompat(date);
  return solarTerms.find((t) => t.key === basic.key) || null;
}

/**
 * Get a solar term detail object by its id/key.
 * @param {string} id - term id (e.g. "minor-cold")
 * @returns {object|undefined}
 */
export function getSolarTermById(id) {
  return solarTerms.find((t) => t.id === id || t.key === id);
}

// Lightweight duplicate of date→term resolution to avoid a circular import
// with src/utils/calendar.js. Keeps this data module self-contained.
function getSolarTermForDateCompat(date = new Date()) {
  const table = [
    { key: 'minor-cold', m: 1, d: 5 },
    { key: 'major-cold', m: 1, d: 20 },
    { key: 'start-of-spring', m: 2, d: 4 },
    { key: 'rain-water', m: 2, d: 19 },
    { key: 'insects-awaken', m: 3, d: 6 },
    { key: 'spring-equinox', m: 3, d: 21 },
    { key: 'pure-brightness', m: 4, d: 5 },
    { key: 'grain-rain', m: 4, d: 20 },
    { key: 'start-of-summer', m: 5, d: 6 },
    { key: 'grain-buds', m: 5, d: 21 },
    { key: 'grain-in-ear', m: 6, d: 6 },
    { key: 'summer-solstice', m: 6, d: 21 },
    { key: 'minor-heat', m: 7, d: 7 },
    { key: 'major-heat', m: 7, d: 23 },
    { key: 'start-of-autumn', m: 8, d: 8 },
    { key: 'limit-of-heat', m: 8, d: 23 },
    { key: 'white-dew', m: 9, d: 8 },
    { key: 'autumn-equinox', m: 9, d: 23 },
    { key: 'cold-dew', m: 10, d: 8 },
    { key: 'frost-descent', m: 10, d: 23 },
    { key: 'start-of-winter', m: 11, d: 7 },
    { key: 'minor-snow', m: 11, d: 22 },
    { key: 'major-snow', m: 12, d: 7 },
    { key: 'winter-solstice', m: 12, d: 21 },
  ];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const cur = month * 100 + day;
  let picked = table[table.length - 1];
  for (const t of table) {
    if (cur >= t.m * 100 + t.d) picked = t;
    else break;
  }
  return picked;
}

// Populate relatedContent for every term once (at import time), pointing to
// real content ids pulled from the data store so deep links always resolve.
solarTerms.forEach((term) => {
  term.relatedContent = buildRelatedContent(term.key, term.season, recipes, cities, dynasties);
});

export default solarTerms;
