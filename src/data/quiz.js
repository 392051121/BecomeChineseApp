/**
 * Quiz Questions Database
 *
 * Organized by categories: History, Geography, Food, Solar Terms, People, Traditional Culture
 * Total: 150+ questions for stable daily rotation
 */

export const quizCategories = {
  history: 'History 历史',
  geography: 'Geography 地理',
  food: 'Food 美食',
  solarTerms: 'Solar Terms 节气',
  people: 'People 人物',
  culture: 'Traditional Culture 传统文化',
};

// History Questions (30)
const historyQuestions = [
  {
    question: 'Which dynasty built the Great Wall as we know it today?',
    options: ['Ming Dynasty', 'Qin Dynasty', 'Han Dynasty', 'Tang Dynasty'],
    correctIndex: 0,
    explanation: 'The Ming Dynasty (1368-1644) rebuilt and extended the Great Wall into its current form.',
    region: 'Beijing',
  },
  {
    question: 'Which Chinese dynasty is considered the golden age of poetry and art?',
    options: ['Tang Dynasty', 'Song Dynasty', 'Han Dynasty', 'Ming Dynasty'],
    correctIndex: 0,
    explanation: 'The Tang Dynasty (618-907) is renowned as China\'s golden age of poetry, art, and culture.',
    region: 'Shaanxi',
  },
  {
    question: 'Who was the first emperor to unify China?',
    options: ['Qin Shi Huang', 'Han Wudi', 'Tang Taizong', 'Kublai Khan'],
    correctIndex: 0,
    explanation: 'Qin Shi Huang unified China in 221 BC, establishing the Qin Dynasty.',
    region: 'Shaanxi',
  },
  {
    question: 'Which dynasty invented gunpowder, printing, and the compass?',
    options: ['Song Dynasty', 'Tang Dynasty', 'Han Dynasty', 'Ming Dynasty'],
    correctIndex: 0,
    explanation: 'The Song Dynasty (960-1279) was a period of major technological innovation.',
    region: 'Henan',
  },
  {
    question: 'The Terracotta Army was created for which emperor?',
    options: ['Qin Shi Huang', 'Han Wudi', 'Tang Taizong', 'Qianlong Emperor'],
    correctIndex: 0,
    explanation: 'The Terracotta Army guards Emperor Qin Shi Huang\'s tomb near Xi\'an.',
    region: 'Shaanxi',
  },
  {
    question: 'Which dynasty established the imperial examination system?',
    options: ['Sui Dynasty', 'Tang Dynasty', 'Song Dynasty', 'Ming Dynasty'],
    correctIndex: 0,
    explanation: 'The Sui Dynasty (581-618) established the keju examination system.',
    region: 'General',
  },
  {
    question: 'The Forbidden City was built during which dynasty?',
    options: ['Ming Dynasty', 'Yuan Dynasty', 'Qing Dynasty', 'Tang Dynasty'],
    correctIndex: 0,
    explanation: 'The Ming Dynasty built the Forbidden City starting in 1406.',
    region: 'Beijing',
  },
  {
    question: 'Which dynasty saw the development of the Silk Road trade routes?',
    options: ['Han Dynasty', 'Tang Dynasty', 'Song Dynasty', 'Yuan Dynasty'],
    correctIndex: 0,
    explanation: 'The Han Dynasty (206 BC-220 AD) established the Silk Road trade routes.',
    region: 'Shaanxi',
  },
  {
    question: 'The Four Great Classical Novels were written during which period?',
    options: ['Ming-Qing period', 'Tang-Song period', 'Han period', 'Yuan period'],
    correctIndex: 0,
    explanation: 'The Four Great Classical Novels were completed during the Ming and Qing dynasties.',
    region: 'General',
  },
  {
    question: 'Which dynasty moved the capital to Beijing?',
    options: ['Ming Dynasty', 'Yuan Dynasty', 'Qing Dynasty', 'Jin Dynasty'],
    correctIndex: 0,
    explanation: 'The Ming Dynasty moved the capital from Nanjing to Beijing in 1421.',
    region: 'Beijing',
  },
  {
    question: 'The Grand Canal was completed during which dynasty?',
    options: ['Sui Dynasty', 'Tang Dynasty', 'Yuan Dynasty', 'Ming Dynasty'],
    correctIndex: 0,
    explanation: 'The Sui Dynasty completed the Grand Canal, linking north and south China.',
    region: 'Zhejiang',
  },
  {
    question: 'Which dynasty was founded by the Mongols?',
    options: ['Yuan Dynasty', 'Qing Dynasty', 'Liao Dynasty', 'Jin Dynasty'],
    correctIndex: 0,
    explanation: 'The Yuan Dynasty (1271-1368) was established by Kublai Khan.',
    region: 'Beijing',
  },
  {
    question: 'The Qing Dynasty was founded by which ethnic group?',
    options: ['Manchus', 'Mongols', 'Han Chinese', 'Tibetans'],
    correctIndex: 0,
    explanation: 'The Qing Dynasty (1644-1912) was founded by the Manchu people.',
    region: 'Beijing',
  },
  {
    question: 'Which dynasty is associated with blue and white porcelain?',
    options: ['Yuan Dynasty', 'Ming Dynasty', 'Song Dynasty', 'Qing Dynasty'],
    correctIndex: 0,
    explanation: 'Blue and white porcelain reached its peak during the Yuan and Ming dynasties.',
    region: 'Jiangxi',
  },
  {
    question: 'The Battle of Red Cliffs occurred during which period?',
    options: ['Three Kingdoms', 'Han Dynasty', 'Tang Dynasty', 'Warring States'],
    correctIndex: 0,
    explanation: 'The famous Battle of Red Cliffs (208 AD) occurred during the Three Kingdoms period.',
    region: 'Hubei',
  },
  {
    question: 'Which dynasty established the tribute system with neighboring countries?',
    options: ['Han Dynasty', 'Tang Dynasty', 'Ming Dynasty', 'Qing Dynasty'],
    correctIndex: 0,
    explanation: 'The Han Dynasty established the tribute system that lasted for centuries.',
    region: 'General',
  },
  {
    question: 'The Summer Palace in Beijing was built for which empress?',
    options: ['Empress Dowager Cixi', 'Empress Wu', 'Empress Xiaozhuang', 'Empress Ma'],
    correctIndex: 0,
    explanation: 'The Summer Palace was rebuilt and expanded for Empress Dowager Cixi.',
    region: 'Beijing',
  },
  {
    question: 'Which dynasty saw the introduction of Buddhism to China?',
    options: ['Han Dynasty', 'Tang Dynasty', 'Wei Dynasty', 'Jin Dynasty'],
    correctIndex: 0,
    explanation: 'Buddhism was introduced to China during the Han Dynasty via the Silk Road.',
    region: 'General',
  },
  {
    question: 'The Chinese civil service examination lasted until which year?',
    options: ['1905', '1911', '1898', '1912'],
    correctIndex: 0,
    explanation: 'The imperial examination system was abolished in 1905.',
    region: 'General',
  },
  {
    question: 'Which dynasty built the Temple of Heaven in Beijing?',
    options: ['Ming Dynasty', 'Yuan Dynasty', 'Qing Dynasty', 'Tang Dynasty'],
    correctIndex: 0,
    explanation: 'The Temple of Heaven was built during the Ming Dynasty in 1420.',
    region: 'Beijing',
  },
  {
    question: 'The famous poet Li Bai lived during which dynasty?',
    options: ['Tang Dynasty', 'Song Dynasty', 'Han Dynasty', 'Ming Dynasty'],
    correctIndex: 0,
    explanation: 'Li Bai (701-762) was one of the greatest poets of the Tang Dynasty.',
    region: 'Sichuan',
  },
  {
    question: 'Which dynasty established the Eight Banners military system?',
    options: ['Qing Dynasty', 'Ming Dynasty', 'Yuan Dynasty', 'Tang Dynasty'],
    correctIndex: 0,
    explanation: 'The Qing Dynasty established the Eight Banners system for military organization.',
    region: 'Beijing',
  },
  {
    question: 'The Chinese classic "Romance of the Three Kingdoms" is set in which period?',
    options: ['Three Kingdoms period', 'Han Dynasty', 'Warring States', 'Tang Dynasty'],
    correctIndex: 0,
    explanation: 'The novel is based on historical events from the Three Kingdoms period (220-280 AD).',
    region: 'General',
  },
  {
    question: 'Which dynasty had the largest territory in Chinese history?',
    options: ['Yuan Dynasty', 'Tang Dynasty', 'Qing Dynasty', 'Han Dynasty'],
    correctIndex: 0,
    explanation: 'The Yuan Dynasty under Mongol rule controlled the largest territorial extent.',
    region: 'General',
  },
  {
    question: 'The last emperor of China, Puyi, belonged to which dynasty?',
    options: ['Qing Dynasty', 'Ming Dynasty', 'Republic', 'Yuan Dynasty'],
    correctIndex: 0,
    explanation: 'Puyi was the last emperor of the Qing Dynasty, abdicating in 1912.',
    region: 'Beijing',
  },
  {
    question: 'Which dynasty developed the civil service examination to its peak?',
    options: ['Song Dynasty', 'Tang Dynasty', 'Ming Dynasty', 'Qing Dynasty'],
    correctIndex: 0,
    explanation: 'The Song Dynasty refined the examination system to its most developed form.',
    region: 'Henan',
  },
  {
    question: 'The Great Wall was primarily built to defend against which group?',
    options: ['Mongols', 'Japanese', 'Russians', 'Vietnamese'],
    correctIndex: 0,
    explanation: 'The Great Wall was primarily built to defend against northern nomadic tribes.',
    region: 'General',
  },
  {
    question: 'Which dynasty saw the voyages of Admiral Zheng He?',
    options: ['Ming Dynasty', 'Yuan Dynasty', 'Tang Dynasty', 'Song Dynasty'],
    correctIndex: 0,
    explanation: 'Zheng He\'s famous maritime expeditions occurred during the Ming Dynasty.',
    region: 'Jiangsu',
  },
  {
    question: 'The Shaolin Temple was founded during which dynasty?',
    options: ['Northern Wei', 'Tang Dynasty', 'Han Dynasty', 'Song Dynasty'],
    correctIndex: 0,
    explanation: 'The Shaolin Temple was founded in 495 AD during the Northern Wei Dynasty.',
    region: 'Henan',
  },
  {
    question: 'Which dynasty established the "Mandate of Heaven" concept?',
    options: ['Zhou Dynasty', 'Qin Dynasty', 'Han Dynasty', 'Shang Dynasty'],
    correctIndex: 0,
    explanation: 'The Zhou Dynasty introduced the Mandate of Heaven to justify political power.',
    region: 'General',
  },
];

