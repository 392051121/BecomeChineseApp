# 功能迭代方案

> 生成日期: 2026-04-30
> 项目: BecomeChineseApp
> 目标用户: 欧美用户学习中国文化
> 约束: 无后端依赖、无语音搜索

---

## 一、搜索增强 (Search Enhancement)

### 现状分析
- ✅ 已有 `SearchBar.js` - 基础搜索 + 历史记录
- ✅ 已有 `EnhancedSearchBar.js` - 分类筛选 + 热门搜索 + 语音按钮
- ❌ 缺少拼音搜索支持
- ❌ 缺少搜索结果高亮
- ❌ 语音搜索未实现
- ❌ 模糊匹配较弱

### 方案设计

#### 1.1 拼音搜索支持
**文件**: `src/utils/pinyin.js` (新建)

```javascript
// 方案: 使用 pinyin-pro 库或内置轻量拼音映射
// 支持输入 "beijing" 匹配 "北京"
// 支持输入 "tangchao" 匹配 "唐朝"

功能:
- toPinyin(text) → 拼音字符串
- matchPinyin(query, target) → 匹配结果
- 预生成常用词汇拼音索引 (cities, dynasties, recipes, people)
```

**依赖选择**:
- 方案A: `pinyin-pro` (完整拼音库, ~200KB)
- 方案B: 内置轻量映射 (仅项目词汇, ~10KB) **推荐**

#### 1.2 搜索结果高亮
**文件**: `src/components/SearchHighlight.js` (新建)

```javascript
<HighlightedText
  text="Beijing 北京"
  query="bei"
  highlightStyle={{ backgroundColor: '#FFE066' }}
/>
// 输出: <highlight>Bei</highlight>jing 北京
```

#### 1.3 语音搜索实现
**文件**: `src/hooks/useVoiceSearch.js` (新建)

```javascript
// 使用 expo-speech 的 SpeechRecognition API
// 或集成 @react-native-voice/voice

export function useVoiceSearch() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = async () => { ... };
  const stopListening = () => { ... };

  return { isListening, transcript, startListening, stopListening };
}
```

**依赖**: `expo-speech` 已安装，需添加语音识别能力

#### 1.4 模糊匹配增强
**文件**: `src/utils/fuzzySearch.js` (新建)

```javascript
// 使用 fuse.js 或自定义算法
// 支持:
// - 容错拼写 (bejing → beijing)
// - 首字母匹配 (bj → beijing)
// - 拼音首字母 (tc → tangchao → 唐朝)
```

### 实现优先级
| 功能 | 优先级 | 工作量 | 依赖 |
|------|--------|--------|------|
| 拼音搜索 | P0 | 2天 | 无 |
| 结果高亮 | P0 | 1天 | 无 |
| 模糊匹配 | P1 | 1天 | fuse.js |

---

## 二、离线模式 (Offline Mode)

### 现状分析
- ✅ 已有 `@react-native-community/netinfo` 依赖
- ✅ 数据文件已内置 (cities.js, recipes.js, dynasties.js, people.js, quiz.js)
- ❌ 无离线状态检测
- ❌ 无离线缓存策略
- ❌ 无离线提示UI

### 方案设计

#### 2.1 网络状态管理
**文件**: `src/context/NetworkContext.js` (新建)

```javascript
export function NetworkProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('wifi');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });
    return unsubscribe;
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, connectionType }}>
      {children}
    </NetworkContext.Provider>
  );
}
```

#### 2.2 离线缓存策略
**文件**: `src/utils/offlineCache.js` (新建)

```javascript
// 缓存策略:
// 1. 静态数据: 已内置在 bundle 中，无需缓存
// 2. 用户数据: AsyncStorage 已存储
// 3. 图片缓存: 使用 react-native-fast-image

export const offlineCache = {
  // 预加载关键资源
  async preloadCritical() { ... },

  // 获取缓存状态
  async getCacheStatus() { ... },

  // 清理过期缓存
  async cleanExpired() { ... },
};
```

#### 2.3 离线提示UI
**文件**: `src/components/OfflineBanner.js` (新建)

```javascript
// 顶部横幅提示
<OfflineBanner />
// 显示: "You're offline. Some features may be limited."
// 自动隐藏当网络恢复
```

**文件**: `src/components/OfflineModal.js` (新建)

```javascript
// 全屏离线模式
// 显示可用内容列表
// 显示 "Waiting for connection..." 动画
```

