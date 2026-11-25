---
omd: 0.1
brand: 한유진 Portfolio
bootstrapped_from: apple
bootstrapped_at: 2026-08-09T06:43:44Z
tokens:
  source: reconciled
  extracted: "2026-07-11"
  note: "Base values are Apple's verified public-web tokens (apple.com marketing + HIG docs). Heading sizes and card padding were scaled down from Apple's raw marketing-page values (56/40/28px, 20px card padding) - those read as oversized on a personal-portfolio content density; corrected 2026-08-09 per user feedback. tile-heading was also bumped from Apple's captured 400 weight to 600: at card-title scale (vs. Apple's large 28px+ tile use) a 400-weight heading next to 400-weight body text had no visual hierarchy. 2026-11-26: the site moved to an angular editorial tone (commit 0f6d147) - all radii are 0, cards and boxes are separated by a 1px opaque border, and the font stack moved from SF Pro to kmrWaldenburg → Helvetica. Colors stay Apple-derived. Typography values below are reconciled to src/styles/globals.css."
  colors:
    primary: "#0071e3"
    brand: "#000000"
    canvas: "#f5f5f7"
    canvas-dark: "#000000"
    surface: "#ffffff"
    foreground: "#1d1d1f"
    on-primary: "#ffffff"
    muted: "#6e6e73"
    secondary: "#515154"
    link: "#0066cc"
    link-on-dark: "#2997ff"
    border: "#ebebeb"
    border-dark: "#3a3a3c"
    danger: "#d70015"
    danger-dark: "#ff6961"
  typography:
    family:
      {
        display: "kmrWaldenburg, Helvetica, Arial",
        text: "kmrWaldenburg, Helvetica, Arial",
      }
    display-hero:
      { size: 40, weight: 600, lineHeight: "46px", tracking: "normal" }
    section: { size: 28, weight: 600, lineHeight: "34px" }
    tile-heading:
      { size: 16, weight: 600, lineHeight: "26px", tracking: "0.196px" }
    body: { size: 17, weight: 400, lineHeight: "26px", tracking: "normal" }
    body-small:
      { size: 14, weight: 400, lineHeight: "20px", tracking: "normal" }
    caption: { size: 12, weight: 400, lineHeight: "18px", tracking: "normal" }
  spacing:
    {
      compact: 8,
      control-inline: 15,
      pill-block: 11,
      pill-inline: 21,
      content: 20,
    }
  rounded: { control: 0, docs-card: 0, marketing-pill: 0 }
  components:
    portfolio-primary:
      {
        type: button,
        bg: "#0071e3",
        fg: "#ffffff",
        radius: "0",
        padding: "11px 21px",
        height: "44px",
        font: "17px / 500",
        states: "default; add hover/active/focus per platform norms",
        use: "primary CTA (e.g. 이력서 보기, 연락하기)",
      }
    portfolio-outline:
      {
        type: button,
        bg: "transparent",
        fg: "#0066cc",
        border: "1px solid #0066cc",
        radius: "0",
        padding: "11px 21px",
        height: "44px",
        font: "17px / 500",
        states: "default; add hover/active/focus per platform norms",
        use: "secondary action paired with a primary CTA",
      }
    portfolio-compact:
      {
        type: button,
        bg: "#0071e3",
        fg: "#ffffff",
        radius: "0",
        padding: "8px 15px",
        height: "36px",
        font: "14px / 500",
        states: "default; add hover/active/focus per platform norms",
        use: "inline/tile-level CTA (e.g. project card '자세히 보기')",
      }
    project-gallery-tab:
      {
        type: tab,
        fg: "#1d1d1f",
        height: "53px",
        font: "17px / 400",
        states: "selected and unselected",
        use: "switching between project screenshots/media",
      }
    doc-reference-card:
      {
        type: card,
        bg: "#ffffff",
        radius: "0",
        border: "1px solid border",
        padding: "12px 16px",
        states: "default; add hover",
        use: "project card, blog post card, skill card",
      }
---

# Design System Inspiration of Apple

## 1. Visual Theme & Atmosphere

This portfolio keeps Apple's neutral palette and single blue action, but sets them in an angular, editorial frame: square corners everywhere, content grouped by thin 1px opaque borders instead of rounded tiles, and a neo-grotesque (kmrWaldenburg → Helvetica) type stack. Project work and writing carry the visual weight instead of decoration. The effect isn't minimalism for its own sake - precise hierarchy, ruled structure, and limited ornament make a personal site read as considered rather than sparse.

Three surfaces exist in this project: the marketing-style pages (home, about), the content pages (projects, blog), and any documentation/meta chrome. Treat their typographic and component needs the way Apple separates apple.com marketing from HIG documentation chrome - related, not identical.

**Key Characteristics:**

