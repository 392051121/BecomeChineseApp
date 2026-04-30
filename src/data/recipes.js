import recipesRaw from './recipes.json';
import { getImageSource, recipeImagePrompts } from './imagePrompts';
import { provinceRecipeRelations, festivalRecipeRelations } from './relations';

const recipeKeywordMap = {
  'kung-pao-chicken': 'Kung Pao Chicken / 宫保鸡丁, Sichuan cuisine / 四川菜, peanuts / 花生, spicy stir-fry / 辣味炒菜, Chinese home cooking / 中国家常菜',
  'mapo-tofu': 'Mapo Tofu / 麻婆豆腐, Sichuan cuisine / 四川菜, tofu / 豆腐, chili / 辣椒, Sichuan pepper / 花椒, Chinese Sichuan cooking / 中国川菜',
  'sweet-sour-pork': 'Sweet and Sour Pork / 咕噜肉, Cantonese cuisine / 广东菜, sweet-sour / 酸甜口, Chinese roasting style / 中式烧法',
  'fried-rice': 'Yangzhou Fried Rice / 扬州炒饭, Chinese fried rice / 中国炒饭, egg / 鸡蛋, shrimp / 虾仁, home staple / 家常主食',
  dumplings: 'Dumplings / 饺子, Chinese New Year food / 中国年节食物, Northern staple / 北方主食, wheat-based food / 面食',
  xiaolongbao: 'Xiaolongbao / 小笼包, Shanghai dim sum / 上海点心, soup dumplings / 汤包, steamed pastry / 蒸制面点',
  'peking-duck': 'Peking Duck / 北京烤鸭, Beijing flavor / 北京风味, palace and city cuisine / 宫廷与城市饮食, sliced duck / 片鸭',
  'char-siu': 'Char Siu / 叉烧, Cantonese cuisine / 粤菜, roasted pork / 烤制猪肉, sweet-savory flavor / 甜咸风味',
  'hot-pot': 'Hot Pot / 火锅, Sichuan hot pot / 四川火锅, communal dining / 中国聚餐, spicy broth / 麻辣锅底',
  congee: 'Congee / 粥, Cantonese breakfast / 广东早餐, century egg and pork congee / 皮蛋瘦肉粥, rice culture / 米食文化',
  'braised-pork': 'Braised Pork Belly / 红烧肉, Shanghai home cooking / 上海家常菜, traditional Chinese braising / 传统中式炖煮, pork belly / 五花肉',
  'scrambled-eggs-tomatoes': 'Tomato and Egg Stir-fry / 番茄炒蛋, Chinese home cooking / 中国家常菜, quick comfort food / 快手下饭菜',
  'steamed-fish': 'Steamed Fish / 清蒸鱼, Cantonese cuisine / 粤菜, original flavor / 原味, festival banquet / 年节宴席, Chinese home-style cooking / 中国家常做法',
};

