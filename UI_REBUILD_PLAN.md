# UI Rebuild Plan v3

## Purpose
This document is the binding execution standard for the rebuild.

The app must not be adjusted by feel. Every screen, component, color, and interaction must be checked against this document before it is changed.

If an implementation conflicts with this plan, the implementation must be changed.

If a page still feels like the old prototype after a change, the change is not enough.

---

## Hard execution rules

### Rule 1. The plan overrides the existing structure
Do not preserve old structure just because it already exists.

If a screen role requires a different layout, the layout must be rebuilt.

### Rule 2. Content may be reshaped for the UI
If the current content is not enough for the intended UI role, reshape the content.

Do not keep the old content order, grouping, or emphasis if it weakens the page role.

### Rule 3. One screen, one role
Every screen must have one primary role.

If a screen cannot be described in one sentence, it is too broad.

### Rule 4. Visual hierarchy must be obvious at first glance
The user should know the primary action and primary content within one second.

If the page needs explanation before it is readable, the hierarchy is wrong.

### Rule 5. Shared UI language only
All screens must use the same language for:
- cards
- buttons
- chips
- stats
- headers
- sheets
- empty states

If a screen invents a new visual language, it is a regression.

### Rule 6. Do not ship prototype behavior
Any page that still behaves like a draft or placeholder must be rebuilt.

This includes:
- unclear primary action
- accidental layout collisions
- content hidden by containers
- modals/sheets that close too easily
- nested scroll structures that fight each other
- inconsistent spacing or weight

### Rule 7. The rebuild must move the app away from the old prototype feel
If a change still feels like the original app with different text, it is not valid.

---

## Global visual rules

### Color system
- Use a quiet warm background.
- Use one clear primary accent.
- Keep most large surfaces neutral.
- Do not overuse the primary color.
- Success/completion should be subtle and warm.
- Borders must stay light and disciplined.

### Surface system
Use only these levels:

1. **Primary card**
   - Main content surface
   - White or near-white
   - Soft shadow, subtle border

2. **Soft card**
   - Supporting or guidance surface
   - Warm tinted background

3. **Panel**
   - Secondary grouped content
   - Slightly muted surface
   - Never stronger than the primary card

### Button system
Use only these action types:

1. **Primary button**
   - Main action
   - Solid primary fill
   - White text
   - Highest visual weight

2. **Secondary button**
   - Supporting action
   - Light background or outline
   - Lower weight than primary

3. **Chip / stat action**
   - Compact informational action
   - Minimal weight

### Typography rules
- Titles must be short and direct.
- Subtitles must be compact.
- Avoid long explanatory copy on top of the page.
- Use bilingual text only when it clarifies meaning.
- Do not let labels become decorative noise.

### Spacing rules
- Use consistent page padding.
- Use consistent section spacing.
- Do not stack many equally weighted blocks.
- Every page must breathe.

### Interaction rules
- Pressed state must be visible.
- Saved/completed/unlocked states must be unmistakable.
- Dismiss behavior must be intentional.
- Do not allow accidental closing of detail surfaces.

---

## Enforced page blueprints

### 1. Home = decision dashboard
Home must answer one question immediately:
**What should I do now?**

#### Required order
1. Header
2. Primary today action
3. Progress row
4. Current path / continue card
5. Continue grid

#### Required content
- Header must be short.
- The today action must be the strongest visual block.
- Progress must be compact and readable.
- Current path must identify what the user is resuming.
- Continue grid must be lower priority than the primary action.

#### Forbidden on Home
- Brand slogan as the main headline
- Decorative intro paragraphs
- A current path that is only a vague text line
- A layout that cannot scroll when content exceeds the screen

---

### 2. Seasons = daily mission page
Seasons must feel like a single focused task.

#### Required order
1. Status card
2. Main quiz card
3. Answer options
4. Completion feedback

#### Required content
- Status card must show date, solar term, and completion state.
- Quiz question must be prominent.
- Answer buttons must be large and tappable.
- Completion must feel like a reward state.
- The page must scroll naturally if content exceeds the screen.

#### Forbidden on Seasons
- Hidden answer options
- Content clipped below the fold
- A reading-page feel
- Ambiguous solved state

---

### 3. Places = city-first story page
Places must be city-first.

#### Required order
1. City lead
2. City cards
3. Map overview
4. Related paths