- One font stack (kmrWaldenburg → Helvetica → Arial) for both display and text roles; hierarchy comes from size and weight
- Primary filled action `#0071e3`; text link `#0066cc`; dark-surface link `#2997ff`
- 44px large and 36px compact buttons coexist (hero CTA vs. project-tile CTA), both square-cornered
- Radius is 0 across the site; cards and meta boxes are separated by a 1px `border` token (`#ebebeb` light / `#3a3a3c` dark)

## 2. Color Palette & Roles

- **Primary Action** (`#0071e3`): filled buttons - "연락하기", "이력서 다운로드", primary nav CTA.
- **Brand / Dark Canvas** (`#000000`): identity marks and any immersive dark section (e.g. hero on dark).
- **Fog Canvas** (`#f5f5f7`): light section and footer background.
- **Surface** (`#ffffff`): card and content surfaces.
- **Foreground** (`#1d1d1f`): principal text.
- **Muted** (`#6e6e73`): secondary/meta text (dates, tags, captions).
- **Secondary** (`#515154`): supporting body text.
- **On Primary** (`#ffffff`): text on blue filled actions.
- **Link** (`#0066cc`): inline links and outline-button text/border on light surfaces.
- **Link on Dark** (`#2997ff`): links on dark sections.
- **Border** (`#ebebeb` light / `#3a3a3c` dark): 1px rules around cards, meta boxes, and timeline items. Opaque, not translucent, so overlapping boxes don't double up.
- **Danger** (`#d70015` light / `#ff6961` dark, `text-danger`): error messages and red suit marks only. A semantic status color, not a second accent; never use it for actions or decoration.

Keep this as one accent color system - don't introduce a second brand hue for variety.

## 3. Typography Rules

### Font Family

- **Display & Text**: one stack for every role - `var(--font-kmr-waldenburg), "kmrWaldenburg", Helvetica, "Helvetica Neue", Arial, sans-serif`. Hierarchy comes from size and weight, not from switching families.
- Korean glyphs fall through to the OS default (Apple SD Gothic Neo / Malgun Gothic).

| Role         | Class               | Size | Weight | Line Height | Tracking |
| ------------ | ------------------- | ---: | -----: | ----------: | -------: |
| Display Hero | `text-display-hero` | 40px |    600 |        46px |   normal |
| Section      | `text-section`      | 28px |    600 |        34px |   normal |
| Tile Heading | `text-tile-heading` | 16px |    600 |        26px |  0.196px |
| Body         | `text-body`         | 17px |    400 |        26px |   normal |
| Body Small   | `text-body-small`   | 14px |    400 |        20px |   normal |
| Caption      | `text-caption`      | 12px |    400 |        18px |   normal |

Use these role classes as-is. Don't override them with arbitrary sizes (`text-[22px]`, `text-[20px]`); if a role is missing, add it here first.

| Evidence class   | Status                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base**         | Neo-grotesque display face (kmrWaldenburg) with Helvetica/Arial fallback, chosen 2026-11-24 (commit 0f6d147) to fit the angular tone                        |
| **This project** | `globals.css` references `--font-kmr-waldenburg`, but no `@font-face` / `next/font` loader is defined yet, so the site currently renders in Helvetica/Arial |
| **Unresolved**   | Load kmrWaldenburg (license + self-host) or drop it from the stack. Unused files in `public/font/` (WantedSans, Wagon, OffBit) should be removed or adopted |

## 4. Component Stylings

All components are square-cornered (radius 0). Structure comes from 1px borders and fills, not rounding.

### Portfolio Primary

- Background: `#0071e3` · Text: `#ffffff` · Radius: 0 · Padding: 11px 21px · Height: 44px · Font: 17px / 500
- Use: hero-level CTA (contact, resume)

### Portfolio Outline

- Background: transparent · Text: `#0066cc` · Border: 1px solid `#0066cc` · Radius: 0 · Padding: 11px 21px · Height: 44px · Font: 17px / 500
- Use: secondary action paired with a primary CTA

### Portfolio Compact

- Background: `#0071e3` · Text: `#ffffff` · Radius: 0 · Padding: 8px 15px · Height: 36px · Font: 14px / 500
- Use: project-card or tile-level CTA

### Project Gallery Tab

- Text: `#1d1d1f` · Height: 53px · Font: 17px / 400
- Use: switching between project screenshots/media on a project detail page

### Content Card (`Card`)

- Background: `surface` · Border: 1px solid `border` · Radius: 0 · Content padding: 12px 16px
- Use: project card, blog post card, skill card - the general content-tile shape across the site
- Meta boxes (period, tags, timeline items) use the same 1px `border` box so cards and meta read as one ruled system.

---

**Base reference:** Apple, verified 2026-07-11 (apple.com + Human Interface Guidelines, public web evidence) - colors only; shape and type diverged 2026-11-24 toward an angular editorial tone
**Adapted for:** 한유진 personal portfolio (Next.js Pages Router)

## 5. Layout Principles

- Marketing-style pages (home, about) use full-width composition and centered content; content pages (projects, blog) use denser list/detail layout.
- Spacing is component-local: 8px/15px for compact action padding, 11px/21px for the large button, 20px as a recurrent content cluster gap.
- Don't invent a universal spacing scale beyond what's listed - extend only when a new component genuinely needs it.