export const recipes = recipesRaw.map((item, index) => {
  const provinceId = (item.province || ({
    'kung-pao-chicken': 'Sichuan',
    'mapo-tofu': 'Sichuan',
    'sweet-sour-pork': 'Guangdong',
    'fried-rice': 'Jiangsu',
    dumplings: 'Shaanxi',
    xiaolongbao: 'Shanghai',
    'peking-duck': 'Beijing',
    'char-siu': 'Guangdong',
    'hot-pot': 'Sichuan',
    congee: 'Guangdong',
    'braised-pork': 'Shanghai',
    'scrambled-eggs-tomatoes': 'General',
    'steamed-fish': 'Guangdong',
  })[item.id]) ?? 'General';

  const featuredRecipes = ['peking-duck', 'mapo-tofu', 'xiaolongbao', 'hot-pot', 'kung-pao-chicken'];
  const isFeatured = featuredRecipes.includes(item.id);

  return {
    id: item.id,
    type: 'recipe',
    province_id: provinceId,
    provinceId,
    regionId: provinceId === 'Sichuan' || provinceId === 'Chongqing' ? 'west'
      : provinceId === 'Guangdong' || provinceId === 'Guangxi' ? 'south'
      : provinceId === 'Jiangsu' || provinceId === 'Shanghai' || provinceId === 'Zhejiang' ? 'east'
      : provinceId === 'Beijing' || provinceId === 'Shaanxi' || provinceId === 'Shandong' ? 'north'
      : provinceId === 'Hunan' || provinceId === 'Hubei' ? 'central'
      : provinceId === 'Gansu' ? 'northwest'
      : 'general',
    related_links: {
      places: [],
      history: [],
      food: [],
    },
    nameEn: item.name,
    nameCn: item.chineseName,
    nameZh: item.chineseName,
    name_en: item.name,
    name_cn: item.chineseName,
    name_zh: item.chineseName,
    pinyin: item.pinyin ?? item.chineseName,
    subtitleCn: item.tasteTags ? `${item.tasteTags.slice(0, 2).join('、')}风味` : '中国饮食文化中的一道菜',
    subtitleEn: item.tasteTags ? `${item.tasteTags[0]} Chinese dish` : 'A representative Chinese dish',
    summaryCn: item.chineseDescription || item.description,
    summaryEn: item.description,
    highlights: [item.name, item.chineseName, provinceId, item.city].filter(Boolean),
    difficulty: item.difficulty ?? 'medium',
    prepTime: item.prepTime,
    cookTime: item.cookTime,
    servings: item.servings,
    province: item.city ? `${item.city} / ${provinceId}` : `${provinceId} / ${provinceId === 'General' ? '中国家常' : provinceId}`,
    city: item.city,
    tags: item.tasteTags ?? item.tags ?? [],
    tasteTags: item.tasteTags ?? [],
    mainIngredients: item.mainIngredients ?? [],
    culturalBackground: item.culturalBackground ?? '',
    seasonalConnection: item.seasonalConnection ?? '',
    historicalConnection: item.historicalConnection ?? '',
    relatedIds: [provinceId],
    relatedCityIds: Object.entries(provinceRecipeRelations)
      .filter(([, recipes]) => recipes.includes(item.id))
      .map(([province]) => province.toLowerCase()),
    relatedFestivalIds: Object.entries(festivalRecipeRelations)
      .filter(([, recipes]) => recipes.includes(item.id))
      .map(([festival]) => festival),
    relatedQuizIds: [],
    tasteProfile: item.tasteTags ?? [],
    ingredients: item.ingredients ?? [],
    steps: item.steps ?? [],
    tips: item.tips ?? '',
    isFeatured,
    sortOrder: isFeatured ? featuredRecipes.indexOf(item.id) : 100 + index,
    imagePrompt: recipeImagePrompts[item.id] ?? `Authentic Chinese ${item.name} close-up, unmistakably China, Chinese ceramic plate, editorial food photography, no Japanese, no Korean, no Western plating.`,
    image: `https://picsum.photos/seed/${encodeURIComponent(item.id || item.name)}/800/600`,
    imagePlaceholderText: `Image of ${item.name}`,
    imageAsset: `${item.id}.jpg`,
    imageSource: getImageSource(`${item.id}.jpg`),
    culturalStory: item.culturalBackground || item.description,
    cultural_story: item.culturalBackground || item.description,
    substitution: item.tips,
    taste_profile: item.tasteTags ?? [],
    etiquette: item.tips,
    culturalContext: item.culturalBackground ?? 'A small part of Chinese food culture. / 中国饮食文化中的一部分。',
  };
});

// Helper functions for recipe queries
export function getRecipesByProvince(provinceId) {
  return recipes.filter(r => r.provinceId === provinceId);
}

export function getRecipesByRegion(regionId) {
  return recipes.filter(r => r.regionId === regionId);
}

export function getRecipesByTasteTag(tag) {
  return recipes.filter(r => r.tasteTags.includes(tag));
}

export function getRecipesBySeason(season) {
  const seasonKeywords = {
    spring: ['春', 'spring', 'refreshing'],
    summer: ['夏', 'summer', 'cooling', 'refreshing', 'cold'],
    autumn: ['秋', 'autumn', 'Mid-Autumn'],
    winter: ['冬', 'winter', 'warming', 'hot pot', 'braised'],
  };
  const keywords = seasonKeywords[season] || [];
  return recipes.filter(r =>
    keywords.some(kw =>
      r.seasonalConnection?.toLowerCase().includes(kw.toLowerCase()) ||
      r.nameCn?.includes(kw) ||
      r.name?.toLowerCase().includes(kw.toLowerCase())
    )
  );
}

export function getFeaturedRecipes() {
  return recipes.filter(r => r.isFeatured).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getRecipeById(id) {
  return recipes.find(r => r.id === id);
}

export function searchRecipes(query) {
  const q = query.toLowerCase();
  return recipes.filter(r =>
    r.nameCn?.includes(query) ||
    r.name?.toLowerCase().includes(q) ||
    r.pinyin?.toLowerCase().includes(q) ||
    r.provinceId?.toLowerCase().includes(q) ||
    r.city?.toLowerCase().includes(q) ||
    r.tasteTags?.some(t => t.toLowerCase().includes(q)) ||
    r.mainIngredients?.some(i => i.toLowerCase().includes(q))
  );
}

export default recipes;
