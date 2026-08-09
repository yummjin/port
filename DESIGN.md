---
omd: 0.1
brand: 한유진 Portfolio
bootstrapped_from: apple
bootstrapped_at: 2026-08-09T06:43:44Z
tokens:
  source: reconciled
  extracted: "2026-07-11"
  note: "Base values are Apple's verified public-web tokens (apple.com marketing + HIG docs). Heading sizes and card padding were scaled down from Apple's raw marketing-page values (56/40/28px, 20px card padding) — those read as oversized on a personal-portfolio content density; corrected 2026-08-09 per user feedback. tile-heading was also bumped from Apple's captured 400 weight to 600: at card-title scale (vs. Apple's large 28px+ tile use) a 400-weight heading next to 400-weight body text had no visual hierarchy."
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
  typography:
    family: { display: "SF Pro Display", text: "SF Pro Text" }
    display-hero: { size: 40, weight: 600, lineHeight: "44px", tracking: "-0.28px" }
    section: { size: 28, weight: 600, lineHeight: "32px" }
    tile-heading: { size: 18, weight: 600, lineHeight: "24px", tracking: "0.196px" }
    body: { size: 17, weight: 400, lineHeight: "25px", tracking: "-0.374px" }
    body-small: { size: 14, weight: 400, lineHeight: "18.0008px", tracking: "-0.224px" }
    caption: { size: 12, weight: 400, lineHeight: "16.0005px", tracking: "-0.12px" }
  spacing: { compact: 8, control-inline: 15, pill-block: 11, pill-inline: 21, content: 20 }
  rounded: { control: 8, docs-card: 18, marketing-pill: 980 }
  components:
    portfolio-primary: { type: button, bg: "#0071e3", fg: "#ffffff", radius: "980px", padding: "11px 21px", height: "44px", font: "17px / 400", states: "default; add hover/active/focus per platform norms", use: "primary CTA (e.g. 이력서 보기, 연락하기)" }
    portfolio-outline: { type: button, bg: "transparent", fg: "#0066cc", border: "1px solid #0066cc", radius: "980px", padding: "11px 21px", height: "44px", font: "17px / 400", states: "default; add hover/active/focus per platform norms", use: "secondary action paired with a primary CTA" }
    portfolio-compact: { type: button, bg: "#0071e3", fg: "#ffffff", radius: "980px", padding: "8px 15px", height: "36px", font: "14px / 400", states: "default; add hover/active/focus per platform norms", use: "inline/tile-level CTA (e.g. project card '자세히 보기')" }
    project-gallery-tab: { type: tab, fg: "#1d1d1f", height: "53px", font: "17px / 400", states: "selected and unselected", use: "switching between project screenshots/media" }
    doc-reference-card: { type: card, bg: "#ffffff", radius: "18px", states: "default; add hover", use: "project card, blog post card, skill card" }
---

# Design System Inspiration of Apple

## 1. Visual Theme & Atmosphere

This portfolio borrows Apple's current web language: a small neutral palette, SF Pro optical families, and one conspicuous blue action, so that project work and writing carry the visual weight instead of decoration. The effect isn't minimalism for its own sake — precise hierarchy, familiar behavior, and limited ornament make a personal site read as considered rather than sparse.

Three surfaces exist in this project: the marketing-style pages (home, about), the content pages (projects, blog), and any documentation/meta chrome. Treat their typographic and component needs the way Apple separates apple.com marketing from HIG documentation chrome — related, not identical.

**Key Characteristics:**
- SF Pro Text for body/control roles; SF Pro Display for large hierarchy (hero, section headings)
- Primary filled action `#0071e3`; text link `#0066cc`; dark-surface link `#2997ff`
- 44px large pill and 36px compact pill coexist (hero CTA vs. project-tile CTA)
- Content cards use an 18px radius

## 2. Color Palette & Roles

