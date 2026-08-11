# BecomeChineseApp Global App Development Specification

**Target Market**: English-speaking users in Europe and North America  
**Product Direction**: Modern Chinese Cultural Discovery App  
**Related Documents**:  
- `docs/PRD_GLOBAL_MARKET.md`  
- `docs/GLOBAL_APP_OPTIMIZATION_PLAN.md`  

**Purpose**: This document is the development reference for rebuilding and optimizing BecomeChineseApp into an English-first cultural discovery product for global users.

---

## 1. Development Objective

The application should be developed as a modern cultural discovery app, not a task-heavy learning app and not a static encyclopedia.

The target product experience is:

```text
Discover -> Understand -> Explore Related -> Save -> Complete -> Share -> Continue
```

All product, UI, data, and business logic decisions should support this loop.

The app should feel like:

- a modern cultural atlas
- a curated editorial guide
- a museum-style discovery app
- a travel journal
- a collectible China passport

---

## 2. Core Development Principles

### 2.1 English-first

All primary UI text and content explanations must be natural English. Chinese names and pinyin may appear as supporting cultural labels.

Example:

```text
Beijing
北京 · Běijīng
```

Avoid long mixed English/Chinese text blocks.

### 2.2 Beginner-friendly by default

Assume the user has limited prior knowledge of Chinese culture. Every culturally specific concept should include a short explanation.

Examples:

- Dynasty
- Solar Terms
- Jiangnan
- Lingnan
- Hutong
- Dim Sum
- Silk Road

### 2.3 Exploration over tasks

The app should prioritize discovery, journeys, collections, and cultural context. Daily quiz, XP, sign-in, and task systems should not dominate the main experience.

### 2.4 Relationships over isolated pages

Every content detail page should have clear related content with an explanation of why the connection matters.

### 2.5 Modern Chinese cultural identity

The visual style should be premium, editorial, warm, and readable. Avoid stereotypical Chinese decoration.

---

## 3. Target Information Architecture

### 3.1 Recommended Primary Navigation

Preferred structure:

```text
Home
Explore
Journeys
Collection
Profile
```

If the app must use four tabs, use:

```text
Home
Explore
Journeys
Collection
```

Profile can be accessed from the top-right avatar or inside Collection.

### 3.2 Navigation Rules

- `History`, `Food`, `Places`, and `Seasons` should not remain separate primary tabs in the final global-market structure.
- These modules should be available inside `Explore`.
- `Journeys` should become a first-class product module.
- `Collection` should become a first-class product module instead of being hidden inside Profile.

---

## 4. Main Modules and Development Requirements

---

## 4.1 Home

### Purpose

Home should answer one question immediately:

```text
What should I explore today?
```

### Required Sections

1. Today’s Discovery
2. Continue Your Journey
3. Featured Journey
4. Explore Categories
5. Progress Snapshot
6. Optional Daily Ritual

### Business Rules

- The first screen must have one visually dominant cultural discovery card.
- Daily Quiz, Daily Tasks, Sign-in, XP, and Wrong Answer Review must not dominate the first screen.
- Returning users should see continuity through unfinished journeys or recently viewed content.
- New users should see beginner-friendly discovery suggestions.

### Today’s Discovery Logic

The recommended item can come from:

- current solar term or season
- featured journey
- beginner-friendly content
- recently viewed related content
- curated discovery list

### Required Data Support

A `featuredDiscoveries` dataset or equivalent logic is recommended.

Recommended fields:

```text
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
```

### Acceptance Criteria

- User understands the main action within 3 seconds.
- Home feels like a cultural discovery product, not a quiz dashboard.
- There is a clear CTA to start or continue exploration.

---

## 4.2 Explore

### Purpose

Explore is the central discovery hub for all cultural content.

### Required Sections

1. Global Search
2. Start Here
3. Categories
4. Featured Themes
5. Popular Journeys
6. Map Discovery teaser
7. Recently Viewed

### Categories

- Cities
- Dynasties
- People
- Food
- Seasons

### Start Here Examples

- First-time China
- Food Lover’s China
- Ancient Capitals
- Easy History
- Seasonal Traditions
- Famous Chinese Cities

### Business Rules

- Explore should feel curated, not like a menu.
- Each category card should include a short explanation and content count.
- Explore should provide beginner-friendly paths.
- Search should work across all major content types.

### Required Data Support

An `exploreThemes` dataset is recommended.

Recommended fields:

