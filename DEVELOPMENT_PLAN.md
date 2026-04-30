# BecomeChineseApp Development Plan

## 1. Goal

Turn the product design direction into an implementation plan for a modern Chinese culture atlas app aimed at English-speaking users.

This document is the technical companion to `PRODUCT_DESIGN.md` and `PRODUCT_FLOW.md`.

The implementation should support:
- content discovery
- clear navigation
- meaningful user actions
- visible progress feedback
- province-linked cultural relationships
- a polished final profile/archive experience

---

## 2. Implementation Principles

### 2.1 Build for clarity first
Before adding more content, the UI system must be easy to scan and understand.

### 2.2 Keep one primary action per screen
Each screen should have one dominant action and a clear next step.

### 2.3 Preserve cultural meaning through structure
The app should express Chinese culture through its organization, relationships, and content hierarchy.

### 2.4 Keep English readable first
English should remain the main reading layer for the audience.

### 2.5 Make progress visible
All meaningful actions should produce visible state changes in the UI and archive.

---

## 3. Technical Scope

### Frontend areas
- theme system
- shared component system
- navigation structure
- Home screen
- Seasons screen
- History list and detail screens
- Food list and detail screens
- Places list and detail screens
- Persona/Profile screen
- related-path UI blocks
- feedback and progress UI

### Data areas
- cities data
- recipes data
- dynasties data
- quiz data
- Chinese name generator data
- cultural asset persistence

### Behavior areas
- haptics
- speech playback
- bookmark and collection handling
- quiz solving and streak logic
- province connection logic
- archive summary generation

---

## 4. UI System Implementation Plan

### 4.1 Base theme
Implement and keep a restrained visual system:
- warm light background
- clear red accent color
- soft border and shadow system
- compact but readable spacing
- consistent radius scale
- minimal texture

#### Tasks
- verify `theme/colors.js`
- verify `theme/theme.js`
- verify `GlobalPaperBackground`
- keep the palette consistent across screens

---

### 4.2 Shared components
Refactor and standardize the reusable visual blocks.

#### Components to keep aligned
- `ScreenHeader`
- `SectionCard`
- `StampFeedback`
- `HandscrollContainer`
- `PaperTexture`
- `SealTexture`
- `ChinaConnectionMap`
- any related-path card component if split later

#### Rules
- shared components should support a clean editorial look
- cards should not carry page-specific logic
- actions and states should be reusable

---

## 5. Screen Implementation Plan

### 5.1 Home
#### Purpose
Decision layer and daily entry.

#### Implementation focus
- keep the page concise
- emphasize one main daily action
- show a simple progress summary
- keep quick module navigation visible but secondary

#### Work items
- maintain a single primary ritual card
- keep stats compact
- ensure quick actions do not compete with the main CTA
- keep copy short and clear

---

### 5.2 Seasons
#### Purpose
Single daily ritual entry point.

#### Implementation focus
- the page should center the user on today’s action
- keep answer states obvious
- show completion feedback immediately

#### Work items
- keep the date/solar term hero readable
- keep one daily quiz or ritual flow
- maintain streak and solved totals
- make answer state styling stronger
- keep stamp feedback clearly visible

---

### 5.3 History
#### Purpose
Civilizational story stream.

#### Implementation focus
- make dynasty cards feel like editorial chapters
- keep detail sections readable and expandable
- keep related paths clear and actionable

#### Work items
- preserve horizontal journey style if it works well on device
- ensure detail cards have strong hierarchy
- standardize related-path chips as action cards
- keep emperor sections compact and collapsible

---

### 5.4 Food
#### Purpose
Regional cuisine story atlas.

#### Implementation focus
- keep dish cards visually appealing but readable
- preserve strong story, taste, etiquette, and substitution hierarchy
- make related paths feel like next-step cards

#### Work items
- keep hero card image-led
- keep modal sheet readable on smaller screens
- keep bookmark feedback prominent
- preserve province-linked relationships
- ensure related-path chips invite continuation

---

### 5.5 Places
#### Purpose
City essay and regional character.

#### Implementation focus
- reduce any map-like block from dominating the page
- let city cards become the main browsing flow
- keep the geographic entry as a supporting module only

#### Work items
- make top geography entry smaller and lighter if needed
- prioritize the city list and active card
- keep expanded city details easy to scan
- standardize related-path chips with Food/History

---

### 5.6 Persona
#### Purpose
Archive of truth and identity altar.

#### Implementation focus
- make the page feel like a final summary of the user’s cultural path
- keep the generated identity, atlas, progress, badges, and saved names clear
- avoid visual clutter

#### Work items
- keep name generation interaction simple
- ensure save and speak actions are prominent
- keep atlas map readable
- keep milestones compact and clear
- keep share card polished

---

## 6. Data and State Implementation Plan

### 6.1 Cultural assets persistence
Maintain and verify:
- favorites
- quiz solved state
- streak counts
- province connection map state
- saved names
- badge unlocks

### 6.2 Province linkage
Every favorite action should continue to drive province connection logic.

### 6.3 Related content lookup
Continue using province IDs to link:
- city ↔ food
- city ↔ dynasty
- food ↔ dynasty
- dynasty ↔ place

### 6.4 Persona aggregation
Keep Persona as the summary surface for:
- unlocks
- solved count
- streak
- saved content
- connected provinces

---

## 7. Interaction Implementation Plan

### 7.1 Feedback system
Each meaningful action should trigger at least one visible feedback type:
- haptic pulse
- stamp feedback
- selected state
- saved state
- solved state
- progress update

### 7.2 Action patterns
Use a consistent pattern across modules:
- primary action button
- secondary save/bookmark action
- related-path continuation