- **Primary Action** (`#0071e3`): filled buttons — "연락하기", "이력서 다운로드", primary nav CTA.
- **Brand / Dark Canvas** (`#000000`): identity marks and any immersive dark section (e.g. hero on dark).
- **Fog Canvas** (`#f5f5f7`): light section and footer background.
- **Surface** (`#ffffff`): card and content surfaces.
- **Foreground** (`#1d1d1f`): principal text.
- **Muted** (`#6e6e73`): secondary/meta text (dates, tags, captions).
- **Secondary** (`#515154`): supporting body text.
- **On Primary** (`#ffffff`): text on blue filled actions.
- **Link** (`#0066cc`): inline links and outline-button text/border on light surfaces.
- **Link on Dark** (`#2997ff`): links on dark sections.

Keep this as one accent color system — don't introduce a second brand hue for variety.

## 3. Typography Rules

### Font Family
- **Display**: `SF Pro Display` — hero and section headings.
- **Text**: `SF Pro Text` — body copy, controls, captions.
- Fall back to the system font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", ...`) since SF Pro isn't web-licensed for arbitrary redistribution; Apple's own site relies on OS-level SF Pro plus this fallback chain for non-Apple platforms.

| Role | Family | Size | Weight | Line Height | Tracking |
|---|---|---:|---:|---:|---:|
| Display Hero | SF Pro Display | 40px | 600 | 44px | -0.28px |
| Section | SF Pro Display | 28px | 600 | 32px | normal |
| Tile Heading | SF Pro Display | 18px | 600 | 24px | 0.196px |
| Body | SF Pro Text | 17px | 400 | 25px | -0.374px |
| Body Small | SF Pro Text | 14px | 400 | 18.0008px | -0.224px |
| Caption | SF Pro Text | 12px | 400 | 16.0005px | -0.12px |

| Evidence class | Status |
|---|---|
| **Base** | SF Pro is Apple's system family; not distributable as a web font without an Apple developer/license context |
| **This project** | Use system-font fallback stack so rendering matches SF Pro on Apple devices and degrades gracefully elsewhere |
| **Unresolved** | Whether to self-host a licensed SF Pro web build — treat as a later upgrade, not a blocker |

## 4. Component Stylings

### Portfolio Primary
- Background: `#0071e3` · Text: `#ffffff` · Radius: 980px · Padding: 11px 21px · Height: 44px · Font: 17px / 400 / SF Pro Text
- Use: hero-level CTA (contact, resume)

### Portfolio Outline
- Background: transparent · Text: `#0066cc` · Border: 1px solid `#0066cc` · Radius: 980px · Padding: 11px 21px · Height: 44px · Font: 17px / 400 / SF Pro Text
- Use: secondary action paired with a primary CTA

### Portfolio Compact
- Background: `#0071e3` · Text: `#ffffff` · Radius: 980px · Padding: 8px 15px · Height: 36px · Font: 14px / 400 / SF Pro Text
- Use: project-card or tile-level CTA

### Project Gallery Tab
- Text: `#1d1d1f` · Height: 53px · Font: 17px / 400 / SF Pro Text
- Use: switching between project screenshots/media on a project detail page

### Doc Reference Card
- Background: `#ffffff` · Radius: 18px · Padding: 16px (scaled down from the reference's 20px `content` spacing — 20px reads as too loose on this project's denser card grids)
- Use: project card, blog post card, skill card — the general content-tile shape across the site

---

**Base reference:** Apple, verified 2026-07-11 (apple.com + Human Interface Guidelines, public web evidence)
**Adapted for:** 한유진 personal portfolio (Next.js Pages Router)

## 5. Layout Principles

- Marketing-style pages (home, about) use full-width composition and centered content; content pages (projects, blog) use denser list/detail layout.
- Spacing is component-local: 8px/15px for compact action padding, 11px/21px for the large pill, 20px as a recurrent content cluster gap.
- Don't invent a universal spacing scale beyond what's listed — extend only when a new component genuinely needs it.

## 6. Depth & Elevation

No shadow token is canonical. Primary/outline buttons are flat; content cards are flat with a radius only. Let imagery, whitespace, and color contrast create depth rather than drop shadows.

## 7. Do's and Don'ts