```text
id
title
subtitle
description
targetType
targetId
difficulty
tags
imageAsset
```

### Acceptance Criteria

- User can access all content types from one place.
- User can start with beginner-friendly themes.
- Explore encourages deeper discovery instead of simple browsing.

---

## 4.3 Journeys

### Purpose

Journeys are the core long-term exploration feature.

They should replace the feeling of disconnected browsing with curated cultural paths.

### Journey Types

- City Journey
- Food Journey
- Dynasty Journey
- Seasonal Journey
- Mixed Cultural Journey

### Required Journey Data Structure

```text
id
title
subtitle
description
theme
difficulty
estimatedTime
coverImage
tags
nodes
completionReward
shareTemplate
```

### Required Node Data Structure

```text
id
type
targetId
title
subtitle
reason
requiredAction
completionRule
order
```

### Completion Rules

Support one or more of the following:

```text
viewed
saved
quizCompleted
manuallyMarked
shared
```

Minimum recommended logic:

- viewed detail page for a minimum time
- or saved item
- or manually marked as explored

### Required Journey UI

Each Journey should show:

- cover visual
- title and subtitle
- estimated time
- number of stops
- progress bar
- ordered nodes
- explanation for each node
- completion state
- shareable result

### Recommended Initial Journeys

- The Silk Road
- Tang Poetry Trail
- Imperial Beijing
- Sichuan Flavors
- Jiangnan Water Towns
- Festival Foods
- Maritime Silk Road
- Ancient Philosophers
- First Taste of China
- Ancient Capitals
- Tea and Daily Life
- Seasons and Festivals

### Business Rules

- Each Journey node must explain why it belongs to the journey.
- Journey completion should represent real exploration, not just random saving.
- Completed journeys should unlock a stamp or completion card.
- After completing a journey, recommend the next journey.

### Acceptance Criteria

- Journeys have an independent entry point.
- User can see progress clearly.
- User understands why each stop matters.
- Completion creates a meaningful shareable result.

---

## 4.4 Content Detail Pages

### Purpose

Every detail page should be readable, beautiful, and connected to the wider cultural graph.

### Universal Detail Structure

All content detail pages should follow this structure:

1. Hero image
2. English title
3. Chinese name + pinyin
4. One-line summary
5. Why it matters
6. Cultural story
7. Key facts
8. Explore Next
9. Save / Share actions

### City Detail Requirements

Required sections:

- city name
- Chinese name + pinyin
- region
- one-line summary
- why it matters
- best known for
- cultural story
- what to eat
- related era
- related people
- suggested journey

### Dynasty Detail Requirements

Required sections:

- dynasty name
- date range
- simple era summary
- why it matters
- what changed in China
- what you can still see today
- key city
- key people
- suggested journey

Rulers and emperor lists should be secondary or collapsible.

### Food Detail Requirements

Required sections:

- English name
- Chinese name + pinyin
- flavor profile
- origin city or region
- why it matters
- cultural story
- when people eat it
- related city or festival
- related journey

Ingredients and cooking steps should be optional or collapsed. The Food module should not feel like a recipe database.

### Person Detail Requirements

Required sections:

- name
- Chinese name + pinyin
- era
- why they matter
- cultural role
- related city
- related story
- suggested journey

### Season Detail Requirements

Required sections:

- English-friendly name
- Chinese name + pinyin
- time range
- meaning in one sentence
- natural changes
- food or custom
- gentle daily action
- related journey

### Acceptance Criteria

- Every detail page has a clear next step.
- English is visually dominant.
- Chinese appears as supporting context.
- Each page includes beginner-friendly context.

---

## 4.5 Content Relationship Model

### Purpose

Build a real cultural graph instead of relying only on province-based matching.

### Recommended Data File

Create or extend a content relation data source, such as:

```text
contentRelations.js
```

### Required Relation Fields

```text
sourceType
sourceId
targetType
targetId
relationType
reason
priority
```

### Relation Types

Recommended values:

```text
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
seasonalCustom
philosophy
```

### Example Relations

```text
Tang Dynasty -> Xi’an
relationType: capital
reason: Chang’an, today’s Xi’an, was the Tang capital and one of the world’s largest cosmopolitan cities.
```

```text
Chengdu -> Mapo Tofu
relationType: famousFor
reason: Mapo Tofu reflects the bold, spicy profile of Sichuan cooking.
```

