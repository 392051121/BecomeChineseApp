# BecomeChineseApp 内容数据结构模板

这份模板用于统一管理应用中的 **城市、菜谱、朝代、人物、节气、问答** 等内容，方便后续扩充、联动和推荐。

---

## 一、设计原则

1. **统一字段**：不同内容类型尽量共享核心字段，减少后续维护成本。
2. **短内容 + 强关联**：每条内容不必很长，但必须能跳转到相关内容。
3. **可收藏、可推荐、可统计**：每条内容都要能进入收藏、进度和路径系统。
4. **支持中英双语**：当前项目已经有英文展示倾向，建议结构从一开始就预留双语字段。

---

## 二、通用基础字段

适用于所有内容类型的基础字段。

```js
{
  id: 'unique-id',
  type: 'city' | 'recipe' | 'dynasty' | 'person' | 'festival' | 'quiz',
  nameCn: '中文名',
  nameEn: 'English Name',
  subtitleCn: '一句中文副标题',
  subtitleEn: 'Short English subtitle',
  summaryCn: '简短中文介绍',
  summaryEn: 'Short English summary',
  tags: ['tag1', 'tag2'],
  provinceId: 'beijing',
  regionId: 'north',
  coverImage: 'asset-or-url',
  isFeatured: false,
  sortOrder: 0,
  relatedIds: ['other-id-1', 'other-id-2'],
  createdAt: '2026-04-26T00:00:00.000Z',
  updatedAt: '2026-04-26T00:00:00.000Z'
}
```

---

## 三、城市数据模板

城市是地图和路径的基础节点。

```js
{
  id: 'beijing',
  type: 'city',
  nameCn: '北京',
  nameEn: 'Beijing',
  subtitleCn: '帝都与中轴线',
  subtitleEn: 'Imperial capital and central axis',
  summaryCn: '北京是中国历史与现代交汇的重要城市。',
  summaryEn: 'Beijing is a city where history and modern life meet.',
  provinceId: 'beijing',
  regionId: 'north',
  tags: ['capital', 'history', 'imperial'],
  highlights: [
    '故宫',
    '胡同文化',
    '京味饮食'
  ],
  relatedRecipeIds: ['peking-duck'],
  relatedDynastyIds: ['ming', 'qing'],
  relatedPersonIds: ['qianlong'],
  mapPosition: {
    lat: 39.9042,
    lng: 116.4074
  },
  difficulty: 'easy',
  isFeatured: true
}
```

### 推荐字段说明
- `highlights`：3~5 个最值得记住的点
- `relatedRecipeIds`：和城市相关的菜谱
- `relatedDynastyIds`：和城市关联的历史朝代
- `relatedPersonIds`：与城市有关的人物
- `mapPosition`：用于地图展示和标记

---

## 四、菜谱数据模板

菜谱适合承载地域文化和饮食知识。

```js
{
  id: 'peking-duck',
  type: 'recipe',
  nameCn: '北京烤鸭',
  nameEn: 'Peking Duck',
  subtitleCn: '京味代表菜',
  subtitleEn: 'A signature Beijing dish',
  summaryCn: '北京烤鸭是最具代表性的中国菜之一。',
  summaryEn: 'Peking duck is one of the most iconic Chinese dishes.',
  provinceId: 'beijing',
  regionId: 'north',
  tags: ['roast', 'classic', 'beijing'],
  tasteProfile: ['crispy', 'savory'],
  ingredients: ['鸭子', '面饼', '葱丝', '甜面酱'],
  steps: [
    '处理鸭胚',
    '风干',
    '烤制',
    '卷饼食用'
  ],
  relatedCityIds: ['beijing'],
  relatedFestivalIds: ['spring-festival'],
  relatedQuizIds: ['quiz-001', 'quiz-002'],
  difficulty: 'medium',
  isFeatured: true
}
```

### 推荐字段说明
- `ingredients`：突出食材文化
- `steps`：不用太长，保持简洁
- `tasteProfile`：方便做推荐和筛选

---

## 五、朝代数据模板

朝代适合做时间线和历史理解。