#### 2.4 图片离线缓存
**依赖**: `react-native-fast-image`

```javascript
// 替换 SmartImageBlock 中的 Image 组件
import FastImage from 'react-native-fast-image';

// 预缓存关键图片
FastImage.preload([
  { uri: 'https://...' },
  // ...
]);
```

### 实现优先级
| 功能 | 优先级 | 工作量 | 依赖 |
|------|--------|--------|------|
| 网络状态检测 | P0 | 0.5天 | 已有 |
| 离线Banner | P0 | 0.5天 | 无 |
| 离线Modal | P1 | 1天 | 无 |
| 图片缓存 | P1 | 1天 | fast-image |

---

## 三、推送通知 (Push Notifications)

### 现状分析
- ❌ 无推送通知功能
- ❌ 无提醒系统

### 方案设计

#### 3.1 技术选型
**推荐**: Expo Notifications (`expo-notifications`)

```javascript
// 优势:
// - 跨平台支持 (iOS/Android)
// - 本地通知 + 远程推送
// - 与 Expo 生态集成良好
```

#### 3.2 通知类型设计

| 类型 | 触发条件 | 内容示例 | 频率 |
|------|----------|----------|------|
| 每日问答 | 每日固定时间 | "Ready for today's quiz?" | 1次/天 |
| Streak提醒 | 连续打卡即将中断 | "Don't break your 7-day streak!" | 条件触发 |
| 节日提醒 | 传统节日当天 | "Happy Mid-Autumn Festival! 🌕" | 节日当天 |
| 错题复习 | 错题积累超过5道 | "You have 5 questions to review" | 条件触发 |
| 周总结 | 每周日 | "You learned 12 new things this week!" | 1次/周 |

#### 3.3 通知管理
**文件**: `src/utils/notifications.js` (新建)

```javascript
import * as Notifications from 'expo-notifications';

export const notificationManager = {
  // 请求权限
  async requestPermissions() { ... },

  // 安排每日问答通知
  async scheduleDailyQuiz(hour = 9) { ... },

  // 安排Streak提醒
  async scheduleStreakReminder() { ... },

  // 安排节日通知
  async scheduleFestivalNotifications(festivals) { ... },

  // 取消所有通知
  async cancelAll() { ... },

  // 获取待发送通知
  async getAllScheduled() { ... },
};
```

#### 3.4 通知设置UI
**文件**: `src/screens/NotificationSettingsScreen.js` (新建)

```javascript
// 设置选项:
// - 每日问答提醒: 开/关 + 时间选择
// - Streak提醒: 开/关
// - 节日提醒: 开/关
// - 错题复习提醒: 开/关
// - 周总结: 开/关
```

#### 3.5 通知处理
**文件**: `src/handlers/notificationHandler.js` (新建)

```javascript
// 处理通知点击，导航到对应页面
Notifications.addNotificationReceivedListener(notification => {
  const { type, data } = notification.request.content.data;
  switch (type) {
    case 'daily-quiz':
      navigation.navigate('Seasons', { screen: 'Quiz' });
      break;
    case 'festival':
      navigation.navigate('Seasons', { screen: 'FestivalDetail', params: data });
      break;
    // ...
  }
});
```

### 依赖
```json
{
  "expo-notifications": "~0.20.0",
  "expo-device": "~7.0.0",
  "expo-constants": "~17.0.0"
}
```

### 实现优先级
| 功能 | 优先级 | 工作量 | 依赖 |
|------|--------|--------|------|
| 基础通知框架 | P0 | 1天 | expo-notifications |
| 每日问答提醒 | P0 | 0.5天 | 无 |
| Streak提醒 | P1 | 0.5天 | 无 |
| 节日提醒 | P1 | 1天 | 无 |
| 通知设置UI | P1 | 1天 | 无 |

---

## 四、社交功能 (Social Features)

### 现状分析
- ✅ 已有分享卡片模板 (`ShareCardTemplates.js`)
- ✅ 已有 `expo-sharing` 和 `expo-clipboard`
- ❌ 无分享统计
- ❌ 无好友系统
- ❌ 无排行榜

### 方案设计

#### 4.1 分享功能增强

**文件**: `src/utils/shareManager.js` (新建)

