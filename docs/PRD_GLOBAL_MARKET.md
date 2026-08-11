gemini建议
# BecomeChineseApp PRD - Global Market Edition

**Product Name**: BecomeChineseApp  
**Version**: v1.0  
**Target Market**: English-speaking global users, primarily欧美市场  
**Primary Language**: English-first, with optional Chinese labels as supporting context  
**Product Category**: Cultural discovery, lightweight learning, collectible journey  

## 1. Product Summary

BecomeChineseApp is a modern cultural discovery app that helps global users explore Chinese history, cities, food, traditions, and seasonal culture through short-form storytelling, guided journeys, collections, and gentle daily rituals.

The product should feel like a mix of:
- a curated editorial app
- a museum-like cultural guide
- a travel journal
- a collectible atlas

It is not a textbook, not a generic encyclopedia, and not a heavy quiz app. The product should lower cultural entry barriers for non-Chinese users while keeping the content authentic and respectful.

## 2. Product Goal

### 2.1 User Goal
Help users quickly understand what Chinese culture is, why it matters, and what to explore next.

### 2.2 Business Goal
Build a repeatable exploration loop that increases:
- daily active usage
- content depth
- collection completion
- route completion
- sharing
- return visits

### 2.3 Product North Star
A user should be able to:
1. discover a cultural topic
2. understand it in a beginner-friendly way
3. explore related topics
4. save progress into a collection
5. share the result
6. continue the journey later

## 3. Product Positioning

### 3.1 Core Positioning Statement
A lightweight cultural discovery app for global users to explore Chinese history, food, cities, and seasonal traditions through stories, curated journeys, and collectible progress.

### 3.2 What the app should feel like
- clear
- modern
- readable
- culturally distinctive
- welcoming to non-Chinese users
- structured and rewarding

### 3.3 What the app should not feel like
- a textbook
- a static museum board
- a Chinese-only knowledge database
- a task-heavy gamification app
- a decorative app with shallow cultural styling

## 4. Audience

### 4.1 Primary Audience
English-speaking users interested in:
- Chinese culture
- history
- food
- travel
- heritage
- Asian cultural exploration

### 4.2 Secondary Audience
- language learners
- travelers preparing for China
- diaspora users reconnecting with regional identity
- museum/history enthusiasts
- food explorers
- educators and casual learners

### 4.3 User Needs
Users need:
- fast comprehension
- beginner-friendly explanations
- clear navigation
- visible progress
- culturally meaningful structure
- easy sharing
- low-pressure repeat engagement

## 5. Product Principles

1. **English first**  
   English is the main reading layer. Chinese labels can appear as supporting context.

2. **Story over glossary**  
   Users should learn through stories and curated context, not long definitions.

3. **One primary action per screen**  
   Every screen should have one obvious next step.

4. **Connections matter**  
   Content must be linked by real cultural relationships.

5. **Progress must feel real**  
   Collection, route completion, and profile growth should be visible and meaningful.

6. **Beginner-friendly by default**  
   Every topic should include short context for users who know little about China.

7. **Authentic but accessible**  
   Keep the content culturally accurate while reducing unnecessary complexity.

## 6. Content Strategy

The app should organize content around six exploration pillars:

- **Cities** - cultural places and regional identity
- **Dynasties** - historical eras and civilizational changes
- **People** - influential figures and their cultural context
- **Food** - regional dishes and culinary stories
- **Seasons** - Chinese calendar rhythms and traditional timing
- **Journeys** - themed exploration routes

### 6.1 Content Style Rules
Each content item should ideally include:
- a one-line summary
- why it matters
- cultural context
- related items
- a beginner-friendly explanation
- a recommended next step

### 6.2 Content Tone
- concise
- informative
- warm
- exploratory
- not academic-heavy
- not overly poetic if it reduces clarity

## 7. Information Architecture

### 7.1 Primary Navigation
Recommended bottom tabs:
- Home
- Explore
- Collection
- Profile

Optional secondary entry points can live inside Explore.

### 7.2 Explore Page Structure
Explore should be the main discovery hub and include:
- Cities
- Dynasties
- People
- Food
- Seasons
- Journeys
- Search
- Featured themes

## 8. Functional Requirements

## 8.1 Home

### Purpose
Help the user know what to do right now.

### Required Modules
- Today’s discovery card
- Continue exploring card
- Featured journey card
- Quick access to major categories
- Optional progress snapshot

### Business Rules
- Only one main recommendation should be visually dominant
- Secondary content must not compete with the primary action
- New users should get guided entry points
- Returning users should see continuity and progress

### Success Criteria
- user understands the app within a few seconds
- user can enter one meaningful exploration path quickly
- user knows what to do next

## 8.2 Explore

### Purpose
Central entry for discovering content.

### Required Modules
- category shortcuts
- curated themes
- search
- map or region-based browsing where applicable
- recommended journeys

### Business Rules
- Explore should feel like a curated catalog, not a directory
- Each category should lead to deeper related content
- Search results should include related recommendations

## 8.3 City Module

### Purpose
Let cities act as cultural anchors.

### Required Content Fields
- name
- region
- short summary
- why it matters
- historical links
- representative food
- representative people
- related dynasty
- related journey(s)
- images

### Page Structure
- city hero image
- short summary
- cultural tags
- why it matters
- related dynasty
- related people
- related food
- related journeys
- save/share actions

### Business Rules
- city pages must not be isolated facts
- each city should connect to at least 3 related items
- city pages should create a clear next-step path

## 8.4 Dynasty Module

### Purpose
Present Chinese history as understandable eras.

### Required Content Fields
- dynasty name
- date range
- overview
- key characteristics
- representative people
- representative cities
- representative cultural achievements
- related food or customs
- related journey(s)

### Page Structure
- era summary
- key facts
- cultural significance
- timeline highlights
- related content
- next-step exploration

