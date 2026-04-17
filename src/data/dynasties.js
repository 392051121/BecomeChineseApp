import dynastiesRaw from './dynasties.json';
import { fullEmperorsByDynasty } from './fullEmperors';
import { dynastyImagePrompts, getImageSource } from './imagePrompts';

const bgColorMap = {
  xia: '#2A2621',
  shang: '#332A22',
  zhou: '#373229',
  qin: '#1E1C1A',
  han: '#2C2B24',
  'three-kingdoms': '#2D2A2A',
  jin: '#2A2F33',
  sui: '#3C3A36',
  tang: '#4B3F2A',
  song: '#3E464A',
  yuan: '#3A3F45',
  ming: '#4A2E2A',
  qing: '#2A3A44',
};

const colorThemeMap = {
  xia: '#6E5C4A',
  shang: '#7A4E2D',
  zhou: '#6A6F52',
  qin: '#3E3B38',
  han: '#8A3A2B',
  'three-kingdoms': '#5B2E2E',
  jin: '#4D5A62',
  sui: '#6C6A66',
  tang: '#E2B05E', // Dunhuang gold
  song: '#6B8A94',
  yuan: '#5E6B7A',
  ming: '#9C3A2B',
  qing: '#2E6C7A',
};

const dynastyAssetMap = {
  xia: 'xia_dynasty_bronze_artifact.png',
  shang: 'shang_dynasty_oracle_bone.png',
  zhou: 'zhou_dynasty_bronze_vessel.png',
  qin: 'qin_dynasty_terracotta_detail.png',
  han: 'han_dynasty_silk_road_relic.png',
  sui: 'sui_dynasty_grand_canal_relic.png',
  tang: 'tang_dynasty_pottery.png',
  song: 'song_dynasty_ceramics.png',
  yuan: 'yuan_dynasty_blue_white_porcelain.png',
  ming: 'ming_dynasty_imperial_porcelain.png',
  qing: 'qing_dynasty_court_artifact.png',
};
const dynastyKeywordMap = {
  xia: 'Erlitou culture, early bronze age China, archaeology, bronze vessel, museum',
  shang: 'Shang dynasty bronze ritual vessel, taotie, Anyang Yin Ruins, oracle bone, museum',
  zhou: 'Zhou dynasty bronze, ritual bells, bronze ding, ancient Chinese artifacts, museum',
  qin: "Qin dynasty, terracotta warriors, Qin armor, Xi'an museum, ancient sculpture",
  han: 'Han dynasty, jade burial suit, tomb mural, bronze lamp, museum artifact',
  'three-kingdoms': 'Three Kingdoms, Chinese armor, ancient battlefield, bronze, museum artifact',
  jin: 'Jin dynasty, calligraphy, ancient Chinese art, Eastern Jin, museum',
  sui: 'Sui dynasty, Buddhist sculpture, stone carving, early imperial China, museum',
  tang: 'Tang dynasty sancai pottery horse, Silk Road, Tang ceramic, museum artifact',
  song: 'Song dynasty porcelain, Ru ware, celadon, Chinese landscape painting, museum',
  yuan: 'Yuan dynasty blue and white porcelain, underglaze cobalt, Mongol era, museum',
  ming: 'Ming dynasty porcelain, dragon motif, imperial China, Forbidden City artifact, museum',
  qing: 'Qing dynasty imperial palace, cloisonne, imperial porcelain, court art, museum',
};

const worldContextMap = {
  xia: 'Early Bronze Age civilizations / 早期青铜时代文明',
  shang: 'Bronze Age high culture / 青铜时代高文明',
  zhou: 'Age of philosophies / 百家思想兴起的时代',
  qin: 'First unification / 中国首次大一统',
  han: 'Silk Road opening / 丝绸之路开启',
  'three-kingdoms': 'Fragmented world after empire / 帝国分裂后的时代',
  jin: 'Migration and reunification attempts / 南北流动与再统一尝试',
  sui: 'Reunification and grand projects / 再统一与大工程',
  tang: 'Peak of the Silk Road / 丝绸之路的高峰',
  song: 'Commercial and maritime boom / 商业与海贸繁荣',
  yuan: 'Pax Mongolica / 蒙古帝国带来的欧亚联通',
  ming: 'Maritime expeditions and later consolidation / 海上远航与后期整合',
  qing: 'Global trade and modern pressures / 全球贸易与近代压力',
};