#### Required content
- City content must read before the map.
- The map must be secondary support.
- City cards must be browseable and story-led.
- Related paths must connect to Food and History.

#### Forbidden on Places
- Map as the visual hero
- Map-first browsing behavior
- Noisy mixed-language labels without function

---

### 4. History = chapter stream
History must feel like a curated chapter browser.

#### Required order
1. Intro card
2. Dynasty chapter cards
3. Related paths
4. Secondary ruler details

#### Required content
- Each dynasty must read as a chapter.
- Chapters must have a clear title and summary.
- Related paths must be concrete and specific.
- Ruler details must be progressive disclosure, not the main hook.

#### Forbidden on History
- Nested detail inside detail
- Large unexplained blank space
- Horizontal paging as the main reading structure
- Repeated detail navigation that duplicates the main page

---

### 5. Food = editorial dish stream
Food must feel like a regional content feed with a proper detail sheet.

#### Required order
1. Guide card
2. Dish grid
3. Detail sheet

#### Required content
- Dish cards must be image-led.
- The sheet must feel like a bottom sheet, not a random modal.
- The sheet must have a clear handle and clear hierarchy.
- Tap outside may close the sheet, but in-sheet taps must not close it accidentally.
- The sheet must support downward swipe to close.

#### Forbidden on Food
- Any sheet that closes from normal taps inside content
- A detail layer that feels like leaving the page entirely
- A grid that loses readability because of oversized content

---

### 6. Profile = archive endpoint
Profile must feel like the user’s cultural archive.

#### Required order
1. Identity hero
2. Generator / actions
3. Atlas progress
4. Insight
5. Milestones
6. Saved names
7. Share result

#### Required content
- Identity hero must be the primary artifact.
- Generator must be clearly actionable.
- Atlas progress must be secondary to the identity.
- Milestones must feel like a reward wall.
- Saved names must be scannable.
- Share result must feel like the final output.

#### Forbidden on Profile
- Generic account-page feel
- Multiple equally strong blocks competing with the identity hero
- Virtualized list nesting inside another vertical scroll container

---

## Component enforcement

### ScreenHeader
- One short kicker.
- One short title.
- One short subtitle.
- No decorative banner feel.

### SectionCard
- Must use the shared surface hierarchy.
- Cards must not invent a one-off style.

### RelatedPathCard
- Must remain secondary to primary content.
- Must look like a supporting navigation card, not a hero block.

### HandscrollContainer
- Must not create scroll behavior that blocks normal screen reading.
- If a page needs a different scroll model, use the page blueprint instead of forcing the container.

---

## Execution order
When changing a page, follow this order:

1. Identify the page role.
2. Check the page against the blueprint.
3. Remove anything that weakens the role.
4. Reshape the content if needed.
5. Apply the shared visual system.
6. Test the interaction state.
7. Only then move to the next page.

---

## Acceptance criteria
A page only counts as rebuilt if:
- the role is obvious,
- the hierarchy is obvious,
- the page uses the shared UI language,
- the page no longer feels like the prototype,
- the page matches its blueprint,
- and the page does not introduce new structural drift.

---

## Final rule
If a screen, component, or interaction still feels like the old app, it is not finished.

---

## Reference UI/UX patterns (from Xiaohongshu, WeChat, Alipay)

### Card design patterns
- **Image-first cards**: Use high-quality images as the primary visual element, with text overlay for context
- **Chinese-first naming**: Display Chinese characters prominently, with English as secondary/supporting text
- **Province/location pills**: Use compact pills with icons for location indicators, not plain text
- **Card hierarchy**: Primary cards use larger shadows and stronger borders; secondary cards use subtle styling

### Bottom sheet patterns
- **Slide-up animation**: Use `animationType="slide"` for natural mobile feel, not fade
- **Handle indicator**: A centered, subtle handle bar (4px height, 44px width) for drag-to-close
- **Close button**: A small circular close button (32px) in the header for explicit dismissal
- **Content padding**: 20px horizontal padding for comfortable reading width
- **Swipe threshold**: 26px minimum downward movement to trigger close

### Badge and status patterns
- **Icon + label combo**: Use icons alongside labels for visual reinforcement (e.g., Trophy + "Rank", Flame + "Streak")
- **Active state badges**: Change background color and text color when state changes (e.g., "Open" → "Done")
- **Progress indicators**: Use icons in progress items for quick recognition
- **Count pills**: Display counts in subtle pills, not as standalone numbers

