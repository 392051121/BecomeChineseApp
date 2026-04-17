const baseQuestions = [
  {
    question: 'Which Chinese city is often called the “City of Stone” because of its ancient wall?',
    options: ['Xi\'an', 'Harbin', 'Xiamen', 'Kunming'],
    correctIndex: 0,
    explanation: 'Xi\'an is famous for its preserved city wall and long role as an imperial capital.',
    region: 'Shaanxi',
  },
  {
    question: 'What everyday dish is commonly linked to the idea of “tomato and egg” home cooking in China?',
    options: ['Scrambled eggs with tomatoes', 'Mapo tofu', 'Peking duck', 'Xiaolongbao'],
    correctIndex: 0,
    explanation: '番茄炒蛋 is one of the most familiar comfort dishes in Chinese households.',
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
    question: 'What is the traditional name for the narrow old neighborhoods in Beijing?',
    options: ['Hutongs', 'Paddies', 'Bazaars', 'Arcades'],
    correctIndex: 0,
    explanation: 'Beijing hutongs are narrow alley neighborhoods that reveal the city’s older rhythm.',
    region: 'Beijing',
  },
  {
    question: 'Which province is especially famous for the spicy and numbing flavor of Sichuan cuisine?',
    options: ['Sichuan', 'Guangdong', 'Jiangsu', 'Fujian'],
    correctIndex: 0,
    explanation: 'Sichuan cuisine is known for mala — the famous combination of numbing and spicy.',
    region: 'Sichuan',
  },
  {
    question: 'Which food is most associated with Shanghai street breakfast culture?',
    options: ['Shengjianbao', 'Peking duck', 'Hot pot', 'Congee'],
    correctIndex: 0,
    explanation: 'Shengjianbao are pan-fried soup buns beloved in Shanghai morning food culture.',
    region: 'Shanghai',
  },
  {
    question: 'Which landmark is the symbolic start of the Silk Road in Chinese history?',
    options: ['Xi\'an', 'Dalian', 'Tianjin', 'Lhasa'],
    correctIndex: 0,
    explanation: 'Xi\'an served as a major hub from which Silk Road exchanges radiated westward.',
    region: 'Shaanxi',
  },
  {
    question: 'What is the name of the famous winter festival city in China?',
    options: ['Harbin', 'Guangzhou', 'Wuhan', 'Suzhou'],
    correctIndex: 0,
    explanation: 'Harbin is known for its Ice and Snow Festival and dramatic winter identity.',
    region: 'Heilongjiang',
  },
  {
    question: 'Which city is widely known for its Cantonese dim sum tradition?',
    options: ['Guangzhou', 'Qingdao', 'Lhasa', 'Nanjing'],
    correctIndex: 0,
    explanation: 'Guangzhou is the heartland of Cantonese dim sum and morning tea culture.',
    region: 'Guangdong',
  },
  {
    question: 'Which scenic place is famous for bamboo rafts and misty karst peaks?',
    options: ['Guilin', 'Chongqing', 'Shenzhen', 'Tianjin'],
    correctIndex: 0,
    explanation: 'Guilin’s Li River landscapes are among the most iconic in China.',
    region: 'Guangxi',
  },
];

const templateRegions = [
  'General', 'Beijing', 'Shanghai', 'Shaanxi', 'Sichuan', 'Guangdong', 'Zhejiang', 'Jiangsu', 'Hubei', 'Shandong', 'Fujian', 'Yunnan', 'Heilongjiang', 'Liaoning', 'Hunan', 'Anhui', 'Henan', 'Hebei', 'Chongqing', 'Tibet',
];

const templateTopics = [
  ['Which animal appears often in Chinese zodiac stories?', ['Rat', 'Lion', 'Penguin', 'Koala'], 0, 'The Chinese zodiac begins with the Rat, followed by 11 other animals.'],
  ['What is the traditional name for dumplings in Chinese New Year food customs?', ['Jiaozi', 'Tacos', 'Samosas', 'Buns only'], 0, 'Jiaozi symbolize reunion and prosperity in many northern households.'],
  ['Which imperial city is home to the Forbidden City?', ['Beijing', 'Xi\'an', 'Luoyang', 'Nanjing'], 0, 'The Forbidden City stands in Beijing and served as the imperial palace for Ming and Qing rulers.'],
  ['What style of Chinese painting often emphasizes mountains, mist, and brush rhythm?', ['Shanshui painting', 'Pop art', 'Cubism', 'Mosaic'], 0, 'Shanshui means mountain-water painting, a major tradition in Chinese art.'],
  ['Which food is especially linked to Sichuan for its sesame paste and chili aroma?', ['Dan dan noodles', 'Pasta', 'Burger', 'Ramen'], 0, 'Dan dan noodles are a beloved Sichuan street-food classic.'],
  ['Which craft is strongly associated with Jingdezhen?', ['Porcelain', 'Glass blowing', 'Origami', 'Stone carving'], 0, 'Jingdezhen is celebrated as the porcelain capital of China.'],
  ['What is the common Chinese term for the Mid-Autumn Festival mooncake?', ['Yuebing', 'Tangyuan', 'Mantou', 'Baijiu'], 0, 'Yuebing is the mooncake eaten during Mid-Autumn Festival celebrations.'],
  ['Which city is most associated with the Bund?', ['Shanghai', 'Xian', 'Chengdu', 'Ningbo'], 0, 'The Bund is a famous waterfront promenade in Shanghai.', ],
  ['Which term describes the energetic lion dance often seen during festivals?', ['Wushi', 'Huoshan', 'Yuedu', 'Qipao'], 0, 'Lion dance is a major festive performance across many Chinese communities.'],
  ['Which noodle tradition is especially linked to Lanzhou?', ['Beef noodles', 'Rice cakes', 'Udon', 'Glass noodles'], 0, 'Lanzhou beef noodles are one of China’s most famous noodle dishes.'],
];

function makeQuestion(index) {
  const [question, options, correctIndex, explanation] = templateTopics[index % templateTopics.length];
  return {
    question: `${question} (Set ${index + 1})`,
    options,
    correctIndex,
    explanation,
    region: templateRegions[index % templateRegions.length],
  };
}

export const quizQuestions = Array.from({ length: 365 }, (_, index) =>
  baseQuestions[index] ?? makeQuestion(index - baseQuestions.length)
);

export function getDailyQuizQuestion(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const regionOrder = [
    'General',
    'Beijing',
    'Shanghai',
    'Shaanxi',
    'Sichuan',
    'Guangdong',
    'Zhejiang',
    'Jiangsu',
    'Hubei',
    'Shandong',
    'Fujian',
    'Yunnan',
    'Heilongjiang',
    'Liaoning',
    'Hunan',
    'Anhui',
    'Henan',
    'Hebei',
    'Chongqing',
    'Tibet',
    'Guangxi',
    'Jilin',
    'Shaanxi',
  ];

  const region = regionOrder[dayOfYear % regionOrder.length];
  const regionQuestions = quizQuestions.filter((item) => item.region === region);
  const pool = regionQuestions.length > 0 ? regionQuestions : quizQuestions;
  return pool[dayOfYear % pool.length];
}
