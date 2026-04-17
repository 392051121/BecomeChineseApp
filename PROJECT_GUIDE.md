# BecomeChineseApp Project Guide

## 1. Project Overview

`BecomeChineseApp` is an Expo / React Native app that presents Chinese culture as a bilingual, English-first cultural atlas for an international audience.

The app is designed to help users explore China through a calm, visually refined experience focused on:

- Chinese seasons and solar terms
- Chinese dynasties and historical context
- Chinese food and regional cuisine
- Chinese cities and regional character
- Personal cultural profiles and saved progress

The product emphasis is **Chinese culture only**. It should not mix in Japanese, Korean, or generic East Asian framing.

---

## 2. Product Goals

### Primary goals
- Make Chinese culture easy to explore for English-speaking users.
- Keep Chinese names, terminology, and cultural references visible as a second layer.
- Create a durable local-first cultural app that can grow without a backend.
- Use strong visual design and well-structured content to make the app feel like a cultural atlas rather than a simple facts app.

### Audience
- Primary: English-speaking users in Europe and the United States
- Secondary: Chinese-speaking users who want a bilingual cultural reference app
- Internal goal: Make the app easy for future developers and AI agents to understand, extend, and maintain

---

## 3. Core Theme and Positioning

### Theme statement
**An English-first bilingual atlas of Chinese culture.**

### Tone and style
- Calm
- Editorial
- Cultural
- Refined
- Minimal but content-rich
- Respectful of Chinese history and identity

### Cultural boundaries
The app should remain strictly centered on Chinese culture:
- Chinese cities
- Chinese food
- Chinese dynasties
- Chinese festivals and seasonal culture
- Chinese lifestyle and regional identity

Avoid:
- Japanese framing
- Korean framing
- Generic “pan-Asian” wording
- Content that weakens or distorts the Chinese cultural core

---

## 4. Information Architecture

The app uses a bottom-tab structure with six main areas:

- **Home** — entry point and cultural summary
- **Seasons** — lunar date, solar terms, and daily cultural questions
- **History** — dynasties, rulers, cultural contributions, and world context
- **Food** — Chinese dishes, regional cuisine, and cultural context
- **Places** — Chinese cities, local character, and everyday life notes
- **Profile** — bilingual cultural identity, saved names, and progress

### Design principle
Each section should follow the same pattern:
1. English primary label
2. Chinese secondary label or original name
3. Cultural explanation
4. Optional saved/progress interaction

---

## 5. Content Model

### Home
Purpose:
- Present the app as a cultural atlas
- Show the user’s latest cultural activity
- Link into the rest of the app quickly

Should include:
- English main title
- Short English subtitle
- Chinese helper copy where helpful
- Today’s clue / recent pick
- Lightweight progress metrics

### Seasons
Purpose:
- Present China’s seasonal rhythm and lunar calendar system
- Provide one daily cultural prompt or quiz

Should include:
- English-first seasonal language
- Chinese solar term name
- Lunar date reference
- One daily question
- Local progress tracking

### History
Purpose:
- Explore Chinese dynasties as a long civilizational timeline

Should include:
- English dynasty title
- Chinese dynasty name
- World context
- Cultural contribution
- Key rulers
- Historical impact

### Food
Purpose:
- Present Chinese cuisine as culture, not just recipes

Should include:
- English dish name
- Chinese dish name
- Region
- Cultural story
- Home version / substitution note
- Dining context

### Places
Purpose:
- Present Chinese cities as regional character studies

Should include:
- English city name
- Chinese city name
- Pinyin where useful
- City character
- Best season
- Daily life notes
- Regional flavor

### Profile
Purpose:
- Let users generate a Chinese name
- Save cultural identity notes
- Track regions and preferences

Should include:
- English main interface
- Chinese name result
- Personality tags
- Saved names
- Shareable profile card

---

## 6. Bilingual Content Rules

### Global language rule
- English is the primary UI language.
- Chinese is the secondary cultural layer.
- Chinese text should never completely disappear in core cultural content.

### Recommended formats
Use these patterns when possible:
- `Chinese New Year / 春节`
- `Tang Dynasty / 唐朝`
- `Beijing / 北京`
- `Mapo Tofu / 麻婆豆腐`

### Translation guidance
- Prefer natural English over literal translation.
- Keep Chinese names, historical terms, and cultural nouns accurate.
- Avoid overly academic or machine-like wording.
- For “春节”, use **Chinese New Year / 春节**.

### Content consistency
Each bilingual label should be consistent across the app:
- Page titles
- Card labels
- Section headers
- Button text
- Detail sheets

