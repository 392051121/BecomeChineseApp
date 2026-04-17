# AI Context for BecomeChineseApp

## What this project is
`BecomeChineseApp` is an Expo / React Native app that presents Chinese culture as an English-first bilingual atlas for an international audience.

## Product direction
- English is the primary UI language.
- Chinese is the secondary cultural layer.
- The app must stay strictly focused on Chinese culture.
- Do not mix in Japanese, Korean, or generic pan-Asian framing.
- Avoid any language that weakens or dismisses China.

## Core sections
- **Home**: English-first entry point with a cultural summary and recent progress.
- **Seasons**: Lunar date, solar terms, and a daily China-focused question.
- **History**: Chinese dynasties, rulers, cultural contributions, and world context.
- **Food**: Chinese dishes, regional cuisine, and cultural context.
- **Places**: Chinese cities, regional character, and daily life notes.
- **Profile**: Chinese name generator, saved names, and cultural profile sharing.

## Bilingual rules
- Use natural English first.
- Preserve Chinese names and cultural nouns.
- Recommended format for labels: `English / 中文`.
- For Spring Festival, use `Chinese New Year / 春节`.
- Keep the bilingual text consistent across screens and data.

## Design rules
- Calm, editorial, minimal, and content-rich.
- Thin borders, paper-like cards, strong typography.
- Keep the layout readable and internationally friendly.
- Chinese text should support the English story, not overwhelm it.

## Data strategy
- The app is local-first and currently does not rely on a backend.
- Key data lives in `src/data/`.
- Important datasets: `cities`, `recipes`, `dynasties`, `quizQuestions`.
- Prefer stable IDs and bilingual fields in content records.

## Image strategy
- Prefer local images for important cultural content.
- Use free/open-license images when adding new assets.
- Keep visuals clearly Chinese in subject matter.
- Avoid ambiguous East Asian or non-Chinese imagery.

## Development standards
- Keep components small and readable.
- Keep screen logic simple.
- Check lint after edits.
- Preserve the app’s English-first bilingual cultural direction.

## Useful files to inspect first
- `PROJECT_GUIDE.md`
- `package.json`
- `src/navigation/RootTabs.js`
- `src/screens/`
- `src/data/`

## One-sentence summary
This app is an English-first bilingual cultural atlas of China built with Expo and React Native.