### Business Rules
- use beginner-friendly framing, not academic chronology only
- show why the dynasty matters to culture, food, cities, or identity
- connect each dynasty to modern understandable references where possible

## 8.5 People Module

### Purpose
Turn historical figures into culture entry points.

### Required Content Fields
- name
- era/dynasty
- region or birthplace
- short biography
- significance
- related events
- related cities
- related works or stories
- related journeys

### Business Rules
- avoid biography-only pages
- each person page should explain the person’s cultural role
- relate people to places and historical change

## 8.6 Food Module

### Purpose
Make food a regional cultural story.

### Required Content Fields
- dish name
- English name
- pronunciation or Chinese name where relevant
- origin region/city
- flavor profile
- cultural story
- historical context
- related season or festival
- related city
- related journey

### Business Rules
- food should not be presented as a recipe database only
- every dish should have context about place and culture
- use global-friendly phrasing for taste and origin

## 8.7 Seasons Module

### Purpose
Use seasonal culture as a daily ritual layer.

### Required Content Fields
- season or solar term name
- time/date context
- meaning
- natural changes
- customs
- associated food
- associated city/region
- recommended daily action

### Business Rules
- keep the seasonal module lightweight
- it should work as a daily entry point
- do not overload the user with too much explanation on the first view

## 8.8 Journeys Module

### Purpose
Provide themed cultural paths and long-term engagement.

### Journey Types
- dynasty journeys
- city journeys
- food journeys
- seasonal journeys
- mixed cultural journeys

### Journey Page Structure
- journey theme
- short description
- node list
- node order
- why each node is included
- completion progress
- reward or unlock state
- shareable result

### Business Rules
- journeys must feel curated and story-driven
- journeys should have a visible beginning and completion state
- each node should contribute to the journey theme

## 8.9 Search

### Purpose
Help users discover content by intent.

### Required Behaviors
- search across all content types
- support category filters
- support related results
- support no-result fallback suggestions

### Business Rules
- search should not be a dead-end
- search results should encourage deeper exploration

## 8.10 Collection

### Purpose
Turn saved content into a personal cultural atlas.

### Collection Types
- saved cities
- saved dynasties
- saved people
- saved food
- saved seasons
- saved journeys

### Required Features
- saved state
- categorized collection views
- progress indicators
- completion-based unlocks
- shareable collection snapshots

### Business Rules
- collection should feel like a meaningful archive, not a bookmark list
- progress and completion states should be visible

## 8.11 Profile

### Purpose
Show the user’s identity as a cultural explorer.

### Required Features
- profile summary
- cultural progress overview
- badges / stamps / milestones
- saved collections
- journey completion history
- shareable identity card

### Business Rules
- profile should feel like an archive and identity center
- it should connect all progress across modules

## 9. Reward and Progress System

### 9.1 Reward Types
- stamps
- badges
- collection completion states
- journey completion states
- profile milestones

### 9.2 Reward Principles
- rewards should be meaningful, not noisy
- rewards should mark real exploration progress
- do not over-gamify the app

### 9.3 Recommended Milestones
- first city explored
- first dynasty completed
- first food trail completed
- first seasonal entry completed
- first collection set completed
- first share created

## 10. Localization Rules

### 10.1 English-First Copy
All major UI and content copy should be written naturally in English.

### 10.2 Chinese Support Layer
Chinese can appear as a supporting label or cultural reference, but must not block comprehension.

### 10.3 Beginner-Friendly Definition Rule
Every culturally specific item should have at least one short explanation that helps a non-Chinese user understand it quickly.

### 10.4 Avoid Direct Translation
Do not rely on literal translation if it sounds unnatural to English-speaking users.

## 11. Visual Direction

### 11.1 Overall Style
The app should feel like a modern editorial culture product with subtle Chinese visual identity.

### 11.2 Visual Characteristics
- warm background
- clean cards
- restrained red accents
- clear hierarchy
- generous spacing
- subtle stamp/seal feedback
- lightweight map or atlas cues

### 11.3 Avoid
- heavy parchment textures
- dark crowded screens
- overly ornate traditional styling
- museum-board presentation

## 12. Interaction Direction

### Core Loop
Discover → Understand → Explore Related → Save → Complete → Share → Continue

### Feedback Types
- stamp animation
- saved state change
- unlock state
- progress ring or completion indicator
- share card generation
- haptic feedback where appropriate

## 13. Data Requirements

## 13.1 Core Content Entities
The product should support structured data for:
- cities
- dynasties
- people
- food
- seasons / solar terms
- journeys
- badges / stamps
- user progress

## 13.2 Recommended Fields by Entity

### City
- id
- English name
- Chinese name
- region
- summary
- why it matters
- historical links
- representative food
- representative people
- related journeys
- images

### Dynasty
- id
- name
- date range
- summary
- significance
- representative people
- representative cities
- related journeys
- images

### Person
- id
- name
- era
- birthplace or region
- summary
- significance
- related cities
- related stories
- related journeys
- images

### Food
- id
- name
- English name
- origin region
- summary
- flavor profile
- cultural story
- related season
- related city
- related journeys
- images

### Season
- id
- name
- time range
- summary
- meaning
- customs
- related food
- related city
- images

### Journey
- id
- name
- theme
- summary
- nodes
- completion reward
- share template
- difficulty

## 14. Content Expansion Suggestions

If the app needs more cultural depth, the following content sets are recommended.

### 14.1 Cities
Recommended starter cities:
- Beijing
- Xi’an
- Nanjing
- Hangzhou
- Suzhou
- Chengdu
- Chongqing
- Guangzhou
- Shanghai
- Kaifeng
- Luoyang
- Dunhuang
- Datong
- Pingyao
- Quanzhou
- Xiamen
- Ningbo
- Shaoxing
- Wuzhen
- Xitang
- Tongli
- Lijiang
- Dali
- Kunming
- Lhasa
- Urumqi
- Turpan
- Kashgar