### Do
- Use SF Pro Display (system-font fallback) for hero/section headings, SF Pro Text for body/controls.
- Use `#0071e3` for filled actions and `#0066cc` for light-surface links/outline actions.
- Keep selected state explicit in gallery-style tabs.
- Reuse the same button/card shapes across home, about, projects, and blog.
- In cards, pair `text-tile-heading` (title) with `text-body-small` (description) — the 18px/600 vs 14px/400 contrast is what makes the title read as a title.

### Don't
- Don't introduce a second accent color for variety.
- Don't mix the 36px and 44px pill sizes within the same composition.
- Don't add drop shadows as a default card treatment.
- Don't use exclamation marks or emoji in UI copy or CTAs.

## 8. Responsive Behavior

No universal breakpoints are promoted from the source reference. Preserve control geometry (button height/radius/padding) across breakpoints; adjust font size and layout density with standard Tailwind breakpoints already in use in this codebase.

## 9. Agent Prompt Guide

- "Create a large CTA with `#0071e3`, white text, 44px height, 980px radius, 11px 21px padding, SF Pro Text 17px/400."
- "Pair it with an outline action using transparent background and `#0066cc` text/border."
- "For a project-card CTA, use the compact 36px / 8px 15px variant."
- "For project/blog cards, use the 18px-radius flat white card — no drop shadow."

## 10. Voice & Tone

Copy should be concise, recognizable, and directly tied to what happens next. Prefer plain statements over promotional filler. One capability or one idea per heading; short actions over long explanations.

Clarity doesn't mean stripping away character — pair **Simplicity** with **Craft**: remove what's unnecessary, care about detail (spacing, alignment, consistent radius), and let small transitions support the task rather than interrupt it.

## 11. Brand Narrative

한유진은 프론트엔드 개발자로, 디자인과 성능, 사용자 경험을 통해 어떻게 사용자와 더 가까워질 수 있을지 고민한다. 이 포트폴리오는 그 관심사를 보여주는 자리다: 정리된 타이포그래피 스케일, 절제된 컬러 팔레트, 일관된 컴포넌트 형태로 "만드는 사람이 디테일에 신경 쓴다"는 것을 말이 아니라 화면으로 증명한다.

Apple의 웹 언어를 차용한 이유도 같은 맥락이다 — 제품(여기서는 프로젝트와 글)이 주인공이 되도록 UI는 최대한 절제하고, 계층 구조와 상호작용만 명확하게 남긴다.

## 12. Principles

1. 콘텐츠(프로젝트, 글)가 주인공이 되도록 컨트롤은 시각적으로 절제한다.
2. 화면마다 하나의 명확한 액션 컬러만 쓴다.
3. 타이포그래피 역할과 크기를 일치시킨다: Display는 큰 계층, Text는 본문/컨트롤.
4. 홈/소개/프로젝트/블로그 전반에 걸쳐 같은 버튼·카드 형태를 재사용한다.
5. 검증된 토큰 값을 우선하고, 새 토큰이 필요할 때만 최소한으로 확장한다.

## 13. Personas

- **채용 담당자 / 리크루터**: 짧은 시간 안에 스킬과 프로젝트를 훑어보고 싶어 한다. 명확한 계층과 빠른 스캔이 중요하다.
- **동료 개발자**: 코드/구현 디테일과 기술적 선택의 이유에 관심이 있다. 프로젝트 설명에 기술 스택과 문제 해결 과정이 드러나야 한다.
- **협업/네트워킹 상대**: 연락 방법과 최근 활동(블로그, 최신 프로젝트)을 빠르게 찾고 싶어 한다.

## 14. States

| Component | State evidence |
|---|---|
| Buttons | default geometry defined; add hover/active/focus/disabled per standard web affordances |
| Project gallery tab | selected and unselected |
| Content card | default flat state; add hover (subtle, no shadow-heavy treatment) |

## 15. Motion & Easing

No exact motion token is promoted from the source reference. This project already uses `motion` (Framer Motion) — keep transitions short (150–250ms), ease-out for entrances, and respect `prefers-reduced-motion`.