// Geography Questions (25)
const geographyQuestions = [
  {
    question: 'Which river is known as the "mother river" of China?',
    options: ['Yellow River', 'Yangtze River', 'Pearl River', 'Mekong River'],
    correctIndex: 0,
    explanation: 'The Yellow River (Huang He) is considered the cradle of Chinese civilization.',
    region: 'General',
  },
  {
    question: 'What is the longest river in China?',
    options: ['Yangtze River', 'Yellow River', 'Pearl River', 'Amur River'],
    correctIndex: 0,
    explanation: 'The Yangtze River (Chang Jiang) is China\'s longest river at 6,300 km.',
    region: 'General',
  },
  {
    question: 'Which city is known as the "Spring City" for its mild climate?',
    options: ['Kunming', 'Chengdu', 'Hangzhou', 'Suzhou'],
    correctIndex: 0,
    explanation: 'Kunming in Yunnan province enjoys a mild spring-like climate year-round.',
    region: 'Yunnan',
  },
  {
    question: 'Which province is home to the Potala Palace?',
    options: ['Tibet', 'Qinghai', 'Sichuan', 'Yunnan'],
    correctIndex: 0,
    explanation: 'The Potala Palace in Lhasa, Tibet, was the winter residence of the Dalai Lamas.',
    region: 'Tibet',
  },
  {
    question: 'Which Chinese city is famous for its Ice and Snow Festival?',
    options: ['Harbin', 'Changchun', 'Shenyang', 'Dalian'],
    correctIndex: 0,
    explanation: 'Harbin International Ice and Snow Sculpture Festival is the world\'s largest.',
    region: 'Heilongjiang',
  },
  {
    question: 'Which province is famous for the Li River cruise?',
    options: ['Guangxi', 'Guangdong', 'Guizhou', 'Yunnan'],
    correctIndex: 0,
    explanation: 'The Li River cruise from Guilin to Yangshuo is one of China\'s most scenic journeys.',
    region: 'Guangxi',
  },
  {
    question: 'Which city is known as the "Roof of the World"?',
    options: ['Lhasa', 'Xining', 'Urumqi', 'Xigaze'],
    correctIndex: 0,
    explanation: 'Lhasa, the capital of Tibet, is known as the Roof of the World due to its altitude.',
    region: 'Tibet',
  },
  {
    question: 'Which province is home to the Zhangjiajie National Forest Park?',
    options: ['Hunan', 'Hubei', 'Sichuan', 'Guizhou'],
    correctIndex: 0,
    explanation: 'Zhangjiajie\'s towering pillars inspired the floating mountains in Avatar.',
    region: 'Hunan',
  },
  {
    question: 'Which city is famous for the West Lake?',
    options: ['Hangzhou', 'Suzhou', 'Nanjing', 'Wuxi'],
    correctIndex: 0,
    explanation: 'West Lake in Hangzhou is a UNESCO site celebrated in poetry and art.',
    region: 'Zhejiang',
  },
  {
    question: 'Which province is China\'s largest by area?',
    options: ['Xinjiang', 'Tibet', 'Inner Mongolia', 'Qinghai'],
    correctIndex: 0,
    explanation: 'Xinjiang is China\'s largest province-level region by area.',
    region: 'Xinjiang',
  },
  {
    question: 'Which city hosts the famous Bund waterfront promenade?',
    options: ['Shanghai', 'Guangzhou', 'Tianjin', 'Qingdao'],
    correctIndex: 0,
    explanation: 'The Bund is Shanghai\'s iconic waterfront along the Huangpu River.',
    region: 'Shanghai',
  },
  {
    question: 'Which province is famous for its classical gardens, a UNESCO World Heritage site?',
    options: ['Jiangsu', 'Zhejiang', 'Anhui', 'Fujian'],
    correctIndex: 0,
    explanation: 'Suzhou\'s classical gardens represent the pinnacle of Chinese garden design.',
    region: 'Jiangsu',
  },
  {
    question: 'Which city is known for its panda research base?',
    options: ['Chengdu', 'Chongqing', 'Kunming', 'Guiyang'],
    correctIndex: 0,
    explanation: 'Chengdu is home to the Giant Panda Breeding Research Base.',
    region: 'Sichuan',
  },
  {
    question: 'Which province is home to the famous Stone Forest?',
    options: ['Yunnan', 'Guizhou', 'Guangxi', 'Sichuan'],
    correctIndex: 0,
    explanation: 'Shilin (Stone Forest) is a UNESCO site of limestone formations in Yunnan.',
    region: 'Yunnan',
  },
  {
    question: 'Which city was the southern terminus of the Grand Canal?',
    options: ['Hangzhou', 'Suzhou', 'Nanjing', 'Shanghai'],
    correctIndex: 0,
    explanation: 'Hangzhou was the southern endpoint of the ancient Grand Canal.',
    region: 'Zhejiang',
  },
  {
    question: 'Which province is famous for the Yellow Mountain (Huangshan)?',
    options: ['Anhui', 'Jiangxi', 'Zhejiang', 'Fujian'],
    correctIndex: 0,
    explanation: 'Huangshan in Anhui is renowned for its granite peaks and pine trees.',
    region: 'Anhui',
  },
  {
    question: 'Which city is known for its ancient water towns?',
    options: ['Zhouzhuang', 'Suzhou', 'Hangzhou', 'Wuxi'],
    correctIndex: 0,
    explanation: 'Zhouzhuang is a well-preserved ancient water town with canals and stone bridges.',
    region: 'Jiangsu',
  },
  {
    question: 'Which province is home to the Kanas Lake?',
    options: ['Xinjiang', 'Tibet', 'Qinghai', 'Inner Mongolia'],
    correctIndex: 0,
    explanation: 'Kanas Lake in Xinjiang is known for its stunning scenery and mysterious legends.',
    region: 'Xinjiang',
  },
  {
    question: 'Which city is famous for the Terracotta Warriors?',
    options: ['Xi\'an', 'Luoyang', 'Kaifeng', 'Nanjing'],
    correctIndex: 0,
    explanation: 'The Terracotta Army guards Emperor Qin Shi Huang\'s tomb near Xi\'an.',
    region: 'Shaanxi',
  },
  {
    question: 'Which province is famous for the Jiuzhaigou Valley?',
    options: ['Sichuan', 'Yunnan', 'Guizhou', 'Guangxi'],
    correctIndex: 0,
    explanation: 'Jiuzhaigou Valley is a UNESCO nature reserve known for colorful lakes and waterfalls.',
    region: 'Sichuan',
  },
  {
    question: 'Which city is China\'s most populous?',
    options: ['Shanghai', 'Beijing', 'Chongqing', 'Guangzhou'],
    correctIndex: 2,
    explanation: 'Chongqing municipality has the largest population of any Chinese city.',
    region: 'Chongqing',
  },
  {
    question: 'Which province is famous for the Dunhuang Mogao Caves?',
    options: ['Gansu', 'Xinjiang', 'Qinghai', 'Ningxia'],
    correctIndex: 0,
    explanation: 'The Mogao Caves in Dunhuang contain thousands of Buddhist artworks.',
    region: 'Gansu',
  },
  {
    question: 'Which city is known for the Leshan Giant Buddha?',
    options: ['Leshan', 'Chengdu', 'Chongqing', 'Emeishan'],
    correctIndex: 0,
    explanation: 'The Leshan Giant Buddha is a 71-meter tall stone statue carved into a cliff.',
    region: 'Sichuan',
  },
  {
    question: 'Which province is home to the Wudang Mountains?',
    options: ['Hubei', 'Hunan', 'Henan', 'Jiangxi'],
    correctIndex: 0,
    explanation: 'The Wudang Mountains are a sacred Taoist site in Hubei province.',
    region: 'Hubei',
  },
  {
    question: 'Which city is famous for its colonial architecture on the Bund?',
    options: ['Shanghai', 'Qingdao', 'Xiamen', 'Guangzhou'],
    correctIndex: 0,
    explanation: 'Shanghai\'s Bund features colonial-era buildings from the early 20th century.',
    region: 'Shanghai',
  },
];