```javascript
export const shareManager = {
  // 分享到社交媒体
  async shareContent(type, data) {
    // type: 'achievement' | 'streak' | 'collection' | 'quiz_result'
    // 生成分享卡片图片
    // 调用原生分享面板
  },

  // 记录分享统计
  async trackShare(type, platform) { ... },

  // 获取分享统计
  async getShareStats() { ... },
};
```

**分享内容类型**:
| 类型 | 内容 | 图片模板 |
|------|------|----------|
| 成就解锁 | Badge图标 + 名称 + 描述 | AchievementShareCard |
| 连续打卡 | 火焰图标 + 天数 + 日历 | StreakShareCard |
| 收藏展示 | 收藏数量 + 代表图片 | CollectionShareCard |
| 问答结果 | 正确率 + 排名 | QuizResultShareCard |
| 升级庆祝 | 新等级 + 进度 | LevelUpShareCard |

#### 4.2 好友系统

**方案: 本地好友码**
```javascript
// 无需后端，生成用户唯一码
// 好友输入码添加，存储在本地 AsyncStorage
// 排行榜基于好友列表

// 实现方式:
// 1. 生成唯一用户码 (基于设备ID或随机)
// 2. 好友码输入 → 存储好友信息到本地
// 3. 排行榜 = 自己 + 好友列表
// 4. 分享好友码给朋友添加

// 限制: 无法实时同步，需手动刷新
```

#### 4.3 排行榜

**文件**: `src/components/Leaderboard.js` (新建)

```javascript
// 排行榜维度:
// - XP 总分
// - 连续打卡天数
// - 本周答题正确率
// - 收藏数量

// 显示:
// - 用户自己的排名 (固定顶部)
// - 好友排名列表
// - 全球排名 (可选)
```

#### 4.4 社交分享集成

**文件**: `src/utils/socialShare.js` (新建)

```javascript
// 集成各平台分享
// - 微信: expo-wechat (需配置)
// - Twitter: 深链接
// - Facebook: 深链接
// - Instagram: 图片分享

export const socialShare = {
  async shareToWeChat(data) { ... },
  async shareToTwitter(data) { ... },
  async shareToFacebook(data) { ... },
  async shareToInstagram(data) { ... },
};
```

### 实现优先级
| 功能 | 优先级 | 工作量 | 依赖 |
|------|--------|--------|------|
| 分享统计 | P0 | 0.5天 | 无 |
| 分享卡片优化 | P0 | 1天 | 无 |
| 本地好友码 | P1 | 2天 | 无 |
| 排行榜 | P1 | 1天 | 无 |

---

## 五、学习路径 (Learning Paths)

### 现状分析
- ✅ 已有推荐系统 (`recommendations.js`)
- ✅ 已有用户兴趣设置 (`OnboardingScreen.js`)
- ❌ 无结构化课程
- ❌ 无进度追踪
- ❌ 无里程碑奖励

### 方案设计

#### 5.1 学习路径设计

**预定义路径**:

| 路径 | 目标 | 课程数 | 时长 |
|------|------|--------|------|
| 中国历史入门 | 了解主要朝代 | 8 | 2周 |
| 美食探索家 | 了解8大菜系 | 10 | 3周 |
| 地理达人 | 了解所有省份 | 15 | 4周 |
| 传统文化 | 节日+习俗+礼仪 | 12 | 3周 |
| 名人传记 | 历史人物故事 | 10 | 2周 |

#### 5.2 课程结构

**文件**: `src/data/learningPaths.js` (新建)

```javascript
export const learningPaths = [
  {
    id: 'history-basics',
    name: 'Chinese History Basics',
    nameCn: '中国历史入门',
    description: 'Learn about major dynasties and their achievements',
    totalLessons: 8,
    estimatedDays: 14,
    lessons: [
      {
        id: 'l1',
        title: 'The Qin Dynasty',
        titleCn: '秦朝',
        type: 'dynasty', // dynasty | city | recipe | quiz | person
        contentId: 'qin', // 对应数据ID
        xpReward: 10,
        prerequisites: [], // 前置课程
      },
      {
        id: 'l2',
        title: 'The Han Dynasty',
        titleCn: '汉朝',
        type: 'dynasty',
        contentId: 'han',
        xpReward: 10,
        prerequisites: ['l1'],
      },
      // ...
    ],
    milestones: [
      { lessonCount: 4, reward: { badge: 'history-half', xp: 50 } },
      { lessonCount: 8, reward: { badge: 'history-master', xp: 100 } },
    ],
  },
  // ...
];
```

