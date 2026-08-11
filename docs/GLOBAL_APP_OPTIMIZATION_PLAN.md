# BecomeChineseApp Global App Optimization Plan

**Target Market**: English-speaking global users, primarily Europe and North America  
**Primary Direction**: Modern Chinese Cultural Discovery App  
**Related PRD**: `docs/PRD_GLOBAL_MARKET.md`  
**Purpose**: This document records the functional, business logic, content, data, and UI optimization plan for the global-market version of BecomeChineseApp.

## 1. Overall Goal

Transform the current app from a multi-feature Chinese culture learning app into a clear, beautiful, and globally understandable cultural discovery product.

The target product should feel like:

- a modern cultural atlas
- a curated editorial guide
- a museum-style discovery app
- a travel journal
- a collectible China passport

The product loop should become:

```text
Discover -> Understand -> Explore Related -> Save -> Complete -> Share -> Continue
```

## 2. Current Key Problems

### 2.1 Product Structure

The current navigation is organized by content type:

- Home
- Seasons
- History
- Food
- Places
- Profile

This structure is understandable but does not strongly communicate a cultural exploration journey to global users.

### 2.2 Home Experience

The current Home screen gives too much priority to:

- XP
- Daily Quiz
- Daily Tasks
- Daily Sign-in
- Wrong Answer Review

This makes the app feel closer to a task-heavy learning app than a cultural discovery app.

### 2.3 Exploration Logic

The app has many modules, but it lacks a strong Explore hub that connects all cultural content through curated themes, journeys, and global search.

### 2.4 Content Relationships

The app already has some relationship data, but many related paths still rely on simple province-based matching. For a global cultural product, related content should explain why items are connected.

### 2.5 Journeys

The app already has cultural paths, but they should become a central product module. Journey nodes need explanation, progress logic, completion rules, and shareable results.

### 2.6 UI and Visual Identity

The current UI has some Chinese-style elements, such as paper texture, red accents, Chinese labels, stamps, and cards, but the overall style is not distinctive or premium enough.

The target UI should not rely on stereotypical Chinese decoration. It should become a modern, elegant, editorial cultural atlas.

## 3. Functional Optimization Priorities

## 3.1 P0 - Core Product Restructure

P0 work should establish the correct product structure and exploration loop.

### P0-1: Restructure Primary Navigation

Recommended navigation:

```text
Home / Explore / Journeys / Collection / Profile
```

If the app needs only four tabs:

```text
Home / Explore / Journeys / Collection
```

Profile can be accessed from the top-right corner or from Collection.

#### Requirements

- Move History, Food, Places, and Seasons into Explore as content categories.
- Make Journeys a core entry point.
- Promote Collection from Profile into a primary product area.
- Avoid making the app feel like a set of disconnected databases.

#### Acceptance Criteria

- Users can understand the main product structure within a few seconds.
- Cultural exploration, not quiz/task completion, becomes the main navigation logic.
- Journeys and Collection have visible product weight.

### P0-2: Redesign Home as a Discovery Entrance

Home should prioritize cultural discovery instead of tasks.

#### Target Home Modules

1. Today’s Discovery
2. Continue Your Journey
3. Featured Journey
4. Explore Categories
5. Progress Snapshot
6. Optional Daily Ritual

#### Today’s Discovery Logic

Today’s Discovery can be generated from:

- current solar term or seasonal content
- featured journey
- recently viewed related content
- editor-selected cultural theme
- beginner-friendly starter content

Recommended data structure:

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

#### Requirements

- Home must have one dominant CTA.
- Daily Quiz should not dominate the first screen.
- XP, level, sign-in, and daily tasks should be visually reduced.
- The first screen should feel like a cultural magazine cover or travel discovery card.

#### Acceptance Criteria

- The first screen clearly answers: what can I discover today?
- Returning users can continue their journey quickly.
- New users have an obvious first action.

