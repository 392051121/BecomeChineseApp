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
 *
 * Rules:
 * - Every recipe id must exist in recipes.json
 * - Prefer real regional dishes over nearest-neighbor placeholders
 * - Lists are deduped at the getter layer; avoid intentional duplicates
 */

// City to Recipe relationships (beyond province matching)
export const cityRecipeRelations = {
  beijing: ['peking-duck', 'zhajiang-noodles', 'dumplings', 'sugar-coated-hawthorn'],
  shanghai: ['xiaolongbao', 'pan-fried-buns', 'braised-pork', 'pork-floss-buns'],
  chengdu: ['kung-pao-chicken', 'mapo-tofu', 'hot-pot', 'dan-dan-noodles', 'twice-cooked-pork'],
  xian: ['yangrou-paomo', 'biang-biang-noodles', 'stewed-pork-buns', 'dumplings'],
  guangzhou: ['char-siu', 'siu-mai', 'shrimp-dumplings', 'congee', 'steamed-fish', 'claypot-rice'],
  hangzhou: ['dongpo-pork', 'longjing-shrimp', 'west-lake-fish'],
  suzhou: ['eight-treasure-rice', 'sweet-ribs', 'lion-head-meatballs'],
  // Nanjing: Huaiyang / Jiangnan — not Sichuan hot pot
  nanjing: ['lion-head-meatballs', 'fried-rice', 'sweet-ribs'],
  chongqing: ['hot-pot', 'dan-dan-noodles', 'mapo-tofu', 'spicy-crawfish'],
  tianjin: ['pan-fried-buns', 'scallion-pancakes', 'dumplings'],
  wuhan: ['hot-dry-noodles', 'dumplings', 'spicy-crawfish'],
  // Northeast: dumplings / buns / hearty wheat foods — not Sichuan hot pot
  harbin: ['dumplings', 'stewed-pork-buns', 'scallion-pancakes'],
  // Yunnan / Southwest plateau: avoid inventing ghost dishes; use milder common staples
  // available in catalog (crossing-bridge style isn't in catalog → steamed chicken / congee)
  kunming: ['steamed-chicken', 'steamed-fish', 'congee'],
  // Lhasa: catalog has no tsampa/yak butter tea dishes — use warm national staples, not hot-pot spam
  lhasa: ['congee', 'steamed-chicken', 'black-sesame-soup'],
  dalian: ['steamed-fish', 'dumplings', 'scallion-pancakes'],
  qingdao: ['steamed-fish', 'dumplings', 'scallion-pancakes'],
  // Xiamen / Minnan: dim sum & sweet soups rather than dan-dan
  xiamen: ['shrimp-dumplings', 'siu-mai', 'mango-pudding', 'pineapple-buns'],
  guilin: ['steamed-fish', 'fried-rice', 'congee'],
  // Lijiang / Dian: same real catalog constraints as Kunming
  lijiang: ['steamed-chicken', 'steamed-fish', 'black-sesame-soup'],
  shenzhen: ['char-siu', 'claypot-rice', 'egg-tarts', 'mango-pudding'],
  // Ancient / secondary cities used in paths
  qufu: ['dumplings', 'scallion-pancakes'],
  luoyang: ['dumplings', 'yangrou-paomo'],
  kaifeng: ['dumplings', 'pan-fried-buns'],
  yangzhou: ['fried-rice', 'lion-head-meatballs'],
  changsha: ['stinky-tofu', 'spicy-crawfish', 'twice-cooked-pork'],
  jinan: ['scallion-pancakes', 'dumplings', 'sweet-sour-pork'],
  lanzhou: ['braised-noodles', 'yangrou-paomo'],
  dali: ['steamed-fish', 'steamed-chicken'],
  'shangri-la': ['congee', 'steamed-chicken'],
  hongkong: ['egg-tarts', 'pineapple-buns', 'mango-pudding', 'char-siu'],
  macau: ['egg-tarts', 'pineapple-buns', 'almond-tofu'],
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
  qufu: ['zhou'],
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
  qin: ['yangrou-paomo', 'dumplings'],
  han: ['dumplings', 'zhajiang-noodles'],
  tang: ['radish-cake', 'taro-cake', 'longjing-shrimp'],
  song: ['dongpo-pork', 'beggar-chicken', 'west-lake-fish'],
  ming: ['peking-duck', 'zhajiang-noodles'],
  qing: ['peking-duck', 'hot-pot', 'almond-tofu'],
};