#### 5.3 进度追踪

**文件**: `src/utils/learningProgress.js` (新建)

```javascript
export const learningProgress = {
  // 获取路径进度
  async getPathProgress(pathId) {
    // 返回: { completedLessons, currentLesson, percentComplete }
  },

  // 完成课程
  async completeLesson(pathId, lessonId) {
    // 更新进度
    // 检查里程碑
    // 发放奖励
  },

  // 获取推荐路径
  async getRecommendedPaths(userInterests) {
    // 基于用户兴趣排序
  },

  // 获取每日学习任务
  async getDailyTasks() {
    // 返回今日推荐课程
  },
};
```

#### 5.4 学习路径UI

**文件**: `src/screens/LearningPathScreen.js` (新建)

```javascript
// 显示:
// - 路径概览卡片 (进度条 + 课程数)
// - 课程列表 (已完成/进行中/锁定)
// - 里程碑标记
// - 继续学习按钮
```

**文件**: `src/screens/LessonScreen.js` (新建)

```javascript
// 课程内容页:
// - 根据课程类型显示对应内容
// - Dynasty: DynastyDetailScreen
// - City: CityDetailScreen
// - Quiz: QuizScreen
// - Person: PersonDetailScreen
// - 完成按钮 + XP奖励动画
```

#### 5.5 首页集成

**修改**: `src/screens/HomeScreen.js`

```javascript
// 添加"学习路径"区块
// 显示进行中的路径
// 显示每日学习任务
// 显示路径推荐
```

#### 5.6 里程碑奖励

**新增Badge**: `src/data/badges.js`

```javascript
// 学习路径里程碑Badge
{ id: 'history-half', name: 'History Apprentice', ... },
{ id: 'history-master', name: 'History Master', ... },
{ id: 'food-explorer', name: 'Food Explorer', ... },
{ id: 'geography-expert', name: 'Geography Expert', ... },
```

### 实现优先级
| 功能 | 优先级 | 工作量 | 依赖 |
|------|--------|--------|------|
| 学习路径数据 | P0 | 2天 | 无 |
| 进度追踪 | P0 | 1天 | 无 |
| 路径列表UI | P0 | 1天 | 无 |
| 课程内容页 | P1 | 1天 | 无 |
| 首页集成 | P1 | 0.5天 | 无 |
| 里程碑奖励 | P1 | 0.5天 | 无 |

---

## 六、实现路线图

### Phase 1: 搜索增强 (3天)
- [ ] 拼音搜索支持
- [ ] 搜索结果高亮
- [ ] 模糊匹配

### Phase 2: 离线模式 (2天)
- [ ] 网络状态检测
- [ ] 离线Banner + Modal
- [ ] 图片缓存

### Phase 3: 推送通知 (3天)
- [ ] 推送通知基础框架
- [ ] 每日问答推送
- [ ] Streak提醒 + 节日提醒
- [ ] 通知设置UI

### Phase 4: 社交功能 (3天)
- [ ] 分享统计
- [ ] 分享卡片优化
- [ ] 本地好友码系统
- [ ] 排行榜

### Phase 5: 学习路径 (4天)
- [ ] 学习路径数据结构
- [ ] 进度追踪
- [ ] 路径列表UI
- [ ] 课程内容页
- [ ] 首页集成
- [ ] 里程碑奖励

**总计: 约15个工作日**

---

## 七、技术依赖汇总

### 新增依赖
```json
{
  "fuse.js": "^6.6.2",           // 模糊搜索
  "react-native-fast-image": "^8.6.3",  // 图片缓存
  "expo-notifications": "~0.20.0",      // 推送通知
  "expo-device": "~7.0.0"               // 设备信息
}
```

### 可选依赖
```json
{
  "pinyin-pro": "^3.0.0"       // 完整拼音库 (可选，可用内置轻量映射替代)
}
```

---

## 八、风险与考量

### 技术风险
1. **推送通知**: iOS 需要真机测试，模拟器不支持
2. **离线缓存**: 图片缓存可能占用较大存储空间

### 产品考量
1. **学习路径**: 需要内容团队配合设计课程结构
2. **社交功能**: 需考虑隐私政策和用户协议
3. **推送通知**: 需控制频率，避免打扰用户

### 兼容性
- iOS 13+ 支持大部分功能
- Android 6+ 需要运行时权限处理
- Web 版本部分功能受限 (推送通知)