### 14.2 Dynasties
- Xia
- Shang
- Zhou
- Qin
- Han
- Three Kingdoms
- Jin
- Sui
- Tang
- Song
- Yuan
- Ming
- Qing

### 14.3 People
Recommended cultural figures:
- Li Bai
- Du Fu
- Su Shi
- Bai Juyi
- Wang Wei
- Cao Cao
- Zhuge Liang
- Wu Zetian
- Xuanzang
- Zheng He
- Wang Xizhi
- Yue Fei
- Wen Tianxiang
- Xu Xiake

### 14.4 Food
Recommended regional dishes:
- Peking Duck
- Mapo Tofu
- Kung Pao Chicken
- Lanzhou Beef Noodles
- Xian Roujiamo
- Beef Chow Fun
- Cantonese Dim Sum
- West Lake Fish
- Xiaolongbao
- Dan Dan Noodles
- Hot Dry Noodles
- Yangzhou Fried Rice
- Guilin Rice Noodles
- Over-the-Bridge Rice Noodles
- Xinjiang Roast Lamb
- Big Plate Chicken
- Shanghai Soup Dumplings
- Tangyuan
- Zongzi
- Mooncake

### 14.5 Seasons / Solar Terms
Support all 24 solar terms with simple explanations and related food/culture notes.

## 15. Suggested User Flows

### 15.1 New User Flow
Home → Today’s discovery → Content detail → Related content → Save → Complete a small journey → Share

### 15.2 Returning User Flow
Home → Continue journey → New node → Progress reward → Save/share → Next suggestion

### 15.3 Casual User Flow
Search or browse one topic → read short context → save if interested → leave with one clear next step

## 16. Metrics and KPIs

### Core KPIs
- DAU
- retention
- session depth
- content completion rate
- collection save rate
- journey completion rate
- share rate
- profile revisit rate

### Behavioral KPIs
- homepage CTR
- explore page CTR
- search conversion rate
- related content click-through rate
- save-to-share conversion
- journey node completion rate
- first-week repeat visit rate

## 17. Priority Levels

### P0
- Home redesign around one main discovery action
- Explore hub structure
- Content entity relationships
- Collection system foundation
- Journey system foundation

### P1
- Search improvements
- Share card templates
- Season module as daily entry
- Badge / stamp progression

### P2
- Deeper personalization
- richer map exploration
- advanced milestone logic
- more editorial content packs

## 18. Risks

### Product Risks
- too much content without structure
- over-gamification
- weak recommendation relevance
- low content connectivity
- poor readability for English-speaking users

### Content Risks
- too much cultural jargon
- too much assumed prior knowledge
- too many disconnected pages
- inconsistent translation quality

## 19. Acceptance Criteria

The product is considered successful if a global user can:
- understand the app within seconds
- know what each module is for
- explore Chinese culture without feeling overwhelmed
- connect content through related paths
- save and see meaningful progress
- complete a journey and share the result
- return because the app feels like a living atlas, not a static library

## 20. Implementation Notes for the Code Model

When optimizing the app, prioritize:
1. product structure and navigation
2. content relationship model
3. beginner-friendly content presentation
4. collection and journey loops
5. shareable progress states
6. English-first international UX

If extra content is needed, it is acceptable to expand the base dataset for cities, dynasties, people, food, and seasons.



GPT5 建议
BecomeChineseApp 全球版优化计划
总目标
将当前应用从：

多功能中文文化学习 App

优化为：

面向欧美用户的 Chinese Culture Discovery App，通过 Home、Explore、Journeys、Collection 形成“发现 → 理解 → 关联 → 探索 → 收藏 → 分享 → 再探索”的完整闭环。

一、优化优先级总览
P0：必须优先做
解决产品主线和业务闭环问题。

重构信息架构
重构首页主线
建立 Explore 总入口
强化 Journeys 为核心功能
建立统一内容关系模型
降低首页游戏化权重
优化内容详情页结构
建立面向欧美用户的内容解释层
P1：第二阶段做
强化留存和分享。

Collection 升级为 Cultural Atlas
Share Card 模板化
Seasons 模块从 quiz 改为 gentle daily ritual
Profile 重构为 Explorer Identity
搜索升级为全局搜索
奖励系统降噪
P2：后续增强
提升内容厚度和长期运营能力。

增加更多主题路线
增加人物、城市、美食文化内容
增加新手引导
增加个性化推荐解释
增加运营专题
增加多语言扩展基础
二、P0 优化计划
P0-1：重构一级导航
当前问题
当前底部 Tab 是：

Home
Seasons
History
Food
Places
Profile
问题是功能分散，用户无法理解主线。

优化目标
改成更符合欧美用户理解的探索型结构：

Home
Explore
Journeys
Collection
Profile
如果底部 Tab 数量要控制在 4 个，建议：

Home
Explore
Journeys
Collection
Profile 可以作为右上角入口或 Collection 内部入口。

业务逻辑要求
History、Food、Places、Seasons 不再作为一级主 Tab，而是进入 Explore。
Journeys 成为核心入口，不再只是某个组件。
Collection 从 Profile 里独立出来。
是否需要新增数据
不一定，但需要统一分类配置：

Explore Categories:
- Cities
- Dynasties
- People
- Food
- Seasons
验收标准
用户打开应用后能理解主要路径。
一级导航不再像内容数据库。
Collection 和 Journeys 的权重明显提升。
P0-2：重构首页为文化发现入口
当前问题
首页过度强调：

XP
Daily Quiz
Daily Sign-in
Daily Tasks
Wrong Answers
对欧美用户来说，容易误解为学习打卡 App。