// Food Questions (25)
const foodQuestions = [
  {
    question: 'Which Chinese dish is known for its spicy and numbing flavor?',
    options: ['Mapo Tofu', 'Peking Duck', 'Xiaolongbao', 'Congee'],
    correctIndex: 0,
    explanation: 'Mapo Tofu is a Sichuan dish famous for its mala (numbing and spicy) flavor.',
    region: 'Sichuan',
  },
  {
    question: 'What is the traditional Chinese fermented bean paste used in cooking?',
    options: ['Doubanjiang', 'Hoisin sauce', 'Oyster sauce', 'Soy sauce'],
    correctIndex: 0,
    explanation: 'Doubanjiang is a spicy fermented bean paste, essential in Sichuan cuisine.',
    region: 'Sichuan',
  },
  {
    question: 'Which Chinese city is widely known for its Cantonese dim sum tradition?',
    options: ['Guangzhou', 'Qingdao', 'Lhasa', 'Nanjing'],
    correctIndex: 0,
    explanation: 'Guangzhou is the heartland of Cantonese dim sum and morning tea culture.',
    region: 'Guangdong',
  },
  {
    question: 'What is the primary ingredient in traditional Peking duck\'s crispy skin preparation?',
    options: ['Maltose syrup', 'Honey', 'Soy sauce', 'Rice wine'],
    correctIndex: 0,
    explanation: 'Maltose syrup is brushed on the duck to create the signature crispy, glossy skin.',
    region: 'Beijing',
  },
  {
    question: 'Which food is especially linked to Sichuan for its sesame paste and chili aroma?',
    options: ['Dan dan noodles', 'Pasta', 'Burger', 'Ramen'],
    correctIndex: 0,
    explanation: 'Dan dan noodles are a beloved Sichuan street-food classic.',
    region: 'Sichuan',
  },
  {
    question: 'What is the Chinese name for the Mid-Autumn Festival pastry?',
    options: ['Yuebing (Mooncake)', 'Jiaozi (Dumpling)', 'Zongzi (Rice dumpling)', 'Tangyuan (Glutinous ball)'],
    correctIndex: 0,
    explanation: 'Mooncakes are the traditional pastry eaten during the Mid-Autumn Festival.',
    region: 'General',
  },
  {
    question: 'Which Chinese cuisine is known for its emphasis on fresh, lightly seasoned dishes?',
    options: ['Cantonese', 'Sichuan', 'Hunan', 'Shandong'],
    correctIndex: 0,
    explanation: 'Cantonese cuisine emphasizes fresh ingredients and light, natural flavors.',
    region: 'Guangdong',
  },
  {
    question: 'What is the traditional name for dumplings in Chinese New Year food customs?',
    options: ['Jiaozi', 'Tacos', 'Samosas', 'Buns only'],
    correctIndex: 0,
    explanation: 'Jiaozi symbolize reunion and prosperity in many northern households.',
    region: 'General',
  },
  {
    question: 'Which tea is most closely associated with Hangzhou and West Lake?',
    options: ['Longjing tea', 'Pu\'er tea', 'Oolong tea', 'Jasmine tea'],
    correctIndex: 0,
    explanation: 'Longjing, or Dragon Well tea, is a signature tea from Hangzhou.',
    region: 'Zhejiang',
  },
  {
    question: 'Which food is most associated with Shanghai street breakfast culture?',
    options: ['Shengjianbao', 'Peking duck', 'Hot pot', 'Congee'],
    correctIndex: 0,
    explanation: 'Shengjianbao are pan-fried soup buns beloved in Shanghai morning food culture.',
    region: 'Shanghai',
  },
  {
    question: 'What style of Chinese cooking is famous for "red braising"?',
    options: ['Hunan cuisine', 'Cantonese cuisine', 'Jiangsu cuisine', 'Sichuan cuisine'],
    correctIndex: 0,
    explanation: 'Hunan cuisine is known for red braising techniques and bold flavors.',
    region: 'Hunan',
  },
  {
    question: 'Which Chinese dish consists of thinly sliced raw fish?',
    options: ['Yu Sheng', 'Sashimi', 'Carpaccio', 'Poke'],
    correctIndex: 0,
    explanation: 'Yu Sheng is a Chinese raw fish salad, popular during Chinese New Year.',
    region: 'Guangdong',
  },
  {
    question: 'What is the Chinese term for hot pot?',
    options: ['Huo Guo', 'Mala Xiang Guo', 'Shuan Yang Rou', 'Suan Cai Yu'],
    correctIndex: 0,
    explanation: 'Huo Guo (hot pot) is a communal dining experience with simmering broth.',
    region: 'Sichuan',
  },
  {
    question: 'Which Chinese dish is traditionally eaten during the Dragon Boat Festival?',
    options: ['Zongzi', 'Mooncake', 'Jiaozi', 'Tangyuan'],
    correctIndex: 0,
    explanation: 'Zongzi are sticky rice dumplings wrapped in bamboo leaves.',
    region: 'General',
  },
  {
    question: 'What is the main ingredient in the famous Sichuan dish "Mapo Tofu"?',
    options: ['Tofu', 'Pork', 'Beef', 'Chicken'],
    correctIndex: 0,
    explanation: 'Mapo Tofu features soft tofu in a spicy, numbing sauce.',
    region: 'Sichuan',
  },
  {
    question: 'Which Chinese province is famous for its spicy Hunan cuisine?',
    options: ['Hunan', 'Sichuan', 'Guangdong', 'Fujian'],
    correctIndex: 0,
    explanation: 'Hunan (Xiang) cuisine is known for hot spicy flavors and fresh ingredients.',
    region: 'Hunan',
  },
  {
    question: 'What is the traditional Chinese breakfast dish made from rice porridge?',
    options: ['Congee', 'Noodles', 'Dumplings', 'Baozi'],
    correctIndex: 0,
    explanation: 'Congee (zhou) is a rice porridge commonly eaten for breakfast.',
    region: 'General',
  },
  {
    question: 'Which Chinese dish features beggar\'s chicken wrapped in lotus leaves?',
    options: ['Jiao Hua Ji', 'Peking Duck', 'Bai Qie Ji', 'Gong Bao Ji Ding'],
    correctIndex: 0,
    explanation: 'Beggar\'s Chicken is a traditional dish wrapped in lotus leaves and clay.',
    region: 'Jiangsu',
  },
  {
    question: 'What is the Chinese name for spring rolls?',
    options: ['Chun Juan', 'Dan Bing', 'Jian Bing', 'Cong You Bing'],
    correctIndex: 0,
    explanation: 'Chun Juan are crispy rolls filled with vegetables or meat.',
    region: 'General',
  },
  {
    question: 'Which Chinese dish is known as "Lion\'s Head"?',
    options: ['Shizitou', 'Hong Shao Rou', 'Tang Cu Li Ji', 'Yu Xiang Rou Si'],
    correctIndex: 0,
    explanation: 'Lion\'s Head is a meatball dish from Huaiyang cuisine.',
    region: 'Jiangsu',
  },
  {
    question: 'What is the main ingredient in the dish "Dongpo Pork"?',
    options: ['Pork belly', 'Pork ribs', 'Pork loin', 'Pork shoulder'],
    correctIndex: 0,
    explanation: 'Dongpo Pork is braised pork belly named after poet Su Dongpo.',
    region: 'Zhejiang',
  },
  {
    question: 'Which Chinese dish is traditionally served during Winter Solstice?',
    options: ['Tangyuan', 'Mooncake', 'Zongzi', 'Jiaozi'],
    correctIndex: 0,
    explanation: 'Tangyuan (glutinous rice balls) are eaten during the Winter Solstice Festival.',
    region: 'General',
  },
  {
    question: 'What is the famous Beijing street food made from mutton and bread?',
    options: ['Yangrou Paomo', 'Lamb skewers', 'Mutton hotpot', 'Roasted lamb'],
    correctIndex: 0,
    explanation: 'Yangrou Paomo is a Xi\'an specialty of crumbled bread in mutton soup.',
    region: 'Shaanxi',
  },
  {
    question: 'Which Chinese dish features "ants climbing a tree"?',
    options: ['Ma Yi Shang Shu', 'Mapo Tofu', 'Kung Pao Chicken', 'Twice-cooked pork'],
    correctIndex: 0,
    explanation: 'Ants Climbing a Tree is vermicelli with minced meat, a Sichuan dish.',
    region: 'Sichuan',
  },
  {
    question: 'What is the Chinese fermented rice wine called?',
    options: ['Mijiu', 'Huangjiu', 'Baijiu', 'Yanjing'],
    correctIndex: 0,
    explanation: 'Mijiu is sweet fermented rice wine, while Huangjiu is yellow wine and Baijiu is distilled spirit.',
    region: 'Zhejiang',
  },
];