### P0-3: Add or Redesign Explore Hub

Explore should become the central cultural discovery page.

#### Target Explore Modules

1. Global Search
2. Start Here
3. Categories
4. Featured Themes
5. Popular Journeys
6. Map Discovery
7. Recently Viewed

#### Categories

- Cities
- Dynasties
- People
- Food
- Seasons

#### Beginner-Friendly Themes

Recommended themes:

- First-time China
- Food Lover’s China
- Ancient Capitals
- Easy History
- Seasonal Traditions
- Famous Chinese Cities

Recommended `exploreThemes` fields:

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

#### Acceptance Criteria

- Users can enter all content types from one page.
- Explore feels curated, not like a plain menu.
- New users can find a beginner-friendly starting path.

### P0-4: Upgrade Paths into Journeys

Journeys should become a central long-term engagement module.

#### Journey Types

- City Journey
- Food Journey
- Dynasty Journey
- Seasonal Journey
- Mixed Cultural Journey

Recommended `journeys` data structure:

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
nodes[]
completionReward
shareTemplate
```

Recommended `journey.nodes` structure:

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

#### Completion Rules

Supported completion methods can include:

- viewed
- saved
- quizCompleted
- manuallyMarked
- shared

Minimum viable completion logic:

- viewed for a short duration
- or saved
- or manually marked as explored

#### Recommended First Journeys

Keep and improve existing paths:

- The Silk Road
- Tang Poetry Trail
- Imperial Beijing
- Sichuan Flavors
- Jiangnan Water Towns
- Festival Foods
- Maritime Silk Road
- Ancient Philosophers

Add beginner-friendly journeys:

- First Taste of China
- Ancient Capitals
- Tea and Daily Life
- Seasons and Festivals

#### Acceptance Criteria

- Journeys have an independent entry point.
- Each journey node explains why it matters.
- Users can see journey progress.
- Journey completion generates a reward and shareable result.

### P0-5: Build a Unified Content Relationship Model

Current simple province-based matching should be replaced or supplemented with explicit cultural relationship data.

Recommended `contentRelations` fields:

```text
sourceType
sourceId
targetType
targetId
relationType
reason
priority
```

Recommended relation types:

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
```

Example relationships:

```text
Tang Dynasty -> Xi’an
relationType: capital
reason: Chang’an, today’s Xi’an, was the Tang capital and one of the world’s largest cosmopolitan cities.

Chengdu -> Mapo Tofu
relationType: famousFor
reason: Mapo Tofu reflects the bold, spicy profile of Sichuan cooking.

Mid-Autumn Festival -> Mooncake
relationType: festivalFood
reason: Mooncakes are traditionally shared during the Mid-Autumn Festival as symbols of reunion.
```

#### UI Display Rule

Related content should be shown as:

- Explore Next
- Why connected
- Continue this journey

#### Acceptance Criteria

- Related recommendations do not rely only on province.
- Each detail page has at least three meaningful related items.
- Each related item has a clear reason.

### P0-6: Standardize Detail Page Structure

All detail pages should follow a consistent global-user-friendly structure.

#### Common Detail Structure

1. Hero image
2. English title
3. Chinese name + pinyin
4. One-line summary
5. Why it matters
6. Cultural story
7. Key facts
8. Explore next
9. Save / Share

#### City Detail Structure

- City name
- Chinese name + pinyin
- Region
- Why it matters
- Best known for
- Cultural story
- What to eat
- Related era
- Suggested journey

#### Dynasty Detail Structure

- Dynasty name
- Date range
- Simple era summary
- Why it matters
- What changed in China
- What you can still see today
- Key city
- Key people
- Suggested journey

#### Food Detail Structure

- English name
- Chinese name + pinyin
- Flavor profile
- Origin region
- Why it matters
- Cultural story
- When people eat it
- Related city or festival
- Optional cooking notes

#### Person Detail Structure

