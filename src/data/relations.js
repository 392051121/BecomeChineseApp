/**
 * Content Relationship Maps
 *
 * This file defines the relationships between different content types:
 * - Cities <-> Recipes (by province and local food)
 * - Cities <-> Dynasties (by province and historical significance)
 * - Cities <-> People (by birthplace and activity)
 * - Dynasties <-> People (by era)
 * - Dynasties <-> Recipes (by court cuisine and era)
 * - Festivals <-> Recipes (by seasonal/traditional food)
 */

// City to Recipe relationships (beyond province matching)
export const cityRecipeRelations = {
  beijing: ['peking-duck', 'dumplings', 'zhajiang-noodles'],
  shanghai: ['xiaolongbao', 'pan-fried-buns', 'braised-pork'],
  chengdu: ['kung-pao-chicken', 'mapo-tofu', 'hot-pot', 'dan-dan-noodles'],
  xian: ['yangrou-paomo', 'biang-biang-noodles', 'yangrou-paomo'],
  guangzhou: ['char-siu', 'siu-mai', 'steamed-fish', 'congee'],
  hangzhou: ['dongpo-pork', 'longjing-shrimp', 'beggar-chicken'],
  suzhou: ['west-lake-fish', 'longjing-shrimp'],
  nanjing: ['peking-duck', 'hot-pot'],
  chongqing: ['hot-pot', 'dan-dan-noodles'],
  tianjin: ['pan-fried-buns', 'scallion-pancakes'],
  wuhan: ['hot-dry-noodles', 'dumplings'],
  harbin: ['hot-pot', 'stewed-pork-buns'],
  kunming: ['hot-dry-noodles', 'hot-pot'],
  lhasa: ['hot-pot', 'hot-pot', 'hot-pot'],
  dalian: ['dumplings', 'steamed-fish'],
  qingdao: ['steamed-fish', 'steamed-fish'],
  xiamen: ['dan-dan-noodles', 'scallion-pancakes'],
  guilin: ['hot-dry-noodles', 'steamed-fish'],
  lijiang: ['hot-pot', 'hot-pot'],
};

// City to Dynasty relationships (historical significance)
export const cityDynastyRelations = {
  beijing: ['yuan', 'ming', 'qing'],
  xian: ['qin', 'han', 'tang'],
  nanjing: ['ming', 'qing'],
  luoyang: ['han', 'tang'],
  kaifeng: ['song'],
  hangzhou: ['song'],
  chengdu: ['han', 'three-kingdoms'],
  anyang: ['shang'],
  datong: ['han', 'tang'],
};

// Dynasty to People relationships
export const dynastyPersonRelations = {
  qin: ['qinshihuang'],
  han: ['simaqian'],
  'three-kingdoms': ['caocao', 'liubei', 'sunquan'],
  tang: ['libai', 'dufu', 'wuzetian'],
  song: ['suxi'],
  ming: ['zhenghe', 'zhu-yuanzhang'],
  qing: ['kangxi', 'qianlong'],
  zhou: ['kongzi', 'laozi'],
};

// Dynasty to Recipe relationships (court cuisine, era-specific dishes)
export const dynastyRecipeRelations = {
  qin: ['yangrou-paomo'], // Ancient Northwest food
  han: ['dumplings', 'zhajiang-noodles'], // Early wheat-based food
  tang: ['radish-cake', 'taro-cake'], // Tang sweets
  song: ['dongpo-pork', 'beggar-chicken'], // Song literary food
  ming: ['peking-duck'], // Ming court cuisine
  qing: ['peking-duck', 'hot-pot'], // Qing imperial cuisine
};

// Festival to Recipe relationships (traditional foods)
// Keys must match the `id` values used in src/data/festivals.js so the
// merged recommendedFoodIds actually resolve. (P1-3 naming fix)
export const festivalRecipeRelations = {
  'spring-festival': ['dumplings', 'stewed-pork-buns', 'tangyuan', 'steamed-fish'],
  'lantern-festival': ['tangyuan', 'tangyuan'],
  // 清明 (solar term) — festivals.js id is `qingming` (was `qingming-festival`)
  qingming: ['tangyuan', 'zongzi'],
  'dragon-boat-festival': ['zongzi', 'zongzi'],
  'mid-autumn-festival': ['mooncake', 'mooncake', 'peking-duck'],
  'double-ninth-festival': ['mooncake', 'longjing-shrimp'],
  // 冬至 (solar term) — festivals.js id is `dongzhi` (was `winter-solstice`)
  dongzhi: ['dumplings', 'tangyuan'],
};

