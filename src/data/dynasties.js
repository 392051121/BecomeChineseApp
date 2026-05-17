import dynastiesRaw from './dynasties.json';
import { fullEmperorsByDynasty } from './fullEmperors';
import { dynastyImagePrompts, getImageSource } from './imagePrompts';
import { getDynastyPeople, getDynastyRecipes, provinceDynastyRelations } from './relations';

const provinceMap = {
  xia: 'Henan',
  shang: 'Henan',
  zhou: 'Shaanxi',
  qin: 'Shaanxi',
  han: 'Shaanxi',
  'three-kingdoms': 'General',
  jin: 'General',
  sui: 'Shaanxi',
  tang: 'Shaanxi',
  song: 'Henan',
  yuan: 'Inner Mongolia',
  ming: 'Beijing',
  qing: 'Beijing',
};

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
  tang: '#E2B05E',
  song: '#6B8A94',
  yuan: '#5E6B7A',
  ming: '#9C3A2B',
  qing: '#2E6C7A',
};

const dynastyAssetMap = {
  xia: 'xia.jpg',
  shang: 'shang.jpg',
  zhou: 'zhou.jpg',
  qin: 'qin.jpg',
  han: 'han.jpg',
  'three-kingdoms': 'three-kingdoms.jpg',
  jin: 'jin.jpg',
  sui: 'sui.jpg',
  tang: 'tang.jpg',
  song: 'song.jpg',
  yuan: 'yuan.jpg',
  ming: 'ming.jpg',
  qing: 'qing.jpg',
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
  han: 'Silk Road opening / 丝绸之路开启；Han Dynasty roughly parallels the late Roman Republic to the early Roman Empire, when long-distance trade and imperial administration reshaped Eurasia. / 汉代大致对应罗马共和国晚期至罗马帝国早期，欧亚长距离贸易与帝国行政体系同步重塑世界。',
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

const preferredOrder = ['xia', 'shang', 'zhou', 'qin', 'han', 'three-kingdoms', 'jin', 'sui', 'tang', 'song', 'yuan', 'ming', 'qing'];
const emperorChineseNameByDynasty = {
  xia: ['禹', '启', '太康', '仲康', '相', '少康', '杼', '槐', '芒', '泄', '不降', '扃', '廑', '孔甲', '皋', '发', '桀'],
  shang: ['商汤', '外丙', '仲壬', '太甲', '沃丁', '太庚', '小甲', '雍己', '太戊', '仲丁', '外壬', '河亶甲', '祖乙', '祖辛', '沃甲', '祖丁', '南庚', '阳甲', '盘庚', '小辛', '小乙', '武丁', '祖庚', '祖甲', '廪辛', '庚丁', '武乙', '文丁', '帝乙', '帝辛'],
  zhou: ['周武王', '周成王', '周康王', '周昭王', '周穆王', '周共王', '周懿王', '周孝王', '周夷王', '周厉王', '共和行政', '周宣王', '周幽王', '周平王', '周桓王', '周庄王', '周釐王', '周惠王', '周襄王', '周顷王', '周匡王', '周定王', '周简王', '周灵王', '周景王', '周悼王', '周敬王', '周元王', '周贞定王', '周哀王', '周思王', '周考王', '周威烈王', '周安王', '周烈王', '周显王', '周慎靓王', '周赧王'],
  qin: ['嬴政', '胡亥', '子婴'],
  han: ['刘邦', '刘盈', '吕雉（临朝）', '刘恒', '刘启', '刘彻', '刘弗陵', '刘询', '刘奭', '刘骜', '刘欣', '刘衎', '孺子婴', '刘秀', '刘庄', '刘炟', '刘肇', '刘隆', '刘祜', '刘保', '刘炳', '刘缵', '刘志', '刘宏', '刘辩', '刘协'],
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
const wantedDynasties = dynastiesRaw.filter((item) => orderMap[item.id] !== undefined).sort((a, b) => orderMap[a.id] - orderMap[b.id]);

// Parse years from period string
function parseYears(period) {
  if (!period) return { startYear: null, endYear: null };
  const match = period.match(/(\d+)\s*(?:BC|BCE)?\s*[-–]\s*(\d+)\s*(?:BC|BCE)?/i);
  if (match) {
    return { startYear: parseInt(match[1]), endYear: parseInt(match[2]) };
  }
  return { startYear: null, endYear: null };
}

// Key events by dynasty
const keyEventsMap = {
  xia: ['Yu the Great tames the floods', 'Early state formation', 'Bronze age begins'],
  shang: ['Oracle bone script developed', 'Bronze ritual vessels', 'Anyang capital established'],
  zhou: ['Mandate of Heaven concept', 'Hundred Schools of Thought', 'Spring and Autumn period'],
  qin: ['First unification of China', 'Standardization of writing', 'Great Wall construction begins'],
  han: ['Silk Road opens', 'Confucianism becomes state ideology', 'Paper invention'],
  'three-kingdoms': ['Battle of Red Cliffs', 'Three rival kingdoms', 'Strategic classics written'],
  jin: ['Reunification attempt', 'Calligraphy flourishes', 'Northern migration'],
  sui: ['Grand Canal construction', 'Reunification of China', 'Buddhist expansion'],
  tang: ['Golden age of poetry', 'Silk Road peak', 'Woodblock printing'],
  song: ['Neo-Confucianism', 'Compass and gunpowder', 'Maritime trade expansion'],
  yuan: ['Mongol rule', 'Pax Mongolica', 'Blue and white porcelain'],
  ming: ['Maritime expeditions', 'Forbidden City built', 'Porcelain excellence'],
  qing: ['Territorial expansion', 'Court arts flourish', 'Modern pressures begin'],
};

// Famous people by dynasty
const famousPeopleMap = {
  xia: [{ name: 'Yu the Great', nameCn: '大禹', role: 'Founder, flood control hero' }],
  shang: [
    { name: 'Tang of Shang', nameCn: '商汤', role: 'Dynasty founder' },
    { name: 'Fu Hao', nameCn: '妇好', role: 'Female general, queen' },
  ],
  zhou: [
    { name: 'Confucius', nameCn: '孔子', role: 'Philosopher, educator' },
    { name: 'Laozi', nameCn: '老子', role: 'Daoism founder' },
    { name: 'Mencius', nameCn: '孟子', role: 'Confucian philosopher' },
    { name: 'Sun Tzu', nameCn: '孙子', role: 'Military strategist' },
  ],
  qin: [
    { name: 'Qin Shi Huang', nameCn: '秦始皇', role: 'First Emperor' },
    { name: 'Li Si', nameCn: '李斯', role: 'Prime minister, legalist' },
  ],
  han: [
    { name: 'Sima Qian', nameCn: '司马迁', role: 'Historian, author of Records of the Grand Historian' },
    { name: 'Ban Zhao', nameCn: '班昭', role: 'Female historian, scholar' },
    { name: 'Zhang Qian', nameCn: '张骞', role: 'Explorer, Silk Road pioneer' },
    { name: 'Cai Lun', nameCn: '蔡伦', role: 'Paper inventor' },
  ],
  'three-kingdoms': [
    { name: 'Cao Cao', nameCn: '曹操', role: 'Warlord, poet, strategist' },
    { name: 'Liu Bei', nameCn: '刘备', role: 'Shu founder, benevolent ruler' },
    { name: 'Zhuge Liang', nameCn: '诸葛亮', role: 'Strategist, advisor' },
    { name: 'Guan Yu', nameCn: '关羽', role: 'General, symbol of loyalty' },
  ],
  jin: [
    { name: 'Wang Xizhi', nameCn: '王羲之', role: 'Calligrapher, Sage of Calligraphy' },
    { name: 'Tao Yuanming', nameCn: '陶渊明', role: 'Poet, recluse' },
  ],
  sui: [
    { name: 'Emperor Wen', nameCn: '隋文帝', role: 'Dynasty founder, reformer' },
  ],
  tang: [
    { name: 'Li Bai', nameCn: '李白', role: 'Poet, Immortal of Poetry' },
    { name: 'Du Fu', nameCn: '杜甫', role: 'Poet, Sage of Poetry' },
    { name: 'Wang Wei', nameCn: '王维', role: 'Poet, painter' },
    { name: 'Bai Juyi', nameCn: '白居易', role: 'Poet, accessible verse' },
    { name: 'Wu Zetian', nameCn: '武则天', role: 'Only female emperor' },
    { name: 'Xuanzang', nameCn: '玄奘', role: 'Monk, translator, pilgrim' },
  ],
  song: [
    { name: 'Su Shi', nameCn: '苏轼', role: 'Poet, statesman, artist' },
    { name: 'Ouyang Xiu', nameCn: '欧阳修', role: 'Poet, historian, reformer' },
    { name: 'Zhu Xi', nameCn: '朱熹', role: 'Neo-Confucian philosopher' },
    { name: 'Shen Kuo', nameCn: '沈括', role: 'Polymath, scientist' },
    { name: 'Yue Fei', nameCn: '岳飞', role: 'General, patriot' },
  ],
  yuan: [
    { name: 'Kublai Khan', nameCn: '忽必烈', role: 'Yuan founder' },
    { name: 'Marco Polo', nameCn: '马可波罗', role: 'Venetian traveler' },
  ],
  ming: [
    { name: 'Zheng He', nameCn: '郑和', role: 'Navigator, admiral' },
    { name: 'Wang Yangming', nameCn: '王阳明', role: 'Philosopher' },
    { name: 'Li Shizhen', nameCn: '李时珍', role: 'Physician, pharmacologist' },
    { name: 'Wu Cheng\'en', nameCn: '吴承恩', role: 'Author of Journey to the West' },
  ],
  qing: [
    { name: 'Cao Xueqin', nameCn: '曹雪芹', role: 'Author of Dream of the Red Chamber' },
    { name: 'Kangxi Emperor', nameCn: '康熙帝', role: 'Longest reigning emperor' },
    { name: 'Qianlong Emperor', nameCn: '乾隆帝', role: 'Cultural patron' },
  ],
};

// Cultural artifacts by dynasty
const artifactsMap = {
  xia: [
    { name: 'Erlitou Bronze Vessels', nameCn: '二里头青铜器', desc: 'Early bronze ritual vessels' },
  ],
  shang: [
    { name: 'Oracle Bones', nameCn: '甲骨文', desc: 'Earliest Chinese writing' },
    { name: 'Bronze Ritual Vessels', nameCn: '青铜礼器', desc: 'Taotie motif vessels' },
    { name: 'Simuwu Ding', nameCn: '司母戊鼎', desc: 'Largest ancient bronze vessel' },
  ],
  zhou: [
    { name: 'Bronze Bells', nameCn: '编钟', desc: 'Musical ritual instruments' },
    { name: 'Jade Suits', nameCn: '玉衣', desc: 'Burial garments for nobility' },
  ],
  qin: [
    { name: 'Terracotta Army', nameCn: '兵马俑', desc: 'Thousands of clay soldiers' },
    { name: 'Great Wall', nameCn: '长城', desc: 'Defensive fortification' },
    { name: 'Standardized Coins', nameCn: '秦半两', desc: 'First unified currency' },
  ],
  han: [
    { name: 'Jade Burial Suit', nameCn: '金缕玉衣', desc: 'Liu Sheng\'s burial suit' },
    { name: 'Silk Road Goods', nameCn: '丝路文物', desc: 'Trade artifacts' },
    { name: 'Paper', nameCn: '纸张', desc: 'Cai Lun\'s invention' },
  ],
  'three-kingdoms': [
    { name: 'Red Cliffs Site', nameCn: '赤壁', desc: 'Famous battle location' },
  ],
  jin: [
    { name: 'Lantingji Xu', nameCn: '兰亭序', desc: 'Wang Xizhi\'s calligraphy masterpiece' },
  ],
  sui: [
    { name: 'Grand Canal', nameCn: '大运河', desc: 'World\'s longest canal' },
  ],
  tang: [
    { name: 'Sancai Pottery', nameCn: '唐三彩', desc: 'Three-color glazed ceramics' },
    { name: 'Dunhuang Murals', nameCn: '敦煌壁画', desc: 'Buddhist cave paintings' },
    { name: 'Tang Poetry Collections', nameCn: '唐诗', desc: 'Over 50,000 poems preserved' },
  ],
  song: [
    { name: 'Ru Ware', nameCn: '汝窑', desc: 'Rare celadon porcelain' },
    { name: 'Movable Type', nameCn: '活字印刷', desc: 'Printing innovation' },
    { name: 'Compass', nameCn: '指南针', desc: 'Navigation tool' },
  ],
  yuan: [
    { name: 'Blue and White Porcelain', nameCn: '青花瓷', desc: 'Cobalt glazed ceramics' },
    { name: 'Yuan Drama Scripts', nameCn: '元曲', desc: 'Theater literature' },
  ],
  ming: [
    { name: 'Forbidden City', nameCn: '紫禁城', desc: 'Imperial palace complex' },
    { name: 'Ming Porcelain', nameCn: '明代瓷器', desc: 'Jingdezhen ceramics' },
    { name: 'Yongle Encyclopedia', nameCn: '永乐大典', desc: 'World\'s largest paper encyclopedia' },
  ],
  qing: [
    { name: 'Cloisonné', nameCn: '景泰蓝', desc: 'Enamel metalwork' },
    { name: 'Qing Porcelain', nameCn: '清代瓷器', desc: 'Famille rose, verte' },
    { name: 'Summer Palace', nameCn: '颐和园', desc: 'Imperial garden' },
  ],
};

const featuredDynasties = ['tang', 'han', 'song', 'ming', 'qing'];

export const dynasties = wantedDynasties.map((item, index) => {
  const rawName = String(item?.name ?? '');
  const rawChineseName = String(item?.chineseName ?? '');
  const normalizedName = rawName.replace(' Dynasty', '').replace(' Period', '').toUpperCase();
  const normalizedChineseName = rawChineseName.replace('朝', '').replace('时期', '');
  const fallbackLegacy = item?.achievements?.[0] ?? item?.description ?? 'An era remembered for its lasting imprint on language, governance, and culture.';
  const fullEmperors = fullEmperorsByDynasty[item.id] ?? [];
  const zhNames = emperorChineseNameByDynasty[item.id] ?? [];
  const province_id = provinceMap[item.id] ?? 'General';
  const { startYear, endYear } = parseYears(item.period);
  const isFeatured = featuredDynasties.includes(item.id);

  return {
    id: item.id,
    type: 'dynasty',
    province_id,
    provinceId: province_id,
    province: province_id,
    regionId: province_id === 'Shaanxi' || province_id === 'Henan' ? 'central'
      : province_id === 'Beijing' || province_id === 'Inner Mongolia' ? 'north'
      : 'general',
    related_links: {
      places: [],
      history: [],
      food: [],
    },
    name_en: normalizedName,
    name_cn: rawChineseName,
    nameEn: normalizedName,
    nameCn: rawChineseName,
    subtitleCn: taglineMap[item.id] ?? '历史长河中的一章',
    subtitleEn: 'A chapter in the long river of time',
    summaryCn: item.description ?? fallbackLegacy,
    summaryEn: item.description ?? fallbackLegacy,
    highlights: keyEventsMap[item.id] ?? ['A significant era in Chinese history'],
    years: item.period,
    startYear,
    endYear,
    keyEvents: keyEventsMap[item.id] ?? [],
    famousPeople: famousPeopleMap[item.id] ?? [],
    artifacts: artifactsMap[item.id] ?? [],
    tagline: taglineMap[item.id] ?? 'A Chapter in the Long River of Time / 历史长河中的一章',
    worldContext: worldContextMap[item.id] ?? 'A pivotal era in East Asia / 东亚历史中的关键时期',
    world_parallel: worldContextMap[item.id] ?? 'A pivotal era in East Asia / 东亚历史中的关键时期',
    tags: [item.id, 'history', 'dynasty'],
    relatedIds: [],
    relatedCityIds: Object.entries(provinceDynastyRelations)
      .filter(([, dynasties]) => dynasties.includes(item.id))
      .map(([province]) => province.toLowerCase()),
    relatedPersonIds: getDynastyPeople(item.id),
    relatedRecipeIds: getDynastyRecipes(item.id),
    relatedQuizIds: [],
    contribution: contributionMap[item.id] ?? { item: 'Cultural Continuity / 文化延续', icon: 'sparkle' },
    emperors:
      (fullEmperors.length > 0
        ? fullEmperors.map((e, idx) => ({ ...e, nameZh: e.nameZh ?? zhNames[idx] }))
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
        yuan: "Cross-Eurasian exchange deepened China's connection with the wider steppe world. / 跨欧亚交流加强，中国与草原世界联结更紧密。",
        ming: 'Porcelain, maritime trade, and court order shaped the late imperial image. / 瓷器、海贸与宫廷秩序，塑造晚期帝国形象。',
        qing: 'A multiethnic imperial structure, court arts, and modern pressures coexisted. / 多民族国家结构、宫廷艺术与近代转型并存。',
      }[item.id] ?? fallbackLegacy,
    culturalStory: fallbackLegacy,
    cultural_story: fallbackLegacy,
    colorTheme: colorThemeMap[item.id] ?? '#E2B05E',
    nameEn: normalizedName,
    nameCn: normalizedChineseName,
    period: item.period,
    emperor: item.notableEmperors?.[0]?.name ?? item.founder ?? 'N/A',
    bgColor: bgColorMap[item.id] ?? '#2F3237',
    isFeatured,
    sortOrder: isFeatured ? featuredDynasties.indexOf(item.id) : 100 + index,
    imagePrompt: dynastyImagePrompts[item.id] ?? `Authentic Chinese ${item.name} artifact, unmistakably China, museum still life, no Japanese, no Korean, no Western elements.`,
    image: dynastyAssetMap[item.id] ? undefined : `https://picsum.photos/seed/${encodeURIComponent(item.id || item.name)}/1600/1000`,
    imagePlaceholderText: `Image of ${item.name}`,
    imageAsset: dynastyAssetMap[item.id] ?? null,
    imageSource: getImageSource(dynastyAssetMap[item.id] ?? null),
  };
});