// Solar Terms Questions (20)
const solarTermsQuestions = [
  {
    question: 'How many solar terms are there in the traditional Chinese calendar?',
    options: ['24', '12', '36', '48'],
    correctIndex: 0,
    explanation: 'The traditional Chinese calendar has 24 solar terms (jieqi) marking seasonal changes.',
    region: 'General',
  },
  {
    question: 'Which solar term marks the beginning of spring in the Chinese calendar?',
    options: ['Lichun (Start of Spring)', 'Chunfen (Spring Equinox)', 'Yushui (Rain Water)', 'Jingzhe (Awakening of Insects)'],
    correctIndex: 0,
    explanation: 'Lichun, around February 4, marks the start of spring in the Chinese calendar.',
    region: 'General',
  },
  {
    question: 'Which solar term is associated with the Qingming Festival?',
    options: ['Qingming', 'Guyu', 'Chunfen', 'Lichun'],
    correctIndex: 0,
    explanation: 'Qingming (Pure Brightness) is when the Qingming Festival is observed.',
    region: 'General',
  },
  {
    question: 'Which solar term marks the longest day of the year?',
    options: ['Xiazhi (Summer Solstice)', 'Lixia (Start of Summer)', 'Xiaoman (Grain Buds)', 'Mangzhong (Grain in Ear)'],
    correctIndex: 0,
    explanation: 'Xiazhi, around June 21, is the summer solstice with the longest daylight.',
    region: 'General',
  },
  {
    question: 'During which solar term do people eat mooncakes?',
    options: ['Qiufen (Autumn Equinox)', 'Bailu (White Dew)', 'Chushu (Limit of Heat)', 'Hanlu (Cold Dew)'],
    correctIndex: 0,
    explanation: 'The Mid-Autumn Festival falls near Qiufen, when mooncakes are traditionally eaten.',
    region: 'General',
  },
  {
    question: 'Which solar term is known for "awakening of insects"?',
    options: ['Jingzhe', 'Lichun', 'Yushui', 'Chunfen'],
    correctIndex: 0,
    explanation: 'Jingzhe marks when hibernating insects wake up as spring thunder begins.',
    region: 'General',
  },
  {
    question: 'Which solar term marks the beginning of winter?',
    options: ['Lidong', 'Xiaoxue', 'Daxue', 'Shuangjiang'],
    correctIndex: 0,
    explanation: 'Lidong (Start of Winter) occurs around November 7-8.',
    region: 'General',
  },
  {
    question: 'During which solar term do people traditionally eat dumplings?',
    options: ['Dongzhi (Winter Solstice)', 'Lidong', 'Xiaoxue', 'Daxue'],
    correctIndex: 0,
    explanation: 'Dumplings are traditionally eaten during Dongzhi (Winter Solstice).',
    region: 'General',
  },
  {
    question: 'Which solar term is associated with "grain rain"?',
    options: ['Guyu', 'Yushui', 'Xiaoman', 'Mangzhong'],
    correctIndex: 0,
    explanation: 'Guyu (Grain Rain) is the last solar term of spring, important for agriculture.',
    region: 'General',
  },
  {
    question: 'Which solar term marks the hottest period of the year?',
    options: ['Dashu (Major Heat)', 'Xiaoshu (Minor Heat)', 'Xiazhi', 'Lixia'],
    correctIndex: 0,
    explanation: 'Dashu is the hottest solar term, occurring in late July.',
    region: 'General',
  },
  {
    question: 'Which solar term is known for "white dew"?',
    options: ['Bailu', 'Chushu', 'Qiufen', 'Hanlu'],
    correctIndex: 0,
    explanation: 'Bailu marks when dew forms at night as temperatures cool.',
    region: 'General',
  },
  {
    question: 'Which solar term is associated with dragon boat racing?',
    options: ['Mangzhong', 'Xiazhi', 'Xiaoman', 'Lixia'],
    correctIndex: 0,
    explanation: 'The Dragon Boat Festival usually falls during the Mangzhong solar term.',
    region: 'General',
  },
  {
    question: 'Which solar term marks the shortest day of the year?',
    options: ['Dongzhi (Winter Solstice)', 'Lidong', 'Xiaoxue', 'Daxue'],
    correctIndex: 0,
    explanation: 'Dongzhi, around December 22, is the winter solstice with the shortest daylight.',
    region: 'General',
  },
  {
    question: 'Which solar term is known for "frost descent"?',
    options: ['Shuangjiang', 'Hanlu', 'Qiufen', 'Bailu'],
    correctIndex: 0,
    explanation: 'Shuangjiang marks the appearance of frost, the last solar term of autumn.',
    region: 'General',
  },
  {
    question: 'Which solar term is associated with "grain in ear"?',
    options: ['Mangzhong', 'Xiaoman', 'Guyu', 'Xiazhi'],
    correctIndex: 0,
    explanation: 'Mangzhong is when grains become plump and farming is busy.',
    region: 'General',
  },
  {
    question: 'Which solar term marks the beginning of autumn?',
    options: ['Liqiu', 'Chushu', 'Bailu', 'Qiufen'],
    correctIndex: 0,
    explanation: 'Liqiu (Start of Autumn) occurs around August 7-8.',
    region: 'General',
  },
  {
    question: 'Which solar term is known for "limit of heat"?',
    options: ['Chushu', 'Liqiu', 'Bailu', 'Qiufen'],
    correctIndex: 0,
    explanation: 'Chushu marks the end of the hottest days of summer.',
    region: 'General',
  },
  {
    question: 'Which solar term is associated with "cold dew"?',
    options: ['Hanlu', 'Bailu', 'Shuangjiang', 'Qiufen'],
    correctIndex: 0,
    explanation: 'Hanlu marks when dew becomes cold and frost is near.',
    region: 'General',
  },
  {
    question: 'Which solar term is known for "minor snow"?',
    options: ['Xiaoxue', 'Daxue', 'Lidong', 'Dongzhi'],
    correctIndex: 0,
    explanation: 'Xiaoxue marks when light snow begins to fall.',
    region: 'General',
  },
  {
    question: 'Which solar term is associated with "major snow"?',
    options: ['Daxue', 'Xiaoxue', 'Lidong', 'Dongzhi'],
    correctIndex: 0,
    explanation: 'Daxue marks heavier snowfall as winter deepens.',
    region: 'General',
  },
];