const taglineMap = {
  xia: 'The Dawn of Dynasties / 王朝曙光',
  shang: 'Bronze & Oracle Bones / 青铜与甲骨',
  zhou: 'Mandate of Heaven & Philosophy / 天命与诸子',
  qin: 'Unification by Law / 以法统一',
  han: 'Silk Road & Statecraft / 丝路与治国',
  'three-kingdoms': 'Heroes of a Divided Realm / 分裂中的英雄时代',
  jin: 'Elegance Amid Turbulence / 乱世中的文雅',
  sui: 'Reunifying the Empire / 重新统一',
  tang: 'The Golden Age of China / 中国文化的黄金时代',
  song: 'Refinement & Innovation / 精致与创新',
  yuan: 'Empire of the Steppe / 草原帝国',
  ming: 'Porcelain & Voyages / 瓷器与远航',
  qing: 'Court Splendor & Change / 宫廷辉煌与变局',
};

const contributionMap = {
  xia: { item: 'Flood Control & Early Statecraft / 治水与早期国家', icon: 'waves' },
  shang: { item: 'Oracle Bone Script & Bronze Ritual Art / 甲骨文与青铜礼器', icon: 'scroll' },
  zhou: { item: 'Mandate of Heaven & Hundred Schools / 天命与百家争鸣', icon: 'book' },
  qin: { item: 'Standardization & Imperial Blueprint / 统一标准与帝国蓝图', icon: 'ruler' },
  han: { item: 'Silk Road Networks & Confucian Governance / 丝路网络与儒家治理', icon: 'route' },
  'three-kingdoms': { item: 'Strategy Lore & Cultural Memory / 谋略叙事与文化记忆', icon: 'swords' },
  jin: { item: 'Calligraphy & Literati Aesthetics / 书法与士人审美', icon: 'pen' },
  sui: { item: 'Grand Canal & Administrative Rebuild / 大运河与行政重建', icon: 'bridge' },
  tang: { item: 'Poetry & Woodblock Printing / 诗歌与雕版印刷', icon: 'feather' },
  song: { item: 'Neo-Confucian Thought & Urban Culture / 理学与城市文化', icon: 'lamp' },
  yuan: { item: 'Cross-Continental Exchange / 跨欧亚交流', icon: 'globe' },
  ming: { item: 'Blue-and-White Porcelain & Maritime Reach / 青花瓷与海上远航', icon: 'anchor' },
  qing: { item: 'Court Arts & Multiethnic Administration / 宫廷艺术与多民族治理', icon: 'crown' },
};

const preferredOrder = [
  'xia',
  'shang',
  'zhou',
  'qin',
  'han',
  'three-kingdoms',
  'jin',
  'sui',
  'tang',
  'song',
  'yuan',
  'ming',
  'qing',
];