### Interaction patterns
- **Press feedback**: Scale down to 0.995-0.985 on press, with opacity 0.94-0.96
- **Choice buttons**: Use letter indicators (A, B, C, D) in small badges for quiz options
- **Action buttons**: Primary buttons have shadow for emphasis; secondary buttons are flat
- **Share buttons**: Include icon alongside text for clarity

### Typography refinements
- **Title hierarchy**: Main titles 24-28px, section titles 17-18px, labels 10-11px
- **Chinese text**: Use larger font sizes (28-64px) for Chinese characters as hero elements
- **Letter spacing**: Tighter spacing (-0.2 to -0.5) for large titles, wider (1.2-1.6) for uppercase labels
- **Line height**: 1.3-1.4x font size for comfortable reading

### Spacing refinements
- **Card padding**: 16-18px for primary cards, 14px for secondary cards
- **Section gaps**: 14px between major sections, 10px between related items
- **Button padding**: 14-15px vertical for comfortable touch targets
- **Grid gaps**: 10-12px for 2-column grids

### Color refinements
- **Success color**: Warm gold/amber (#A6723D) for completion states, not green
- **Primary usage**: Limit primary color to interactive elements and labels, not large surfaces
- **Shadow opacity**: 0.02-0.06 for subtle depth, 0.10 for modal overlays
- **Border opacity**: 0.08-0.16 for subtle separation, 0.30-0.40 for emphasis

---

## Implementation checklist

Before marking a screen as complete, verify:
1. Icons are used alongside labels where appropriate
2. Chinese text is displayed prominently for cultural content
3. Press states have visible scale and opacity changes
4. Badges change appearance when state changes
5. Bottom sheets use slide animation and have close buttons
6. Card shadows create clear hierarchy
7. Spacing follows the refined guidelines
8. Colors are used sparingly and purposefully

---

## Chinese aesthetic design system

### Core philosophy
The app must feel both modern and distinctly Chinese. This is achieved through:
- **Subtle traditional elements**: Textures, patterns, and decorations that evoke Chinese aesthetics without being kitsch
- **Modern interaction patterns**: Contemporary mobile UX with Chinese visual language
- **Balanced bilingual design**: Chinese characters as primary visual elements, English as supporting context

### Traditional color palette

#### Primary colors (朱砂色系 - Cinnabar)
- `primary`: #C23A2E - Main accent, used sparingly for maximum impact
- `primaryLight`: #D64A3E - Hover/pressed states
- `primaryDark`: #A32A1E - Emphasis states

#### Background colors (宣纸色系 - Rice paper)
- `background`: #F5F0E8 - Warm, quiet main background
- `backgroundLight`: #FAF7F2 - Elevated surfaces
- `backgroundDark`: #EDE8E0 - Pressed states

#### Text colors (墨色系 - Ink)
- `text`: #1B1715 - 墨黑, primary text
- `textLight`: #3A3634 - 墨浅, secondary text
- `mutedText`: rgba(27, 23, 21, 0.60) - 墨淡, hint text

#### Status colors
- `success`: #B87333 - 鎏金 (warm gold), completion/achievement
- `warning`: #D4A574 - 杏黄, caution states

#### Special aesthetic colors
- `inkWash`: rgba(27, 23, 21, 0.04) - 水墨晕染, subtle overlays
- `cinnabarGlow`: rgba(194, 58, 46, 0.08) - 朱砂晕, warm highlights
- `goldLeaf`: rgba(184, 115, 51, 0.12) - 金箔, premium accents

### Typography guidelines

#### Chinese characters (汉字)
- Use larger font sizes (28-64px) for hero Chinese text
- Letter spacing: 2-4px for prominent characters
- Line height: 1.2-1.4x for comfortable reading
- Font weight: 600-700 for visual presence

#### Bilingual labels
- Chinese first, English second when both are shown
- Chinese in primary color, English in muted text
- Use compact layout: Chinese + English on same line with gap

#### Section labels
- Uppercase with wide letter spacing (1.2-1.6)
- Primary color for emphasis
- Consider Chinese equivalent for cultural context

### Texture and pattern usage

#### Paper texture (宣纸纹理)
- Apply to hero cards and important surfaces
- Use `intensity="light"` for subtle backgrounds
- Creates authentic Chinese paper feel without distraction

#### Seal texture (印章纹理)
- Use for milestone/achievement cards
- `variant="minimal"` for subtle backgrounds
- `variant="default"` for achievement displays

#### Ink wash (水墨晕染)
- Subtle gradient overlays for depth
- Use sparingly, primarily on hero elements
- Opacity should never exceed 0.12

### Decorative elements

#### Seal stamps (印章)
- Use StampFeedback component for completion states
- `tone="cinnabar"` for standard stamps (default)
- `tone="gold"` for achievements/milestones
- `tone="soft"` for subtle confirmations
- Include Chinese label via `labelZh` prop

#### Corner ornaments
- Use sparingly on important cards
- Position in corners with low opacity (0.15-0.25)
- Never compete with content for attention

#### Border patterns
- Wave pattern for subtle card decoration
- Only on top edge of cards
- Opacity 0.15 maximum

### Layout principles

#### Visual hierarchy (Chinese style)
1. Chinese characters as primary visual anchors
2. Icons as supporting elements, not primary
3. English text as secondary context
4. Decorative elements as subtle enhancement

#### Card composition
- Chinese title prominent at top
- English subtitle smaller, muted
- Content follows with clear separation
- Actions at bottom with clear visual weight

#### Spacing philosophy
- Generous padding (16-20px) for breathing room
- Consistent gaps (10-14px) between related elements
- Larger gaps (14-18px) between sections
- Follow traditional Chinese layout proportions

### Interaction patterns

#### Press states
- Scale down to 0.985-0.995 (subtle, like brush pressure)
- Opacity 0.94-0.96
- Duration 180-280ms (elegant, not snappy)

#### Animations
- Spring physics for natural feel
- Tension 90-100, Friction 6-8
- Avoid linear timing functions
- Consider "ink spreading" metaphor for reveals

### Forbidden patterns

- Never use bright green for success (use warm gold instead)
- Never use pure white backgrounds (use rice paper tones)
- Never use pure black text (use ink tones)
- Never use heavy borders (use subtle ink wash borders)
- Never use cartoonish Chinese elements (respect tradition)
- Never use red for error states (use same cinnabar for cohesion)

### Component usage

#### StampFeedback
```jsx
<StampFeedback
  label="Saved"
  labelZh="已收藏"
  active={isSaved}
  tone="cinnabar"  // or "gold", "soft"
/>
```

#### PaperTexture
```jsx
<PaperTexture intensity="light" />  // inside card
```

#### SealTexture
```jsx
<SealTexture opacity={0.06} variant="minimal" />
```

---

## Bilingual UI patterns

### Label display rules
- **Section labels**: Chinese first when culturally appropriate (e.g., "探索路径" not "Explore paths")
- **Status labels**: Chinese for user-facing states (e.g., "已完成", "待完成", "已收藏")
- **Navigation labels**: Bilingual in tabs (e.g., "首页", "历史", "饮食", "地方", "档案")
- **Action buttons**: Chinese primary (e.g., "开始", "保存", "分享")

### RelatedPathCard usage
```jsx
<RelatedPathCard
  label="Food"
  labelZh="饮食"
  title="Dish Name / 菜名"
  hintZh="继续"
  onPress={() => {}}
/>
```

### EmptyStateCard usage
```jsx
<EmptyStateCard
  titleZh="暂无内容"
  title="No content yet"
  descriptionZh="稍后再来查看。"
  description="Check back later."
/>
```

### Screen header patterns
- `kicker`: Chinese module name (e.g., "历史", "饮食", "地方")
- `title`: Chinese primary title (e.g., "历史长河", "饮食图谱", "城市故事")
- `subtitle`: English supporting text

### Stats and metrics
- Use Chinese labels: "连续", "已答", "连接", "品级", "地区", "已存"
- Display numbers prominently with icons
- Use pills for compact display

---

## Updated component props

### RelatedPathCard
- `label`: English category label
- `labelZh`: Chinese category label (optional)
- `title`: Full title (usually "English / 中文")
- `hint`: English hint text
- `hintZh`: Chinese hint text (optional)

### EmptyStateCard
- `title`: English title
- `titleZh`: Chinese title (optional, displayed first)
- `description`: English description
- `descriptionZh`: Chinese description (optional)

### StampFeedback
- `label`: English status label
- `labelZh`: Chinese status label (optional)
- `tone`: "cinnabar" | "gold" | "soft"
- `shape`: "round" | "pill" | "minimal"