// People Questions (25)
const peopleQuestions = [
  {
    question: 'Which Chinese philosopher is known for the concept of "wu wei" (non-action)?',
    options: ['Laozi', 'Confucius', 'Mencius', 'Sunzi'],
    correctIndex: 0,
    explanation: 'Laozi, the legendary founder of Taoism, introduced the concept of wu wei or effortless action.',
    region: 'General',
  },
  {
    question: 'Which Chinese philosopher emphasized "ren" (benevolence) and "li" (ritual)?',
    options: ['Confucius', 'Laozi', 'Zhuangzi', 'Mozi'],
    correctIndex: 0,
    explanation: 'Confucius (Kongzi) founded Confucianism, emphasizing benevolence and proper conduct.',
    region: 'Shandong',
  },
  {
    question: 'Who wrote "The Art of War"?',
    options: ['Sunzi', 'Confucius', 'Laozi', 'Han Fei'],
    correctIndex: 0,
    explanation: 'Sunzi (Sun Tzu) wrote The Art of War, a classic military strategy text.',
    region: 'Shandong',
  },
  {
    question: 'Which Tang dynasty poet is known as the "Poet Immortal"?',
    options: ['Li Bai', 'Du Fu', 'Wang Wei', 'Bai Juyi'],
    correctIndex: 0,
    explanation: 'Li Bai (701-762) is celebrated as the "Poet Immortal" for his romantic poetry.',
    region: 'Sichuan',
  },
  {
    question: 'Which poet is known as the "Poet Sage"?',
    options: ['Du Fu', 'Li Bai', 'Wang Wei', 'Su Shi'],
    correctIndex: 0,
    explanation: 'Du Fu (712-770) is called the "Poet Sage" for his realistic and compassionate works.',
    region: 'Henan',
  },
  {
    question: 'Who was the only female emperor in Chinese history?',
    options: ['Wu Zetian', 'Empress Dowager Cixi', 'Empress Wu', 'Empress Wei'],
    correctIndex: 0,
    explanation: 'Wu Zetian (624-705) was the only woman to rule China as emperor in her own right.',
    region: 'Shaanxi',
  },
  {
    question: 'Which Chinese explorer led seven maritime expeditions in the 15th century?',
    options: ['Zheng He', 'Zhang Qian', 'Xuanzang', 'Fa Xian'],
    correctIndex: 0,
    explanation: 'Zheng He (1371-1433) led seven major naval expeditions during the Ming Dynasty.',
    region: 'Yunnan',
  },
  {
    question: 'Who founded the Republic of China in 1912?',
    options: ['Sun Yat-sen', 'Chiang Kai-shek', 'Mao Zedong', 'Yuan Shikai'],
    correctIndex: 0,
    explanation: 'Sun Yat-sen is considered the father of modern China and founded the Republic.',
    region: 'Guangdong',
  },
  {
    question: 'Which Chinese Buddhist monk traveled to India to obtain scriptures?',
    options: ['Xuanzang', 'Zheng He', 'Fa Xian', 'Jianzhen'],
    correctIndex: 0,
    explanation: 'Xuanzang (602-664) journeyed to India and brought back Buddhist scriptures.',
    region: 'Henan',
  },
  {
    question: 'Who is considered the greatest calligrapher in Chinese history?',
    options: ['Wang Xizhi', 'Yan Zhenqing', 'Liu Gongquan', 'Su Shi'],
    correctIndex: 0,
    explanation: 'Wang Xizhi (303-361) is revered as the "Sage of Calligraphy".',
    region: 'Zhejiang',
  },
  {
    question: 'Which Song dynasty poet and statesman wrote "Red Cliff" verses?',
    options: ['Su Shi', 'Li Bai', 'Du Fu', 'Wang Anshi'],
    correctIndex: 0,
    explanation: 'Su Shi (Su Dongpo) wrote the famous "Ode to the Red Cliff" poems.',
    region: 'Sichuan',
  },
  {
    question: 'Who was the founder of the Han Dynasty?',
    options: ['Liu Bang', 'Liu Bei', 'Liu Xiu', 'Han Wudi'],
    correctIndex: 0,
    explanation: 'Liu Bang (256-195 BC) founded the Han Dynasty in 202 BC.',
    region: 'Jiangsu',
  },
  {
    question: 'Which Chinese physician is known as the "Medicine King"?',
    options: ['Sun Simiao', 'Li Shizhen', 'Zhang Zhongjing', 'Hua Tuo'],
    correctIndex: 0,
    explanation: 'Sun Simiao (581-682) is revered as the "Medicine King" for his medical contributions.',
    region: 'Shaanxi',
  },
  {
    question: 'Who wrote "Journey to the West"?',
    options: ['Wu Cheng\'en', 'Cao Xueqin', 'Luo Guanzhong', 'Shi Nai\'an'],
    correctIndex: 0,
    explanation: 'Wu Cheng\'en (1500-1582) wrote Journey to the West, one of the Four Great Classical Novels.',
    region: 'Jiangsu',
  },
  {
    question: 'Which Chinese inventor is credited with inventing paper?',
    options: ['Cai Lun', 'Bi Sheng', 'Zhang Heng', 'Su Song'],
    correctIndex: 0,
    explanation: 'Cai Lun (50-121 AD) improved papermaking technology during the Han Dynasty.',
    region: 'Hunan',
  },
  {
    question: 'Who was the famous Song dynasty general who fought against the Jin invasion?',
    options: ['Yue Fei', 'Han Shizhong', 'Wen Tianxiang', 'Xin Qiji'],
    correctIndex: 0,
    explanation: 'Yue Fei (1103-1142) is a legendary patriot who fought against the Jin Dynasty.',
    region: 'Henan',
  },
  {
    question: 'Which Chinese astronomer invented the seismoscope?',
    options: ['Zhang Heng', 'Zu Chongzhi', 'Guo Shoujing', 'Shen Kuo'],
    correctIndex: 0,
    explanation: 'Zhang Heng (78-139) invented the first seismoscope to detect earthquakes.',
    region: 'Henan',
  },
  {
    question: 'Who wrote "Dream of the Red Chamber"?',
    options: ['Cao Xueqin', 'Wu Cheng\'en', 'Luo Guanzhong', 'Shi Nai\'an'],
    correctIndex: 0,
    explanation: 'Cao Xueqin (1715-1763) wrote Dream of the Red Chamber, considered China\'s greatest novel.',
    region: 'Beijing',
  },
  {
    question: 'Which Chinese mathematician calculated pi to seven decimal places?',
    options: ['Zu Chongzhi', 'Zhang Heng', 'Liu Hui', 'Shen Kuo'],
    correctIndex: 0,
    explanation: 'Zu Chongzhi (429-500) calculated pi to seven decimal places, a record for 1000 years.',
    region: 'Jiangsu',
  },
  {
    question: 'Who was the famous Chinese navigator who may have reached America before Columbus?',
    options: ['Zheng He', 'Zhang Qian', 'Xuanzang', 'Fa Xian'],
    correctIndex: 0,
    explanation: 'Some theories suggest Zheng He\'s fleets may have reached the Americas.',
    region: 'Yunnan',
  },
  {
    question: 'Which Chinese painter is known for painting horses?',
    options: ['Xu Beihong', 'Qi Baishi', 'Zhang Daqian', 'Wu Changshuo'],
    correctIndex: 0,
    explanation: 'Xu Beihong (1895-1953) is famous for his ink paintings of horses.',
    region: 'Jiangsu',
  },
  {
    question: 'Who founded the Ming Dynasty?',
    options: ['Zhu Yuanzhang', 'Zhu Di', 'Hongwu Emperor', 'Yongle Emperor'],
    correctIndex: 0,
    explanation: 'Zhu Yuanzhang (1328-1398), a peasant, founded the Ming Dynasty.',
    region: 'Anhui',
  },
  {
    question: 'Which Chinese monk introduced Chan (Zen) Buddhism to Japan?',
    options: ['Jianzhen', 'Xuanzang', 'Bodhidharma', 'Huineng'],
    correctIndex: 0,
    explanation: 'Jianzhen (688-763) traveled to Japan and established Toshodaiji Temple.',
    region: 'Jiangsu',
  },
  {
    question: 'Who is known as the "Father of Chinese Railways"?',
    options: ['Zhan Tianyou', 'Li Siguang', 'Qian Xuesen', 'Deng Jiaxian'],
    correctIndex: 0,
    explanation: 'Zhan Tianyou (1861-1919) designed China\'s first railway built without foreign assistance.',
    region: 'Guangdong',
  },
  {
    question: 'Which Chinese philosopher founded Mohism?',
    options: ['Mozi', 'Confucius', 'Laozi', 'Han Fei'],
    correctIndex: 0,
    explanation: 'Mozi (470-391 BC) founded Mohism, advocating universal love and meritocracy.',
    region: 'Shandong',
  },
];