- Name
- Chinese name + pinyin
- Era
- Why they matter
- Cultural role
- Related city
- Related story
- Suggested journey

#### Season Detail Structure

- English-friendly name
- Chinese name + pinyin
- Time range
- Meaning in one sentence
- Natural changes
- Food or custom
- Gentle daily action
- Related journey

#### Acceptance Criteria

- Global users can understand each page quickly.
- Chinese text supports understanding but does not dominate the page.
- Every detail page has a clear next-step exploration path.

### P0-7: Add Beginner-Friendly Explanation Layer

All culturally specific topics should include a short beginner explanation.

Recommended fields:

```text
beginnerNote
whyItMatters
globalContext
pronunciation
```

Examples:

```text
Dynasty beginnerNote:
A dynasty is a historical period ruled by one royal family. Chinese history is often understood through these eras.

Solar Terms beginnerNote:
The 24 Solar Terms are a traditional Chinese calendar system that tracks seasonal changes, farming rhythms, and daily customs.

Dumplings beginnerNote:
Dumplings are one of the most familiar Chinese foods globally, but in China they also carry family and festival meanings.
```

#### Acceptance Criteria

- Users do not need Chinese cultural background to understand content.
- Key terms have short explanations.
- Cultural terminology is not left unexplained.

## 3.2 P1 - Retention, Sharing, and Identity

### P1-1: Upgrade Collection into Cultural Atlas

Collection should become a personal cultural atlas or China passport.

Recommended naming options:

- My Cultural Atlas
- My China Passport
- Heritage Collection

Target page structure:

1. Overall progress
2. Saved Cities
3. Completed Journeys
4. Food Collection
5. Dynasty Eras
6. Seasonal Discoveries
7. Stamp Album

#### Rarity Adjustment

Replace or reduce game-like rarity labels.

Instead of:

```text
common / rare / legendary
```

Use:

```text
Introductory / Iconic / Deep Cut / Hidden Gem
```

#### Acceptance Criteria

- Collection feels like a meaningful cultural archive.
- Users can see their exploration progress.
- Collection snapshots are shareable.

### P1-2: Redesign Seasons as Gentle Daily Ritual

The Seasons module should become a lightweight cultural daily entry, not mainly a quiz page.

Target structure:

1. Today’s seasonal note
2. Meaning
3. Food or custom
4. One gentle action
5. Related content
6. Optional mini quiz

Recommended `solarTerms` fields:

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

#### Acceptance Criteria

- Users can quickly understand today’s seasonal meaning.
- Quiz becomes optional, not primary.
- Each season connects to food, city, festival, or journey content.

### P1-3: Template Share Cards

Share should communicate cultural achievement, not just page screenshots.

Recommended share templates:

1. Today’s Discovery Card
2. Journey Completion Card
3. Food Trail Card
4. City Discovery Card
5. Cultural Atlas Snapshot
6. Name Card

Each share card should include:

- title
- subtitle
- achievement
- cultural fact
- visual identity
- app branding

#### Acceptance Criteria

- Share cards are readable for English-speaking users.
- Journey completion naturally leads to sharing.
- Shared content does not require Chinese reading ability.

### P1-4: Redesign Profile as Explorer Identity

Profile should represent the user as a cultural explorer.

Target structure:

1. Explorer name / avatar
2. Progress summary
3. Completed journeys
4. Stamps
5. Saved collections
6. Chinese name tool as a secondary feature
7. Share profile card

For the Chinese name generator, add a clear disclaimer:

```text
This is a playful cultural experience, not an official Chinese name.
```

#### Acceptance Criteria

- Profile reflects user exploration progress.
- The Chinese name generator does not dominate the main profile experience.
- Users can share their explorer identity.

### P1-5: Upgrade Global Search

Search should work across all content types.

Search scope:

- cities
- dynasties
- people
- food
- seasons
- journeys

Search result structure:

