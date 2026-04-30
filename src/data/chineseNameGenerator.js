function normalizeEnglishName(name) {
  return String(name ?? '').trim().replace(/\s+/g, ' ');
}

function hashStringToInt(input) {
  // Small deterministic hash (not crypto) for stable "randomness".
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickFrom(list, seed) {
  if (!list.length) return null;
  const idx = seed % list.length;
  return list[idx];
}

const surnames = [
  // Original surnames
  { hanzi: '林', pinyin: 'Lín', meaningEn: 'forest vitality' },
  { hanzi: '苏', pinyin: 'Sū', meaningEn: 'renewal and elegance' },
  { hanzi: '沈', pinyin: 'Shěn', meaningEn: 'depth and composure' },
  { hanzi: '周', pinyin: 'Zhōu', meaningEn: 'completeness and grace' },
  { hanzi: '许', pinyin: 'Xǔ', meaningEn: 'promise and trust' },
  { hanzi: '顾', pinyin: 'Gù', meaningEn: 'care and attentiveness' },
  { hanzi: '唐', pinyin: 'Táng', meaningEn: 'grand cultural aura' },
  { hanzi: '白', pinyin: 'Bái', meaningEn: 'clarity and sincerity' },
  { hanzi: '宋', pinyin: 'Sòng', meaningEn: 'scholarly elegance' },
  { hanzi: '叶', pinyin: 'Yè', meaningEn: 'fresh growth' },
  { hanzi: '陆', pinyin: 'Lù', meaningEn: 'steady ground' },
  { hanzi: '韩', pinyin: 'Hán', meaningEn: 'refined legacy' },
  { hanzi: '郑', pinyin: 'Zhèng', meaningEn: 'upright principle' },
  { hanzi: '梁', pinyin: 'Liáng', meaningEn: 'support and bridge' },
  { hanzi: '程', pinyin: 'Chéng', meaningEn: 'progress and path' },
  { hanzi: '夏', pinyin: 'Xià', meaningEn: 'warmth and brightness' },
  { hanzi: '魏', pinyin: 'Wèi', meaningEn: 'fortitude' },
  { hanzi: '赵', pinyin: 'Zhào', meaningEn: 'noble clarity' },
  { hanzi: '杜', pinyin: 'Dù', meaningEn: 'stability and rootedness' },
  { hanzi: '冯', pinyin: 'Féng', meaningEn: 'swift momentum' },
  { hanzi: '裴', pinyin: 'Péi', meaningEn: 'cultivated style' },
  { hanzi: '乔', pinyin: 'Qiáo', meaningEn: 'lofty elegance' },
  // New surnames - Common and meaningful
  { hanzi: '李', pinyin: 'Lǐ', meaningEn: 'plum tree abundance' },
  { hanzi: '王', pinyin: 'Wáng', meaningEn: 'noble sovereignty' },
  { hanzi: '张', pinyin: 'Zhāng', meaningEn: 'expansive reach' },
  { hanzi: '刘', pinyin: 'Liú', meaningEn: 'peaceful flow' },
  { hanzi: '陈', pinyin: 'Chén', meaningEn: 'ancient wisdom' },
  { hanzi: '杨', pinyin: 'Yáng', meaningEn: 'poplar resilience' },
  { hanzi: '黄', pinyin: 'Huáng', meaningEn: 'imperial yellow' },
  { hanzi: '吴', pinyin: 'Wú', meaningEn: 'boundless spirit' },
  { hanzi: '徐', pinyin: 'Xú', meaningEn: 'gentle progress' },
  { hanzi: '孙', pinyin: 'Sūn', meaningEn: 'generational continuity' },
  { hanzi: '马', pinyin: 'Mǎ', meaningEn: 'swift strength' },
  { hanzi: '朱', pinyin: 'Zhū', meaningEn: 'vermilion passion' },
  { hanzi: '胡', pinyin: 'Hú', meaningEn: 'vital longevity' },
  { hanzi: '郭', pinyin: 'Guō', meaningEn: 'protective wall' },
  { hanzi: '何', pinyin: 'Hé', meaningEn: 'harmonious unity' },
  { hanzi: '高', pinyin: 'Gāo', meaningEn: 'lofty aspiration' },
  { hanzi: '林', pinyin: 'Lín', meaningEn: 'forest vitality' },
  { hanzi: '罗', pinyin: 'Luó', meaningEn: 'gathering wisdom' },
  { hanzi: '郑', pinyin: 'Zhèng', meaningEn: 'solemn integrity' },
  { hanzi: '梁', pinyin: 'Liáng', meaningEn: 'bridging strength' },
  // Literary and poetic surnames
  { hanzi: '柳', pinyin: 'Liǔ', meaningEn: 'willow grace' },
  { hanzi: '梅', pinyin: 'Méi', meaningEn: 'plum blossom resilience' },
  { hanzi: '云', pinyin: 'Yún', meaningEn: 'cloud-like freedom' },
  { hanzi: '江', pinyin: 'Jiāng', meaningEn: 'river-like persistence' },
  { hanzi: '秦', pinyin: 'Qín', meaningEn: 'ancient dynasty glory' },
  { hanzi: '楚', pinyin: 'Chǔ', meaningEn: 'poetic heritage' },
  { hanzi: '燕', pinyin: 'Yàn', meaningEn: 'swallow elegance' },
  { hanzi: '萧', pinyin: 'Xiāo', meaningEn: 'serene clarity' },
  { hanzi: '尹', pinyin: 'Yǐn', meaningEn: 'governing wisdom' },
  { hanzi: '邵', pinyin: 'Shào', meaningEn: 'splendid virtue' },
  { hanzi: '孟', pinyin: 'Mèng', meaningEn: 'philosophical depth' },
  { hanzi: '曹', pinyin: 'Cáo', meaningEn: 'literary talent' },
];

const traits = {
  Brave: {
    label: 'Brave',
    given: [
      // Original
      { hanzi: '骁', pinyin: 'Xiāo', meaningEn: 'valiant / swift' },
      { hanzi: '毅', pinyin: 'Yì', meaningEn: 'resolute' },
      { hanzi: '峻', pinyin: 'Jùn', meaningEn: 'steep / lofty' },
      { hanzi: '燃', pinyin: 'Rán', meaningEn: 'to ignite / passion' },
      { hanzi: '锋', pinyin: 'Fēng', meaningEn: 'sharp edge and courage' },
      { hanzi: '铮', pinyin: 'Zhēng', meaningEn: 'ringing integrity' },
      { hanzi: '霆', pinyin: 'Tíng', meaningEn: 'thunderous strength' },
      { hanzi: '擎', pinyin: 'Qíng', meaningEn: 'to lift and shoulder duty' },
      { hanzi: '烈', pinyin: 'Liè', meaningEn: 'fierce conviction' },
      { hanzi: '昆', pinyin: 'Kūn', meaningEn: 'mountain-like endurance' },
      { hanzi: '航', pinyin: 'Háng', meaningEn: 'to navigate fearlessly' },
      { hanzi: '拓', pinyin: 'Tuò', meaningEn: 'to pioneer new frontiers' },
      { hanzi: '朗', pinyin: 'Lǎng', meaningEn: 'bold clarity' },
      { hanzi: '骏', pinyin: 'Jùn', meaningEn: 'galloping spirit' },
      { hanzi: '昱', pinyin: 'Yù', meaningEn: 'radiant confidence' },
      { hanzi: '川', pinyin: 'Chuān', meaningEn: 'unstoppable flow' },
      { hanzi: '卫', pinyin: 'Wèi', meaningEn: 'to protect and guard' },
      // New additions
      { hanzi: '豪', pinyin: 'Háo', meaningEn: 'heroic spirit' },
      { hanzi: '杰', pinyin: 'Jié', meaningEn: 'outstanding talent' },
      { hanzi: '刚', pinyin: 'Gāng', meaningEn: 'unyielding strength' },
      { hanzi: '勇', pinyin: 'Yǒng', meaningEn: 'courageous heart' },
      { hanzi: '威', pinyin: 'Wēi', meaningEn: 'commanding presence' },
      { hanzi: '震', pinyin: 'Zhèn', meaningEn: 'awe-inspiring power' },
      { hanzi: '鹏', pinyin: 'Péng', meaningEn: 'soaring ambition' },
      { hanzi: '龙', pinyin: 'Lóng', meaningEn: 'majestic strength' },
      { hanzi: '虎', pinyin: 'Hǔ', meaningEn: 'tiger-like bravery' },
      { hanzi: '翔', pinyin: 'Xiáng', meaningEn: 'soaring flight' },
      { hanzi: '凯', pinyin: 'Kǎi', meaningEn: 'triumphant victory' },
      { hanzi: '昂', pinyin: 'Áng', meaningEn: 'head held high' },
      { hanzi: '昊', pinyin: 'Hào', meaningEn: 'vast sky ambition' },
    ],
  },
  Gentle: {
    label: 'Gentle',
    given: [
      // Original
      { hanzi: '宁', pinyin: 'Níng', meaningEn: 'peaceful / calm' },
      { hanzi: '安', pinyin: 'Ān', meaningEn: 'safe / serene' },
      { hanzi: '和', pinyin: 'Hé', meaningEn: 'harmony' },
      { hanzi: '澄', pinyin: 'Chéng', meaningEn: 'clear / tranquil' },
      { hanzi: '柔', pinyin: 'Róu', meaningEn: 'soft and flexible' },
      { hanzi: '婉', pinyin: 'Wǎn', meaningEn: 'graceful and gentle' },
      { hanzi: '沁', pinyin: 'Qìn', meaningEn: 'refreshing calm' },
      { hanzi: '岚', pinyin: 'Lán', meaningEn: 'mountain mist serenity' },
      { hanzi: '汐', pinyin: 'Xī', meaningEn: 'evening tide tenderness' },
      { hanzi: '月', pinyin: 'Yuè', meaningEn: 'moonlit gentleness' },
      { hanzi: '悠', pinyin: 'Yōu', meaningEn: 'unhurried ease' },
      { hanzi: '瑶', pinyin: 'Yáo', meaningEn: 'precious grace' },
      { hanzi: '芷', pinyin: 'Zhǐ', meaningEn: 'fragrant calm' },
      { hanzi: '棠', pinyin: 'Táng', meaningEn: 'blossoming warmth' },
      { hanzi: '雅', pinyin: 'Yǎ', meaningEn: 'elegant poise' },
      { hanzi: '清', pinyin: 'Qīng', meaningEn: 'clear-hearted purity' },
      { hanzi: '溪', pinyin: 'Xī', meaningEn: 'brook-like softness' },
      // New additions
      { hanzi: '萱', pinyin: 'Xuān', meaningEn: 'daylily joy' },
      { hanzi: '怡', pinyin: 'Yí', meaningEn: 'joyful harmony' },
      { hanzi: '欣', pinyin: 'Xīn', meaningEn: 'delightful spirit' },
      { hanzi: '悦', pinyin: 'Yuè', meaningEn: 'pleasing warmth' },
      { hanzi: '涵', pinyin: 'Hán', meaningEn: 'nurturing depth' },
      { hanzi: '淑', pinyin: 'Shū', meaningEn: 'virtuous grace' },
      { hanzi: '惠', pinyin: 'Huì', meaningEn: 'kind benevolence' },
      { hanzi: '娴', pinyin: 'Xián', meaningEn: 'refined elegance' },
      { hanzi: '静', pinyin: 'Jìng', meaningEn: 'quiet serenity' },
      { hanzi: '雯', pinyin: 'Wén', meaningEn: 'cloud patterns beauty' },
      { hanzi: '琳', pinyin: 'Lín', meaningEn: 'beautiful jade' },
      { hanzi: '蕊', pinyin: 'Ruǐ', meaningEn: 'flower heart delicacy' },
      { hanzi: '馨', pinyin: 'Xīn', meaningEn: 'fragrant warmth' },
      { hanzi: '语', pinyin: 'Yǔ', meaningEn: 'gentle expression' },
    ],
  },
  Wise: {
    label: 'Wise',
    given: [
      // Original
      { hanzi: '知', pinyin: 'Zhī', meaningEn: 'to know' },
      { hanzi: '哲', pinyin: 'Zhé', meaningEn: 'philosophical / wise' },
      { hanzi: '明', pinyin: 'Míng', meaningEn: 'bright / insightful' },
      { hanzi: '启', pinyin: 'Qǐ', meaningEn: 'to enlighten' },
      { hanzi: '睿', pinyin: 'Ruì', meaningEn: 'sharp-minded wisdom' },
      { hanzi: '衡', pinyin: 'Héng', meaningEn: 'balanced judgment' },
      { hanzi: '言', pinyin: 'Yán', meaningEn: 'thoughtful expression' },
      { hanzi: '观', pinyin: 'Guān', meaningEn: 'wide perspective' },
      { hanzi: '博', pinyin: 'Bó', meaningEn: 'learned breadth' },
      { hanzi: '慎', pinyin: 'Shèn', meaningEn: 'careful discernment' },
      { hanzi: '策', pinyin: 'Cè', meaningEn: 'strategic thinking' },
      { hanzi: '源', pinyin: 'Yuán', meaningEn: 'deep source of thought' },
      { hanzi: '谦', pinyin: 'Qiān', meaningEn: 'humble wisdom' },
      { hanzi: '辰', pinyin: 'Chén', meaningEn: 'cosmic timing insight' },
      { hanzi: '允', pinyin: 'Yǔn', meaningEn: 'fair and just' },
      { hanzi: '真', pinyin: 'Zhēn', meaningEn: 'truth-seeking' },
      { hanzi: '维', pinyin: 'Wéi', meaningEn: 'analytical order' },
      // New additions
      { hanzi: '思', pinyin: 'Sī', meaningEn: 'deep contemplation' },
      { hanzi: '文', pinyin: 'Wén', meaningEn: 'scholarly culture' },
      { hanzi: '书', pinyin: 'Shū', meaningEn: 'bookish wisdom' },
      { hanzi: '修', pinyin: 'Xiū', meaningEn: 'self-cultivation' },
      { hanzi: '德', pinyin: 'Dé', meaningEn: 'moral virtue' },
      { hanzi: '贤', pinyin: 'Xián', meaningEn: 'worthy sagacity' },
      { hanzi: '圣', pinyin: 'Shèng', meaningEn: 'sage-like wisdom' },
      { hanzi: '智', pinyin: 'Zhì', meaningEn: 'intellectual depth' },
      { hanzi: '学', pinyin: 'Xué', meaningEn: 'love of learning' },
      { hanzi: '墨', pinyin: 'Mò', meaningEn: 'ink and scholarship' },
      { hanzi: '远', pinyin: 'Yuǎn', meaningEn: 'far-reaching vision' },
      { hanzi: '致', pinyin: 'Zhì', meaningEn: 'attaining excellence' },
      { hanzi: '诚', pinyin: 'Chéng', meaningEn: 'sincere integrity' },
    ],
  },
  Creative: {
    label: 'Creative',
    given: [
      { hanzi: '艺', pinyin: 'Yì', meaningEn: 'artistic talent' },
      { hanzi: '韵', pinyin: 'Yùn', meaningEn: 'poetic rhythm' },
      { hanzi: '诗', pinyin: 'Shī', meaningEn: 'poetic soul' },
      { hanzi: '画', pinyin: 'Huà', meaningEn: 'painting mastery' },
      { hanzi: '琴', pinyin: 'Qín', meaningEn: 'musical elegance' },
      { hanzi: '舞', pinyin: 'Wǔ', meaningEn: 'dancing grace' },
      { hanzi: '歌', pinyin: 'Gē', meaningEn: 'singing spirit' },
      { hanzi: '墨', pinyin: 'Mò', meaningEn: 'ink artistry' },
      { hanzi: '笔', pinyin: 'Bǐ', meaningEn: 'writing talent' },
      { hanzi: '彩', pinyin: 'Cǎi', meaningEn: 'colorful imagination' },
      { hanzi: '灵', pinyin: 'Líng', meaningEn: 'inspired spirit' },
      { hanzi: '梦', pinyin: 'Mèng', meaningEn: 'dreamlike vision' },
      { hanzi: '幻', pinyin: 'Huàn', meaningEn: 'imaginative wonder' },
      { hanzi: '创', pinyin: 'Chuàng', meaningEn: 'creative innovation' },
      { hanzi: '新', pinyin: 'Xīn', meaningEn: 'fresh originality' },
      { hanzi: '奇', pinyin: 'Qí', meaningEn: 'unique brilliance' },
      { hanzi: '妙', pinyin: 'Miào', meaningEn: 'wonderful ingenuity' },
      { hanzi: '巧', pinyin: 'Qiǎo', meaningEn: 'skillful craft' },
      { hanzi: '华', pinyin: 'Huá', meaningEn: 'flourishing beauty' },
      { hanzi: '锦', pinyin: 'Jǐn', meaningEn: 'brocade elegance' },
      { hanzi: '绣', pinyin: 'Xiù', meaningEn: 'embroidered art' },
      { hanzi: '璇', pinyin: 'Xuán', meaningEn: 'jade brilliance' },
      { hanzi: '瑛', pinyin: 'Yīng', meaningEn: 'crystal clarity' },
    ],
  },
};

// Very lightweight “sound hint”: map first letter to a pinyin-ish syllable and a matching character.
const phoneticInitialMap = {
  a: { hanzi: '安', pinyin: 'Ān', meaningEn: 'peace' },
  b: { hanzi: '博', pinyin: 'Bó', meaningEn: 'broad / learned' },
  c: { hanzi: '成', pinyin: 'Chéng', meaningEn: 'to become / accomplished' },
  d: { hanzi: '德', pinyin: 'Dé', meaningEn: 'virtue' },
  e: { hanzi: '恩', pinyin: 'Ēn', meaningEn: 'grace' },
  f: { hanzi: '飞', pinyin: 'Fēi', meaningEn: 'to fly' },
  g: { hanzi: '光', pinyin: 'Guāng', meaningEn: 'light' },
  h: { hanzi: '和', pinyin: 'Hé', meaningEn: 'harmony' },
  i: { hanzi: '依', pinyin: 'Yī', meaningEn: 'to rely on' },
  j: { hanzi: '景', pinyin: 'Jǐng', meaningEn: 'scene / bright' },
  k: { hanzi: '恺', pinyin: 'Kǎi', meaningEn: 'joyful / triumphant' },
  l: { hanzi: '澜', pinyin: 'Lán', meaningEn: 'great waves' },
  m: { hanzi: '墨', pinyin: 'Mò', meaningEn: 'ink' },
  n: { hanzi: '宁', pinyin: 'Níng', meaningEn: 'peaceful' },
  o: { hanzi: '欧', pinyin: 'Ōu', meaningEn: 'elegant sound' },
  p: { hanzi: '平', pinyin: 'Píng', meaningEn: 'peace / level' },
  q: { hanzi: '清', pinyin: 'Qīng', meaningEn: 'clear / pure' },
  r: { hanzi: '然', pinyin: 'Rán', meaningEn: 'so / natural' },
  s: { hanzi: '思', pinyin: 'Sī', meaningEn: 'to think' },
  t: { hanzi: '霆', pinyin: 'Tíng', meaningEn: 'thunder' },
  u: { hanzi: '宇', pinyin: 'Yǔ', meaningEn: 'universe' },
  v: { hanzi: '薇', pinyin: 'Wēi', meaningEn: 'fern / gentle' },
  w: { hanzi: '文', pinyin: 'Wén', meaningEn: 'culture / literature' },
  x: { hanzi: '星', pinyin: 'Xīng', meaningEn: 'star' },
  y: { hanzi: '遥', pinyin: 'Yáo', meaningEn: 'distant / free' },
  z: { hanzi: '泽', pinyin: 'Zé', meaningEn: 'grace / beneficence' },
};

export function getTraitOptions() {
  return Object.keys(traits);
}

export function generateChineseName({ englishName, traitKeys = [], randomness = Math.random }) {
  const name = normalizeEnglishName(englishName);
  const firstChar = name.trim().charAt(0).toLowerCase();
  const phonetic = phoneticInitialMap[firstChar] ?? null;

  const traitPoolKeys = traitKeys.filter((k) => traits[k]);
  const traitKey =
    traitPoolKeys.length > 0 ? traitPoolKeys[Math.floor(randomness() * traitPoolKeys.length)] : null;

  const baseSeed = hashStringToInt(`${name}|${traitKey ?? 'none'}`);
  const surname = pickFrom(surnames, baseSeed) ?? surnames[0];

  const givenPool = traitKey
    ? traits[traitKey].given
    : [...traits.Wise.given, ...traits.Gentle.given, ...traits.Brave.given];
  const given1 = phonetic ? phonetic : pickFrom(givenPool, baseSeed ^ 0x9e3779b9);
  const given2 = pickFrom(givenPool, (baseSeed >>> 1) ^ 0x7f4a7c15);

  const given = given2 && given2.hanzi !== given1.hanzi ? `${given1.hanzi}${given2.hanzi}` : `${given1.hanzi}`;
  const pinyin = given2 && given2.hanzi !== given1.hanzi ? `${given1.pinyin} ${given2.pinyin}` : `${given1.pinyin}`;

  const meaningBits = [];
  if (phonetic) meaningBits.push(`A sound hint from “${name.split(' ')[0] || 'you'}” → ${phonetic.meaningEn}.`);
  if (traitKey) meaningBits.push(`Trait focus: ${traitKey}, emphasizing this personality arc in your Chinese identity.`);
  meaningBits.push(`Surname “${surname.hanzi}” conveys ${surname.meaningEn}.`);
  meaningBits.push(
    `Given name suggests ${
      given2 ? `${given1.meaningEn} paired with ${given2.meaningEn}` : given1.meaningEn
    }, shaping a balanced personal narrative.`
  );

  const meaningEn = meaningBits.join(' ');

  return {
    id: `${Date.now()}-${Math.floor(randomness() * 1e9)}`,
    englishName: name,
    traitKey,
    surname,
    given: { hanzi: given, pinyin, meaningEn },
    full: {
      hanzi: `${surname.hanzi}${given}`,
      pinyin: `${surname.pinyin} ${pinyin}`.trim(),
      meaningEn,
    },
  };
}

