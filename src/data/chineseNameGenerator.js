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
  // Coerce any seed into a non-negative integer; bitwise XOR of two u32 values
  // can exceed 2^31 and become negative, which would index the list out of range.
  const idx = ((seed >>> 0) % list.length);
  return list[idx];
}

const surnames = [
  // Common surnames (最常见姓氏 - familiar & credible)
  { hanzi: '李', pinyin: 'Lǐ', meaningEn: 'plum tree abundance' },
  { hanzi: '王', pinyin: 'Wáng', meaningEn: 'noble sovereignty' },
  { hanzi: '张', pinyin: 'Zhāng', meaningEn: 'expansive reach' },
  { hanzi: '刘', pinyin: 'Liú', meaningEn: 'peaceful flow' },
  { hanzi: '陈', pinyin: 'Chén', meaningEn: 'ancient wisdom' },
  { hanzi: '杨', pinyin: 'Yáng', meaningEn: 'poplar resilience' },
  { hanzi: '黄', pinyin: 'Huáng', meaningEn: 'imperial yellow' },
  { hanzi: '吴', pinyin: 'Wú', meaningEn: 'boundless spirit' },
  { hanzi: '赵', pinyin: 'Zhào', meaningEn: 'noble clarity' },
  { hanzi: '周', pinyin: 'Zhōu', meaningEn: 'completeness and grace' },
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
  { hanzi: '谢', pinyin: 'Xiè', meaningEn: 'gratitude and courtesy' },
  { hanzi: '宋', pinyin: 'Sòng', meaningEn: 'scholarly elegance' },
  { hanzi: '唐', pinyin: 'Táng', meaningEn: 'grand cultural aura' },
  { hanzi: '韩', pinyin: 'Hán', meaningEn: 'refined legacy' },
  { hanzi: '曹', pinyin: 'Cáo', meaningEn: 'literary talent' },
  { hanzi: '许', pinyin: 'Xǔ', meaningEn: 'promise and trust' },
  { hanzi: '邓', pinyin: 'Dèng', meaningEn: 'steadfast virtue' },
  { hanzi: '萧', pinyin: 'Xiāo', meaningEn: 'serene clarity' },
  { hanzi: '冯', pinyin: 'Féng', meaningEn: 'swift momentum' },
  { hanzi: '苏', pinyin: 'Sū', meaningEn: 'renewal and elegance' },
  { hanzi: '叶', pinyin: 'Yè', meaningEn: 'fresh growth' },
  { hanzi: '杜', pinyin: 'Dù', meaningEn: 'stability and rootedness' },
  { hanzi: '沈', pinyin: 'Shěn', meaningEn: 'depth and composure' },
  { hanzi: '孟', pinyin: 'Mèng', meaningEn: 'philosophical depth' },
  // Literary and poetic surnames (诗意姓氏 - evocative & elegant)
  { hanzi: '柳', pinyin: 'Liǔ', meaningEn: 'willow grace' },
  { hanzi: '梅', pinyin: 'Méi', meaningEn: 'plum blossom resilience' },
  { hanzi: '云', pinyin: 'Yún', meaningEn: 'cloud-like freedom' },
  { hanzi: '江', pinyin: 'Jiāng', meaningEn: 'river-like persistence' },
  { hanzi: '秦', pinyin: 'Qín', meaningEn: 'ancient dynasty glory' },
  { hanzi: '楚', pinyin: 'Chǔ', meaningEn: 'poetic heritage' },
  { hanzi: '程', pinyin: 'Chéng', meaningEn: 'progress and path' },
  { hanzi: '陆', pinyin: 'Lù', meaningEn: 'steady ground' },
  { hanzi: '白', pinyin: 'Bái', meaningEn: 'clarity and sincerity' },
  { hanzi: '顾', pinyin: 'Gù', meaningEn: 'care and attentiveness' },
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
  // Return { key, label } objects so callers can render and select traits
  // directly (the label matches the traits map's user-facing label).
  return Object.keys(traits).map((key) => ({ key, label: traits[key].label }));
}

// Stable, reusable helper: pick distinct given-name characters from a pool so
// the generated name never repeats the same character and always reads naturally.
function pickGivenName({ englishName, traitKey, phonetic, baseSeed }) {
  // A trait pools its own meaning-rich characters; otherwise fall back to a
  // broad blend across Wise / Gentle / Creative so the result still feels
  // intentional even without an explicit trait selection.
  const traitPool = traitKey ? traits[traitKey].given : null;
  const fallbackPool = [...traits.Wise.given, ...traits.Gentle.given, ...traits.Creative.given];
  const pool = traitPool && traitPool.length > 0 ? traitPool : fallbackPool;

  // First character: prefer a phonetic hint when the English name has a clear
  // initial, so the name echoes the user's own sound ("Sarah" → 思 / Sī).
  const first =
    phonetic && (!traitKey || traitPool?.some((c) => c.hanzi === phonetic.hanzi))
      ? phonetic
      : pickFrom(pool, baseSeed ^ 0x9e3779b9);

  // Second character: a distinct one from the same pool.
  const others = pool.filter((c) => c.hanzi !== first.hanzi);
  const second = others.length > 0 ? pickFrom(others, (baseSeed >>> 1) ^ 0x7f4a7c15) : null;

  const hanzi = second ? `${first.hanzi}${second.hanzi}` : first.hanzi;
  const pinyin = second ? `${first.pinyin} ${second.pinyin}` : first.pinyin;

  return { first, second, hanzi, pinyin };
}

export function generateChineseName({ englishName, traitKeys = [], randomness = Math.random }) {
  const name = normalizeEnglishName(englishName);
  const firstChar = name.charAt(0).toLowerCase();
  const phonetic = phoneticInitialMap[firstChar] ?? null;

  const traitPoolKeys = traitKeys.filter((k) => traits[k]);
  // Pick one trait deterministically (not randomly) so a given (name + traits)
  // pair always produces the same name — surprising but stable.
  const traitKey =
    traitPoolKeys.length > 0 ? traitPoolKeys[hashStringToInt(name) % traitPoolKeys.length] : null;

  const baseSeed = hashStringToInt(`${name}|${traitKey ?? 'none'}`);
  const surname = pickFrom(surnames, baseSeed) ?? surnames[0];

  const { first, second, hanzi: givenHanzi, pinyin: givenPinyin } = pickGivenName({
    englishName: name,
    traitKey,
    phonetic,
    baseSeed,
  });

  const firstName = name.split(' ')[0] || name;

  // Build a readable, compact explanation instead of the old verbose stack.
  const meaningBits = [];
  if (first === phonetic) {
    meaningBits.push(`“${firstName}” echoes ${first.pinyin} (${first.meaningEn}), a sound-alike opening.`);
  } else if (traitKey) {
    meaningBits.push(`The “${traits[traitKey].label}” spirit opens with ${first.pinyin} (${first.meaningEn}).`);
  }
  if (second) {
    meaningBits.push(`${traitKey ? `Paired with` : `Balanced by`} ${second.pinyin} (${second.meaningEn}).`);
  }
  meaningBits.push(`Surname ${surname.hanzi} (${surname.pinyin}) means ${surname.meaningEn}.`);

  const meaningEn = meaningBits.join(' ');

  return {
    id: `${Date.now()}-${Math.floor(randomness() * 1e9)}`,
    englishName: name,
    traitKey,
    surname,
    given: { hanzi: givenHanzi, pinyin: givenPinyin, meaningEn },
    full: {
      hanzi: `${surname.hanzi}${givenHanzi}`,
      pinyin: `${surname.pinyin} ${givenPinyin}`.trim(),
      meaningEn,
    },
  };
}