## 6. Depth & Elevation

No shadow token is canonical. Primary/outline buttons are flat; content cards are flat, square, and separated by a 1px border. Let imagery, whitespace, borders, and color contrast create depth rather than drop shadows.

## 7. Do's and Don'ts

### Do

- Use the single kmrWaldenburg → Helvetica stack for every role; build hierarchy with the role classes in §3.
- Use `#0071e3` for filled actions and `#0066cc` for light-surface links/outline actions.
- Keep selected state explicit in gallery-style tabs.
- Reuse the same square button/card shapes and 1px border boxes across home, work, blog, and playground.
- In cards, pair `text-tile-heading` (title) with `text-body-small` (description) - the 16px/600 vs 14px/400 contrast is what makes the title read as a title.

### Don't

- Don't introduce a second accent color for variety.
- Don't mix the 36px and 44px button sizes within the same composition.
- Don't reintroduce rounded corners (`rounded-*`) on cards, buttons, or boxes. Circles for intentional graphic marks (e.g. avatar, dot) are the only exception.
- Don't add drop shadows as a default card treatment.
- Don't use exclamation marks or emoji in UI copy or CTAs.

## 8. Responsive Behavior

No universal breakpoints are promoted from the source reference. Preserve control geometry (button height/padding, square corners) across breakpoints; adjust font size and layout density with standard Tailwind breakpoints already in use in this codebase.

## 9. Agent Prompt Guide

- "Create a large CTA with `#0071e3`, white text, 44px height, square corners, 11px 21px padding, 17px/500."
- "Pair it with an outline action using transparent background and `#0066cc` text/border."
- "For a project-card CTA, use the compact 36px / 8px 15px variant."
- "For project/blog cards, use the square `surface` card with a 1px `border` - no radius, no drop shadow."

## 10. Voice & Tone

Copy should be concise, recognizable, and directly tied to what happens next. Prefer plain statements over promotional filler. One capability or one idea per heading; short actions over long explanations.

Clarity doesn't mean stripping away character - pair **Simplicity** with **Craft**: remove what's unnecessary, care about detail (spacing, alignment, consistent radius), and let small transitions support the task rather than interrupt it.

## 11. Brand Narrative

한유진은 프론트엔드 개발자로, 디자인과 성능, 사용자 경험을 통해 어떻게 사용자와 더 가까워질 수 있을지 고민한다. 이 포트폴리오는 그 관심사를 보여주는 자리다: 정리된 타이포그래피 스케일, 절제된 컬러 팔레트, 각진 박스와 가는 테두리로 일관된 컴포넌트 형태로 "만드는 사람이 디테일에 신경 쓴다"는 것을 말이 아니라 화면으로 증명한다.

Apple의 컬러 체계를 차용한 이유도 같은 맥락이다 - 제품(여기서는 프로젝트와 글)이 주인공이 되도록 UI는 최대한 절제하고, 계층 구조와 상호작용만 명확하게 남긴다. 곡률을 없앤 에디토리얼 톤은 콘텐츠를 장식 없이 구획해 정리된 인상을 준다.

## 12. Principles

1. 콘텐츠(프로젝트, 글)가 주인공이 되도록 컨트롤은 시각적으로 절제한다.
2. 화면마다 하나의 명확한 액션 컬러만 쓴다.
3. 타이포그래피 역할과 크기를 일치시킨다: §3의 역할 클래스만 쓰고 임의 크기로 덮어쓰지 않는다.
4. 홈/소개/프로젝트/블로그 전반에 걸쳐 같은 버튼·카드 형태를 재사용한다.
5. 검증된 토큰 값을 우선하고, 새 토큰이 필요할 때만 최소한으로 확장한다.

## 13. Personas

- **채용 담당자 / 리크루터**: 짧은 시간 안에 스킬과 프로젝트를 훑어보고 싶어 한다. 명확한 계층과 빠른 스캔이 중요하다.
- **동료 개발자**: 코드/구현 디테일과 기술적 선택의 이유에 관심이 있다. 프로젝트 설명에 기술 스택과 문제 해결 과정이 드러나야 한다.
- **협업/네트워킹 상대**: 연락 방법과 최근 활동(블로그, 최신 프로젝트)을 빠르게 찾고 싶어 한다.

## 14. States

| Component           | State evidence                                                                         |
| ------------------- | -------------------------------------------------------------------------------------- |
| Buttons             | default geometry defined; add hover/active/focus/disabled per standard web affordances |
| Project gallery tab | selected and unselected                                                                |
| Content card        | default flat state; add hover (subtle, no shadow-heavy treatment)                      |

## 15. Motion & Easing

No exact motion token is promoted from the source reference. This project already uses `motion` (Framer Motion) - keep transitions short (150–250ms), ease-out for entrances, and respect `prefers-reduced-motion`.