- Top result
- Category results
- Related journeys
- No-result suggestions

Example behavior:

```text
Search: spicy
Results: Sichuan Flavors, Mapo Tofu, Chengdu, Hot Pot

Search: poetry
Results: Tang Poetry Trail, Li Bai, Du Fu, Tang Dynasty
```

#### Acceptance Criteria

- Search is not a dead end.
- Cultural keywords produce useful results.
- Results encourage continued exploration.

### P1-6: Reduce Gamification Noise

Keep rewards, but make them support exploration.

Keep or emphasize:

- stamps
- journey completion
- collection progress
- profile milestones

Reduce visual priority for:

- daily tasks
- sign-in
- XP level
- wrong answer review

Tone change example:

```text
Before:
Task Complete! XP +20

After:
You explored a new cultural stop. Added to your journey.
```

#### Acceptance Criteria

- Rewards feel meaningful and cultural.
- The product does not feel like a task app.
- Home is not dominated by game mechanics.

## 3.3 P2 - Long-Term Enhancements

### P2-1: Add Onboarding

First-time users should understand the app in under one minute.

Suggested onboarding flow:

1. What this app is
2. Choose interests
   - Food
   - History
   - Cities
   - Festivals
   - Travel
3. Recommend first journey
4. Save first discovery

Recommended onboarding data:

```text
interests[]
firstJourneyId
preferredContentTypes[]
```

### P2-2: Explain Personalized Recommendations

Recommendation reasons should be visible.

Examples:

- Because you saved Chengdu
- Because you started Sichuan Flavors
- Because you explored Tang Dynasty
- Because today relates to seasonal food

Data sources:

- viewed items
- saved items
- completed journeys
- selected interests
- seasonal context

### P2-3: Add Editorial Content Packs

Recommended content packs:

- First-time China
- Famous Chinese Foods
- Ancient Capitals
- Chinese Festivals
- The Silk Road
- Tea Culture
- Chinese Poetry
- Regional China
- Food by Flavor
- China Through Seasons

Each content pack should include:

- description
- content list
- suggested journey
- share card

## 4. Recommended New Data Files

If additional data is needed, add structured files instead of hardcoding logic in UI components.

### 4.1 `journeys.js`

Purpose: make cultural journeys data-driven.

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

### 4.2 `contentRelations.js`

Purpose: centralize content relationship logic.

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

### 4.3 `exploreThemes.js`

Purpose: support curated Explore themes.

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

### 4.4 `featuredDiscoveries.js`

Purpose: support Home Today’s Discovery.

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

### 4.5 `solarTerms.js`

Purpose: strengthen the Seasons module.

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

### 4.6 `festivals.js`

Purpose: make festival culture easier for global users to understand.

Recommended starter festivals:

- Spring Festival
- Lantern Festival
- Qingming Festival
- Dragon Boat Festival
- Qixi Festival
- Mid-Autumn Festival
- Double Ninth Festival
- Winter Solstice

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

### 4.7 `contentGlossary.js`

Purpose: explain cultural terms for global users.

Starter terms:

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

Fields:

```text
term
shortDefinition
longDefinition
relatedContent
```

## 5. Recommended Content Expansion

### 5.1 Cities

Prioritize culturally rich cities that support journeys:

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

### 5.2 People

Prioritize globally understandable figures:

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

### 5.3 Food

Prioritize globally attractive or culturally important foods:

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

Each food item should include:

- flavor profile
- origin
- why it matters
- when people eat it
- beginner note

### 5.4 Festivals and Seasonal Content

Festivals are often easier for global users to understand than solar terms. Use festivals to support the Seasons module and cultural journeys.

Prioritize:

- Spring Festival
- Lantern Festival
- Qingming Festival
- Dragon Boat Festival
- Mid-Autumn Festival
- Winter Solstice

## 6. UI Planning Requirements

## 6.1 UI Vision

The UI should become a **Modern Chinese Cultural Atlas**.