const emperorChineseNameByDynasty = {
  xia: ['禹', '启', '太康', '仲康', '相', '少康', '杼', '槐', '芒', '泄', '不降', '扃', '廑', '孔甲', '皋', '发', '桀'],
  shang: ['商汤', '外丙', '仲壬', '太甲', '沃丁', '太庚', '小甲', '雍己', '太戊', '仲丁', '外壬', '河亶甲', '祖乙', '祖辛', '沃甲', '祖丁', '南庚', '阳甲', '盘庚', '小辛', '小乙', '武丁', '祖庚', '祖甲', '廪辛', '庚丁', '武乙', '文丁', '帝乙', '帝辛'],
  zhou: ['周武王', '周成王', '周康王', '周昭王', '周穆王', '周共王', '周懿王', '周孝王', '周夷王', '周厉王', '共和行政', '周宣王', '周幽王', '周平王', '周桓王', '周庄王', '周釐王', '周惠王', '周襄王', '周顷王', '周匡王', '周定王', '周简王', '周灵王', '周景王', '周悼王', '周敬王', '周元王', '周贞定王', '周哀王', '周思王', '周考王', '周威烈王', '周安王', '周烈王', '周显王', '周慎靓王', '周赧王'],
  qin: ['嬴政', '胡亥', '子婴'],
  han: [
    '刘邦', '刘盈', '吕雉（临朝）', '刘恒', '刘启', '刘彻', '刘弗陵', '刘询', '刘奭', '刘骜', '刘欣', '刘衎', '孺子婴',
    '刘秀', '刘庄', '刘炟', '刘肇', '刘隆', '刘祜', '刘保', '刘炳', '刘缵', '刘志', '刘宏', '刘辩', '刘协',
  ],
  'three-kingdoms': ['曹丕', '曹叡', '曹芳', '曹髦', '曹奂', '刘备', '刘禅', '孙权', '孙亮', '孙休', '孙皓'],
  jin: ['司马炎', '司马衷', '司马炽', '司马邺', '司马睿', '司马绍', '司马衍', '司马岳', '司马聃', '司马丕', '司马奕', '司马昱', '司马曜', '司马德宗', '司马德文'],
  sui: ['杨坚', '杨广', '杨浩', '杨侑', '杨侗'],
  tang: ['李渊', '李世民', '李治', '李显', '李旦', '武曌', '李显', '李重茂', '李旦', '李隆基', '李亨', '李豫', '李适', '李诵', '李纯', '李恒', '李湛', '李昂', '李瀍', '李忱', '李漼', '李儇', '李晔', '李柷'],
  song: ['赵匡胤', '赵炅', '赵恒', '赵祯', '赵曙', '赵顼', '赵煦', '赵佶', '赵桓', '赵构', '赵昚', '赵惇', '赵扩', '赵昀', '赵禥', '赵㬎', '赵昰', '赵昺'],
  yuan: ['忽必烈', '铁穆耳', '海山', '爱育黎拔力八达', '硕德八剌', '也孙铁木儿', '阿速吉八', '图帖睦尔', '和世㻋', '懿璘质班', '妥懽贴睦尔'],
  ming: ['朱元璋', '朱允炆', '朱棣', '朱高炽', '朱瞻基', '朱祁镇', '朱祁钰', '朱见深', '朱祐樘', '朱厚照', '朱厚熜', '朱载垕', '朱翊钧', '朱常洛', '朱由校', '朱由检'],
  qing: ['努尔哈赤', '皇太极', '福临', '玄烨', '胤禛', '弘历', '颙琰', '旻宁', '奕詝', '载淳', '载湉', '溥仪'],
};

const orderMap = Object.fromEntries(preferredOrder.map((id, index) => [id, index]));

const wantedDynasties = dynastiesRaw
  .filter((item) => orderMap[item.id] !== undefined)
  .sort((a, b) => orderMap[a.id] - orderMap[b.id]);