---

## 7. Design System

### Visual direction
The app uses a restrained editorial visual style:
- Soft neutral backgrounds
- Thin borders
- Paper-like card surfaces
- Strong typographic hierarchy
- Limited accent color usage
- Cultural texture without clutter

### UI characteristics
- Minimal but not empty
- Calm and readable
- Strong card-based composition
- Clear spacing and hierarchy
- International-friendly layout

### Important UI rules
- English UI labels should feel native, not translated.
- Chinese should act as a second layer, not visual noise.
- Maintain comfortable reading density.
- Preserve enough whitespace for a premium feel.

---

## 8. Data and Architecture Strategy

### Local-first approach
The app is designed to work without a backend server.
Most content lives in local JSON / JS data modules.

### Key data areas
- `cities`
- `recipes`
- `dynasties`
- `quizQuestions`
- cultural assets and saved user state

### Recommended structure
- Keep content in local files for now.
- Use stable IDs for all entities.
- Keep bilingual fields in the data model.
- Add relationship fields when useful.

### Examples of useful bilingual fields
- `nameEn`
- `nameCn`
- `tagline`
- `culturalStory`
- `worldContext`
- `culturalContext`
- `legacySummary`

---

## 9. Image Strategy

### Current strategy
- Prefer local images for important content.
- Use remote/generated placeholders only as fallback.
- Keep the imagery culturally aligned with Chinese subject matter.

### Preferred image sources
- Free/open-license resources
- Chinese city scenes
- Chinese food photography
- Chinese historical artifacts
- Chinese architecture and landscape imagery

### Asset rules
- Images should support the English-first bilingual story.
- Avoid ambiguous East Asian visuals.
- Avoid obvious non-Chinese cultural cues.
- When possible, store images locally in the repo for reliability.

### Image workflow
1. Find usable free/open images.
2. Download them into the project assets.
3. Regenerate local image mappings if needed.
4. Replace weak remote visuals on key pages.

---

## 10. Development Standards

### Code style
- Prefer small, readable components.
- Keep screen-level logic simple.
- Use stable naming conventions.
- Avoid unnecessary complexity.

### Content editing standards
- Maintain Chinese cultural accuracy.
- Keep English natural and readable.
- Avoid mixing in non-Chinese cultural references.
- Do not add negative or dismissive language about China.

### QA expectations
Before shipping a change, check:
- Language consistency
- Bilingual label consistency
- Chinese-only cultural scope
- Layout balance
- Lint status

---

## 11. Tech Stack

### Framework
- Expo
- React Native
- React Navigation

### Notable dependencies
- `expo`
- `expo-haptics`
- `expo-splash-screen`
- `expo-status-bar`
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native-stack`
- `lucide-react-native`
- `@react-native-async-storage/async-storage`

### Tooling
- Scripts are managed through `package.json`
- Local image mapping is generated via `npm run gen:images`

---

## 12. Useful Scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run gen:images
```

### Notes
- `npm start` launches the Expo dev server.
- `npm run gen:images` rebuilds local image mapping files.

---

## 13. Existing Screen Summary

### Home
- English-first atlas entry point
- Bilingual cultural summary
- Progress and recent pick

### Seasons
- Solar terms
- Lunar date reference
- Daily question and streak tracking

### History
- Chinese dynasties timeline
- World context
- Cultural contribution
- Key rulers
- Historical impact

### Food
- Regional Chinese cuisine
- Dish detail sheets
- Cultural story and dining context

### Places
- Chinese cities
- Regional character
- Daily life and food notes

### Profile
- Chinese name generator
- Saved names
- Cultural profile sharing

---

## 14. What Future Contributors Should Do First

When entering this repo, first check:
1. `PROJECT_GUIDE.md`
2. `package.json`
3. `src/navigation/RootTabs.js`
4. The main screens in `src/screens/`
5. Data modules in `src/data/`

Then ask:
- Is this change consistent with the English-first bilingual goal?
- Is the Chinese cultural scope still strict?
- Does the new content improve clarity for an international audience?

---

## 15. Maintenance Notes

- Keep the app bilingual, but English-first.
- Keep Chinese cultural accuracy high.
- Prefer consistent section headers across all screens.
- Prefer local images over unstable remote placeholders.
- Keep the app calm, refined, and content-rich.

---

## 16. Project Summary in One Sentence

`BecomeChineseApp` is an English-first bilingual cultural atlas of China, designed for an international audience and built with a local-first Expo / React Native architecture.