It should feel like:

- a refined travel journal
- a modern museum guide
- a cultural magazine
- a collectible atlas
- a China passport

The UI should be premium, editorial, warm, and highly readable.

## 6.2 UI Principles

### 6.2.1 Avoid Stereotypical Chinese Decoration

Avoid relying on:

- excessive red
- excessive gold
- dragon patterns
- heavy parchment textures
- ornate borders
- oversized calligraphy
- too many stamp graphics
- dense Chinese text decoration

These can make the app feel stereotyped or visually cheap for global users.

### 6.2.2 Use Modern Cultural Identity

Use subtle cultural signals:

- restrained cinnabar accents
- atlas and map motifs
- travel passport stamps
- refined typography
- clean spacing
- high-quality imagery
- soft paper or map texture only when subtle

### 6.2.3 English-First Readability

English must be visually dominant. Chinese names and pinyin should support the experience, not compete with English content.

Recommended display pattern:

```text
Beijing
北京 · Běijīng
```

Avoid long bilingual mixed paragraphs like:

```text
Beijing / 北京 / 首都的礼制感与中轴秩序
```

## 6.3 Visual Style Direction

Recommended style name:

```text
Modern Cultural Atlas
```

Mood keywords:

- modern
- elegant
- warm
- premium
- editorial
- welcoming
- story-driven
- calm
- refined

## 6.4 Color System

### Background Colors

```text
Warm Ivory: #F8F3EA
Soft Rice Paper: #F4EBDD
Porcelain White: #FCFAF5
Ink Wash Light: #E9E1D4
```

### Primary Accent

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

- Use warm ivory or porcelain white for most backgrounds.
- Use cinnabar as accent, not as large background.
- Use red for CTA, stamp, active state, and key labels.
- Avoid high-saturation red backgrounds.

### Content Type Colors

| Content Type | Suggested Colors |
|---|---|
| Cities | Lake Blue / Jade Green |
| Dynasties | Deep Cinnabar / Muted Gold |
| Food | Tea Brown / Warm Gold |
| Seasons | Bamboo Green / Soft Blue |
| Journeys | Indigo Ink / Cinnabar |
| Collection | Muted Gold / Jade |

## 6.5 Typography

### Rules

- English typography should drive the hierarchy.
- Titles may use a refined serif feel.
- Body text should use a readable sans-serif.
- Chinese should be shown as supporting labels.

### Recommended Hierarchy

```text
Page title: 32px, 700-800
Card title: 20-24px, 700
Body: 15-16px, line-height 22-25
Secondary text: 13-14px, muted
Labels: 10-12px, uppercase, letter spacing
```

## 6.6 Component-Level UI Requirements

### 6.6.1 Home Hero Discovery Card

Home should start with a visually strong hero card.

Requirements:

- large image
- gradient overlay
- Today’s Discovery label
- title
- one-sentence summary
- clear CTA
- height around 260-320
- large radius around 28

The hero should feel like a cultural magazine cover, not a task card.

### 6.6.2 Explore Category Cards

Each category card should include:

- icon
- subtle illustration or texture
- English title
- one-line description
- item count
- theme color

Example:

```text
Cities
Explore China through places and regional stories.
42 places
```

### 6.6.3 Journey Cards

Journey cards should feel like cultural route cards or travel passport pages.

Requirements:

- cover image or map-line background
- journey title
- subtitle
- estimated time
- number of stops
- progress bar
- first 3 stops preview
- CTA

Visual motifs:

- dotted route line
- small route nodes
- subtle stamp
- progress indicator

Avoid pure icon-and-text list cards.

### 6.6.4 Detail Page Hero

Each content detail page should have:

- hero image
- gradient overlay
- content type badge
- English title
- Chinese name + pinyin
- one-line summary

Below the hero, use short readable sections:

- Why it matters
- Cultural story
- Key facts
- Explore next