// Traditional Culture Questions (25)
const cultureQuestions = [
  {
    question: 'What is the Chinese term for the traditional ink wash painting technique?',
    options: ['Shuimo', 'Guohua', 'Sumi-e', 'Shanshui'],
    correctIndex: 0,
    explanation: 'Shuimo (water and ink) is the traditional Chinese painting technique using ink and water.',
    region: 'General',
  },
  {
    question: 'What style of Chinese painting emphasizes mountains and water?',
    options: ['Shanshui (Mountain-water)', 'Gongbi (Meticulous)', 'Xieyi (Freehand)', 'Mogu (Boneless)'],
    correctIndex: 0,
    explanation: 'Shanshui painting is a traditional Chinese style focusing on landscapes of mountains and water.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for calligraphy?',
    options: ['Shufa', 'Guohua', 'Zhuanke', 'Yinshua'],
    correctIndex: 0,
    explanation: 'Shufa is the art of Chinese calligraphy, one of the highest art forms in China.',
    region: 'General',
  },
  {
    question: 'What is the traditional Chinese string instrument with a pear-shaped body?',
    options: ['Pipa', 'Erhu', 'Guzheng', 'Dizi'],
    correctIndex: 0,
    explanation: 'The pipa is a four-stringed Chinese lute with a distinctive pear-shaped body.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the traditional red envelope given during festivals?',
    options: ['Hongbao', 'Lishi', 'Yasuiqian', 'All of these'],
    correctIndex: 3,
    explanation: 'Hongbao, Lishi, and Yasuiqian all refer to red envelopes given for good luck.',
    region: 'General',
  },
  {
    question: 'Which Chinese martial art is known for its slow, flowing movements?',
    options: ['Tai Chi', 'Kung Fu', 'Wushu', 'Bagua'],
    correctIndex: 0,
    explanation: 'Tai Chi (Taijiquan) is known for its slow, deliberate movements for health.',
    region: 'General',
  },
  {
    question: 'What is the Chinese term for the concept of "face" or social reputation?',
    options: ['Mianzi', 'Guanxi', 'Renqing', 'Favor'],
    correctIndex: 0,
    explanation: 'Mianzi (face) is crucial in Chinese social interactions and business relationships.',
    region: 'General',
  },
  {
    question: 'What is the traditional Chinese fermented rice wine called?',
    options: ['Mijiu', 'Huangjiu', 'Baijiu', 'Yanjing'],
    correctIndex: 0,
    explanation: 'Mijiu is sweet fermented rice wine, while Huangjiu is yellow wine and Baijiu is distilled spirit.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the traditional paper-cutting art?',
    options: ['Jianzhi', 'Zhezhi', 'Jiehua', 'Nianhua'],
    correctIndex: 0,
    explanation: 'Jianzhi is the traditional Chinese art of paper cutting, often used for decorations.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the traditional knot-tying art?',
    options: ['Zhongguo Jie', 'Pan Jie', 'Hua Jie', 'Tong Jie'],
    correctIndex: 0,
    explanation: 'Zhongguo Jie (Chinese knotting) is decorative knotwork with symbolic meanings.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the traditional folding screen?',
    options: ['Pingfeng', 'Zhangzi', 'Bijing', 'Chaping'],
    correctIndex: 0,
    explanation: 'Pingfeng is the traditional Chinese folding screen used for decoration and privacy.',
    region: 'General',
  },
  {
    question: 'What is the Chinese term for the traditional courtyard residence?',
    options: ['Siheyuan', 'Tulou', 'Yaodong', 'Diaojiaolou'],
    correctIndex: 0,
    explanation: 'Siheyuan is the traditional Chinese courtyard house with rooms around a central yard.',
    region: 'Beijing',
  },
  {
    question: 'What is the Chinese name for the traditional tea ceremony?',
    options: ['Gongfu Cha', 'Cha Dao', 'Sencha', 'Matcha'],
    correctIndex: 0,
    explanation: 'Gongfu Cha is the Chinese tea ceremony emphasizing skillful preparation.',
    region: 'Fujian',
  },
  {
    question: 'Which Chinese festival involves dragon boat racing?',
    options: ['Duanwu Festival', 'Mid-Autumn Festival', 'Spring Festival', 'Qingming Festival'],
    correctIndex: 0,
    explanation: 'The Dragon Boat Festival (Duanwu) commemorates poet Qu Yuan with boat races.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the Lunar New Year?',
    options: ['Chunjie', 'Zhongqiujie', 'Duanwujie', 'Qingmingjie'],
    correctIndex: 0,
    explanation: 'Chunjie (Spring Festival) is the Chinese Lunar New Year, the most important holiday.',
    region: 'General',
  },
  {
    question: 'What is the traditional Chinese medical practice of inserting thin needles?',
    options: ['Acupuncture', 'Moxibustion', 'Cupping', 'Tui na'],
    correctIndex: 0,
    explanation: 'Acupuncture involves inserting thin needles at specific points for healing.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the traditional silk embroidery?',
    options: ['Su Xiu', 'Shu Xiu', 'Xiang Xiu', 'Yue Xiu'],
    correctIndex: 0,
    explanation: 'Su Xiu (Suzhou embroidery) is one of the four famous Chinese embroidery styles.',
    region: 'Jiangsu',
  },
  {
    question: 'What is the Chinese term for the concept of "yin and yang"?',
    options: ['Yinyang', 'Wuxing', 'Qi', 'Dao'],
    correctIndex: 0,
    explanation: 'Yinyang represents the duality and balance in Chinese philosophy.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the five elements theory?',
    options: ['Wuxing', 'Yinyang', 'Bagua', 'Qi'],
    correctIndex: 0,
    explanation: 'Wuxing (Five Elements) describes wood, fire, earth, metal, and water.',
    region: 'General',
  },
  {
    question: 'What is the traditional Chinese board game considered one of the four arts?',
    options: ['Weiqi (Go)', 'Xiangqi (Chinese Chess)', 'Mahjong', 'Pai Gow'],
    correctIndex: 0,
    explanation: 'Weiqi, known internationally as Go, is one of the four classical Chinese arts.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the traditional shadow puppetry?',
    options: ['Piyingxi', 'Jingju', 'Kunqu', 'Yueju'],
    correctIndex: 0,
    explanation: 'Piyingxi is traditional Chinese shadow puppet theater.',
    region: 'Shaanxi',
  },
  {
    question: 'What is the Chinese term for the traditional porcelain from Jingdezhen?',
    options: ['Qinghua', 'Doucai', 'Famille rose', 'All of these'],
    correctIndex: 3,
    explanation: 'Jingdezhen is famous for various porcelain styles including Qinghua (blue and white).',
    region: 'Jiangxi',
  },
  {
    question: 'What is the Chinese name for the traditional lion dance?',
    options: ['Wushi', 'Longwu', 'Yangge', 'Dengwu'],
    correctIndex: 0,
    explanation: 'Wushi (lion dance) is a major festive performance across many Chinese communities.',
    region: 'General',
  },
  {
    question: 'What is the Chinese term for the traditional seal carving?',
    options: ['Zhuanke', 'Shufa', 'Guohua', 'Banhua'],
    correctIndex: 0,
    explanation: 'Zhuanke is the traditional art of carving seals, used in calligraphy and painting.',
    region: 'General',
  },
  {
    question: 'What is the Chinese name for the traditional lantern festival?',
    options: ['Yuanxiao', 'Zhongqiu', 'Duanwu', 'Chongyang'],
    correctIndex: 0,
    explanation: 'Yuanxiao (Lantern Festival) marks the end of Chinese New Year celebrations.',
    region: 'General',
  },
];

