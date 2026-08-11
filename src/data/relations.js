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
  beijing: ['peking-duck', 'jiaozi', 'zhajiangmian'],
  shanghai: ['xiaolongbao', 'shengjianbao', 'hongshaorou'],
  chengdu: ['kung-pao-chicken', 'mapo-tofu', 'hot-pot', 'dandan-noodles'],
  xian: ['roujiamo', 'biangbiang-noodles', 'yangrou-paomo'],
  guangzhou: ['char-siu', 'dim-sum', 'steamed-fish', 'congee'],
  hangzhou: ['dongpo-pork', 'longjing-shrimp', 'beggar-chicken'],
  suzhou: ['squirrel-fish', 'biluochun-shrimp'],
  nanjing: ['salted-duck', 'duck-blood-soup'],
  chongqing: ['hot-pot', 'chongqing-noodles'],
  tianjin: ['goubuli-baozi', 'jianbing'],
  wuhan: ['hot-dry-noodles', 'steamed-dumplings'],
  harbin: ['harbin-sausage', 'stewed-pork'],
  kunming: ['crossing-bridge-noodles', 'wild-mushroom-hotpot'],
  lhasa: ['tsampa', 'butter-tea', 'yak-meat'],
  dalian: ['seafood-dumplings', 'braised-sea-cucumber'],
  qingdao: ['clams-with-beer', 'braised-abalone'],
  xiamen: ['satay-noodles', 'oyster-omelette'],
  guilin: ['guilin-noodles', 'beer-fish'],
  lijiang: ['naxi-hotpot', 'yak-cheese'],
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
  qin: ['roujiamo'], // Ancient Northwest food
  han: ['dumplings', 'noodles'], // Early wheat-based food
  tang: ['persimmon-cake', 'huangshan-cake'], // Tang sweets
  song: ['dongpo-pork', 'beggar-chicken'], // Song literary food
  ming: ['peking-duck'], // Ming court cuisine
  qing: ['manchu-han-feast', 'hot-pot'], // Qing imperial cuisine
};

// Festival to Recipe relationships (traditional foods)
// Keys must match the `id` values used in src/data/festivals.js so the
// merged recommendedFoodIds actually resolve. (P1-3 naming fix)
export const festivalRecipeRelations = {
  'spring-festival': ['dumplings', 'nian-gao', 'tangyuan', 'fish'],
  'lantern-festival': ['tangyuan', 'yuanxiao'],
  // 清明 (solar term) — festivals.js id is `qingming` (was `qingming-festival`)
  qingming: ['qingtuan', 'sanzi'],
  'dragon-boat-festival': ['zongzi', 'realgar-wine'],
  'mid-autumn-festival': ['mooncake', 'pomelo', 'duck'],
  'double-ninth-festival': ['chongyang-cake', 'chrysanthemum-tea'],
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
  suxi: ['hangzhou', 'huangzhou'],
  caocao: ['xuchang', 'luoyang'],
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
  Shandong: ['zhou', 'han', 'qi'],
  Yunnan: ['ming', 'qing'],
  Tibet: ['yuan', 'ming', 'qing'],
  Guangdong: ['han', 'nan-yue', 'qing'],
};

// Province to Recipe relationships (regional cuisine)
export const provinceRecipeRelations = {
  Beijing: ['peking-duck', 'zhajiangmian', 'jiaozi'],
  Shanghai: ['xiaolongbao', 'shengjianbao', 'hongshaorou'],
  Sichuan: ['kung-pao-chicken', 'mapo-tofu', 'hot-pot', 'dandan-noodles'],
  Shaanxi: ['roujiamo', 'biangbiang-noodles', 'yangrou-paomo'],
  Guangdong: ['char-siu', 'dim-sum', 'steamed-fish', 'congee'],
  Zhejiang: ['dongpo-pork', 'longjing-shrimp', 'beggar-chicken'],
  Jiangsu: ['squirrel-fish', 'biluochun-shrimp', 'lion-head-meatball'],
  Hunan: ['stewed-pork-with-preserved-vegetable', 'spicy-crawfish'],
  Fujian: ['buddha-jumps-wall', 'lychee-pork'],
  Shandong: ['braised-intestines', 'sweet-sour-carp'],
  Yunnan: ['crossing-bridge-noodles', 'wild-mushroom-hotpot'],
  Tibet: ['tsampa', 'butter-tea', 'yak-meat'],
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