### 6.6.5 Explore Next Cards

Each Explore Next card should show:

- target title
- content type
- relationship reason
- thumbnail or icon
- CTA

Example:

```text
Next Stop
Xi’an
Why here: It was Chang’an, the Tang capital and a Silk Road hub.
Explore
```

### 6.6.6 Collection / Cultural Atlas

Collection should visually feel like a passport, atlas, or curated gallery.

Target structure:

1. Cultural Atlas header
2. Progress summary
3. Categorized collection shelves
4. Stamps
5. Completed journeys
6. Share snapshot

Collection cards should include:

- image
- English title
- Chinese label
- type badge
- progress or collected state

Avoid overusing rarity stars.

### 6.6.7 Stamps and Badges

Stamps should feel like:

- travel passport stamps
- museum collection marks
- cultural seals

Rules:

- use restrained linework
- use cinnabar or muted gold
- avoid game-like explosive visuals
- keep unlock animation subtle

### 6.6.8 Profile / Explorer Identity

Profile should look like an explorer identity card.

Top section should show:

- avatar or initials
- explorer title
- journeys completed
- collection progress
- stamps collected

Chinese name generator should be a secondary card, not the main visual focus.

## 6.7 Page-Level UI Plan

### Home

Target structure:

1. Hero Discovery Card
2. Continue Journey
3. Featured Journeys carousel
4. Explore Categories grid
5. Cultural Atlas progress
6. Optional Daily Ritual

Visual priority:

- first screen must be beautiful and memorable
- hero card must be the brand anchor
- daily quiz must not dominate

### Explore

Target structure:

1. Search bar
2. Start Here banner
3. Category cards
4. Featured themes
5. Map discovery teaser
6. Popular journeys

Visual priority:

- curated catalog feel
- not a plain feature menu
- every section should invite exploration

### Journeys

Target structure:

1. Page title and description
2. Featured journey hero
3. Journey categories
4. Journey list
5. Completed journeys

Visual priority:

- route and travel feeling
- clear progress
- strong cover imagery and route line visuals

### Detail Pages

Target structure:

1. Hero
2. Quick summary
3. Why it matters
4. Cultural story
5. Key facts
6. Related content
7. Save / Share action

Visual priority:

- premium cultural card feeling
- not a plain data page
- short readable sections

### Collection

Target structure:

1. Cultural Atlas header
2. Overall progress
3. Collection categories
4. Stamp album
5. Completed journeys
6. Share snapshot

Visual priority:

- passport / atlas feeling
- users should want to screenshot or share it

## 6.8 Motion Design

### Principles

Motion should be:

- subtle
- elegant
- meaningful
- not game-like

### Recommended Motion

- hero card fade-in
- journey progress line draw
- save stamp press
- collection card reveal
- Explore Next card slide-in
- share card generation
- subtle hero image parallax

### Avoid

- excessive sparkle
- explosion particles
- heavy bounce
- frequent popups
- long animation duration

## 6.9 Image and Illustration Requirements

### Image Quality

Images should be:

- high-resolution
- warm and consistent in tone
- authentically Chinese
- not visually Japanese or Korean
- not overly AI-looking
- suitable for hero cards

### Usage Rules

- Home Hero requires a high-quality image.
- Detail pages should have hero images.
- Journey cards may combine maps, route lines, and thumbnails.
- Category cards can use subtle illustration or line art.

### Suggested Illustration Motifs

- map lines
- mountain contours
- tea steam
- city gate silhouette
- dumpling outline
- pagoda silhouette
- seal stamp
- compass mark

The illustration style should be modern and simple.

## 6.10 Brand Visual Elements

Use a few consistent brand motifs:

1. **Red Stamp CTA**  
   Use for save, complete, and unlock feedback.

2. **Route Line**  
   Use for Journeys and progress.

3. **Atlas Grid**  
   Use for Explore and Collection.

