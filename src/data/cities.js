import citiesRaw from './cities.json';
import { cityImagePrompts, getImageSource } from './imagePrompts';

const vibeMap = {
  beijing: 'Imperial order and a strong capital rhythm / 首都的礼制感与中轴秩序',
  shanghai: 'Haipai culture, commerce, and urban renewal / 海派文化、商业活力与城市更新并存',
  xian: 'A deep historical capital with city-wall order / 中国古都的时间深度与城墙秩序',
  chengdu: 'Tea houses, Sichuan flavors, and a relaxed pace / 茶馆、川味与松弛日常构成的生活节奏',
  guangzhou: 'Lingnan food culture, trade tradition, and pragmatism / 岭南饮食、商贸传统与务实市民气质',
  hangzhou: 'West Lake elegance with Song-style aesthetics / 西湖、宋韵与江南审美融成的柔和气质',
  suzhou: 'Classical gardens, canals, and Jiangnan aesthetics / 园林、运河与江南文人审美的集中体现',
};

const cityPinyinMap = {
  beijing: 'Běijīng',
  shanghai: 'Shànghǎi',
  xian: "Xī'ān",
  chengdu: 'Chéngdū',
  guilin: 'Guìlín',
  hangzhou: 'Hángzhōu',
  suzhou: 'Sūzhōu',
  lijiang: 'Lìjiāng',
  nanjing: 'Nánjīng',
  shenzhen: 'Shēnzhèn',
  guangzhou: 'Guǎngzhōu',
  tianjin: 'Tiānjīn',
  chongqing: 'Chóngqìng',
  wuhan: 'Wǔhàn',
  dalian: 'Dàlián',
  qingdao: 'Qīngdǎo',
  xiamen: 'Xiàmén',
  harbin: "Hā'ěrbīn",
  kunming: 'Kūnmíng',
  lhasa: 'Lāsà',
};

const cityTaglineMap = {
  beijing: '中轴线、宫城与都城秩序',
  shanghai: '海派生活、商贸活力与城市更新',
  xian: '十三朝古都与长安记忆',
  chengdu: '茶馆、川菜与慢生活的日常中心',
  guilin: '山水甲天下的喀斯特画卷',
  hangzhou: '西湖与宋韵交织的江南名城',
  suzhou: '园林、丝绸与运河构成的江南样本',
  lijiang: '古城、雪山与滇西风物相连',
  nanjing: '六朝古都与秦淮灯影',
  shenzhen: '改革开放前沿的现代中国城市',
  guangzhou: '岭南饮食、商贸传统与珠江风貌',
  tianjin: '海河两岸的近代城市记忆',
  chongqing: '山城地形与夜色生活并存',
  wuhan: '江汉相会、湖泊环绕的中部都会',
  dalian: '海岸线与滨城风貌',
  qingdao: '海港、啤酒与近代城市肌理',
  xiamen: '岛城、侨乡与闽南生活气息',
  harbin: '冰雪季节中的北国城市',
  kunming: '四季如春的高原春城',
  lhasa: '高原、宗教与雪域风光交汇',
};