```js
{
  id: 'ming',
  type: 'dynasty',
  nameCn: '明朝',
  nameEn: 'Ming Dynasty',
  subtitleCn: '重建与秩序',
  subtitleEn: 'Rebuilding order',
  summaryCn: '明朝在政治、城市和文化上都有重要影响。',
  summaryEn: 'The Ming Dynasty had major influence on politics, cities, and culture.',
  startYear: 1368,
  endYear: 1644,
  tags: ['imperial', 'classical', 'timelime'],
  keyEvents: [
    '朱元璋建国',
    '郑和下西洋',
    '北京城发展'
  ],
  relatedCityIds: ['beijing', 'nanjing'],
  relatedPersonIds: ['zhenghe', 'zhu-yuanzhang'],
  relatedRecipeIds: ['ming-style-dish'],
  isFeatured: true
}
```

---

## 六、人物数据模板

人物用于增强记忆点和故事性。

```js
{
  id: 'zhenghe',
  type: 'person',
  nameCn: '郑和',
  nameEn: 'Zheng He',
  subtitleCn: '下西洋的航海家',
  subtitleEn: 'The admiral of the Ming voyages',
  summaryCn: '郑和是中国古代航海史上的重要人物。',
  summaryEn: 'Zheng He was a major figure in China’s maritime history.',
  dynastyId: 'ming',
  provinceId: 'yunnan',
  tags: ['explorer', 'maritime', 'history'],
  achievements: [
    '七下西洋',
    '推动海上交流'
  ],
  relatedCityIds: ['nanjing'],
  relatedDynastyIds: ['ming'],
  relatedQuizIds: ['quiz-1001'],
  isFeatured: false
}
```

---

## 七、节气/节日数据模板

节气和节日适合做季节性首页内容与问答联动。

```js
{
  id: 'lixia',
  type: 'festival',
  nameCn: '立夏',
  nameEn: 'Start of Summer',
  subtitleCn: '夏日的开始',
  subtitleEn: 'The beginning of summer',
  summaryCn: '立夏标志着夏季正式开始。',
  summaryEn: 'The Start of Summer marks the beginning of the summer season.',
  dateRule: 'solar-term',
  tags: ['season', 'festival', 'climate'],
  recommendedFoodIds: ['dumplings', 'cold-noodles'],
  relatedQuizIds: ['quiz-2001'],
  relatedCityIds: ['hangzhou'],
  isFeatured: true
}
```

---

## 八、问答数据模板

问答是留存核心，建议结构尽量完整。

```js
{
  id: 'quiz-001',
  type: 'quiz',
  questionCn: '北京烤鸭最常见的食用方式是什么？',
  questionEn: 'What is the common way to eat Peking duck?',
  optionsCn: ['直接吃', '卷饼吃', '泡汤吃', '蒸着吃'],
  optionsEn: ['Eat plain', 'Wrap in pancakes', 'Eat in soup', 'Steam it'],
  correctIndex: 1,
  explanationCn: '北京烤鸭通常搭配面饼、葱丝和甜面酱卷起来吃。',
  explanationEn: 'Peking duck is usually wrapped in pancakes with scallions and sauce.',
  topic: 'food',
  difficulty: 'easy',
  relatedItemIds: ['peking-duck', 'beijing'],
  tags: ['food', 'beijing', 'daily'],
  isDaily: true
}
```

### 问答推荐字段
- `topic`：便于分类和筛选
- `relatedItemIds`：实现问答与内容页联动
- `isDaily`：标记是否进入每日题池

---

## 九、数据关系建议

为了让内容真正联动，建议每条数据至少有 1~3 个关联对象。

### 推荐关系结构
- 城市 → 菜谱、朝代、人物
- 菜谱 → 城市、节气、问答
- 朝代 → 城市、人物、问答
- 人物 → 朝代、城市、问答
- 节气/节日 → 菜谱、城市、问答
- 问答 → 任意相关内容

---

## 十、内容扩充时的最小标准

每新增一条内容，至少满足下面 5 条中的 3 条：

1. 可以被收藏
2. 可以关联其他内容
3. 可以用于问答
4. 可以展示在推荐列表中
5. 可以进入某条路径或专题

如果做不到，说明这条内容可能只是“信息”，还不是“产品内容节点”。

---

## 十一、推荐的目录拆分方式

建议后续在 `src/data/` 下按类型拆分：

```text
src/data/
  cities.js
  recipes.js
  dynasties.js
  people.js
  festivals.js
  quiz.js
```

如果数据量继续变大，可以再升级为 JSON 文件或按专题拆分。

---

## 十二、结论

这套结构的目标不是让每条内容都很长，而是让内容具备：

- 统一性
- 可扩展性
- 可关联性
- 可推荐性
- 可收藏性

只要结构先统一，后面你补内容、做推荐、做路径、做地图联动都会轻松很多。