// Combine all questions with category labels
export const allQuizQuestions = [
  ...historyQuestions.map(q => ({ ...q, category: 'history' })),
  ...geographyQuestions.map(q => ({ ...q, category: 'geography' })),
  ...foodQuestions.map(q => ({ ...q, category: 'food' })),
  ...solarTermsQuestions.map(q => ({ ...q, category: 'solarTerms' })),
  ...peopleQuestions.map(q => ({ ...q, category: 'people' })),
  ...cultureQuestions.map(q => ({ ...q, category: 'culture' })),
];

/**
 * Stable content-hash id for a quiz item.
 * Index-based ids break when questions are inserted/reordered; hashing the
 * question stem keeps wrong-answer / relatedQuizIds stable across content edits.
 */
function stableQuizId(questionText, category = 'general') {
  const raw = String(questionText || '').trim().toLowerCase();
  let hash = 2166136261; // FNV-1a 32-bit
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  // keep signed 32-bit → unsigned hex
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  const cat = String(category || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '');
  return `quiz-${cat || 'general'}-${hex}`;
}

// Generate quiz questions with IDs (stable content hash + index fallback uniqueness)
const usedQuizIds = new Set();
export const quizQuestions = allQuizQuestions.map((item, index) => {
  let id = stableQuizId(item.question, item.category);
  // Extremely rare hash collision: append index for uniqueness
  if (usedQuizIds.has(id)) {
    id = `${id}-${index + 1}`;
  }
  usedQuizIds.add(id);

  // Legacy index id kept as alias so people.relatedQuizIds like quiz-001 still resolve
  const legacyId = `quiz-${String(index + 1).padStart(3, '0')}`;

  return {
    id,
    legacyId,
    type: 'quiz',
    nameCn: item.question,
    nameEn: item.question,
    subtitleCn: item.region,
    subtitleEn: item.region,
    summaryCn: item.explanation,
    summaryEn: item.explanation,
    questionCn: item.question,
    questionEn: item.question,
    optionsCn: item.options,
    optionsEn: item.options,
    correctIndex: item.correctIndex,
    explanationCn: item.explanation,
    explanationEn: item.explanation,
    topic: item.region,
    difficulty: 'easy',
    relatedItemIds: [],
    tags: [item.region.toLowerCase(), 'daily', 'quiz', item.category],
    isDaily: true,
    region: item.region,
    category: item.category,
    question: item.question,
    options: item.options,
    explanation: item.explanation,
  };
});

/** Lookup by stable id OR legacy quiz-00N index id */
export function getQuizQuestionById(id) {
  if (!id) return null;
  return (
    quizQuestions.find((q) => q.id === id || q.legacyId === id) || null
  );
}

/**
 * Get daily quiz question based on date
 */