优化目标
首页改成：

Today’s Discovery
Continue Your Journey
Featured Journey
Explore Categories
Progress Snapshot
功能逻辑
Today’s Discovery
每日推荐一个文化主题，可从以下来源生成：

当前节气
随机精选城市
推荐 Journey
最近浏览的关联内容
新手推荐主题
Continue Your Journey
如果用户有进行中的 Journey，优先展示 Journey。

如果没有 Journey，展示最近浏览内容。

Featured Journey
展示一个主推 Journey。

Progress Snapshot
展示：

saved items
journeys completed
stamps collected
是否需要新增数据
建议新增 featuredDiscoveries 或从现有数据动态生成。

字段建议：

id
title
subtitle
summary
reason
contentType
contentId
ctaText
imageAsset
tags
验收标准
首页首屏只有一个主 CTA。
Daily Quiz 不再是首屏核心。
用户能在 3 秒内知道今天可以探索什么。
P0-3：新增 Explore Hub
当前问题
没有统一的探索页，内容分散在多个 Tab。

优化目标
建立 Explore 总入口。

Explore 页面结构
Global Search
Start Here
Categories
Featured Themes
Popular Journeys
Map Discovery
Recently Viewed
Categories
Cities
Dynasties
People
Food
Seasons
Start Here 推荐
为欧美新用户提供低门槛入口：

First-time China
Food Lover’s China
Ancient Capitals
Easy History
Seasonal Traditions
Famous Chinese Cities
是否需要新增数据
建议新增 exploreThemes。

字段：

id
title
subtitle
description
targetType
targetId
difficulty
tags
imageAsset
验收标准
用户可以从一个页面进入所有文化内容。
Explore 不只是分类列表，而是策展页。
新用户有明确起点。
P0-4：强化 Journeys 为核心模块
当前问题
已有路径，但只是附属组件。
路径节点缺少解释，完成逻辑也不够准确。

优化目标
把 Paths 升级为 Journeys，成为文化探索主线。

Journey 类型
City Journey
Food Journey
Dynasty Journey
Seasonal Journey
Mixed Journey
Journey 数据结构建议
id
title
subtitle
description
theme
difficulty
estimatedTime
coverImage
tags
nodes[]
completionReward
shareTemplate
Node 数据结构建议
id
type
targetId
title
subtitle
reason
requiredAction
completionRule
order
completionRule 建议
支持多种完成方式：

viewed
saved
quizCompleted
manuallyMarked
shared
最简单可先做：

viewed for 15 seconds
saved
mark as explored
建议先保留并优化的 Journey
当前已有路径不错，建议第一批保留：

The Silk Road
Tang Poetry Trail
Imperial Beijing
Sichuan Flavors
Jiangnan Water Towns
Festival Foods
Maritime Silk Road
Ancient Philosophers
需要补充的 Journey
建议新增：

First Taste of China
适合新手，从最容易理解的内容开始：

Peking Duck
Dumplings
Xiaolongbao
Mapo Tofu
Cantonese Dim Sum
Ancient Capitals
围绕中国古都：

Xi’an
Luoyang
Nanjing
Beijing
Kaifeng
Tea and Daily Life
围绕茶文化：

Hangzhou
Chengdu
Fujian / Xiamen
Suzhou
Guangzhou
Seasons and Festivals
围绕节日与时令：

Spring Festival
Qingming
Dragon Boat Festival
Mid-Autumn Festival
Winter Solstice
验收标准
Journey 有独立入口。
每个节点都有 “Why this stop matters”。
用户能看到 Journey 进度。
完成后有分享卡和推荐下一条 Journey。
P0-5：建立统一内容关系模型
当前问题
很多关联逻辑依赖同省匹配，不够准确。

优化目标
建立真正的文化关系图谱。

新增基础数据建议
新增 contentRelations.js 或扩展现有 relations.js。

关系字段建议
sourceType
sourceId
targetType
targetId
relationType
reason
priority
relationType 示例
origin
capital
famousFor
influencedBy
sameRegion
festivalFood
historicalEra
birthplace
tradeRoute
poetryConnection
dailyLife
示例关系
Tang Dynasty -> Xi’an
relationType: capital
reason: Chang’an, today’s Xi’an, was the Tang capital and one of the world’s largest cosmopolitan cities.
Chengdu -> Mapo Tofu
relationType: famousFor
reason: Mapo Tofu reflects the bold, spicy profile of Sichuan cooking.
Mid-Autumn Festival -> Mooncake
relationType: festivalFood
reason: Mooncakes are traditionally shared during the Mid-Autumn Festival as symbols of reunion.
页面展示规则
所有详情页都应该有：

Explore Next
Why connected
Continue this journey
验收标准
关联推荐不再只依赖 province。
每个详情页至少有 3 个高质量关联项。
每个关联项都有解释。
P0-6：优化详情页统一结构
当前问题
不同模块详情结构不统一。
有些内容偏中文，有些偏菜谱，有些偏历史教材。

优化目标
统一面向欧美用户的内容详情结构。

所有详情页通用结构
Hero
English title
Chinese name + pinyin
One-line summary
Why it matters
Cultural story
Key facts
Explore next
Save / Share
城市详情结构
City name
Chinese name + pinyin
Region
Why it matters
Best known for
Cultural story
What to eat
Related era
Suggested journey
朝代详情结构
Dynasty name
Date range
Simple era summary
Why it matters
What changed in China
What you can still see today
Key city
Key people
Suggested journey
美食详情结构
English name
Chinese name + pinyin
Flavor profile
Origin region
Why it matters
Cultural story
When people eat it
Related city / festival
Optional cooking notes
人物详情结构
Name
Chinese name + pinyin
Era
Why they matter
Cultural role
Related city
Related story
Suggested journey
节气详情结构
English-friendly name
Chinese name + pinyin
Time range
Meaning in one sentence
Natural changes
Food / custom
Gentle daily action
Related journey
验收标准
欧美用户可以快速读懂每个页面。
中文作为辅助，不干扰理解。
每个详情页都有下一步探索入口。
P0-7：增加 Beginner-friendly 解释层
当前问题
很多文化内容默认用户知道背景。