```text
Mid-Autumn Festival -> Mooncake
relationType: festivalFood
reason: Mooncakes are traditionally shared during the Mid-Autumn Festival as symbols of reunion.
```

### Display Rules

Related content should be shown as `Explore Next`, not merely `Related Paths`.

Each related item must display:

- target title
- content type
- reason
- CTA

### Acceptance Criteria

- Each detail page has at least three high-quality related items where possible.
- Each relationship has a reason.
- Recommendations no longer rely only on province matching.

---

## 4.6 Collection

### Purpose

Collection should become a personal cultural atlas or China passport.

### Recommended Product Names

- My Cultural Atlas
- My China Passport
- Heritage Collection

### Required Sections

1. Overall progress
2. Saved Cities
3. Completed Journeys
4. Food Collection
5. Dynasty Eras
6. Seasonal Discoveries
7. Stamp Album
8. Share Snapshot

### Business Rules

- Collection should be a first-class navigation item.
- It should not feel like a simple bookmark list.
- Completion and progress should be visible.
- Users should be able to share a collection snapshot.

### Rarity Replacement Recommendation

If rarity is used, avoid game-like labels such as:

```text
common / rare / legendary
```

Recommended cultural labels:

```text
Introductory
Iconic
Deep Cut
Hidden Gem
```

### Acceptance Criteria

- Collection communicates user identity and progress.
- User can browse saved items by content type.
- User can see completed journeys and stamps.

---

## 4.7 Seasons

### Purpose

Seasons should become a gentle daily cultural ritual, not mainly a quiz page.

### Required Sections

1. Today’s seasonal note
2. Meaning
3. Nature change
4. Food or custom
5. One gentle action
6. Related content
7. Optional mini quiz

### Required Data Fields

For each solar term or seasonal entry:

```text
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
```

### Business Rules

- Quiz should be optional and secondary.
- Seasonal content should be understandable in one short view.
- Each seasonal entry should connect to food, custom, city, or journey.

### Acceptance Criteria

- User understands what the seasonal term means.
- User gets one culturally meaningful action.
- Seasonal module supports repeat visits without pressure.

---

## 4.8 Profile

### Purpose

Profile should represent the user as a cultural explorer.

### Required Sections

1. Explorer identity
2. Journey progress
3. Collection progress
4. Stamps and milestones
5. Saved collections
6. Share profile card
7. Chinese name tool as secondary feature

### Chinese Name Tool Rule

If the Chinese name generator remains, include a clear explanation:

```text
This is a playful cultural experience, not an official Chinese name.
```

### Acceptance Criteria

- Profile is not dominated by name generation.
- User identity is based on exploration progress.
- User can share a tasteful explorer card.

---

## 4.9 Search

### Purpose

Search should allow discovery across the entire cultural graph.

### Search Scope

- cities
- dynasties
- people
- food
- seasons
- journeys
- glossary terms

### Required Result Structure

- Top result
- Category results
- Related journeys
- No-result suggestions

### Example Logic

Search `spicy` should return:

- Sichuan Flavors
- Mapo Tofu
- Chengdu
- Hot Pot

Search `poetry` should return:

- Tang Poetry Trail
- Li Bai
- Du Fu
- Tang Dynasty

### Acceptance Criteria

- Search works globally.
- No-result state provides useful suggestions.
- Search results encourage continued exploration.

---

## 5. Data and Content Development Requirements

---

## 5.1 Required or Recommended Data Files

### journeys

Purpose: data-driven journey module.

Fields:

```text
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
```

### contentRelations

Purpose: unified cultural relationship model.

Fields:

```text
sourceType
sourceId
targetType
targetId
relationType
reason
priority
```

### exploreThemes

Purpose: curated Explore hub themes.

Fields:

```text
id
title
subtitle
description
targetType
targetId
difficulty
tags
imageAsset
```

### featuredDiscoveries

Purpose: Home Today’s Discovery.

Fields:

```text
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
```

### solarTerms

Purpose: strengthen Seasons module.

Fields:

```text
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
```

### festivals

Purpose: make seasonal and food culture more understandable for global users.

Fields:

```text
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
```

### contentGlossary

Purpose: explain key cultural terms.

Fields:

```text
term
shortDefinition
longDefinition
relatedContent
```

---

## 5.2 Content Expansion Priorities

### Cities

Recommended additions:

- Luoyang
- Kaifeng
- Dunhuang
- Datong
- Pingyao
- Quanzhou
- Shaoxing
- Wuzhen
- Dali
- Kashgar