const localSecretMap = {
  beijing: '清晨的胡同最能看见北京的日常：晨练、早茶、修车摊和慢慢醒来的院落。',
  shanghai: '上海不只看外滩，也要钻进弄堂与老街，才能看见海派生活的细腻层次。',
  xian: '城墙骑行最能感受西安的空间感：一边是古都，一边是当代生活。',
  chengdu: '人民公园的盖碗茶、摆龙门阵和麻将在一起，就是成都的生活语法。',
  guilin: '桂林的精华不止山水照片，晨雾中的漓江才是中国山水审美的现场。',
  hangzhou: '西湖最适合在傍晚走，苏堤、茶山、湖面一起慢下来。',
  suzhou: '苏州园林最好早去，人在园中走一圈，就会明白什么叫“移步换景”。',
  lijiang: '丽江古城适合早晨走，石板路、流水和木屋会比白天更安静。',
  nanjing: '秦淮河夜色很有南京味道，但真正的南京气质也藏在老城巷口和早餐摊。',
  shenzhen: '深圳的文化不是古旧感，而是改革开放后形成的现代城市速度。',
  guangzhou: '广州的早茶不是吃一顿饭，而是整个城市的人情和节奏。',
  tianjin: '天津的乐趣在河边散步、老租界街区和市井幽默。',
  chongqing: '重庆的立体地形决定了它的城市性格：上上下下、热烈直接。',
  wuhan: '武汉最适合看湖：东湖的开阔感能把这座城市的气质讲清楚。',
  dalian: '大连的海岸线适合慢走，海风、广场和近代街景连成一体。',
  qingdao: '青岛的城市记忆里有海港、啤酒和一段清晰的近代城市历史。',
  xiamen: '厦门最有味道的是老城、海岛和闽南日常混在一起的松弛感。',
  harbin: '哈尔滨的冬天不是缺点，而是这座北方城市最重要的文化季节。',
  kunming: '昆明的好处是四季不极端，生活节奏也因此更平稳。',
  lhasa: '拉萨的节奏要放慢，才能更好理解高原城市的生活方式与信仰氛围。',
};
const cityAssetMap = {
  beijing: 'beijing.jpg',
  shanghai: 'shanghai.jpg',
  xian: 'xian.jpg',
  chengdu: 'chengdu.jpg',
  guilin: 'guilin.jpg',
  hangzhou: 'hangzhou.jpg',
  suzhou: 'suzhou.jpg',
  lijiang: 'lijiang.jpg',
  nanjing: 'nanjing.jpg',
  shenzhen: 'shenzhen.jpg',
  guangzhou: 'guangzhou.jpg',
  tianjin: 'tianjin.jpg',
  chongqing: 'chongqing.jpg',
  wuhan: 'wuhan.jpg',
  dalian: 'dalian.jpg',
  qingdao: 'qingdao.jpg',
  xiamen: 'xiamen.jpg',
  harbin: 'harbin.jpg',
  kunming: 'kunming.jpg',
  lhasa: 'lhasa.jpg',
};
const cityKeywordMap = {
  beijing: 'Beijing, Forbidden City, palace architecture, China, traditional roof, courtyard',
  shanghai: 'Shanghai, The Bund, Lujiazui, Oriental Pearl Tower, skyline, night city lights',
  xian: "Xi'an, Terracotta Army, Terracotta Warriors, ancient city wall, Shaanxi, China",
  chengdu: 'Chengdu, giant panda, Sichuan, teahouse, Jinli street, China',
  hangzhou: 'Hangzhou, West Lake, Leifeng Pagoda, lotus, lakeside, China',
  guilin: 'Guilin, Li River, karst mountains, bamboo raft, misty landscape, China',
  suzhou: "Suzhou, classical Chinese garden, Humble Administrator's Garden, canals, Jiangnan",
  lijiang: 'Lijiang, ancient town, Yunnan, Jade Dragon Snow Mountain, traditional streets, China',
  nanjing: 'Nanjing, Sun Yat-sen Mausoleum, Qinhuai River, city wall, Purple Mountain, China',
  shenzhen: 'Shenzhen, modern skyline, tech city, Shenzhen Bay, China, contemporary architecture',
  guangzhou: 'Guangzhou, Canton Tower, Pearl River, skyline, Lingnan architecture, China',
  tianjin: 'Tianjin, Haihe River, Tianjin Eye, colonial architecture, China',
  chongqing: 'Chongqing, Hongya Cave, night city, Yangtze River, mountain city, China',
  wuhan: 'Wuhan, Yellow Crane Tower, Yangtze River bridge, skyline, China',
  dalian: 'Dalian, coastal city, Xinghai Square, seaside, China',
  qingdao: 'Qingdao, seaside, Zhanqiao Pier, German architecture, Tsingtao, China',
  xiamen: 'Xiamen, Gulangyu island, coastal city, Fujian, China',
  harbin: 'Harbin, Saint Sophia Cathedral, ice festival, winter city, China',
  kunming: 'Kunming, Stone Forest, Dianchi Lake, Yunnan, China',
  lhasa: 'Lhasa, Potala Palace, Jokhang Temple, Tibet, China',
};