优化目标
为非中文用户增加解释层。

新增字段建议
所有核心内容添加：

beginnerNote
whyItMatters
globalContext
pronunciation
示例
Dynasty
beginnerNote:
A dynasty is a historical period ruled by one royal family. Chinese history is often understood through these eras.
Solar Terms
beginnerNote:
The 24 Solar Terms are a traditional Chinese calendar system that tracks seasonal changes, farming rhythms, and daily customs.
Dumplings
beginnerNote:
Dumplings are one of the most familiar Chinese foods globally, but in China they also carry family and festival meanings.
验收标准
新用户无需中国文化背景也能理解。
每个高门槛概念都有一句简明解释。
术语不再裸露出现。
三、P1 优化计划
P1-1：Collection 升级为 Cultural Atlas
当前问题
收藏更像 saved items list。

优化目标
改造成：

My Cultural Atlas
China Passport
Heritage Collection
页面结构
Overall progress
Saved Cities
Completed Journeys
Food Collection
Dynasty Eras
Seasonal Discoveries
Stamp Album
Rarity 优化建议
把 common / rare / legendary 改成更文化化：

Introductory
Iconic
Deep Cut
Hidden Gem
验收标准
收藏具有身份感和沉淀感。
用户看到自己探索过的文化地图。
支持分享 Collection Snapshot。
P1-2：Seasons 改为 Gentle Daily Ritual
当前问题
当前 Calendar 偏 quiz / streak。

优化目标
改为每日文化轻入口。

页面结构
Today’s seasonal note
Meaning
Food / custom
One gentle action
Related content
Optional mini quiz
建议新增数据
solarTerms 每条增加：

englishName
chineseName
pinyin
dateRange
meaning
natureChange
custom
food
beginnerNote
relatedContent
dailyAction
验收标准
用户打开 Seasons 能理解今天的文化意义。
Quiz 成为可选项，不是主入口。
每个节气能关联食物、城市或节日。
P1-3：Share Card 模板化
当前问题
分享功能已有，但需要更强传播表达。

优化目标
分享不是截图，而是成果卡。

分享模板
Today’s Discovery Card
Journey Completion Card
Food Trail Card
City Discovery Card
Cultural Atlas Snapshot
Name Card
每张卡包含
title
subtitle
achievement
cultural fact
visual identity
app branding
验收标准
用户完成 Journey 后能自然分享。
分享卡在欧美社交平台上可读。
分享内容不依赖中文理解。
P1-4：Profile 重构为 Explorer Identity
当前问题
Profile 被中文名生成器占据较多。

优化目标
Profile 主体改为文化探索身份。

页面结构
Explorer name / avatar
Progress summary
Completed journeys
Stamps
Saved collections
Chinese name tool as secondary feature
Share profile card
中文名生成器注意
增加说明：

This is a playful cultural experience, not an official Chinese name.
验收标准
Profile 能体现用户探索成果。
中文名生成器不抢主线。
用户可以分享自己的 Explorer identity。
P1-5：全局搜索升级
当前问题
搜索分散在模块内。

优化目标
建立全局搜索。

搜索范围
cities
dynasties
people
food
seasons
journeys
搜索结果结构
Top result
Category results
Related journeys
No-result suggestions
No-result 示例
搜索 spicy，返回：

Sichuan Flavors
Mapo Tofu
Chengdu
Hot Pot
搜索 poetry，返回：

Tang Poetry Trail
Li Bai
Du Fu
Tang Dynasty
验收标准
搜索任何文化关键词都有合理结果。
搜索结果不是死胡同。
支持继续探索。
P1-6：奖励系统降噪
当前问题
XP、等级、签到、任务、印章、徽章、稀有度都存在，容易过度游戏化。

优化目标
保留激励，但降低任务压力。

建议保留
stamps
journey completion
collection progress
profile milestones
建议降权
daily tasks
sign-in
XP level
wrong answer review
文案改法
从：

Task Complete!
XP +20
改为：

You explored a new cultural stop.
Added to your journey.
验收标准
奖励服务于探索，而不是刷任务。
首页不被任务系统占据。
用户感受到成长但没有压力。
四、P2 优化计划
P2-1：增加新手引导
目标
欧美新用户首次进入 1 分钟内理解产品。

引导步骤
What this app is
Choose your interest
Food
History
Cities
Festivals
Travel
Recommend first journey
Save first discovery
是否需要新增数据
新增 onboarding preference：

interests[]
firstJourneyId
preferredContentTypes[]
P2-2：增强个性化推荐
目标
推荐要可解释。

推荐理由
Because you saved Chengdu
Because you started Sichuan Flavors
Because you explored Tang Dynasty
Because today relates to seasonal food
推荐数据来源
viewed items
saved items
completed journeys
selected interests
seasonal context
P2-3：增加专题内容包
推荐专题
First-time China
Famous Chinese Foods
Ancient Capitals
Chinese Festivals
The Silk Road
Tea Culture
Chinese Poetry
Regional China
Food by Flavor
China Through Seasons
每个专题包含
description
content list
suggested journey
share card
五、建议新增的基础数据
如果允许补充数据，建议优先加这些。

1. journeys.js
目的
让主题路线真正数据化，不只写在组件里。

字段
id
title
subtitle
description
theme
difficulty
estimatedTime
coverImage
nodes
completionReward
shareTemplate
2. contentRelations.js
目的
统一内容关联逻辑。

