/**
 * Recipe Image Configuration
 *
 * This file lists all recipe IDs and their corresponding image filenames.
 * To add local images:
 * 1. Place images in assets/recipes/ folder with names matching the IDs (e.g., kung-pao-chicken.jpg)
 * 2. Run: npm run gen:images (or manually update localImages.js)
 *
 * Recommended image sources:
 * - Unsplash: https://unsplash.com (search "Chinese food [dish name]")
 * - Pexels: https://pexels.com (search "Chinese cuisine")
 * - Wikimedia Commons: https://commons.wikimedia.org (public domain images)
 *
 * Image requirements:
 * - Format: JPG or PNG
 * - Size: 800x600 minimum (for cards), 1600x1000 for hero images
 * - Content: Authentic Chinese food presentation, no Western plating
 */

export const recipeImageList = [
  // Sichuan Cuisine
  'kung-pao-chicken',
  'mapo-tofu',
  'hot-pot',
  'twice-cooked-pork',
  'fish-flavored-pork',
  'dan-dan-noodles',
  'spicy-crawfish',

  // Cantonese / Guangdong
  'sweet-sour-pork',
  'char-siu',
  'congee',
  'steamed-fish',
  'wonton-soup',
  'shrimp-dumplings',
  'siu-mai',
  'roast-pigeon',
  'claypot-rice',
  'dim-sum', // generic dim sum placeholder

  // Shanghai / Jiangnan
  'xiaolongbao',
  'braised-pork',
  'lion-head-meatballs',
  'beggar-chicken',
  'dongpo-pork',
  'west-lake-fish',
  'longjing-shrimp',

  // Beijing / Northern
  'peking-duck',
  'dumplings',
  'zhajiang-noodles',
  'hot-dry-noodles',
  'scallion-pancakes',
  'stewed-pork-buns',
  'pan-fried-buns',

  // Northwestern
  'yangrou-paomo',
  'biang-biang-noodles',
  'red-braised-beef',

  // General / Home Cooking
  'fried-rice',
  'scrambled-eggs-tomatoes',
  'steamed-egg-custard',
  'cucumber-garlic',
  'tomato-egg-drop-soup',
  'steamed-chicken',
  'sour-spicy-pot',
  'braised-noodles',
  'sweet-ribs',
  'stinky-tofu',

  // Snacks & Street Food
  'beef-chow-fun',
  'sugar-coated-hawthorn',

  // Festival Foods
  'eight-treasure-rice',
  'tangyuan',
  'mooncake',
  'zongzi',

  // Bakery / Desserts
  'pork-floss-buns',
  'egg-tarts',
  'pineapple-buns',
  'radish-cake',
  'taro-cake',
  'mango-pudding',
  'black-sesame-soup',
  'red-bean-soup',
  'almond-tofu',
];

/**
 * Image prompts for AI image generation (if using AI tools)
 */
export const recipeImagePrompts = {
  'kung-pao-chicken': 'Kung Pao Chicken 宫保鸡丁 in white ceramic bowl, peanuts, diced chicken, red chilies, Sichuan cuisine, authentic Chinese presentation, warm lighting, editorial food photography',
  'mapo-tofu': 'Mapo Tofu 麻婆豆腐 in clay pot, silky tofu cubes, red oil, ground pork, Sichuan peppercorn garnish, steam rising, authentic Chinese restaurant style',
  'hot-pot': 'Chinese hot pot 火锅, bubbling red broth, various ingredients on table, communal dining, Sichuan style, warm ambient lighting',
  'peking-duck': 'Peking Duck 北京烤鸭, crispy skin, sliced duck on plate, pancakes, scallions, hoisin sauce, Beijing cuisine, palace style presentation',
  'xiaolongbao': 'Xiaolongbao 小笼包 in bamboo steamer, soup dumplings, delicate pleats, Shanghai dim sum, steam rising, white porcelain',
  'dumplings': 'Chinese dumplings 饺子, boiled dumplings in bowl, various shapes, Northern Chinese style, New Year celebration, family gathering',
  'fried-rice': 'Yangzhou fried rice 扬州炒饭, golden rice grains, egg, shrimp, peas, in ceramic bowl, Chinese home cooking, wok-charred',
  'char-siu': 'Char Siu 叉烧, glazed BBQ pork, hanging in traditional style, Cantonese cuisine, red sweet glaze, roasted meat',
  'sweet-sour-pork': 'Sweet and Sour Pork 咕噜肉, crispy glazed pork pieces, pineapple, bell peppers, Cantonese style, glossy sauce',
  'braised-pork': 'Braised Pork Belly 红烧肉, rich brown sauce, tender pork chunks, Shanghai style, traditional clay pot',
  'steamed-fish': 'Steamed Fish 清蒸鱼, whole fish, ginger scallion garnish, light soy sauce, Cantonese style, white plate',
  'congee': 'Chinese Congee 粥, rice porridge in bowl, century egg, pork slices, Cantonese breakfast, comfort food',
  'wonton-soup': 'Wonton Soup 云吞汤, delicate wontons in clear broth, shrimp filling, Cantonese style, garnished with scallions',
  'dan-dan-noodles': 'Dan Dan Noodles 担担面, spicy sesame noodles, minced pork, chili oil, Sichuan street food, in small bowl',
  'mooncake': 'Chinese Mooncake 月饼, traditional pastry, lotus seed paste, egg yolk center, Mid-Autumn Festival, intricate pattern',
  'zongzi': 'Zongzi 粽子, sticky rice dumpling wrapped in bamboo leaves, Dragon Boat Festival, traditional Chinese',
  'tangyuan': 'Tangyuan 汤圆, glutinous rice balls in bowl, sweet sesame filling, Lantern Festival, warm broth',
  'egg-tarts': 'Chinese Egg Tarts 蛋挞, golden custard filling, flaky pastry, Hong Kong bakery style, Portuguese influence',
  'stinky-tofu': 'Stinky Tofu 臭豆腐, fried tofu blocks, fermented, street food style, chili sauce, Hunan/Taiwan style',
  'scallion-pancakes': 'Scallion Pancakes 葱油饼, layered flatbread, green onions, crispy edges, Northern Chinese breakfast',
};

/**
 * Get image filename for a recipe
 */
export function getRecipeImageFilename(recipeId) {
  return `${recipeId}.jpg`;
}