### 7.3 Loading and empty states
Every page should have sensible states for:
- loading data
- no favorites yet
- unsolved daily quiz
- empty related paths

---

## 8. Navigation Implementation Plan

### 8.1 Top-level tabs
Maintain the six-tab structure:
- Home
- Seasons
- History
- Food
- Places
- Profile

### 8.2 Navigation rules
- Home sends users into one next action
- Seasons owns the daily ritual loop
- Detail pages continue the exploration chain
- Persona is the archive endpoint

### 8.3 Detail entry strategy
Detail pages should continue to accept internal navigation from related paths.

---

## 9. Content Writing Guidelines for Implementation

### 9.1 Copy principles
- concise
- explanatory without overload
- friendly to non-Chinese users
- short labels for actions
- Chinese terms used as support, not clutter

### 9.2 Content tone
- calm
- editorial
- modern
- informative
- culturally warm

### 9.3 Content structure
Prefer:
- one-sentence summaries
- short supporting notes
- visible labels
- short action text
- expandable detail sections when necessary

---

## 10. Recommended Build Order

### Phase 1 — Finalize visual system
- lock palette, typography, spacing, cards, and header hierarchy
- ensure all screens use the same tone and interaction language

### Phase 2 — Standardize screen structure
- Home
- Seasons
- History
- Food
- Places
- Persona

### Phase 3 — Standardize related-path behavior
- convert related paths into consistent actionable cards
- ensure navigation targets are correct and visible

### Phase 4 — Validate data and feedback loops
- check bookmarking
- check quiz solve flow
- check streak updates
- check province unlock behavior

### Phase 5 — Polish for release
- trim copy where needed
- adjust spacing and alignment
- verify on actual device
- ensure archive state feels rewarding

---

## 11. QA Checklist

Before calling the build ready, verify:
- home has one dominant next action
- seasons feels like the single daily ritual
- history/food/places each have a clear primary content flow
- persona shows progress and archive clearly
- related paths are visible and actionable
- bookmarking updates collections and province state
- quiz solving updates streak and solved totals
- screen hierarchy feels consistent across the app
- English text is readable at a glance

---

## 12. Delivery Notes

This app should be released only when the following are true:
- the design system is consistent
- the content structure is easy to scan
- the interaction loop is obvious
- the archive page feels rewarding
- the app feels culturally distinctive without visual clutter

The goal is not just to be functional. The goal is to feel like a polished, modern cultural product for an international audience.

---

## 13. Product Optimization Roadmap

This roadmap turns the design and development direction into a practical build order. It is inspired by mature app patterns from products such as Xiaohongshu, WeChat, and Alipay, but adapted to the app’s own cultural atlas positioning.

### 13.1 Core optimization themes
- clarity first
- one primary action per screen
- content over decoration
- visible feedback for every meaningful action
- consistent relationship-based navigation
- archive-style progress accumulation

### 13.2 Phase 1 — Highest priority foundation

#### 1) Unify the visual system
Focus on the full design language before adding more content polish.
- align background, card, border, shadow, and radius tokens
- standardize spacing and typography
- reduce decorative noise
- keep the cultural tone light, modern, and readable

#### 2) Tighten the Home screen
Make Home a decision layer, not a content dump.
- keep one dominant action for today
- compress secondary stats and shortcuts
- show a concise progress summary
- keep the current exploration path visible

#### 3) Strengthen Seasons as the daily ritual page
Make the daily task feel complete, visible, and rewarding.
- emphasize the one-question daily flow
- make solved and unsolved states obvious
- surface streak and solved totals clearly
- keep stamp feedback prominent

#### 4) Standardize related-path navigation
Make cultural relationships feel actionable, not informational.
- convert related paths into consistent action cards
- preserve province-based links between city, food, dynasty, and place
- ensure continuation from every content page is obvious

#### 5) Strengthen Persona as the archive endpoint
Make Persona feel like the final cultural summary.
- highlight saved names, badges, streaks, and connected provinces
- present the generated identity clearly
- keep the page calm and archive-like

### 13.3 Phase 2 — Content page standardization

#### 6) Refine History
- make dynasty pages feel like editorial chapters
- keep emperor content compact and expandable
- preserve related paths as strong next steps

#### 7) Refine Food
- keep dishes visually appealing but readable
- preserve story, taste, etiquette, and substitution hierarchy
- keep food as a regional story, not a recipe list

#### 8) Refine Places
- reduce the dominance of the geographic entry block
- let city cards drive browsing
- keep city essays easy to scan

### 13.4 Phase 3 — Interaction and state consistency

#### 9) Unify feedback patterns
- keep stamp, selection, saved state, and progress feedback consistent
- use haptics and visible state changes for meaningful actions

#### 10) Standardize empty and loading states
- make empty favorites, unsolved daily tasks, and missing related paths understandable
- keep fallback states simple and calm

### 13.5 Phase 4 — Copy and release polish

#### 11) Tighten English-first copy
- keep labels short and useful
- avoid academic overload
- let Chinese terms support, not dominate, the message

#### 12) Final visual polish
- adjust spacing, alignment, and hierarchy
- verify the app on device
- ensure the archive and progress surfaces feel rewarding

### 13.6 Recommended implementation sequence
1. visual system
2. home screen
3. seasons screen
4. related paths
5. persona archive
6. history / food / places refinement
7. state and feedback consistency
8. copy polish
9. final device validation

### 13.7 Success criteria
The roadmap is working if users can:
- open the app and immediately know what to do
- complete one daily action easily
- understand what each module is for
- browse content without getting lost
- feel progress accumulating over time
- move through Chinese culture in a natural, rewarding way
