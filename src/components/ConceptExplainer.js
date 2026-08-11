import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Info, X, BookOpen, Lightbulb, Globe, ChevronDown, ChevronUp } from 'lucide-react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// Cultural concept explanations database
const CULTURAL_CONCEPTS = {
  // Philosophy & Values
  'harmony': {
    key: 'harmony',
    chinese: '和',
    pinyin: 'hé',
    english: 'Harmony',
    shortDesc: 'The balance between different elements in nature and society.',
    longDesc: 'Harmony (和) is a central concept in Chinese philosophy, emphasizing the importance of balance and peaceful coexistence. Unlike Western individualism, Chinese culture values collective harmony—finding ways for different elements to complement each other rather than compete.',
    westernEquivalent: 'Similar to the Greek concept of "eudaimonia" or modern ideas of work-life balance, but extends to all relationships.',
    examples: ['Family harmony over individual desires', 'Diplomatic harmony in international relations', 'Harmony between humans and nature'],
    relatedConcepts: ['yin-yang', 'confucianism'],
    category: 'philosophy',
  },
  'yin-yang': {
    key: 'yin-yang',
    chinese: '阴阳',
    pinyin: 'yīn yáng',
    english: 'Yin-Yang',
    shortDesc: 'The duality of opposing forces that create balance in the universe.',
    longDesc: 'Yin-Yang represents the ancient Chinese understanding of dualism—how opposite forces are actually complementary and interconnected. Yin (阴) represents darkness, cold, feminine, and passive energy. Yang (阳) represents light, heat, masculine, and active energy. Together, they create dynamic balance.',
    westernEquivalent: 'Similar to the concept of duality in Western philosophy, or the balance of opposites in Jungian psychology.',
    examples: ['Day and night cycle', 'Hot and cold foods in TCM', 'Rest and activity balance'],
    relatedConcepts: ['harmony', 'tcm'],
    category: 'philosophy',
  },
  'confucianism': {
    key: 'confucianism',
    chinese: '儒家',
    pinyin: 'rú jiā',
    english: 'Confucianism',
    shortDesc: 'A philosophical system emphasizing ethics, family values, and social harmony.',
    longDesc: 'Confucianism, founded by Confucius (551-479 BCE), is a philosophical and ethical system that has profoundly shaped Chinese civilization. It emphasizes filial piety (孝), respect for elders, moral cultivation, and the importance of education.',
    westernEquivalent: 'Comparable to Aristotelian virtue ethics, with emphasis on character development and social responsibility.',
    examples: ['Respecting elders', 'Valuing education', 'Family gatherings during festivals'],
    relatedConcepts: ['harmony', 'filial-piety'],
    category: 'philosophy',
  },
  'filial-piety': {
    key: 'filial-piety',
    chinese: '孝',
    pinyin: 'xiào',
    english: 'Filial Piety',
    shortDesc: 'Deep respect and care for one\'s parents and ancestors.',
    longDesc: 'Filial piety (孝) is one of the most important virtues in Chinese culture. It goes beyond simple respect—it encompasses caring for parents in their old age, continuing family traditions, and bringing honor to the family name.',
    westernEquivalent: 'Similar to the Biblical commandment "Honor thy father and mother," but more deeply integrated into daily life and social structure.',
    examples: ['Caring for elderly parents at home', 'Ancestor worship during Qingming Festival', 'Seeking parental approval for major decisions'],
    relatedConcepts: ['confucianism', 'ancestors'],
    category: 'philosophy',
  },

  // Food & Dining
  'chopsticks': {
    key: 'chopsticks',
    chinese: '筷子',
    pinyin: 'kuài zi',
    english: 'Chopsticks',
    shortDesc: 'Traditional eating utensils with 5,000 years of history.',
    longDesc: 'Chopsticks are more than just eating tools—they reflect Chinese dining philosophy. The two sticks represent yin and yang, working together in harmony. Unlike Western utensils that cut and pierce, chopsticks gently pick up food, reflecting a non-violent approach to dining.',
    westernEquivalent: 'The fork and knife in Western dining, but chopsticks emphasize precision and gentleness over cutting.',
    examples: ['Never stick chopsticks vertically in rice (resembles incense for the dead)', 'Passing food with chopsticks is polite', 'The longer your chopsticks, the further your reach'],
    relatedConcepts: ['dining-etiquette', 'harmony'],
    category: 'food',
  },
  'hot-cold-foods': {
    key: 'hot-cold-foods',
    chinese: '热气/寒气',
    pinyin: 'rè qì / hán qì',
    english: 'Hot and Cold Foods',
    shortDesc: 'Foods classified by their energetic properties, not temperature.',
    longDesc: 'In Traditional Chinese Medicine, foods are classified as "hot" (热) or "cold" (寒) based on their energetic effect on the body, not their physical temperature. "Hot" foods like ginger and lamb warm the body; "cold" foods like watermelon and cucumber cool it. Balance is key.',
    westernEquivalent: 'Somewhat similar to the Western concept of inflammatory vs. anti-inflammatory foods, but more systematic.',
    examples: ['Ginger tea for colds (warming)', 'Watermelon in summer (cooling)', 'Avoiding "hot" foods during fever'],
    relatedConcepts: ['tcm', 'yin-yang'],
    category: 'food',
  },
  'dining-etiquette': {
    key: 'dining-etiquette',
    chinese: '餐桌礼仪',
    pinyin: 'cān zhuō lǐ yí',
    english: 'Dining Etiquette',
    shortDesc: 'Traditional rules and customs for Chinese dining.',
    longDesc: 'Chinese dining etiquette reflects respect and harmony. The host pays (no splitting bills), the most honored guest sits facing the door, and dishes are shared communally. Serving others before yourself shows consideration.',
    westernEquivalent: 'Western table manners, but emphasizes communal sharing over individual portions.',
    examples: ['Host always pays', 'Serve others before yourself', 'Leave a little food to show you\'re full'],
    relatedConcepts: ['chopsticks', 'harmony'],
    category: 'food',
  },

  // Festivals & Traditions
  'spring-festival': {
    key: 'spring-festival',
    chinese: '春节',
    pinyin: 'chūn jié',
    english: 'Spring Festival (Chinese New Year)',
    shortDesc: 'The most important Chinese festival, marking the lunar new year.',
    longDesc: 'Spring Festival is a 15-day celebration marking the beginning of the lunar new year. Families reunite, homes are cleaned to sweep away bad luck, and red decorations ward off evil spirits. It\'s like Christmas, New Year, and Thanksgiving combined.',
    westernEquivalent: 'Similar to Christmas in importance—family reunion, gift-giving, and special foods.',
    examples: ['Red envelopes (红包) for children', 'Family reunion dinner', 'Fireworks to scare away Nian monster'],
    relatedConcepts: ['red-luck', 'family-reunion'],
    category: 'festival',
  },
  'mid-autumn': {
    key: 'mid-autumn',
    chinese: '中秋节',
    pinyin: 'zhōng qiū jié',
    english: 'Mid-Autumn Festival',
    shortDesc: 'A harvest festival celebrating family reunion under the full moon.',
    longDesc: 'The Mid-Autumn Festival falls on the 15th day of the 8th lunar month when the moon is brightest. Families gather to admire the moon, eat mooncakes, and celebrate reunion. The round moon symbolizes family togetherness.',
    westernEquivalent: 'Similar to Thanksgiving—celebrating harvest and family, but with mooncakes instead of pumpkin pie.',
    examples: ['Mooncakes with various fillings', 'Lantern displays', 'Chang\'e legend storytelling'],
    relatedConcepts: ['harmony', 'family-reunion'],
    category: 'festival',
  },
  'red-luck': {
    key: 'red-luck',
    chinese: '红色',
    pinyin: 'hóng sè',
    english: 'Red for Luck',
    shortDesc: 'Red is the luckiest color in Chinese culture.',
    longDesc: 'Red symbolizes good fortune, joy, and prosperity in Chinese culture. It\'s used in celebrations, weddings, and festivals. Red envelopes, red lanterns, and red clothing are believed to bring luck and ward off evil.',
    westernEquivalent: 'Green in Irish culture or gold in many Western contexts—associated with luck and prosperity.',
    examples: ['Red envelopes for money gifts', 'Red wedding dress (traditional)', 'Red underwear in your zodiac year'],
    relatedConcepts: ['spring-festival', 'wedding-traditions'],
    category: 'tradition',
  },

  // Arts & Culture
  'calligraphy': {
    key: 'calligraphy',
    chinese: '书法',
    pinyin: 'shū fǎ',
    english: 'Chinese Calligraphy',
    shortDesc: 'The art of beautiful writing, considered the highest form of Chinese art.',
    longDesc: 'Chinese calligraphy is more than writing—it\'s a meditative art form that reveals the calligrapher\'s character. Each stroke must be executed with precision and flow. The brush, ink, paper, and inkstone are called the "Four Treasures of the Study."',
    westernEquivalent: 'Comparable to Western calligraphy, but with deeper philosophical and spiritual significance.',
    examples: ['Brush pressure determines stroke thickness', 'Different styles: seal, clerical, regular, cursive', 'Calligraphy as meditation practice'],
    relatedConcepts: ['ink-wash', 'scholar'],
    category: 'art',
  },
  'ink-wash': {
    key: 'ink-wash',
    chinese: '水墨画',
    pinyin: 'shuǐ mò huà',
    english: 'Ink Wash Painting',
    shortDesc: 'Traditional Chinese painting using black ink and water.',
    longDesc: 'Ink wash painting emphasizes the essence of the subject over realistic representation. Using varying concentrations of ink and water, artists create depth and atmosphere. The empty space (留白) is as important as the painted areas.',
    westernEquivalent: 'Similar to watercolor painting, but with philosophical emphasis on capturing spirit rather than appearance.',
    examples: ['Landscapes with misty mountains', 'Bamboo and orchid paintings', 'Zen-inspired simplicity'],
    relatedConcepts: ['calligraphy', 'daoism'],
    category: 'art',
  },

  // Social Customs
  'guanxi': {
    key: 'guanxi',
    chinese: '关系',
    pinyin: 'guān xi',
    english: 'Guanxi (Connections)',
    shortDesc: 'The system of social networks and relationships that facilitate business and life.',
    longDesc: 'Guanxi refers to the network of relationships that Chinese people cultivate and maintain. It\'s about mutual obligation and trust built over time. Having good guanxi can open doors, but it also comes with expectations of reciprocity.',
    westernEquivalent: 'Similar to Western "networking," but deeper and more obligatory—like having friends who are also business partners.',
    examples: ['Helping a friend\'s child get a job', 'Exchanging favors in business', 'Maintaining relationships through gifts and meals'],
    relatedConcepts: ['face', 'reciprocity'],
    category: 'social',
  },
  'face': {
    key: 'face',
    chinese: '面子',
    pinyin: 'miàn zi',
    english: 'Face (Social Prestige)',
    shortDesc: 'A person\'s social standing, dignity, and reputation in the eyes of others.',
    longDesc: 'Face (面子) represents a person\'s social prestige and dignity. "Giving face" means showing respect publicly; "losing face" is public embarrassment. Chinese communication often prioritizes preserving everyone\'s face over direct confrontation.',
    westernEquivalent: 'Similar to "reputation" or "honor" in Western culture, but more explicitly managed in social interactions.',
    examples: ['Complimenting someone publicly', 'Never criticizing someone in front of others', 'Declining invitations indirectly to avoid embarrassment'],
    relatedConcepts: ['guanxi', 'harmony'],
    category: 'social',
  },

  // Daoism & Philosophy of nature
  'daoism': {
    key: 'daoism',
    chinese: '道家',
    pinyin: 'dào jiā',
    english: 'Daoism (Taoism)',
    shortDesc: 'A philosophy and religion centered on living in harmony with the Dao (the Way).',
    longDesc: 'Daoism emphasizes wu wei (无为, effortless action), spontaneity, and aligning with the natural order of the universe. It developed alongside Confucianism as a complementary path—Confucianism focuses on society and ritual, while Daoism focuses on nature and individual freedom.',
    westernEquivalent: 'Less like Western religion and more like a blend of Stoicism and transcendentalism, emphasizing nature and simplicity.',
    examples: ['"Going with the flow" instead of forcing outcomes', 'Yin-yang balance as a lifestyle', 'Laozi\'s Tao Te Ching as a core text'],
    relatedConcepts: ['yin-yang', 'five-elements', 'qi'],
    category: 'philosophy',
  },
  'tcm': {
    key: 'tcm',
    chinese: '中医',
    pinyin: 'zhōng yī',
    english: 'Traditional Chinese Medicine',
    shortDesc: 'A 2,000-year-old system of medicine focused on balance and prevention.',
    longDesc: 'Traditional Chinese Medicine (TCM) views health as a balance between qi, yin-yang, and the five elements. It uses acupuncture, herbal remedies, tui na massage, and dietary therapy to restore harmony rather than simply treating symptoms as Western medicine typically does.',
    westernEquivalent: 'Complementary to Western biomedicine; often compared to naturopathy or homeopathy but far more codified and systematic.',
    examples: ['Acupuncture for pain', 'Herbal teas blended for the season', 'Diagnosing via tongue and pulse'],
    relatedConcepts: ['qi', 'yin-yang', 'five-elements'],
    category: 'philosophy',
  },
  'five-elements': {
    key: 'five-elements',
    chinese: '五行',
    pinyin: 'wǔ xíng',
    english: 'Five Elements',
    shortDesc: 'Wood, fire, earth, metal, and water—the five forces that make up the universe.',
    longDesc: 'The Five Elements (五行) are wood (木), fire (火), earth (土), metal (金), and water (水). They generate and overcome each other in cycles, and are used to explain everything from the human body and seasons to mapping directions and choosing auspicious dates.',
    westernEquivalent: 'Somewhat like the classical Greek four humors, but used more pervasively across Chinese medicine, astrology, and design.',
    examples: ['Wood feeds fire, fire creates ash/earth', 'Each element maps to a season and organ', 'Feng shui arranges rooms by element balance'],
    relatedConcepts: ['qi', 'fengshui', 'tcm'],
    category: 'philosophy',
  },
  'fengshui': {
    key: 'fengshui',
    chinese: '风水',
    pinyin: 'fēng shuǐ',
    english: 'Feng Shui',
    shortDesc: 'The art of arranging space to channel positive energy (qi).',
    longDesc: 'Feng shui (风水, literal "wind-water") is the practice of positioning buildings, rooms, and objects to harmonize with the flow of qi. Traditional homes and businesses are designed to maximize auspicious energy and avoid inauspicious alignments.',
    westernEquivalent: 'Less spiritual than Western "space planning" but shares goals of comfort, flow, and orientation—combine that with astrology\'s sense of auspicious timing.',
    examples: ['Bed facing away from the door', 'Mirrors not facing the bed', 'Offices arranged to face "favorable" directions'],
    relatedConcepts: ['qi', 'five-elements', 'yin-yang'],
    category: 'philosophy',
  },
  'qi': {
    key: 'qi',
    chinese: '气',
    pinyin: 'qì',
    english: 'Qi (Life Energy)',
    shortDesc: 'The vital energy that flows through the body and the world.',
    longDesc: 'Qi (气) is the vital life force in Chinese thought. It circulates through the body\'s meridians, and health depends on qi flowing smoothly and staying balanced. It is central to TCM, qigong, tai chi, and feng shui.',
    westernEquivalent: 'Similar to the concept of "life force" or "pneuma," but Chinese culture treats it as a measurable, manipulable energy.',
    examples: ['Qigong and tai chi to cultivate qi', 'Blocked qi causes illness; unblocking restores health', 'Eating foods that "nourish" qi'],
    relatedConcepts: ['tcm', 'yin-yang', 'five-elements'],
    category: 'philosophy',
  },
  'golden-mean': {
    key: 'golden-mean',
    chinese: '中庸',
    pinyin: 'zhōng yōng',
    english: 'The Golden Mean',
    shortDesc: 'The virtue of moderation and avoiding extremes in all things.',
    longDesc: 'The Doctrine of the Mean (中庸) holds that harmony is achieved by avoiding excess and deficiency. It is one of the Four Books of Confucianism and urges calm, balanced judgment rather than impulsive or extreme behavior.',
    westernEquivalent: 'Very close to Aristotle\'s "golden mean" in virtue ethics—between two vices lies virtue.',
    examples: ['Neither overspending nor hoarding', 'Speaking neither too little nor too much', 'Moderation in diet and emotion'],
    relatedConcepts: ['confucianism', 'harmony'],
    category: 'philosophy',
  },
  'ancestors': {
    key: 'ancestors',
    chinese: '祖先崇拜',
    pinyin: 'zǔ xiān chóng bài',
    english: 'Ancestor Worship',
    shortDesc: 'Revering deceased ancestors as continuing members of the family.',
    longDesc: 'Chinese culture deeply reveres ancestors, believing they remain part of the family and can bless or protect descendants. People maintain ancestor tablets, burn incense, and visit graves, especially during Qingming Festival and at the lunar new year.',
    westernEquivalent: 'Similar to family-history commemoration in the West, but with ongoing ritual practice and a belief that ancestors actively intercede.',
    examples: ['Qingming tomb-sweeping', 'Ancestor tablets in the home', 'Burning incense and paper offerings'],
    relatedConcepts: ['qingming', 'filial-piety', 'family-reunion'],
    category: 'philosophy',
  },

  // === Food & Dining (extended) ===
  'tea': {
    key: 'tea',
    chinese: '茶',
    pinyin: 'chá',
    english: 'Tea Culture',
    shortDesc: 'A refined practice of brewing, serving, and enjoying tea that reflects Chinese values.',
    longDesc: 'Tea is more than a drink in China—it is a social ritual and an art form. The Chinese invented tea and shaped elaborate rituals for brewing and serving it. Offering tea is a sign of respect, and tea houses remain centers of social life across the country.',
    westernEquivalent: 'Comparable to coffee culture in the West, but with deeper ritual, health, and etiquette dimensions.',
    examples: ['Serving tea to elders shows respect', 'Gongfu tea ceremony with many steeps', 'Tea as a formal wedding gift to parents'],
    relatedConcepts: ['dining-etiquette', 'harmony'],
    category: 'food',
  },
  'dimsum': {
    key: 'dimsum',
    chinese: '点心',
    pinyin: 'diǎn xīn',
    english: 'Dim Sum',
    shortDesc: 'Small, shared dishes served with tea, especially in Cantonese culture.',
    longDesc: 'Dim sum (点心) literally means "touch the heart." These small dishes—dumplings, buns, rolls, and pastries—are shared among family and friends with tea, reflecting the communal, sharing-first nature of Chinese dining.',
    westernEquivalent: 'Similar to Spanish tapas or Mediterranean mezze, but tied specifically to tea and Cantonese restaurant culture.',
    examples: ['Har gow and siu mai classics', 'Yum cha ("drinking tea") outings', 'Steamed buns and rice-noodle rolls'],
    relatedConcepts: ['dining-etiquette', 'chopsticks'],
    category: 'food',
  },
  'mooncake': {
    key: 'mooncake',
    chinese: '月饼',
    pinyin: 'yuè bǐng',
    english: 'Mooncake',
    shortDesc: 'A dense, sweet pastry eaten during the Mid-Autumn Festival.',
    longDesc: 'Mooncakes (月饼) are round pastries symbolizing family reunion and the full moon. Fillings range from lotus seed paste and red bean to salted egg yolk. During Mid-Autumn, families and businesses exchange them as meaningful gifts.',
    westernEquivalent: 'Like a seasonal fruitcake or Christmas pudding—eaten and gifted once a year for a festival.',
    examples: ['Round shape mirrors the full moon', 'Gift-giving to friends and employers', 'Lotus paste with salted egg yolk'],
    relatedConcepts: ['mid-autumn', 'family-reunion'],
    category: 'food',
  },
  'zongzi': {
    key: 'zongzi',
    chinese: '粽子',
    pinyin: 'zòng zi',
    english: 'Zongzi',
    shortDesc: 'Pyramid-shaped glutinous rice dumplings wrapped in bamboo leaves.',
    longDesc: 'Zongzi (粽子) are sticky rice dumplings wrapped in bamboo or reed leaves, eaten during the Dragon Boat Festival. Legend says they were thrown into rivers as offerings to the poet Qu Yuan. Fillings vary from sweet bean paste to savory pork.',
    westernEquivalent: 'Conceptually like tamales or filled rice rolls, tied closely to one festival and its origin story.',
    examples: ['Eaten on the Dragon Boat Festival', 'Sweet or savory regional fillings', 'Linked to the poet Qu Yuan'],
    relatedConcepts: ['dragon-boat'],
    category: 'food',
  },
  'hotpot': {
    key: 'hotpot',
    chinese: '火锅',
    pinyin: 'huǒ guō',
    english: 'Hot Pot',
    shortDesc: 'A communal bubbling-pot meal where everyone cooks ingredients together.',
    longDesc: 'Hot pot (火锅) is a social dining experience: a simmering pot of broth at the table into which diners cook raw meats, vegetables, and noodles. It embodies warmth, sharing, and generosity. Broths from Sichuan numbing spice to milder Beijing lamb suit all tastes.',
    westernEquivalent: 'Related to fondue or Japanese shabu-shabu, but far more central to Chinese dining culture.',
    examples: ['Sichuan malatang spicy broth', 'Communal cooking fosters closeness', 'Endless rounds of dipping sauces'],
    relatedConcepts: ['dining-etiquette'],
    category: 'food',
  },
  'dumplings': {
    key: 'dumplings',
    chinese: '饺子',
    pinyin: 'jiǎo zi',
    english: 'Dumplings (Jiaozi)',
    shortDesc: 'Stuffed crescent dough, a symbol of good fortune and wealth.',
    longDesc: 'Jiaozi (饺子) are dumplings eaten at the lunar new year and winter solstice. Their crescent shape resembles ancient gold ingots, symbolizing wealth. Families gather to fold them together—an act of togetherness as much as cooking.',
    westernEquivalent: 'Like ravioli or pierogi, but tied to new-year prosperity symbols and made fresh as a family event.',
    examples: ['Eaten at midnight on New Year', 'Folding dumplings as a family gathering', 'A hidden coin brings good luck'],
    relatedConcepts: ['spring-festival', 'family-reunion'],
    category: 'food',
  },
  'baijiu': {
    key: 'baijiu',
    chinese: '白酒',
    pinyin: 'bái jiǔ',
    english: 'Baijiu',
    shortDesc: 'A strong distilled grain liquor central to toasts and banquets.',
    longDesc: 'Baijiu (白酒) is a potent spirit distilled from sorghum with centuries of history. It anchors banquets, toasts, and business deals. Customs—who pours, who drinks, and "ganbei" (empty the cup)—carry deep social meaning and reflect respect.',
    westernEquivalent: 'Comparable to whiskey or vodka in strength, but far more tied to ritual and social hierarchy.',
    examples: ['Ganbei (干杯) toasts', 'Pouring for others before yourself', 'Baijiu at business banquets'],
    relatedConcepts: ['dining-etiquette', 'guanxi'],
    category: 'food',
  },

  // === Festivals (extended) ===
  'lantern-festival': {
    key: 'lantern-festival',
    chinese: '元宵节',
    pinyin: 'yuán xiāo jié',
    english: 'Lantern Festival',
    shortDesc: 'The festival of lanterns marking the end of the lunar new year.',
    longDesc: 'The Lantern Festival falls on the 15th day of the first lunar month, ending the Spring Festival season. People light and release lanterns, solve lantern riddles, eat tangyuan (sweet glutinous rice balls), and enjoy dragon dances in the moonlit streets.',
    westernEquivalent: 'No direct Western parallel; the lantern release resembles a mix of New Year festivities and candlelight vigils.',
    examples: ['Releasing sky lanterns with wishes', 'Guessing lantern riddles', 'Eating tangyuan for reunion'],
    relatedConcepts: ['spring-festival', 'family-reunion'],
    category: 'festival',
  },
  'dragon-boat': {
    key: 'dragon-boat',
    chinese: '端午节',
    pinyin: 'duān wǔ jié',
    english: 'Dragon Boat Festival',
    shortDesc: 'A festival of racing dragon boats, zongzi, and honor for the poet Qu Yuan.',
    longDesc: 'The Dragon Boat Festival falls on the 5th day of the 5th lunar month. It honors the ancient poet Qu Yuan, who drowned himself in protest. People race dragon boats, eat zongzi, and hang aromatic herbs to ward off evil and disease during this hot season.',
    westernEquivalent: 'No close Western parallel; combines elements of a memorial day with communal sporting tradition.',
    examples: ['Dragon boat races', 'Eating pyramid-shaped zongzi', 'Hanging calamus and wormwood'],
    relatedConcepts: ['zongzi'],
    category: 'festival',
  },
  'qingming': {
    key: 'qingming',
    chinese: '清明节',
    pinyin: 'qīng míng jié',
    english: 'Qingming Festival',
    shortDesc: 'A tomb-sweeping festival for honoring the departed and welcoming spring.',
    longDesc: 'Qingming (清 明, "clear and bright") falls in early April. Families visit and clean ancestors\' graves, offer food and incense, and fly kites. It balances remembrance of the dead with celebration of spring\'s renewal. It is also one of the 24 solar terms.',
    westernEquivalent: 'Similar in spirit to All Souls\' Day or Memorial Day—a time set aside to honor the deceased.',
    examples: ['Tomb sweeping and weeding', 'Offering food and burning incense', 'Flying kites and spring outings'],
    relatedConcepts: ['ancestors', 'filial-piety'],
    category: 'festival',
  },
  'double-ninth': {
    key: 'double-ninth',
    chinese: '重阳节',
    pinyin: 'chóng yáng jié',
    english: 'Double Ninth Festival',
    shortDesc: 'A festival on the 9th day of the 9th month honoring elders and enjoying autumn heights.',
    longDesc: 'Double Ninth falls on the 9th day of the 9th lunar month, when the number nine (yang) is maximized. People climb hills, drink chrysanthemum wine, and honor the elderly. It became the "Senior Citizens\' Festival," since nine emphasizes longevity.',
    westernEquivalent: 'Partially like Grandparents Day—a day to celebrate and respect the elderly.',
    examples: ['Climbing mountains for good luck', 'Chrysanthemum wine and cakes', 'Honoring grandparents and elders'],
    relatedConcepts: ['filial-piety'],
    category: 'festival',
  },
  'zhongyuan': {
    key: 'zhongyuan',
    chinese: '中元节',
    pinyin: 'zhōng yuán jié',
    english: 'Ghost Festival',
    shortDesc: 'A festival when the spirits of the dead are believed to revisit the living.',
    longDesc: 'The Ghost Festival on the 15th day of the 7th lunar month opens "Ghost Month." People make offerings to ancestors and wandering spirits, burn incense and spirit money, and release water lanterns. It reflects the deep bond between the living and the departed.',
    westernEquivalent: 'Comparable to Halloween or Día de los Muertos, though more solemn and family-focused.',
    examples: ['Burning spirit money for ancestors', 'Releasing lanterns on rivers', 'Offering food to wandering spirits'],
    relatedConcepts: ['ancestors'],
    category: 'festival',
  },
  'laba': {
    key: 'laba',
    chinese: '腊八节',
    pinyin: 'là bā jié',
    english: 'Laba Festival',
    shortDesc: 'A festival on the 8th day of the 12th lunar month marking the approach of Spring Festival.',
    longDesc: 'Laba falls on the 8th day of the 12th lunar month, the day the Buddha is said to have attained enlightenment. People cook "Laba porridge" with grains, beans, nuts, and dried fruit, and share it to welcome warmth before the new year.',
    westernEquivalent: 'A harvest-like, winter-warming food festival with no close Western counterpart.',
    examples: ['Cooking and sharing Laba porridge', 'Soaking garlic in vinegar (Laba garlic)', 'Preparing for Spring Festival'],
    relatedConcepts: ['spring-festival'],
    category: 'festival',
  },
  'lunar-new-year-eve': {
    key: 'lunar-new-year-eve',
    chinese: '除夕',
    pinyin: 'chú xī',
    english: 'New Year\'s Eve',
    shortDesc: 'The eve of the lunar new year, marked by the reunion dinner.',
    longDesc: 'New Year\'s Eve (除夕) is the most important night of the year. Families gather for the reunion dinner, stay up late, set off firecrackers, and give red envelopes. The word "chu" means "to remove"—a night to drive away the old year.',
    westernEquivalent: 'The equivalent of Christmas Eve or New Year\'s Eve, but with greater family-priority emphasis.',
    examples: ['Reunion dinner feast', 'Staying up late (shousui)', 'Firecrackers at midnight'],
    relatedConcepts: ['spring-festival', 'dumplings', 'family-reunion'],
    category: 'festival',
  },

  // === Traditions (extended) ===
  'zodiac': {
    key: 'zodiac',
    chinese: '生肖',
    pinyin: 'shēng xiào',
    english: 'Chinese Zodiac',
    shortDesc: 'A 12-animal cycle said to shape personality and fortune by birth year.',
    longDesc: 'The Chinese zodiac assigns each year to one of 12 animals—Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig. Belief holds that your animal shapes personality, compatibility, and luck. It pairs with the Five Elements for richer readings.',
    westernEquivalent: 'Similar to Western astrology sun signs, but lunar-calendar based and far more influential in daily decisions like marriage timing.',
    examples: ['Your zodiac year recycles every 12 years', 'Zodiac-matched marriages and decisions', 'The Dragon is the most coveted sign'],
    relatedConcepts: ['five-elements', 'red-luck'],
    category: 'tradition',
  },
  'red-envelope': {
    key: 'red-envelope',
    chinese: '红包',
    pinyin: 'hóng bāo',
    english: 'Red Envelope',
    shortDesc: 'A red packet of money given for luck during celebrations.',
    longDesc: 'Red envelopes (红包) hold money given to children, the unmarried, and employees during Spring Festival, weddings, and birthdays. The red color wards off evil, and the gift conveys blessings and goodwill. Amounts often avoid the unlucky number four.',
    westernEquivalent: 'Like a Western monetary gift (wedding cash, holiday tips), but the red packet itself carries symbolic luck.',
    examples: ['Elders giving to children at New Year', 'Brides receive red envelopes at weddings', 'Money amounts avoid the number 4'],
    relatedConcepts: ['red-luck', 'spring-festival'],
    category: 'tradition',
  },
  'jade': {
    key: 'jade',
    chinese: '玉',
    pinyin: 'yù',
    english: 'Jade',
    shortDesc: 'A revered stone symbolizing virtue, beauty, and protection.',
    longDesc: 'In Chinese culture jade (玉) is prized above gold. It symbolizes virtue, purity, and moral integrity—Confucius compared its qualities to human worth. Jade jewelry is worn for luck and protection, and it plays a central role in art and ceremony.',
    westernEquivalent: 'The emotional and symbolic role of gold in many cultures, but jade specifically represents moral character.',
    examples: ['Jade pendants worn for protection', 'Jade as a gift for new life', 'Carved jade amulets and ornaments'],
    relatedConcepts: ['guanxi'],
    category: 'tradition',
  },
  'paper-cutting': {
    key: 'paper-cutting',
    chinese: '剪纸',
    pinyin: 'jiǎn zhǐ',
    english: 'Chinese Paper Cutting',
    shortDesc: 'Intricate red paper art used to decorate homes and celebrate festivals.',
    longDesc: 'Paper cutting (剪纸) turns thin paper into delicate window decorations, often in red. During Spring Festival and weddings, families paste cut patterns of auspicious symbols, animals, and characters on windows and doors to invite luck and happiness.',
    westernEquivalent: 'Similar to Western silhouette art and paper crafts, but used at scale for communal festive decoration.',
    examples: ['Red "double happiness" (囍) for weddings', 'Window decorations for New Year', 'Zodiac animal cutouts'],
    relatedConcepts: ['red-luck', 'spring-festival'],
    category: 'tradition',
  },
  'lion-dance': {
    key: 'lion-dance',
    chinese: '舞狮',
    pinyin: 'wǔ shī',
    english: 'Lion Dance',
    shortDesc: 'A spirited dance performed with a costume lion to bring luck and fortune.',
    longDesc: 'The lion dance (舞狮) is performed at Spring Festival, grand openings, and celebrations. Performers move the lion through acrobatic stunts, chasing away evil spirits and inviting prosperity. It pairs with the dragon dance and is a cultural pride of Chinese communities.',
    westernEquivalent: 'No direct parallel; think of a festive mascot performance with ritual purpose and martial skill.',
    examples: ['Lion dance at business openings', 'Chasing away bad luck for the new year', 'Acrobatic "cai qing" (plucking greens)'],
    relatedConcepts: ['spring-festival', 'red-luck'],
    category: 'tradition',
  },
  'chinese-knot': {
    key: 'chinese-knot',
    chinese: '中国结',
    pinyin: 'zhōng guó jié',
    english: 'Chinese Knot',
    shortDesc: 'Intricately tied cords symbolizing unity, love, and good fortune.',
    longDesc: 'Chinese knots (中国结) are decorative loops of silk cord tied into complex, symmetrical patterns. Each knot carries meaning—the "endless knot" represents longevity, "love knots" symbolize union. They are given as gifts of blessing and hung for decoration.',
    westernEquivalent: 'Like macramé in technique, but with deep symbolic meanings and gifting significance.',
    examples: ['"Double happiness" wedding knots', 'Knots hung on doors or bags for luck', 'Endless-knot for longevity'],
    relatedConcepts: ['red-luck'],
    category: 'tradition',
  },
  'wedding-traditions': {
    key: 'wedding-traditions',
    chinese: '婚俗',
    pinyin: 'hūn sú',
    english: 'Wedding Traditions',
    shortDesc: 'Colorful customs surrounding engagement and marriage, rich in symbolism.',
    longDesc: 'Chinese weddings are rich with auspicious ritual: betrothal gifts, red everywhere, tea ceremonies to honor parents, a bride in a red qipao, and "double happiness" symbols. Many customs aim to ensure prosperity, fertility, and harmony for the new couple.',
    westernEquivalent: 'Closer than other traditions to Western weddings, but with mandatory tea ceremonies and color symbolism replacing some Western vows.',
    examples: ['Tea ceremony honoring parents', 'Red wedding dress and decorations', 'Exchanging betrothal gifts'],
    relatedConcepts: ['red-luck', 'filial-piety'],
    category: 'tradition',
  },
  'couplets': {
    key: 'couplets',
    chinese: '春联',
    pinyin: 'chūn lián',
    english: 'Spring Festival Couplets',
    shortDesc: 'Paired calligraphy phrases pasted on doors to welcome the new year.',
    longDesc: 'Spring couplets (春联) are paired red strips of calligraphy pasted beside doors at the new year, with a horizontal banner above. They express hopes for prosperity, health, and fortune, and their composition follows strict parallel-structure rules.',
    westernEquivalent: 'Like festive door decorations or holiday wreaths, but with calligraphic poetry expecting literal good luck.',
    examples: ['Paired verses with matching structure', 'Pasted on both sides of the door', 'Red paper for luck'],
    relatedConcepts: ['spring-festival', 'calligraphy', 'red-luck'],
    category: 'tradition',
  },
  'firecrackers': {
    key: 'firecrackers',
    chinese: '鞭炮',
    pinyin: 'biān pào',
    english: 'Firecrackers',
    shortDesc: 'Loud firecrackers set off to scare away evil spirits.',
    longDesc: 'Firecrackers (鞭炮) are set off at the new year, weddings, and openings to frighten away evil spirits (the legendary "nian" beast) and announce joy. Their sound and smoke cleanse space for good fortune. Modern cities regulate them for safety.',
    westernEquivalent: 'Like celebratory fireworks, but rooted in a ritual of warding off evil rather than pure spectacle.',
    examples: ['Firecrackers on New Year\'s Eve', 'Warding off the nian monster', 'Doorstep bursts at openings'],
    relatedConcepts: ['spring-festival', 'red-luck'],
    category: 'tradition',
  },
  'family-reunion': {
    key: 'family-reunion',
    chinese: '团圆',
    pinyin: 'tuán yuán',
    english: 'Family Reunion',
    shortDesc: 'The deep value of family gathering together, especially at festivals.',
    longDesc: '"Tuanyuan" (团圆) literally means "round and complete." Family reunion is the highest value of Chinese festivals—people travel great distances to be home for the new year. The round shape of mooncakes and tangyuan symbolizes this completeness.',
    westernEquivalent: 'Like Thanksgiving homecomings or family Christmases in the West, but with even stronger cultural imperative.',
    examples: ['Traveling home for Spring Festival', 'The round shape symbolizes togetherness', 'Returning home is a festival goal'],
    relatedConcepts: ['spring-festival', 'mid-autumn', 'filial-piety'],
    category: 'tradition',
  },
// === Arts & Culture (extended) ===
  'poetry': {
    key: 'poetry',
    chinese: '古诗',
    pinyin: 'gǔ shī',
    english: 'Classical Poetry',
    shortDesc: 'A cornerstone of Chinese culture that condenses emotion into precise verses.',
    longDesc: 'Classical Chinese poetry, at its peak during the Tang and Song dynasties, distills deep emotion into a few carefully chosen characters. Poems like Li Bai\'s and Du Fu\'s are memorized by every schoolchild, and their lines are quoted in daily life and speech.',
    westernEquivalent: 'Comparable to high Western poetry or memorized verse, but far more embedded in everyday education and speech.',
    examples: ['Tang poetry (tang shi) as a shared canon', 'Poetry quoting in conversation', 'Li Bai and Du Fu as household names'],
    relatedConcepts: ['calligraphy', 'scholar'],
    category: 'art',
  },
  'opera': {
    key: 'opera',
    chinese: '京剧',
    pinyin: 'jīng jù',
    english: 'Peking Opera',
    shortDesc: 'A traditional performance art combining singing, acting, and acrobatics.',
    longDesc: 'Peking Opera (京剧) blends song, spoken dialogue, dance, and acrobatics into a stylized art form. Painted faces encode character types—each color signals personality. Nearly 200 years old, it remains a pinnacle of Chinese performing arts.',
    westernEquivalent: 'Somewhat like Western opera plus ballet, but with far more codified facial symbolism and acrobatics.',
    examples: ['Face paint with meaning (red=loyal, white=crafty)', 'Grand costumes and makeup', 'Acrobatic combat sequences'],
    relatedConcepts: ['poetry', 'calligraphy'],
    category: 'art',
  },
  'porcelain': {
    key: 'porcelain',
    chinese: '瓷器',
    pinyin: 'cí qì',
    english: 'Porcelain',
    shortDesc: 'China\'s world-famous fine ceramic, once dubbed "china" in the West.',
    longDesc: 'Chinese porcelain (瓷器) is celebrated for its hardness, whiteness, and delicate blue and white glaze. Tang dynasty, Song celadon, and Yuan blue-and-white all set world standards. For centuries Chinese porcelain drove global trade and fascination.',
    westernEquivalent: 'The very word "china" in English reflects how deeply Western culture equated China with porcelain.',
    examples: ['Blue-and-white ware of the Yuan/Ming eras', 'Song dynasty celadon', 'Porcelain as a global trade treasure'],
    relatedConcepts: ['silk'],
    category: 'art',
  },
  'silk': {
    key: 'silk',
    chinese: '丝绸',
    pinyin: 'sī chóu',
    english: 'Silk',
    shortDesc: 'A luxurious fabric whose making China kept secret for millennia.',
    longDesc: 'Silk (丝绸), produced from silkworm cocoons, is a Chinese invention that fueled the famed Silk Road trade. For over a thousand years China held the monopoly on sericulture. Silk came to symbolize refinement, wealth, and cultural prestige.',
    westernEquivalent: 'Like a luxury commodity such as Italian silk or cashmere today, but historically a state-guarded secret technology.',
    examples: ['Silk Road trade routes', 'Legend of Empress Leizu discovering silk', 'Silk as a status symbol'],
    relatedConcepts: ['porcelain'],
    category: 'art',
  },
  'guqin': {
    key: 'guqin',
    chinese: '古琴',
    pinyin: 'gǔ qín',
    english: 'Guqin',
    shortDesc: 'An ancient seven-string zither, the instrument of scholars.',
    longDesc: 'The guqin (古琴) is one of China\'s oldest instruments, treasured by scholars and sages. Playing it was considered a path to self-cultivation, requiring quiet focus and spiritual connection rather than showmanship. It is listed as a UNESCO intangible heritage.',
    westernEquivalent: 'In prestige to a classical concert piano, but with a meditative, scholarly, non-performance philosophy.',
    examples: ['One of the "four arts" of the scholar', 'Meditative solo practice', 'UNESCO intangible cultural heritage'],
    relatedConcepts: ['scholar', 'poetry'],
    category: 'art',
  },
  'weiqi': {
    key: 'weiqi',
    chinese: '围棋',
    pinyin: 'wéi qí',
    english: 'Weiqi (Go)',
    shortDesc: 'A strategy board game prized as a model of military and life strategy.',
    longDesc: 'Weiqi (围棋, "Go" in the West) is a game of surrounding territory with black and white stones. It symbolizes positions, patience, and foresight. Its proverbs and tactics are used as metaphors for war, governance, and life decisions.',
    westernEquivalent: 'Comparable to chess in Western culture as a game of deep strategy and cultural metaphor.',
    examples: ['Known as "Go" internationally', 'Used for strategic metaphors', 'Mastery requires intuition and patience'],
    relatedConcepts: ['scholar'],
    category: 'art',
  },
  'scholar': {
    key: 'scholar',
    chinese: '士人',
    pinyin: 'shì rén',
    english: 'The Scholar-Official',
    shortDesc: 'The learned class admired for knowledge, cultivation, and integrity.',
    longDesc: 'The scholar-official (士人) was the ideal of Chinese civilization—educated, refined, and morally upright. Through the imperial examination system, talent rather than birth could win bureaucratic office. Scholars cultivated calligraphy, poetry, painting, and the guqin.',
    westernEquivalent: 'Blend of the Renaissance "Renaissance man" and the civil-service class, with exams open to talent.',
    examples: ['Imperial examination merits office', 'The "four arts": calligraphy, painting, qin, chess', 'Scholars as cultural ideal'],
    relatedConcepts: ['confucianism', 'calligraphy', 'poetry'],
    category: 'art',
  },
  'seal-carving': {
    key: 'seal-carving',
    chinese: '篆刻',
    pinyin: 'zhuàn kè',
    english: 'Seal Carving',
    shortDesc: 'Carving name or artistic seals, a companion art to calligraphy.',
    longDesc: 'Seal carving (篆刻) engraves characters—often names or mottoes—onto stone or other materials for stamping. Official seals authenticate documents, and artist seals sign paintings and calligraphy. It is considered a high art combining calligraphy and sculpture.',
    westernEquivalent: 'Like a personal signature stamp or wax seal, but elevated into a fine-art discipline.',
    examples: ['Signing paintings with a seal', 'Official document seals', 'A collector\'s art of stone carving'],
    relatedConcepts: ['calligraphy', 'scholar'],
    category: 'art',
  },

  // === Social Custom (extended) ===
  'renqing': {
    key: 'renqing',
    chinese: '人情',
    pinyin: 'rén qíng',
    english: 'Renqing (Favor & Sensitivity)',
    shortDesc: 'The favor-and-sensitivity code that governs interpersonal debts.',
    longDesc: 'Renqing (人情) refers both to human empathy and to the web of favors and reciprocation that binds relationships. Doing someone a "renqing" creates an implicit debt to be repaid later. Managing it smoothly is seen as social maturity.',
    westernEquivalent: 'Like the psychology of favors and the "favor bank" in any social culture, but more explicit and obligatory.',
    examples: ['Returning a favor later equals it', 'Gifting to build relationship credit', 'Honoring emotional bonds in decisions'],
    relatedConcepts: ['guanxi', 'face', 'reciprocity'],
    category: 'social',
  },
  'reciprocity': {
    key: 'reciprocity',
    chinese: '礼尚往来',
    pinyin: 'lǐ shàng wǎng lái',
    english: 'Reciprocity',
    shortDesc: 'The belief that courtesy must be returned with courtesy.',
    longDesc: '"Li shang wang lai" (礼尚往来) holds that propriety requires returning kindness with kindness. Gifts, invitations, and favors all expect a return. Failing to reciprocate is regarded as a breach of courtesy that can damage relationships.',
    westernEquivalent: 'The universal norm of reciprocity found in all cultures, with a strong etiquette expectation in China.',
    examples: ['Returning dinner invitations', 'Repaying gifts with comparable gifts', 'Balancing favors between families'],
    relatedConcepts: ['renqing', 'guanxi', 'face'],
    category: 'social',
  },
  'hierarchy': {
    key: 'hierarchy',
    chinese: '长幼尊卑',
    pinyin: 'zhǎng yòu zūn bēi',
    english: 'Hierarchy & Respect',
    shortDesc: 'A structured order of respect based on age, position, and role.',
    longDesc: 'Chinese social life respects a clear hierarchy—elder over younger, senior over junior, superior over subordinate, and guest over host. This order, rooted in Confucian thought, shapes speech, seating, pouring order, and decision-making in families and workplaces.',
    westernEquivalent: 'More pronounced and formally acknowledged than typical Western egalitarianism; akin to formal office or military rank protocols.',
    examples: ['Elders served first at meals', 'Honorific titles in address', 'Seating order by rank at banquets'],
    relatedConcepts: ['confucianism', 'filial-piety', 'dining-etiquette'],
    category: 'social',
  },
  'collectivism': {
    key: 'collectivism',
    chinese: '集体主义',
    pinyin: 'jí tǐ zhǔ yì',
    english: 'Collectivism',
    shortDesc: 'Prioritizing the group\'s interests over the individual\'s.',
    longDesc: 'Collectivism sees the individual as part of a larger whole—family, clan, community, or nation. Decisions weigh group harmony and reputation heavily. This contrasts with Western individualism and explains the strong pull of family and community in Chinese life.',
    westernEquivalent: 'Opposite of Western individualism; closer to "communitarian" philosophies and strong team-family cultures.',
    examples: ['Family over personal preference', 'Group harmony in decisions', 'Shared family reputation'],
    relatedConcepts: ['harmony', 'family-reunion', 'face'],
    category: 'social',
  },

  // === Philosophy (extended) ===
  'ren': {
    key: 'ren',
    chinese: '仁',
    pinyin: 'rén',
    english: 'Ren (Benevolence)',
    shortDesc: 'The Confucian virtue of compassion and human-heartedness.',
    longDesc: 'Ren (仁) is the core virtue of Confucianism—benevolence, kindness, and empathy in all relationships. It means treating others with care, as expressed in the maxim "do not do to others what you would not want done to you." Ren grounds all other virtues.',
    westernEquivalent: 'Parallels the Golden Rule in Judeo-Christian ethics; an ethics of care and human-heartedness.',
    examples: ['The heart of Confucian ethics', 'Compassion toward family and strangers', 'Tied to the Golden Rule concept'],
    relatedConcepts: ['confucianism', 'harmony'],
    category: 'philosophy',
  },
  'li': {
    key: 'li',
    chinese: '礼',
    pinyin: 'lǐ',
    english: 'Li (Ritual Propriety)',
    shortDesc: 'The Confucian framework of ritual, etiquette, and proper conduct.',
    longDesc: 'Li (礼) covers ritual, etiquette, and social order—the concrete forms that express respect and harmony. It ranges from ancestral rites and greeting customs to table manners. Practicing li transforms inner virtue into outward, predictable good behavior.',
    westernEquivalent: 'Like Western etiquette plus religious ritual and legal order combined, aspiring to a harmonious society.',
    examples: ['Ritual greetings and bows', 'Table seating and serving order', 'Formal ceremony and protocol'],
    relatedConcepts: ['confucianism', 'dining-etiquette', 'hierarchy'],
    category: 'philosophy',
  },
  'buddhism': {
    key: 'buddhism',
    chinese: '佛教',
    pinyin: 'fó jiào',
    english: 'Chinese Buddhism',
    shortDesc: 'A millennia-old tradition blending Indian Buddhism with Chinese philosophy.',
    longDesc: 'Buddhism entered China around the 1st century and deeply shaped its culture. Over time it merged with Daoism and Confucianism into a uniquely Chinese form—Chan (Zen) Buddhism emphasizes meditation and sudden insight. Temples, festivals, and art all bear its mark.',
    westernEquivalent: 'Unlike Western religion\'s one-answer exclusivity, Chinese Buddhism coexisted with Confucianism and Daoism.',
    examples: ['Chan (Zen) meditation practice', 'Temples and bodhisattva devotion', 'Buddhist symbols in daily life'],
    relatedConcepts: ['daoism', 'harmony'],
    category: 'philosophy',
  },
  'destiny': {
    key: 'destiny',
    chinese: '天命',
    pinyin: 'tiān mìng',
    english: 'Mandate of Destiny',
    shortDesc: 'The belief that fate and the moral order of heaven shape outcomes.',
    longDesc: 'The idea of "heaven\'s mandate" (天命) holds that legitimate rule and good fortune come from heaven\'s favor, which depends on virtue. It appears in political philosophy (a dynasty may lose the mandate by ruling badly) and in the idea that one should strive while accepting fate.',
    westernEquivalent: 'Combines Western ideas of divine right, providence, and the belief that "what will be, will be."',
    examples: ['Famine or corruption signals lost mandate', '"Strive yourself; leave the rest to heaven"', 'Linked to Confucian moral rule'],
    relatedConcepts: ['confucianism', 'harmony'],
    category: 'philosophy',
  },
};