### People

Recommended additions or prioritization:

- Confucius
- Laozi
- Li Bai
- Du Fu
- Su Shi
- Wang Xizhi
- Xuanzang
- Zheng He
- Wu Zetian
- Zhuge Liang

### Food

Recommended high-interest foods:

- Peking Duck
- Dumplings
- Xiaolongbao
- Mapo Tofu
- Kung Pao Chicken
- Hot Pot
- Dim Sum
- Zongzi
- Mooncake
- Tangyuan
- Lanzhou Beef Noodles
- Roujiamo

### Festivals

Recommended first batch:

- Spring Festival
- Lantern Festival
- Qingming Festival
- Dragon Boat Festival
- Qixi Festival
- Mid-Autumn Festival
- Double Ninth Festival
- Winter Solstice

### Glossary Terms

Recommended first batch:

- Dynasty
- Solar Terms
- Silk Road
- Jiangnan
- Lingnan
- Hutong
- Dim Sum
- Teahouse
- Mid-Autumn Festival
- Dragon Boat Festival
- Pinyin
- Calligraphy
- Confucianism
- Daoism

---

## 6. UI Development Specification

---

## 6.1 Visual Direction

The app should be redesigned as a:

```text
Modern Chinese Cultural Atlas
```

The visual style should be:

- modern
- premium
- editorial
- warm
- readable
- culturally distinctive
- subtle rather than decorative

### Avoid

- excessive red and gold
- dragon patterns
- heavy parchment textures
- ornate traditional borders
- oversized calligraphy
- too many decorative Chinese motifs
- game-like reward visuals

---

## 6.2 Color System

### Recommended Background Colors

```text
Warm Ivory: #F8F3EA
Soft Rice Paper: #F4EBDD
Porcelain White: #FCFAF5
Ink Wash Light: #E9E1D4
```

### Primary Accent Colors

```text
Cinnabar: #B94A32
Deep Cinnabar: #8F2F24
```

### Supporting Colors

```text
Jade Green: #557C70
Indigo Ink: #243B53
Tea Brown: #8A6A4F
Muted Gold: #C49A4A
Lake Blue: #5F8FA8
Bamboo Green: #6F8F72
```

### Text Colors

```text
Ink Black: #1F1A17
Soft Black: #302A26
Muted Text: #7A6F66
```

### Usage Rules

- Use warm ivory or porcelain white as the main background.
- Use cinnabar only for CTA, active state, stamps, and highlights.
- Do not use bright red as a large page background.
- Different content types may use subtle theme colors.

---

## 6.3 Typography

### Requirements

- English must be visually dominant.
- Chinese and pinyin should be secondary labels.
- Use generous line height for readability.

### Recommended Hierarchy

```text
Page title: 32px / 700-800
Card title: 20-24px / 700
Body text: 15-16px / line-height 22-25
Supporting text: 13-14px / muted
Labels: 10-12px / uppercase / letter spacing
```

---

## 6.4 Component Requirements

### Home Hero Discovery Card

Required:

- large image
- gradient overlay
- Today’s Discovery label
- title
- short summary
- CTA

Style:

- height around 260-320
- large rounded corners
- editorial magazine cover feel

### Explore Category Card

Required:

- icon or subtle illustration
- title
- one-line explanation
- item count
- theme color

### Journey Card

Required:

- cover image or map-line background
- journey title
- subtitle
- estimated time
- number of stops
- progress bar
- preview of first stops
- CTA

Visual style:

- travel route card
- passport/journal feel
- subtle route line and node markers

### Detail Hero

Required:

- hero image
- gradient overlay
- content type badge
- English title
- Chinese name + pinyin
- one-line summary

### Explore Next Card

Required:

- target title
- content type
- connection reason
- thumbnail or icon
- CTA

### Collection Card

Required:

- image or icon
- English title
- Chinese small label
- content type badge
- progress or saved state

### Stamp / Badge

Style:

- travel passport stamp
- museum collection mark
- cultural seal
- restrained cinnabar or muted gold
- not game-like

---

## 6.5 Page-level UI Requirements

### Home

Layout:

1. Hero Discovery Card
2. Continue Journey
3. Featured Journeys carousel
4. Explore Categories grid
5. Cultural Atlas progress
6. Optional Daily Ritual

### Explore

Layout:

1. Search bar
2. Start Here banner
3. Category cards
4. Featured themes
5. Map discovery teaser
6. Popular journeys

