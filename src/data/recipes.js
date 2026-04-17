import recipesRaw from './recipes.json';
import { getImageSource, recipeImagePrompts } from './imagePrompts';

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

export const recipes = recipesRaw.map((item) => ({
  id: item.id,
  nameEn: item.name,
  nameZh: item.chineseName,
  difficulty: item.difficulty,
  prepTime: item.prepTime,
  province:
    ({
      'kung-pao-chicken': 'Sichuan / 四川',
      'mapo-tofu': 'Sichuan / 四川',
      'sweet-sour-pork': 'Guangdong / 广东',
      'fried-rice': 'Jiangsu / 江苏',
      dumplings: 'Shaanxi / 陕西',
      xiaolongbao: 'Shanghai / 上海',
      'peking-duck': 'Beijing / 北京',
      'char-siu': 'Guangdong / 广东',
      'hot-pot': 'Sichuan / 四川',
      congee: 'Guangdong / 广东',
      'braised-pork': 'Shanghai / 上海',
      'scrambled-eggs-tomatoes': 'Chinese home cooking / 中国家常',
      'steamed-fish': 'Guangdong / 广东',
    })[item.id] ?? 'Chinese home cooking / 中国家常',
  imagePrompt: recipeImagePrompts[item.id] ?? `Authentic Chinese ${item.name} close-up, unmistakably China, Chinese ceramic plate, editorial food photography, no Japanese, no Korean, no Western plating.`,
  image: `https://source.unsplash.com/1600x1000/?${encodeURIComponent(
    `${recipeKeywordMap[item.id] ?? item.name}, Chinese food photography, close up`
  )}`,
  imagePlaceholderText: `Image of ${item.name}`,
  imageAsset: `${item.id}.jpg`,
  imageSource: getImageSource(null),
  culturalStory: item.description,
  substitution: item.tips,
  culturalContext:
    {
      'kung-pao-chicken': 'A classic Sichuan dish that balances numbing heat, spice, sweetness, and savory depth. / 典型川菜代表，兼具麻、辣、甜、鲜的复合口味。',
      'mapo-tofu': 'Tofu paired with chili oil and Sichuan pepper, showing the signature structure of Sichuan flavor. / 豆腐与麻辣调味的结合，体现四川味型的典型结构。',
      'sweet-sour-pork': 'A sweet-and-sour Cantonese dish often seen in family banquets. / 粤菜与广式家宴中常见的酸甜口菜式。',
      'fried-rice': 'A staple that reflects Chinese home cooking’s practicality and thrift. / 剩饭再利用形成的经典主食，体现中国家庭的节俭与灵活。',
      dumplings: 'A staple for both everyday meals and Lunar New Year reunions. / 北方年节与日常都常见的面食，象征团圆。',
      xiaolongbao: 'A Jiangnan dim sum classic known for thin skin, rich soup, and precise steaming. / 江南点心代表之一，讲究皮薄、汤足、火候准。',
      'peking-duck': 'A capital-city dish that reflects Beijing’s sense of ceremony. / 都城饮食代表，体现北京菜的仪式感。',
      'char-siu': 'A signature Cantonese roast dish that highlights marinades and fire control. / 岭南烧味的典型之一，体现粤菜对火候与腌制的重视。',
      'hot-pot': 'A powerful symbol of communal dining in China — shared, lively, and warm. / 中国聚餐文化的强连接符号，强调共享与热闹。',
      congee: 'The most modest and stable form of rice-based breakfast in Chinese daily life. / 米食文化中最朴素也最稳定的一种日常早餐形态。',
      'braised-pork': 'Braising shows the Chinese love for savory sauce and tender texture. / 红烧技法体现中国家庭菜对酱香与软糯口感的偏爱。',
      'scrambled-eggs-tomatoes': 'A fast, reliable comfort dish in Chinese home cooking. / 中国家常菜代表，快、稳、下饭。',
      'steamed-fish': 'A Cantonese cooking style that respects the ingredient’s original flavor. / 强调尊重食材本味，是粤菜审美的重要体现。',
    }[item.id] ?? 'A small part of Chinese food culture. / 中国饮食文化中的一部分。',
}));