字段
sourceType
sourceId
targetType
targetId
relationType
reason
priority
3. exploreThemes.js
目的
支持 Explore 页策展主题。

字段
id
title
subtitle
description
targetType
targetId
difficulty
tags
imageAsset
4. featuredDiscoveries.js
目的
支持首页 Today’s Discovery。

字段
id
title
subtitle
summary
reason
contentType
contentId
ctaText
imageAsset
tags
5. solarTerms.js
目的
强化 Seasons 模块。

字段
id
englishName
chineseName
pinyin
dateRange
meaning
natureChange
custom
food
beginnerNote
relatedContent
dailyAction
6. contentGlossary.js
目的
给欧美用户解释文化术语。

字段
term
shortDefinition
longDefinition
relatedContent
示例
dynasty
solar term
dumpling
Spring Festival
Silk Road
Jiangnan
Lingnan
hutong
dim sum
tea house
六、建议增加的文化内容
1. 城市内容优先增加
第一批
Luoyang
Kaifeng
Dunhuang
Datong
Pingyao
Quanzhou
Shaoxing
Wuzhen
Dali
Kashgar
原因
这些城市更适合文化探索，不只是现代旅行目的地。

2. 人物内容优先增加
文化传播力强的人物
Confucius
Laozi
Li Bai
Du Fu
Su Shi
Wang Xizhi
Xuanzang
Zheng He
Wu Zetian
Zhuge Liang
原因
欧美用户较容易通过人物进入文化故事。

3. 美食内容优先增加
欧美用户容易感兴趣的内容
Peking Duck
Dumplings
Xiaolongbao
Mapo Tofu
Kung Pao Chicken
Hot Pot
Dim Sum
Zongzi
Mooncake
Tangyuan
Lanzhou Beef Noodles
Roujiamo
每个美食需要补：
flavor profile
origin
why it matters
when people eat it
beginner note
4. 节日与时令内容
建议增加 festivals.js，因为欧美用户对 festival 更好理解，节气可与 festival 结合。

第一批节日
Spring Festival
Lantern Festival
Qingming Festival
Dragon Boat Festival
Qixi Festival
Mid-Autumn Festival
Double Ninth Festival
Winter Solstice
字段
id
englishName
chineseName
pinyin
time
summary
whyItMatters
customs
foods
relatedJourney
5. 文化术语内容
建议增加术语解释，用于页面内 tooltip 或 glossary。

第一批术语
Dynasty
Solar Terms
Silk Road
Jiangnan
Lingnan
Hutong
Dim Sum
Teahouse
Mid-Autumn Festival
Dragon Boat Festival
Pinyin
Calligraphy
Confucianism
Daoism
七、功能重构路线图
第 1 阶段：主线重构
建议先做：

Navigation 调整
Home 重构
Explore Hub 新增
Journeys 独立化
Collection 独立化
目标：让产品结构对。

第 2 阶段：内容图谱
建议做：

contentRelations 数据
详情页 Explore Next
Journey 节点 reason
推荐理由
最近浏览和继续探索逻辑
目标：让内容串起来。

第 3 阶段：国际化内容表达
建议做：

whyItMatters
beginnerNote
pronunciation
globalContext
英文主文案优化
中文降为辅助层
目标：让欧美用户读懂。

第 4 阶段：留存与分享
建议做：

Journey completion
Cultural Atlas
Share cards
Stamps
Explorer Profile
目标：形成复访和传播。

第 5 阶段：内容扩充
建议做：

新城市
新人物
新美食
节日
术语库
新 Journey
目标：提升内容厚度。

八、给代码模型的执行指令建议
你可以把下面这段直接交给代码模型：

请基于 docs/PRD_GLOBAL_MARKET.md，将 BecomeChineseApp 优化为面向欧美用户的中国文化探索产品。
优先完成：
1. 将底部导航从 History/Food/Places/Seasons 分散结构，优化为 Home / Explore / Journeys / Collection / Profile 或类似结构。
2. 首页重构为 Today’s Discovery、Continue Your Journey、Featured Journey、Explore Categories、Progress Snapshot。
3. 新增 Explore Hub，集中展示 Cities、Dynasties、People、Food、Seasons、Journeys 和全局搜索。
4. 将现有 PathsSection 升级为 Journeys 模块，路径数据化，每个节点增加 reason、completionRule、progress、share result。
5. 建立统一 contentRelations 数据模型，详情页的 Related Paths 改为 Explore Next，并显示为什么推荐。
6. 优化城市、朝代、人物、美食、节气详情页结构，统一加入 whyItMatters、beginnerNote、Explore Next。
7. Collection 升级为 Cultural Atlas，支持分类收藏、进度、完成状态、分享快照。
8. 降低首页 Daily Quiz、Daily Tasks、Sign-in、XP 的权重，让奖励服务探索而不是任务。
9. 如果文化内容不足，可以增加 journeys、contentRelations、exploreThemes、featuredDiscoveries、solarTerms、festivals、contentGlossary 等基础数据。
10. 所有主要 UI 和内容表达必须 English-first，中文只作为辅助标签。
九、最终建议
如果只做一件事，先做：

Home + Explore + Journeys + ContentRelations

这四个做好，整个产品主线就会立起来。

如果先去扩充大量城市、美食、人物，但不先建立探索关系，内容越多越容易变成资料库。
所以建议顺序是：

先重构主线
再建立关系图谱
再补内容
最后加强分享和个性化
这样最稳。

GPT 的UI建议
UI 规划总目标
当前视觉问题可以概括为：

有中国风意图，但缺少统一视觉系统；有纸纹、印章、红色、中文元素，但整体不够高级、不够现代，也不够有品牌辨识度。

新的 UI 方向应该是：

Modern Chinese Cultural Atlas
一个现代中国文化图册 / 旅行手账 / 博物馆策展式 App。