### Journeys

Layout:

1. Page title and description
2. Featured journey hero
3. Journey categories
4. Journey list
5. Completed journeys

### Detail Pages

Layout:

1. Hero
2. Quick summary
3. Why it matters
4. Cultural story
5. Key facts
6. Explore Next
7. Save / Share floating action

### Collection

Layout:

1. Cultural Atlas header
2. Overall progress
3. Collection categories
4. Stamp album
5. Completed journeys
6. Share snapshot

### Profile

Layout:

1. Explorer card
2. Journey progress
3. Collection progress
4. Stamps and milestones
5. Secondary tools

---

## 6.6 Animation Requirements

### Recommended Animations

- hero card fade-in
- journey progress line draw
- save stamp press
- collection card reveal
- Explore Next card slide-in
- share card generation
- subtle hero image parallax

### Avoid

- excessive sparkles
- explosion particles
- heavy bounce effects
- frequent popups
- long blocking animations

---

## 6.7 Image and Illustration Requirements

### Image Requirements

- high quality
- warm tone
- authentic Chinese scenes
- consistent color treatment
- avoid obvious AI artifacts
- avoid Japanese/Korean visual confusion

### Illustration Direction

Use subtle modern line art:

- map lines
- mountain contours
- tea steam
- city gate silhouette
- dumpling outline
- pagoda silhouette
- seal mark
- compass mark

Avoid overly ornate traditional patterns.

---

## 7. Reward and Gamification Rules

### Keep

- stamps
- journey completion
- collection progress
- profile milestones

### De-emphasize

- daily tasks
- sign-in pressure
- XP level dominance
- wrong-answer review on Home
- rarity as a primary visual system

### Copywriting Direction

Prefer exploration language:

```text
You explored a new cultural stop.
Added to your journey.
```

Avoid overly game-like language:

```text
Task Complete!
XP +20
```

---

## 8. Development Phases

### Phase 1: Product Structure

Deliver:

- new navigation structure
- redesigned Home
- Explore hub
- independent Journeys module
- independent Collection module

### Phase 2: Content Graph

Deliver:

- contentRelations model
- Explore Next cards
- relationship reasons
- improved Journey node reasons
- better continue-exploring logic

### Phase 3: International Content Layer

Deliver:

- whyItMatters fields
- beginnerNote fields
- pinyin/pronunciation support
- globalContext fields where useful
- English-first content cleanup

### Phase 4: UI System

Deliver:

- Modern Chinese Cultural Atlas visual system
- hero cards
- journey cards
- detail heroes
- Collection atlas layout
- elegant stamp/badge style

### Phase 5: Sharing and Retention

Deliver:

- journey completion share cards
- collection snapshot cards
- explorer profile card
- seasonal daily ritual
- softer reward system

### Phase 6: Content Expansion

Deliver:

- additional cities
- additional people
- additional foods
- festivals
- glossary
- new journeys

---

## 9. Acceptance Checklist

Before considering the global-market rebuild complete, verify:

- Home has one clear cultural discovery action.
- Explore is a real hub, not just a menu.
- Journeys are first-class and progress-based.
- Collection feels like a Cultural Atlas or Passport.
- Detail pages include `Why it matters` and `Explore Next`.
- Relationships include explanations.
- English is the dominant reading layer.
- Chinese is a secondary cultural support layer.
- Daily quiz and XP no longer dominate the app.
- UI feels premium, modern, and culturally distinctive.
- The app avoids stereotypical Chinese decoration.
- Users can discover, understand, save, complete, share, and continue.

---

## 10. Implementation Instruction for Code Models

When using an AI code model or development agent, use this instruction:

```text
Please implement BecomeChineseApp according to docs/PRD_GLOBAL_MARKET.md, docs/GLOBAL_APP_OPTIMIZATION_PLAN.md, and docs/GLOBAL_APP_DEVELOPMENT_SPEC.md.

The app must become an English-first Modern Chinese Cultural Discovery App for global users. Prioritize Home, Explore, Journeys, Collection, content relationships, detail page structure, and modern premium UI. Reduce task-heavy gamification. Build or extend data structures for journeys, contentRelations, exploreThemes, featuredDiscoveries, solarTerms, festivals, and glossary where needed. All detail pages must include beginner-friendly explanations, Why it matters, and Explore Next with relationship reasons. The UI should feel like a modern cultural atlas, museum guide, travel journal, and collectible passport.
```