export const cities = citiesRaw
  .slice()
  .sort((a, b) => {
    const featuredOrder = [
      'xian',
      'chengdu',
      'shanghai',
      'beijing',
      'hangzhou',
      'guilin',
      'suzhou',
      'lijiang',
    ];
    const orderMap = Object.fromEntries(featuredOrder.map((id, index) => [id, index]));
    const aOrder = orderMap[a.id];
    const bOrder = orderMap[b.id];
    const aFeatured = aOrder !== undefined;
    const bFeatured = bOrder !== undefined;
    if (aFeatured && bFeatured) return aOrder - bOrder;
    if (aFeatured) return -1;
    if (bFeatured) return 1;
    return String(a.name).localeCompare(String(b.name));
  })
  .map((item) => ({
    id: item.id,

    // --- Standard fields (snake_case) for Travel module ---
    name_en: item.name,
    name_cn: item.chineseName,
    pinyin: cityPinyinMap[item.id] ?? item.name,
    tagline: cityTaglineMap[item.id] ?? 'A Chinese city worth reading slowly / 一座值得慢慢读的中国城市',
    travelTips: {
      bestSeason: item.bestTimeToVisit ?? 'Any season works, but it is best read through China’s solar terms and local landscape / 四季皆可，但更适合结合中国节气与地方风物来读。',
      localVibe:
        vibeMap[item.id] ??
        item.description ??
        'Landmarks, local flavors, and everyday streets together shape a Chinese city’s character / 中国城市的地标、地方风味与日常街巷共同构成它的气质。',
    },
    attractions: (item.attractions ?? []).map((a) => ({
      name: a.name,
      desc: a.description,
    })),
    localSecret: localSecretMap[item.id] ?? 'Leave the main street and step into the lanes; that is often where a Chinese city’s everyday rhythm becomes clearest / 离开主街，走进巷子，往往更能看见中国城市的日常层次。',
    province:
      ({
        beijing: 'Beijing',
        shanghai: 'Shanghai',
        xian: 'Shaanxi',
        chengdu: 'Sichuan',
        guilin: 'Guangxi',
        hangzhou: 'Zhejiang',
        suzhou: 'Jiangsu',
        lijiang: 'Yunnan',
        nanjing: 'Jiangsu',
        shenzhen: 'Guangdong',
        guangzhou: 'Guangdong',
        tianjin: 'Tianjin',
        chongqing: 'Chongqing',
        wuhan: 'Hubei',
        dalian: 'Liaoning',
        qingdao: 'Shandong',
        xiamen: 'Fujian',
        harbin: 'Heilongjiang',
        kunming: 'Yunnan',
        lhasa: 'Tibet',
      })[item.id] ?? 'General',

    // --- Backward-compatible fields used by current UI ---
    nameEn: item.name,
    namePinyin: item.name,
    nameCn: item.chineseName,
    imagePrompt: cityImagePrompts[item.id] ?? `Authentic Chinese ${item.name} cityscape, unmistakably China, clean mobile composition, no Japanese, no Korean, no Western elements.`,
    image: `https://source.unsplash.com/1600x1000/?${encodeURIComponent(
      cityKeywordMap[item.id] ?? `${item.name}, landmark, cityscape, China`
    )}`,
    imagePlaceholderText: `Image of ${item.name}`,
    imageAsset: cityAssetMap[item.id] ?? null,
    imageSource: getImageSource(cityAssetMap[item.id] ?? null),
    // Keep Travel screen concise fields
    mustSee: (item.attractions ?? []).map((a) => a.name).join(', '),
    localTaste: (item.localFood ?? []).join(', '),
    vibe: vibeMap[item.id] ?? item.description,
    // Keep full source data for future pages/details
    description: item.description,
    chineseDescription: item.chineseDescription,
    bestTimeToVisit: item.bestTimeToVisit,
    localFood: item.localFood ?? [],
    attractions: item.attractions ?? [],
  }));