关键词：

modern
elegant
editorial
cultural atlas
travel journal
museum card
subtle Chinese identity
warm, premium, readable
一、UI 核心原则
1. 不要做传统中国风堆叠
避免简单堆：

大红色
金色
龙纹
祥云
毛笔字
纸纹铺满
古风边框
过多印章
大量中文装饰
这些会显得廉价、模板化，尤其面向欧美用户时容易变成 stereotyped Chinese style。

2. 要做“现代东方文化感”
建议走：

干净留白
高级暖色
克制红色点缀
博物馆卡片
地图纹理
轻手账感
旅行邮戳感
精致插图 / 图片主导
3. 内容可读性优先
欧美用户主要读英文，所以 UI 不能让装饰影响阅读。

4. 视觉要服务探索感
UI 不只是漂亮，要让用户觉得自己在：

打开一张文化地图
浏览一本文化图册
收集一本中国文化护照
完成一段 journey
二、整体视觉方向
推荐方向名
Modern Cultural Atlas
现代文化图册风格。

视觉基调
像一本精致的旅行文化杂志
像一个现代博物馆导览 App
像一个收藏型文化护照
情绪关键词
warm
curious
premium
welcoming
story-driven
calm
refined
三、色彩系统规划
1. 主色不要过红
当前如果红色用得多，会显得重。
建议使用“克制的 cinnabar red”作为点缀，而不是大面积背景。

推荐色板
背景色
Warm Ivory: #F8F3EA
Soft Rice Paper: #F4EBDD
Porcelain White: #FCFAF5
Ink Wash Light: #E9E1D4
主强调色
Cinnabar: #B94A32
Deep Cinnabar: #8F2F24
辅助色
Jade Green: #557C70
Indigo Ink: #243B53
Tea Brown: #8A6A4F
Muted Gold: #C49A4A
Lake Blue: #5F8FA8
Bamboo Green: #6F8F72
文字色
Ink Black: #1F1A17
Soft Black: #302A26
Muted Text: #7A6F66
2. 色彩使用规则
背景
80% 使用 warm ivory / porcelain white。
不要使用高饱和红色大面积铺底。
强调色
红色只用于：
CTA
stamp
progress highlight
active state
key label
模块色
不同内容可有轻微色彩区分：

内容类型	推荐颜色
Cities
Lake Blue / Jade Green
Dynasties
Deep Cinnabar / Muted Gold
Food
Tea Brown / Warm Gold
Seasons
Bamboo Green / Soft Blue
Journeys
Indigo Ink / Cinnabar
Collection
Muted Gold / Jade
四、字体与排版
1. 英文优先
欧美用户主要阅读英文，所以英文排版必须高级。

建议
标题：serif 或高质量系统 serif 感
正文：清晰 sans-serif
中文：作为小标签，不要抢主标题
2. 推荐排版层级
页面标题
32px / 700-800
卡片标题
20-24px / 700
正文
15-16px / line-height 22-25
说明文字
13-14px / muted
标签
10-12px / uppercase / letter spacing
3. 中文使用规则
中文作为辅助信息，建议这样显示：

Beijing
北京 · Běijīng
不要这样：

Beijing / 北京 / 首都的礼制感与中轴秩序
长中文句子不要和英文正文混排。

五、组件视觉规划
1. Home Hero Card
当前问题
首页功能多，但视觉没有一个强主焦点。

规划要求
Home 顶部必须有一个高质量主视觉卡：

大图
渐变遮罩
Today’s Discovery
标题
一句话说明
CTA
视觉风格
像文化杂志封面，而不是任务卡。

示例内容
Today’s Discovery
The Silk Road
Follow the route that connected China with the ancient world.
Start Journey
设计要求
高度 260-320
圆角 28
图片覆盖
暗色渐变保证文字可读
CTA 按钮清晰
2. Explore Category Cards
目标
分类入口要有识别度，不是普通按钮。

卡片要求
每个分类使用：

图标
背景插图 / 轻纹理
英文标题
一句话说明
item count
对应主题色
分类示例
Cities
Explore China through places and regional stories.
42 places
3. Journey Card
当前问题
路径卡看起来偏普通列表。

规划要求
Journey Card 要像旅行路线卡 / 护照页。

必须包含
cover image 或地图线条背景
journey title
subtitle
estimated time
number of stops
progress bar
first 3 stops preview
CTA
视觉元素
虚线地图线
小节点圆点
subtle stamp
route progress
避免
纯图标 + 文本列表
中文标题太突出
密集 step 文本
4. Detail Page Hero
目标
每个内容详情页都应该有高级感。

结构
Hero image
gradient overlay
type badge
English title
Chinese name + pinyin
one-line summary
详情页下方内容卡
统一采用：

Why it matters
Cultural story
Key facts
Explore next
每个 section 用干净卡片，不要大段纯文本堆叠。

5. Explore Next Cards
目标
关联推荐要有故事感。

卡片要求
每张卡必须显示：

target title
content type
reason
small thumbnail/icon
CTA
示例
Next Stop
Xi’an
Why here: It was Chang’an, the Tang capital and a Silk Road hub.
Explore
6. Collection / Cultural Atlas
当前问题
收藏页功能多，但缺少“图册/护照”感。

规划要求
Collection 要做成：

Cultural Atlas
Passport
Gallery
页面结构视觉
顶部像护照封面
progress summary
categorized collection shelves
stamps
completed journeys
收藏卡片视觉
小图
英文标题
中文小标签
type badge
collected date 或 progress
不要过度用 rarity 星星
7. Stamps / Badges
当前问题
印章和徽章有潜力，但容易变成游戏化。

规划要求
印章视觉要像：