4. **Cultural Type Badge**  
   Use for City, Food, Dynasty, Person, Season, and Journey.

5. **Soft Map Texture**  
   Use very subtly in background areas.

## 6.11 UI Anti-Patterns to Avoid

Avoid:

- too much Chinese decorative text
- every card looking identical
- red used too heavily
- excessive paper texture
- game UI dominance
- dense bilingual paragraphs
- overly ornate borders
- generic cultural stock imagery

## 6.12 UI Implementation Priority

### UI P0

1. Home Hero Discovery Card
2. Explore Hub visual system
3. Journey Card redesign
4. Unified Detail Hero
5. Collection as Cultural Atlas
6. Reduce game-like visual priority

### UI P1

1. Share Card templates
2. Stamp and Badge visual unification
3. Search Result cards
4. Profile Explorer Identity
5. Seasons Daily Ritual redesign

### UI P2

1. Subtle map texture system
2. Illustration system
3. Advanced motion
4. Dark mode polish
5. Brand visual specification

## 7. Suggested Execution Roadmap

### Phase 1: Product Structure

- Navigation restructure
- Home redesign
- Explore Hub
- Journeys as core module
- Collection as primary module

### Phase 2: Relationship and Journey Logic

- Add contentRelations
- Add journey node reasons
- Add Explore Next sections
- Improve progress tracking
- Add recommendation reasons

### Phase 3: Global Content Layer

- Add whyItMatters
- Add beginnerNote
- Add pronunciation
- Add globalContext
- Reduce Chinese-heavy mixed text

### Phase 4: UI System

- Apply Modern Cultural Atlas style
- Add hero cards
- Redesign journey cards
- Redesign detail heroes
- Redesign Cultural Atlas

### Phase 5: Retention and Sharing

- Journey completion cards
- Cultural Atlas snapshots
- Explorer Profile
- Elegant stamps and badges
- Share card templates

### Phase 6: Content Expansion

- Add more cities
- Add more people
- Add more food items
- Add festivals
- Add glossary
- Add editorial content packs

## 8. Direct Instruction for Code Model

Use the following instruction when asking a code model to optimize the app:

```text
Optimize BecomeChineseApp based on docs/PRD_GLOBAL_MARKET.md and docs/GLOBAL_APP_OPTIMIZATION_PLAN.md.

The app should become a Modern Chinese Cultural Atlas for English-speaking global users. Prioritize product structure, exploration loop, journeys, collection, and English-first cultural readability.

Main requirements:
1. Restructure navigation toward Home / Explore / Journeys / Collection / Profile.
2. Redesign Home around Today’s Discovery, Continue Your Journey, Featured Journey, Explore Categories, and Progress Snapshot.
3. Create an Explore Hub with global search, Start Here, categories, featured themes, popular journeys, and map discovery.
4. Upgrade Paths into data-driven Journeys with node reasons, progress, completion rules, and shareable results.
5. Add a unified contentRelations model so related content explains why it is connected.
6. Standardize detail pages with Hero, English title, Chinese name + pinyin, one-line summary, Why it matters, Cultural story, Key facts, Explore next, Save, and Share.
7. Add beginner-friendly explanation fields such as beginnerNote, whyItMatters, globalContext, and pronunciation.
8. Upgrade Collection into a Cultural Atlas / China Passport experience.
9. Reduce task-heavy and game-like elements on Home, including XP, daily sign-in, daily tasks, and quiz dominance.
10. Redesign UI as a premium Modern Chinese Cultural Atlas. Avoid excessive red, gold, dragons, heavy parchment, ornate borders, and dense bilingual text. Use restrained cinnabar accents, warm ivory backgrounds, refined typography, map/atlas motifs, passport stamps, clean cards, high-quality imagery, and English-first layout.
11. If content is thin, add structured data for journeys, contentRelations, exploreThemes, featuredDiscoveries, solarTerms, festivals, and contentGlossary.
```