// Festival to Recipe relationships (traditional foods)
// Keys must match the `id` values used in src/data/festivals.js so the
// merged recommendedFoodIds actually resolve.
export const festivalRecipeRelations = {
  'spring-festival': ['dumplings', 'stewed-pork-buns', 'tangyuan', 'steamed-fish', 'braised-pork'],
  'lantern-festival': ['tangyuan', 'sweet-ribs'],
  // 清明 — cold foods / spring sweets available in catalog
  qingming: ['tangyuan', 'eight-treasure-rice', 'black-sesame-soup'],
  'dragon-boat-festival': ['zongzi'],
  'mid-autumn-festival': ['mooncake', 'eight-treasure-rice'],
  // 重阳 — cakes / chrysanthemum wine not in catalog → autumn cakes + shrimp
  'double-ninth-festival': ['mooncake', 'longjing-shrimp', 'taro-cake'],
  // 冬至 — northern dumplings, southern tangyuan
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
  suxi: ['hangzhou'],
  caocao: ['luoyang'],
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
  Hubei: ['three-kingdoms', 'han'],
  Chongqing: ['three-kingdoms'],
};

// Province to Recipe relationships (regional cuisine) — Title Case keys match provinceMap
export const provinceRecipeRelations = {
  Beijing: ['peking-duck', 'zhajiang-noodles', 'dumplings', 'sugar-coated-hawthorn'],
  Shanghai: ['xiaolongbao', 'pan-fried-buns', 'braised-pork', 'pork-floss-buns'],
  Sichuan: ['kung-pao-chicken', 'mapo-tofu', 'hot-pot', 'dan-dan-noodles', 'twice-cooked-pork', 'fish-flavored-pork'],
  Chongqing: ['hot-pot', 'dan-dan-noodles', 'spicy-crawfish'],
  Shaanxi: ['yangrou-paomo', 'biang-biang-noodles', 'stewed-pork-buns', 'dumplings'],
  Guangdong: ['char-siu', 'siu-mai', 'shrimp-dumplings', 'steamed-fish', 'congee', 'claypot-rice', 'egg-tarts'],
  Zhejiang: ['dongpo-pork', 'longjing-shrimp', 'beggar-chicken', 'west-lake-fish'],
  Jiangsu: ['lion-head-meatballs', 'sweet-ribs', 'fried-rice', 'eight-treasure-rice'],
  Hunan: ['stinky-tofu', 'spicy-crawfish', 'twice-cooked-pork'],
  Fujian: ['steamed-fish', 'shrimp-dumplings', 'mango-pudding'],
  Shandong: ['scallion-pancakes', 'dumplings', 'sweet-sour-pork'],
  Hubei: ['hot-dry-noodles', 'dumplings', 'spicy-crawfish'],
  Heilongjiang: ['dumplings', 'stewed-pork-buns', 'scallion-pancakes'],
  Liaoning: ['dumplings', 'steamed-fish', 'scallion-pancakes'],
  // Yunnan / Tibet: no ghost dishes — pick closest real catalog items with
  // warmer / milder character rather than defaulting everything to hot-pot
  Yunnan: ['steamed-chicken', 'steamed-fish', 'congee', 'black-sesame-soup'],
  Tibet: ['congee', 'steamed-chicken', 'black-sesame-soup', 'red-bean-soup'],
  Gansu: ['braised-noodles', 'yangrou-paomo'],
  Shanxi: ['sour-spicy-pot', 'dumplings', 'scallion-pancakes'],
  Tianjin: ['pan-fried-buns', 'scallion-pancakes', 'dumplings'],
  Guangxi: ['steamed-fish', 'fried-rice', 'congee'],
  Hainan: ['steamed-chicken', 'steamed-fish', 'mango-pudding'],
  General: ['scrambled-eggs-tomatoes', 'steamed-egg-custard', 'tomato-egg-drop-soup', 'cucumber-garlic'],
};

/**
 * Dedup while preserving first-seen order
 */
function uniqueIds(ids) {
  return [...new Set((ids || []).filter(Boolean))];
}

/**
 * Get related recipes for a city
 */
export function getCityRecipes(cityId, provinceId) {
  const directRecipes = cityRecipeRelations[cityId] ?? [];
  const provinceRecipes = provinceRecipeRelations[provinceId] ?? [];
  return uniqueIds([...directRecipes, ...provinceRecipes]);
}

/**
 * Get related dynasties for a city
 */
export function getCityDynasties(cityId, provinceId) {
  const directDynasties = cityDynastyRelations[cityId] ?? [];
  const provinceDynasties = provinceDynastyRelations[provinceId] ?? [];
  return uniqueIds([...directDynasties, ...provinceDynasties]);
}

/**
 * Get related people for a dynasty
 */
export function getDynastyPeople(dynastyId) {
  return uniqueIds(dynastyPersonRelations[dynastyId] ?? []);
}

/**
 * Get related recipes for a dynasty
 */
export function getDynastyRecipes(dynastyId) {
  return uniqueIds(dynastyRecipeRelations[dynastyId] ?? []);
}

/**
 * Get related recipes for a festival
 */
export function getFestivalRecipes(festivalId) {
  return uniqueIds(festivalRecipeRelations[festivalId] ?? []);
}

/**
 * Get related cities for a person
 */
export function getPersonCities(personId) {
  return uniqueIds(personCityRelations[personId] ?? []);
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
  return uniqueIds(people);
}