// Person to City relationships (birthplace, major activity)
export const personCityRelations = {
  qinshihuang: ['xian'],
  kongzi: ['qufu'],
  libai: ['xian', 'chengdu'],
  dufu: ['chengdu'],
  wuzetian: ['xian', 'luoyang'],
  zhenghe: ['nanjing'],
  'zhu-yuanzhang': ['nanjing', 'beijing'],
  suxi: ['hangzhou', 'hangzhou'],
  caocao: ['luoyang', 'luoyang'],
  liubei: ['chengdu'],
  sunquan: ['nanjing'],
  kangxi: ['beijing'],
  qianlong: ['beijing'],
};

// Province to Dynasty relationships
export const provinceDynastyRelations = {
  Beijing: ['yuan', 'ming', 'qing'],
  Shaanxi: ['qin', 'han', 'tang', 'zhou'],
  Henan: ['shang', 'zhou', 'han', 'song'],
  Jiangsu: ['ming', 'qing', 'song'],
  Zhejiang: ['song', 'ming', 'qing'],
  Sichuan: ['han', 'three-kingdoms'],
  Shandong: ['zhou', 'han'],
  Yunnan: ['ming', 'qing'],
  Tibet: ['yuan', 'ming', 'qing'],
  Guangdong: ['han', 'qing'],
};

// Province to Recipe relationships (regional cuisine)
export const provinceRecipeRelations = {
  Beijing: ['peking-duck', 'zhajiang-noodles', 'dumplings'],
  Shanghai: ['xiaolongbao', 'pan-fried-buns', 'braised-pork'],
  Sichuan: ['kung-pao-chicken', 'mapo-tofu', 'hot-pot', 'dan-dan-noodles'],
  Shaanxi: ['yangrou-paomo', 'biang-biang-noodles', 'yangrou-paomo'],
  Guangdong: ['char-siu', 'siu-mai', 'steamed-fish', 'congee'],
  Zhejiang: ['dongpo-pork', 'longjing-shrimp', 'beggar-chicken'],
  Jiangsu: ['west-lake-fish', 'longjing-shrimp', 'lion-head-meatballs'],
  Hunan: ['twice-cooked-pork', 'spicy-crawfish'],
  Fujian: ['steamed-fish', 'sweet-sour-pork'],
  Shandong: ['braised-pork', 'sweet-sour-pork'],
  Yunnan: ['hot-dry-noodles', 'hot-pot'],
  Tibet: ['hot-pot', 'hot-pot', 'hot-pot'],
};

/**
 * Get related recipes for a city
 */
export function getCityRecipes(cityId, provinceId) {
  const directRecipes = cityRecipeRelations[cityId] ?? [];
  const provinceRecipes = provinceRecipeRelations[provinceId] ?? [];
  return [...new Set([...directRecipes, ...provinceRecipes])];
}

/**
 * Get related dynasties for a city
 */
export function getCityDynasties(cityId, provinceId) {
  const directDynasties = cityDynastyRelations[cityId] ?? [];
  const provinceDynasties = provinceDynastyRelations[provinceId] ?? [];
  return [...new Set([...directDynasties, ...provinceDynasties])];
}

/**
 * Get related people for a dynasty
 */
export function getDynastyPeople(dynastyId) {
  return dynastyPersonRelations[dynastyId] ?? [];
}

/**
 * Get related recipes for a dynasty
 */
export function getDynastyRecipes(dynastyId) {
  return dynastyRecipeRelations[dynastyId] ?? [];
}

/**
 * Get related recipes for a festival
 */
export function getFestivalRecipes(festivalId) {
  return festivalRecipeRelations[festivalId] ?? [];
}

/**
 * Get related cities for a person
 */
export function getPersonCities(personId) {
  return personCityRelations[personId] ?? [];
}

/**
 * Get related people for a city
 */
export function getCityPeople(cityId) {
  const people = [];
  for (const [personId, cities] of Object.entries(personCityRelations)) {
    if (cities.includes(cityId)) {
      people.push(personId);
    }
  }
  return people;
}