travel passport stamp
museum collection mark
cultural seal
要求
线条克制
不要过亮
不要像手游奖励
使用 cinnabar red / muted gold
stamp unlock 动效轻，不要过度爆炸
8. Profile / Explorer Identity
目标
Profile 是用户文化探索身份页。

顶部设计
像 explorer card：

avatar / initials
explorer title
journeys completed
collection progress
stamps collected
中文名生成器
放成次级卡片，不要占据主视觉。

六、页面级 UI 规划
1. Home 页面
结构
Hero Discovery Card
Continue Journey
Featured Journeys 横滑
Explore Categories Grid
Cultural Atlas Progress
Optional Daily Ritual
视觉重点
首屏必须漂亮。
Hero card 必须成为品牌记忆点。
Daily Quiz 不要抢视觉中心。
2. Explore 页面
结构
Search bar
Start Here banner
Category cards
Featured themes
Map discovery teaser
Popular journeys
视觉重点
像策展目录。
不要像功能菜单。
每一块都应该有“我想点进去”的欲望。
3. Journeys 页面
结构
页面标题 + 说明
Featured journey hero
Journey categories
Journey list
Completed journeys
视觉重点
旅行路线感。
进度清晰。
封面图和线路感要强。
4. Detail 页面
结构
Hero
Quick summary
Why it matters
Cultural story
Key facts
Related content
Save / Share floating action
视觉重点
读起来像精品文化卡。
不是资料页。
每段文本要短。
5. Collection 页面
结构
Cultural Atlas header
Overall progress
Collection categories
Stamp album
Completed journeys
Share snapshot
视觉重点
护照 / 图册感。
让用户愿意截图或分享。
七、动效规划
1. 原则
动效要：

subtle
elegant
meaningful
not game-like
2. 推荐动效
Hero card fade-in
Journey progress line draw
Save stamp press
Collection card flip / reveal
Explore next card slide-in
Share card generation
Scroll-based parallax for hero image
3. 避免动效
大量闪光
爆炸粒子
过度弹跳
频繁弹窗
动效时长过长
八、图片与插图要求
1. 图片质量
当前如果图片风格不统一，会显得廉价。
建议所有城市、美食、朝代封面统一为：

高清
色调温暖
真实中国场景
不要 AI 感过强
不要日式/韩式元素混入
2. 图片使用规则
Home Hero 用高质量大图
Category card 可用浅色插图 /纹理
Detail 页必须有 hero image
Journey 卡建议使用地图线条 + 小图组合
3. 插图方向
可以设计一套轻量线稿：

map line
mountain contour
tea steam
city gate silhouette
dumpling outline
pagoda silhouette
seal stamp
compass mark
但要现代、简洁，不要复古堆满。

九、品牌视觉元素建议
建议建立几个固定品牌元素：

1. Red Stamp CTA
所有保存、完成、解锁都可以用轻印章反馈。

2. Route Line
Journeys 用统一路线线条表达。

3. Atlas Grid
Explore 和 Collection 使用图册式网格。

4. Cultural Badge
内容类型 badge：

City
Food
Dynasty
Person
Season
Journey
5. Soft Map Texture
背景可以有非常浅的地图纹理，不要满屏纸纹。

十、现有 UI 需要避免的问题
根据当前项目状态，建议特别避免：

1. 中文装饰过多
中文可以保留，但不要和英文长句混排。

2. 所有卡片都长一样
现在很多 SectionCard 风格类似，导致模块识别度弱。
建议：

Hero card
Journey card
Detail section card
Collection card
Explore category card
都要有不同层级。

3. 红色使用过多或过重
红色是点缀，不是背景主色。

4. 纸纹过度
纸纹如果太多，会显旧。
建议只在少数卡片中用非常轻的 texture。

5. 游戏 UI 感过强
XP、等级、星星、稀有度、任务完成动效不要成为主视觉。

十一、建议补充到 PRD 的 UI 要求
可以把下面这段加到 PRD_GLOBAL_MARKET.md 或给代码模型：

UI Direction Requirement:
The app should be redesigned as a Modern Chinese Cultural Atlas for global users. The visual style should be premium, editorial, warm, and highly readable. Avoid stereotypical or overly decorative Chinese styling such as excessive red, gold, dragon patterns, heavy parchment textures, ornate borders, or oversized calligraphy. Use subtle Chinese cultural identity through restrained cinnabar accents, modern card layouts, atlas/map motifs, travel passport stamps, refined typography, high-quality imagery, and clean spacing.
The UI should feel like a modern museum guide, cultural travel journal, and collectible atlas. Home should have a strong hero discovery card. Explore should feel curated, not like a menu. Journeys should look like cultural routes with progress and map-line visuals. Collection should feel like a Cultural Atlas or Passport. Details pages should use beautiful hero images, short readable sections, and clear Explore Next cards.
English must be visually dominant. Chinese names and pinyin should appear as supporting cultural labels, not as competing text blocks. Rewards and stamps should feel elegant and meaningful, not game-like.
十二、UI 优化执行优先级
UI P0
必须先做：

Home Hero Discovery Card
Explore Hub 视觉系统
Journey Card 重设计
Detail Hero 统一
Collection 改成 Cultural Atlas
降低游戏化视觉权重
UI P1
继续做：

Share Card 视觉模板
Stamp / Badge 统一风格
Search Results 卡片
Profile Explorer Identity
Seasons Daily Ritual 视觉重构
UI P2
后续增强：

轻量地图纹理
插图系统
高级动效
深色模式精修
品牌视觉规范文档
最终建议
你现在的问题不是“没有中国风”，而是：

视觉元素有中国风倾向，但没有形成高级、统一、面向欧美用户的文化品牌系统。

下一步应该让代码模型重点做：

现代文化图册风格
高质量图片主视觉
Journey 路线感
Collection 护照感
英文优先的高级排版
克制中国元素
这样会比继续增加红色、纸纹、印章更有效。