// Get concept by key
export function getCulturalConcept(key) {
  return CULTURAL_CONCEPTS[key] || null;
}

// Get every concept as an array (used by glossary linking and the glossary list)
export function getAllCulturalConcepts() {
  return Object.values(CULTURAL_CONCEPTS);
}

// Get concepts by category
export function getConceptsByCategory(category) {
  return Object.values(CULTURAL_CONCEPTS).filter(c => c.category === category);
}

// Search concepts
export function searchConcepts(query) {
  const lowerQuery = query.toLowerCase();
  return Object.values(CULTURAL_CONCEPTS).filter(c =>
    c.english.toLowerCase().includes(lowerQuery) ||
    c.chinese.includes(query) ||
    c.pinyin.toLowerCase().includes(lowerQuery) ||
    c.shortDesc.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// CONCEPT EXPLAINER CARD
// ============================================

export function ConceptExplainerCard({
  conceptKey,
  concept,
  expanded: initialExpanded = false,
  showWesternEquivalent = true,
  showExamples = true,
  showRelated = true,
  style,
  onDismiss,
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(initialExpanded);

  const data = concept || CULTURAL_CONCEPTS[conceptKey];

  if (!data) return null;

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.chineseBadge, { backgroundColor: colors.cinnabarGlow }]}>
            <Text style={[styles.chineseText, { color: colors.primary }]}>{data.chinese}</Text>
          </View>
          <View style={styles.titleWrap}>
            <Text style={[styles.englishTitle, { color: colors.text }]}>{data.english}</Text>
            <Text style={[styles.pinyin, { color: colors.mutedText }]}>{data.pinyin}</Text>
          </View>
        </View>
        {onDismiss && (
          <Pressable onPress={onDismiss} style={styles.dismissBtn}>
            <X size={16} color={colors.mutedText} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {/* Short Description */}
      <Text style={[styles.shortDesc, { color: colors.text }]}>{data.shortDesc}</Text>

      {/* Expand/Collapse Button */}
      <Pressable style={[styles.expandBtn, { borderColor: colors.border }]} onPress={toggleExpand}>
        <Text style={[styles.expandBtnText, { color: colors.primary }]}>
          {expanded ? 'Show Less' : 'Learn More'}
        </Text>
        {expanded ? (
          <ChevronUp size={14} color={colors.primary} strokeWidth={2} />
        ) : (
          <ChevronDown size={14} color={colors.primary} strokeWidth={2} />
        )}
      </Pressable>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Long Description */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={12} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Understanding</Text>
            </View>
            <Text style={[styles.longDesc, { color: colors.text }]}>{data.longDesc}</Text>
          </View>

          {/* Western Equivalent */}
          {showWesternEquivalent && data.westernEquivalent && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Globe size={12} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Western Context</Text>
              </View>
              <Text style={[styles.westernText, { color: colors.mutedText }]}>{data.westernEquivalent}</Text>
            </View>
          )}

          {/* Examples */}
          {showExamples && data.examples && data.examples.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Lightbulb size={12} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Examples</Text>
              </View>
              {data.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <View style={[styles.exampleDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.exampleText, { color: colors.text }]}>{example}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Related Concepts */}
          {showRelated && data.relatedConcepts && data.relatedConcepts.length > 0 && (
            <View style={styles.relatedRow}>
              <Text style={[styles.relatedLabel, { color: colors.mutedText }]}>Related: </Text>
              {data.relatedConcepts.map((key, index) => {
                const related = CULTURAL_CONCEPTS[key];
                if (!related) return null;
                return (
                  <View key={key} style={[styles.relatedTag, { backgroundColor: colors.cinnabarGlow }]}>
                    <Text style={[styles.relatedTagText, { color: colors.primary }]}>{related.chinese}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ============================================
// INLINE CONCEPT TOOLTIP
// ============================================

export function ConceptTooltip({
  conceptKey,
  concept,
  children,
  position = 'top', // 'top', 'bottom'
}) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  const data = concept || CULTURAL_CONCEPTS[conceptKey];

  if (!data) return children;

  return (
    <View style={styles.tooltipContainer}>
      <Pressable onPress={() => setVisible(!visible)}>
        {children}
      </Pressable>

      {visible && (
        <View style={[
          styles.tooltip,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          position === 'top' ? styles.tooltipTop : styles.tooltipBottom,
        ]}>
          <View style={styles.tooltipHeader}>
            <Text style={[styles.tooltipChinese, { color: colors.primary }]}>{data.chinese}</Text>
            <Text style={[styles.tooltipPinyin, { color: colors.mutedText }]}>{data.pinyin}</Text>
          </View>
          <Text style={[styles.tooltipDesc, { color: colors.text }]}>{data.shortDesc}</Text>
          <Pressable onPress={() => setVisible(false)}>
            <Text style={[styles.tooltipClose, { color: colors.primary }]}>Tap to close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ============================================
// CONCEPT GLOSSARY LIST
// ============================================

export function ConceptGlossary({
  category,
  searchQuery,
  onSelectConcept,
  style,
}) {
  const { colors } = useTheme();

  const concepts = useMemo(() => {
    let list = Object.values(CULTURAL_CONCEPTS);

    if (category && category !== 'all') {
      list = list.filter(c => c.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.english.toLowerCase().includes(query) ||
        c.chinese.includes(searchQuery) ||
        c.pinyin.toLowerCase().includes(query)
      );
    }

    return list;
  }, [category, searchQuery]);

  return (
    <ScrollView style={[styles.glossaryContainer, style]} showsVerticalScrollIndicator={false}>
      {concepts.map((concept) => (
        <Pressable
          key={concept.key}
          style={[styles.glossaryItem, { borderColor: colors.border }]}
          onPress={() => onSelectConcept?.(concept)}
        >
          <View style={[styles.glossaryChinese, { backgroundColor: colors.cinnabarGlow }]}>
            <Text style={[styles.glossaryChineseText, { color: colors.primary }]}>{concept.chinese}</Text>
          </View>
          <View style={styles.glossaryContent}>
            <Text style={[styles.glossaryTitle, { color: colors.text }]}>{concept.english}</Text>
            <Text style={[styles.glossaryDesc, { color: colors.mutedText }]} numberOfLines={2}>
              {concept.shortDesc}
            </Text>
          </View>
          <ChevronDown size={16} color={colors.mutedText} strokeWidth={2} style={{ transform: [{ rotate: '-90deg' }] }} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Card styles
  card: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  chineseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chineseText: {
    fontSize: 20,
    fontWeight: '700',
  },
  titleWrap: {
    flex: 1,
  },
  englishTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  pinyin: {
    fontSize: 12,
    marginTop: 2,
  },
  dismissBtn: {
    padding: 4,
  },
  shortDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 0.5,
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Expanded content
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  longDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  westernText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  exampleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 7,
  },
  exampleText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  relatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  relatedLabel: {
    fontSize: 11,
  },
  relatedTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  relatedTagText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Tooltip styles
  tooltipContainer: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    zIndex: 100,
    ...theme.shadows.medium,
  },
  tooltipTop: {
    bottom: '100%',
    marginBottom: 8,
  },
  tooltipBottom: {
    top: '100%',
    marginTop: 8,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  tooltipChinese: {
    fontSize: 16,
    fontWeight: '700',
  },
  tooltipPinyin: {
    fontSize: 11,
  },
  tooltipDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  tooltipClose: {
    fontSize: 10,
    marginTop: 8,
    fontWeight: '600',
  },

  // Glossary styles
  glossaryContainer: {
    flex: 1,
  },
  glossaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  glossaryChinese: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glossaryChineseText: {
    fontSize: 16,
    fontWeight: '700',
  },
  glossaryContent: {
    flex: 1,
  },
  glossaryTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  glossaryDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
});