export const dynasties = wantedDynasties.map((item) => {
  const rawName = String(item?.name ?? '');
  const rawChineseName = String(item?.chineseName ?? '');
  const normalizedName = rawName.replace(' Dynasty', '').replace(' Period', '').toUpperCase();
  const normalizedChineseName = rawChineseName.replace('朝', '').replace('时期', '');
  const fallbackLegacy =
    item?.achievements?.[0] ??
    item?.description ??
    'An era remembered for its lasting imprint on language, governance, and culture.';

  const fullEmperors = fullEmperorsByDynasty[item.id] ?? [];
  const zhNames = emperorChineseNameByDynasty[item.id] ?? [];
  return {
  id: item.id,
  province: 'General',

  // --- Standard fields (snake_case) for History module ---
  name_en: normalizedName,
  name_cn: rawChineseName,
  years: item.period,
  tagline: taglineMap[item.id] ?? 'A Chapter in the Long River of Time / 历史长河中的一章',
  worldContext: worldContextMap[item.id] ?? 'A pivotal era in East Asia / 东亚历史中的关键时期',
  contribution: contributionMap[item.id] ?? { item: 'Cultural Continuity / 文化延续', icon: 'sparkle' },
  emperors:
    (fullEmperors.length > 0
      ? fullEmperors.map((e, idx) => ({
          ...e,
          nameZh: e.nameZh ?? zhNames[idx],
        }))
      : null) ??
    (item.notableEmperors ?? []).map((e) => ({
      name: e.name,
      nameZh: e.chineseName,
      achievement: e.accomplishments,
      reign: e.reign,
    })),
  legacy: fallbackLegacy,
  legacySummary:
    {
      xia: 'Understanding the earliest point of Chinese civilization through flood control, state formation, and Xia traditions. / 从治水、早期国家与夏文化传说，理解中国文明起点。',
      shang: 'Oracle bones, bronze ritual vessels, and royal power defined an early civilizational peak. / 甲骨文、青铜礼器与王权制度，构成早期文明高峰。',
      zhou: 'Ritual order and the Hundred Schools laid the framework for Chinese intellectual history. / 礼乐制度与百家争鸣，奠定中国思想史的关键框架。',
      qin: 'Standardized writing, weights, and roads formed the blueprint of the Chinese state. / 统一文字、度量衡与车轨，是中国国家形态的重要奠基。',
      han: 'The Silk Road, county administration, and Confucian order shaped the Han cultural core. / 丝绸之路、郡县治理与儒家秩序，形成汉文化骨架。',
      'three-kingdoms': 'A fragmented age that produced strategic legends, hero narratives, and lasting memory. / 分裂时代孕育战略叙事、英雄谱系和文化记忆。',
      jin: 'North-south movement and aristocratic culture matured calligraphy and literati taste. / 南北流动与士族文化，让书法与文人审美更加成熟。',
      sui: 'The Grand Canal and reunification rebuilt imperial transport and administration. / 大运河与重新统一，重建帝国交通与行政骨架。',
      tang: 'Openness, prosperity, poetry, and urban life formed a high point of Chinese culture. / 开放、繁荣、诗歌与城市文化，共同构成中国文化高光时刻。',
      song: 'Neo-Confucian thought, city life, commerce, and refined objects reached new depth. / 理学、城市生活、商业与器物审美达到高度精细化。',
      yuan: 'Cross-Eurasian exchange deepened China’s connection with the wider steppe world. / 跨欧亚交流加强，中国与草原世界联结更紧密。',
      ming: 'Porcelain, maritime trade, and court order shaped the late imperial image. / 瓷器、海贸与宫廷秩序，塑造晚期帝国形象。',
      qing: 'A multiethnic imperial structure, court arts, and modern pressures coexisted. / 多民族国家结构、宫廷艺术与近代转型并存。',
    }[item.id] ?? fallbackLegacy,
  colorTheme: colorThemeMap[item.id] ?? '#E2B05E',

  // --- Backward-compatible fields used by current UI ---
  nameEn: normalizedName,
  nameCn: normalizedChineseName,
  period: item.period,
  emperor: item.notableEmperors?.[0]?.name ?? item.founder ?? 'N/A',
  bgColor: bgColorMap[item.id] ?? '#2F3237',
  imagePrompt: dynastyImagePrompts[item.id] ?? `Authentic Chinese ${item.name} artifact, unmistakably China, museum still life, no Japanese, no Korean, no Western elements.`,
  image: `https://source.unsplash.com/1600x1000/?${encodeURIComponent(
    dynastyKeywordMap[item.id] ?? `${item.name}, Chinese artifacts, museum`
  )}`,
  imagePlaceholderText: `Image of ${item.name}`,
  imageAsset: dynastyAssetMap[item.id] ?? null,
  imageSource: getImageSource(dynastyAssetMap[item.id] ?? null),
  };
});