export function getDailyQuizQuestion(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  return quizQuestions[dayOfYear % quizQuestions.length];
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(category) {
  return quizQuestions.filter(q => q.category === category);
}

/**
 * Get questions by region
 */
export function getQuestionsByRegion(region) {
  return quizQuestions.filter(q => q.region === region);
}

/**
 * Get random questions for practice
 */
export function getRandomQuestions(count = 10, category = null) {
  const pool = category ? getQuestionsByCategory(category) : quizQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Solar terms and their approximate dates
 */
export const solarTerms = {
  'lichun': { name: '立春 Start of Spring', month: 2, day: 4, categories: ['culture', 'history'] },
  'yushui': { name: '雨水 Rain Water', month: 2, day: 19, categories: ['geography', 'culture'] },
  'jingzhe': { name: '惊蛰 Awakening of Insects', month: 3, day: 6, categories: ['culture', 'geography'] },
  'chunfen': { name: '春分 Spring Equinox', month: 3, day: 21, categories: ['culture', 'geography'] },
  'qingming': { name: '清明 Pure Brightness', month: 4, day: 5, categories: ['history', 'culture'] },
  'guyu': { name: '谷雨 Grain Rain', month: 4, day: 20, categories: ['geography', 'culture'] },
  'lixia': { name: '立夏 Start of Summer', month: 5, day: 6, categories: ['culture', 'food'] },
  'xiaoman': { name: '小满 Grain Buds', month: 5, day: 21, categories: ['geography', 'culture'] },
  'mangzhong': { name: '芒种 Grain in Ear', month: 6, day: 6, categories: ['geography', 'culture'] },
  'xiazhi': { name: '夏至 Summer Solstice', month: 6, day: 21, categories: ['culture', 'geography'] },
  'xiaoshu': { name: '小暑 Minor Heat', month: 7, day: 7, categories: ['food', 'culture'] },
  'dashu': { name: '大暑 Major Heat', month: 7, day: 23, categories: ['food', 'culture'] },
  'liqiu': { name: '立秋 Start of Autumn', month: 8, day: 8, categories: ['food', 'culture'] },
  'chushu': { name: '处暑 End of Heat', month: 8, day: 23, categories: ['culture', 'geography'] },
  'bailu': { name: '白露 White Dew', month: 9, day: 8, categories: ['culture', 'geography'] },
  'qiufen': { name: '秋分 Autumn Equinox', month: 9, day: 23, categories: ['culture', 'geography'] },
  'hanlu': { name: '寒露 Cold Dew', month: 10, day: 8, categories: ['culture', 'geography'] },
  'shuangjiang': { name: '霜降 Frost Descent', month: 10, day: 24, categories: ['geography', 'culture'] },
  'lidong': { name: '立冬 Start of Winter', month: 11, day: 8, categories: ['food', 'culture'] },
  'xiaoxue': { name: '小雪 Minor Snow', month: 11, day: 22, categories: ['geography', 'culture'] },
  'daxue': { name: '大雪 Major Snow', month: 12, day: 7, categories: ['geography', 'culture'] },
  'dongzhi': { name: '冬至 Winter Solstice', month: 12, day: 22, categories: ['food', 'history', 'culture'] },
  'xiaohan': { name: '小寒 Minor Cold', month: 1, day: 6, categories: ['food', 'culture'] },
  'dahan': { name: '大寒 Major Cold', month: 1, day: 20, categories: ['food', 'culture'] },
};

/**
 * Traditional Chinese festivals with lunar dates
 */
export const festivals = {
  'spring-festival': { name: '春节 Spring Festival', lunarMonth: 1, lunarDay: 1, categories: ['culture', 'history', 'food'] },
  'lantern-festival': { name: '元宵节 Lantern Festival', lunarMonth: 1, lunarDay: 15, categories: ['culture', 'food'] },
  'qingming-festival': { name: '清明节 Qingming Festival', solarTerm: 'qingming', categories: ['history', 'culture'] },
  'dragon-boat': { name: '端午节 Dragon Boat Festival', lunarMonth: 5, lunarDay: 5, categories: ['history', 'food', 'culture'] },
  'qixi': { name: '七夕节 Qixi Festival', lunarMonth: 7, lunarDay: 7, categories: ['culture', 'people'] },
  'mid-autumn': { name: '中秋节 Mid-Autumn Festival', lunarMonth: 8, lunarDay: 15, categories: ['food', 'culture', 'people'] },
  'chongyang': { name: '重阳节 Double Ninth Festival', lunarMonth: 9, lunarDay: 9, categories: ['culture', 'people'] },
  'labafestival': { name: '腊八节 Laba Festival', lunarMonth: 12, lunarDay: 8, categories: ['food', 'culture'] },
};

/**
 * Get current solar term based on date
 */
export function getCurrentSolarTerm(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const [key, term] of Object.entries(solarTerms)) {
    if (term.month === month && Math.abs(term.day - day) <= 7) {
      return { key, ...term };
    }
  }
  return null;
}

/**
 * Get questions related to current solar term
 */
export function getSolarTermQuestions(date = new Date()) {
  const currentTerm = getCurrentSolarTerm(date);
  if (!currentTerm) return [];

  // Get solar terms questions and questions from related categories
  const solarTermQs = getQuestionsByCategory('solarTerms');
  const relatedQs = currentTerm.categories.flatMap(cat => getQuestionsByCategory(cat));

  // Combine and deduplicate
  const allRelated = [...solarTermQs, ...relatedQs];
  const unique = [...new Map(allRelated.map(q => [q.id, q])).values()];

  return unique.slice(0, 15);
}

/**
 * Get questions related to a specific festival
 */
export function getFestivalQuestions(festivalId) {
  const festival = festivals[festivalId];
  if (!festival) return [];

  // Get questions from festival-related categories
  const relatedQs = festival.categories.flatMap(cat => getQuestionsByCategory(cat));

  // Also get questions mentioning the festival theme
  const themeKeywords = {
    'spring-festival': ['新年', '春', 'dumpling', 'red envelope'],
    'lantern-festival': ['lantern', 'tangyuan', '元宵'],
    'qingming-festival': ['tomb', 'ancestor', '清明'],
    'dragon-boat': ['dragon', 'zongzi', '粽子', 'Qu Yuan', '屈原'],
    'qixi': ['weaver', 'cowherd', 'love', '七夕'],
    'mid-autumn': ['moon', 'mooncake', '月饼', 'Chang\'e', '嫦娥'],
    'chongyang': ['chrysanthemum', 'elderly', '重阳'],
    'labafestival': ['laba', 'porridge', '腊八'],
  };

  const keywords = themeKeywords[festivalId] || [];
  const keywordMatches = quizQuestions.filter(q =>
    keywords.some(kw =>
      q.question?.toLowerCase().includes(kw.toLowerCase()) ||
      q.explanation?.toLowerCase().includes(kw.toLowerCase())
    )
  );

  const allRelated = [...relatedQs, ...keywordMatches];
  const unique = [...new Map(allRelated.map(q => [q.id, q])).values()];

  return unique.slice(0, 15);
}

/**
 * Get daily quiz with seasonal context
 * Returns a question that may be related to current solar term or festival
 */
export function getSeasonalDailyQuiz(date = new Date()) {
  // Check if we're near a festival
  const month = date.getMonth() + 1;

  // Simple approximation - in real app would use lunar calendar
  const nearbyFestivals = Object.entries(festivals).filter(([key, fest]) => {
    if (key === 'spring-festival') return month === 1 || month === 2;
    if (key === 'mid-autumn') return month === 9 || month === 10;
    if (key === 'dragon-boat') return month === 5 || month === 6;
    if (key === 'qingming-festival') return month === 4;
    return false;
  });

  // 30% chance to get a seasonal question if near a festival
  if (nearbyFestivals.length > 0 && Math.random() < 0.3) {
    const [festId] = nearbyFestivals[Math.floor(Math.random() * nearbyFestivals.length)];
    const festQuestions = getFestivalQuestions(festId);
    if (festQuestions.length > 0) {
      return festQuestions[Math.floor(Math.random() * festQuestions.length)];
    }
  }

  // Check for solar term relevance
  const solarTermQs = getSolarTermQuestions(date);
  if (solarTermQs.length > 0 && Math.random() < 0.25) {
    return solarTermQs[Math.floor(Math.random() * solarTermQs.length)];
  }

  // Fall back to regular daily question
  return getDailyQuizQuestion(date);
}
