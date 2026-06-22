# amaravati-design DESIGN.md

> Design system for the **data.amaravati** project — a gov-credible editorial UI.
> Auto-extracted by skillui (static analysis) and **hand-enriched** from
> `tailwind.config.ts` + `src/styles/index.css` (the source of truth).
> Frameworks: Tailwind CSS 3.4 + React 18 · Motion: framer-motion + CSS keyframes
> Themes: light (default) · dark · high-contrast (GIGW) — one CSS-variable set powers all three.

---

## 1. Visual Theme & Atmosphere

This is a **gov-credible editorial** interface — restrained, institutional, and
typographically led. It defaults to a **light** theme on near-white paper with
deep navy ink, and ships two more full themes driven by the same token set:
**dark** and **high-contrast** (GIGW accessibility). The palette is
**India tricolour-derived**: institutional chakra **blue** as the primary, with
**saffron**, **green**, **navy**, and a premium **gold** as accents.

Typography mixes two families on purpose: a **serif** display face
(Newsreader Variable / Georgia) for headings and an **Inter** sans for body and
UI. Density is comfortable (body 17px / 1.65), spacing rides a **4px grid**, and
motion is **subtle and purposeful** — quiet reveal/fade-up transitions on a
shared `ease-gov` curve, with framer-motion reserved for a few rich surfaces.
`prefers-reduced-motion` is honoured globally.

---

## 2. Color Palette & Roles

All colors are CSS custom properties expressed as **`R G B` channels**, consumed
via Tailwind's `rgb(var(--x) / <alpha-value>)`. **Never hardcode hex** — always
reference a token so light / dark / high-contrast all work.

### Core Roles (light theme values)

| Token | RGB | Hex | Role |
|---|---|---|---|
| `--paper` | `255 255 255` | `#ffffff` | Page background |
| `--paper-2` | `247 248 250` | `#f7f8fa` | Raised surface / subtle fill |
| `--paper-3` | `240 242 246` | `#f0f2f6` | Sunken / tertiary surface |
| `--ink` | `14 25 45` | `#0e192d` | Primary text |
| `--ink-muted` | `71 85 110` | `#47556e` | Secondary text |
| `--ink-faint` | `110 123 145` | `#6e7b91` | Tertiary / captions |
| `--line` | `214 219 227` | `#d6dbe3` | Borders / inputs |
| `--line-soft` | `233 236 241` | `#e9ecf1` | Soft dividers |
| `--navy` | `10 31 68` | `#0a1f44` | Deep brand surface (e.g. header) |
| `--brand` | `29 78 216` | `#1d4ed8` | **Primary** — institutional chakra blue |
| `--brand-2` | `37 99 235` | `#2563eb` | Brand secondary / hover |
| `--saffron` | `255 153 51` | `#ff9933` | Tricolour accent (decorative) |
| `--green` | `19 136 8` | `#138808` | Tricolour accent |
| `--gold` | `231 196 107` | `#e7c46b` | Premium gold accent |

### Classification tiers (4-tier confidentiality)

| Token | Light RGB | Meaning |
|---|---|---|
| `--cls-open` | `21 115 71` | Open data |
| `--cls-internal` | `29 78 216` | Internal |
| `--cls-sensitive` | `180 83 9` | Sensitive |
| `--cls-confidential` | `71 85 105` | Confidential |

Tailwind exposes these as `open` / `internal` / `sensitive` / `confidential`
color utilities (e.g. `text-sensitive`, `bg-open`, `border-confidential`).
shadcn-style aliases also map onto the palette: `primary`→`--brand`,
`background`→`--paper`, `foreground`→`--ink`, `input`→`--line`,
`accent`→`--paper-2`.

### Full Theme Token Mapping (light · dark · high-contrast)

| Variable | Light | Dark | High-contrast |
|---|---|---|---|
| `--paper` | `255 255 255` | `8 12 22` | `0 0 0` |
| `--paper-2` | `247 248 250` | `14 20 34` | `0 0 0` |
| `--paper-3` | `240 242 246` | `20 28 46` | `12 12 12` |
| `--ink` | `14 25 45` | `233 238 251` | `255 255 255` |
| `--ink-muted` | `71 85 110` | `167 178 199` | `240 240 240` |
| `--ink-faint` | `110 123 145` | `122 134 156` | `210 210 210` |
| `--line` | `214 219 227` | `39 50 72` | `255 255 255` |
| `--line-soft` | `233 236 241` | `26 34 52` | `170 170 170` |
| `--navy` | `10 31 68` | `173 197 240` | `255 210 0` |
| `--brand` | `29 78 216` | `96 165 250` | `255 210 0` |
| `--brand-2` | `37 99 235` | `122 162 247` | `255 210 0` |
| `--saffron` | `255 153 51` | `255 173 92` | `255 210 0` |
| `--green` | `19 136 8` | `52 196 120` | `0 230 0` |
| `--gold` | `231 196 107` | `231 196 107` | `255 210 0` |
| `--cls-open` | `21 115 71` | `52 196 120` | `0 230 0` |
| `--cls-internal` | `29 78 216` | `122 162 247` | `120 200 255` |
| `--cls-sensitive` | `180 83 9` | `245 158 66` | `255 210 0` |
| `--cls-confidential` | `71 85 105` | `148 163 184` | `230 230 230` |

Themes switch on the root element: default `:root` (light), `[data-theme="dark"]`
(also `.dark` class), and `[data-contrast="high"]`. Each sets the matching
`color-scheme`. `--focus` aliases `--brand`.

---

## 3. Typography Rules

Two intentional families. **Hierarchy comes from mixing serif display with sans
body**, not from a single typeface.

**Font stacks** (`tailwind.config.ts` → `fontFamily`):
- **serif** (`font-serif`): `'Newsreader Variable', Georgia, 'Times New Roman', serif` — **headings h1–h4**
- **sans** (`font-sans`, default body): `'Inter Variable', Inter, -apple-system, 'Segoe UI', sans-serif` — body & UI
- **mono** (`font-mono`): `ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace` — data/labels (e.g. CommandCenter), `tabular-nums`

Fonts are **self-hosted** via `@fontsource-variable/*` (no third-party CDN; keeps `font-src 'self'`).

**Base & headings (from `index.css`):**
- Body: `font-sans`, **17px** (`1.0625rem`) / line-height **1.65**, antialiased, `optimizeLegibility`
- Headings `h1–h4`: `font-serif`, weight **500**, letter-spacing **-0.015em**, `text-wrap: balance`
- Paragraphs: `text-wrap: pretty`
- `.eyebrow`: 11px, weight 600, **uppercase**, letter-spacing **0.22em** (`tracking-eyebrow`), brand-colored
- Custom size token: `text-2xs` = `0.6875rem` / 1.4

**Rules:**
- Serif for display headings, Inter sans for body/UI, mono for tabular data — don't blur these roles
- Headings stay at weight 500 (not 700) — restraint is the look
- Use color/opacity tokens (`ink-muted`, `ink-faint`) for hierarchy, not extra sizes


---

## 4. Component Stylings

### Layout (3)

**A11yControls** — `src/components/A11yControls.tsx`
- Key Styles: `gap-0.5`
- Animation: tw-transitions: transition-colors

```tsx
<div className={cn("flex items-center gap-1.5", className
```

**ThemeToggle.demo** — `src/components/ui/theme-toggle.demo.tsx`
- Key Styles: `gap-4`, `text-sm`

```tsx
<div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        Click the toggle to switch between light and dark mode.
      </p>
      <ThemeToggle size="md" />
    </div>
```

**ThemeToggle** — `src/components/ui/theme-toggle.tsx`
- Variants: `sm`, `md`, `lg`
- Props: `className`, `size`
- Key Styles: `rounded-full`, `border-2`, `cursor-pointer`
- Animation: tw-transitions: transition-colors, duration-700, transition-all, duration-500

```tsx
<svg
      aria-hidden
      className={cn("block shrink-0", className
```

### Navigation (8)

**AiLauncher** — `src/components/AiLauncher.tsx`
- Key Styles: `rounded-full`, `border-2`, `bg-gradient-to-r`, `gap-2.5`, `text-sm`, `font-semibold`, `shadow-[0_18px_40px_-16px_rgb(var(--brand)/0.65)]`, `hover:-translate-y-0.5`
- Animation: tw-transitions: transition-transform, hover-transforms

```tsx
<Link
      to="/assistant"
      aria-label="Talk to the data.amaravati AI assistant"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-green to-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-16px_rgb(var(--brand
```

**SiteFooter** — `src/components/SiteFooter.tsx`
- Key Styles: `border-line-soft`, `bg-paper`, `gap-10`, `text-sm`, `font-semibold`, `hover:text-ink`

```tsx
<footer className="border-t border-line-soft bg-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.5fr_repeat(3,1fr
```

**SiteHeader** — `src/components/SiteHeader.tsx`
- Variants: `light`, `overDark`
- Key Styles: `rounded-md`, `border-line-soft`, `bg-navy`, `gap-3`, `text-sm`, `font-semibold`, `backdrop-blur-md`, `hover:text-white`
- Animation: tw-transitions: transition-colors, duration-300
- State: useState

**DigitalAurora** — `src/components/ui/digital-aurora.tsx`
- Props: `title`, `description`, `badgeText`, `badgeLabel`, `ctaButtons`, `microDetails`
- Key Styles: `rounded-full`, `border-white/15`, `bg-white/5`, `mx-auto`, `text-xs`, `font-medium`, `backdrop-blur-sm`, `pointer-events-none`
- Animation: tw-transitions: transition-colors, duration-300
- State: useState, useRef

```tsx
<section className="relative h-dvh w-full overflow-hidden">
      <ShaderBackground />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-36 sm:gap-8 sm:pt-44 md:px-10 lg:px-16">
        {badgeText && badgeLabel && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/70">
              {badgeLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="text-xs font-light tracking-tight text-white/80">{badgeText}</span>
          </div>
```

**Ui** — `src/components/ui.tsx`
- Variants: `primary`, `ghost`, `div`, `article`, `subtle`, `li`
- Key Styles: `rounded-full`, `border-current`, `bg-current`, `mb-3.5`, `text-base`, `font-serif`, `opacity-80`
- Animation: tw-transitions: transition-all, duration-200, ease-gov

```tsx
<div className={cn("mb-8 max-w-prose2", className
```

**AssistantChat** — `src/features/assistant/AssistantChat.tsx`
- Variants: `user`, `Tab`, `assistant`
- Props: `top`, `behavior`
- Key Styles: `rounded-2xl`, `border-line-soft`, `bg-paper-2`, `px-4`, `text-sm`, `font-serif`, `shadow-card`, `hover:border-brand`
- Animation: tw-animate-spin, tw-animate-bounce, tw-transitions: transition-colors, transition-opacity
- State: useState, useRef

**Assistant** — `src/pages/Assistant.tsx`
- Key Styles: `rounded-full`, `border-line-soft`, `bg-paper`, `gap-4`, `text-base`, `font-serif`, `blur-[130px]`, `pointer-events-none`
- Animation: tw-animate-pulse

```tsx
<main id="main" className="relative flex h-dvh flex-col overflow-hidden bg-paper">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-green/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-brand/10 blur-[130px] [animation-delay:700ms]" />
        <div className="absolute right-1/3 top-1/3 h-64 w-64 animate-pulse rounded-full bg-gold/10 blur-[96px] [animation-delay:1000ms]" />
      </div>
      <header className="relative z-10 flex items-center justify-between gap-4 border-b border-line-soft bg-paper/70 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back to data.amaravati"
```

**Visit** — `src/pages/Visit.tsx`
- Variants: `heritage`, `river`, `culture`, `nature`, `all`, `Heritage`, `Riverfront`, `Culture`, `Cuisine`, `Nature`, `family`, `Family`
- Key Styles: `rounded-card`, `border-line-soft`, `bg-paper`, `pt-32`, `text-lg`, `font-medium`, `shadow-card`
- Animation: tw-transitions: transition-colors, transition-all, duration-300, ease-gov
- State: useState

```tsx
<div className="bg-paper">
      <SiteHeader
        links={NAV}
        cta={{ label: "Plan your visit", to: "#plan" }}
        brandSubtitle="Visit · Concept Guide"
      />

      <main id="main">
        {/* ----------------------------------------------------------- HERO */}
        <section className="relative scroll-mt-24 pt-32">
          <div className="wrap">
            <Reveal className="max-w-content">
```

### Data Display (1)

**Scorecards** — `src/pages/platform/Scorecards.tsx`
- Variants: `review`
- Props: `e.abbr`
- Key Styles: `rounded-2xl`, `border-dashed`, `bg-paper-2`, `mx-auto`, `text-xl`, `font-serif`, `shadow-card`, `focus:outline-none`
- State: useState

```tsx
<div className="mx-auto max-w-xl rounded-2xl border border-dashed border-line bg-paper-2 px-7 py-11 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h4 className="font-serif text-xl">{head}</h4>
      <p className="mx-auto mt-2.5 max-w-md text-sm text-ink-muted">{body}</p>
      <Btn className="mx-auto mt-6" onClick={openSignIn}>
        {btn} →
      </Btn>
    </div>
```

### Data Input (3)

**TravelConnectSignin1** — `src/components/ui/travel-connect-signin-1.tsx`
- Variants: `citizen`
- Props: `x`, `y`, `r`, `hub`
- Key Styles: `rounded-3xl`, `border-line-soft`, `bg-paper`, `p-10`, `text-3xl`, `font-serif`, `shadow-lift`
- Animation: framer-motion, tw-transitions: transition-colors, transition-all, transition-transform, hover-transforms
- State: useState, useRef

**AuthFlow** — `src/features/auth/AuthFlow.tsx`
- Variants: `signin`, `persona`, `request`, `exchange`, `done`, `exchangeDone`, `citizen`
- Props: `name`, `email`, `persona`
- Key Styles: `rounded-2xl`, `border-line`, `bg-black/60`, `mb-6`, `text-sm`, `font-medium`, `backdrop-blur-sm`, `hover:border-brand`
- State: useState, useContext, useRef

**Platform** — `src/pages/Platform.tsx`
- Variants: `all`, `U`, `You`
- Props: `k`, `label`
- Key Styles: `rounded-full`, `border-line`, `bg-paper-2`, `px-4`, `text-xs`, `font-bold`, `hover:border-brand`
- Animation: tw-animate-marquee, tw-transitions: transition-transform, transition-colors, hover-transforms
- State: useState

```tsx
<AuthFlowProvider>
      <PlatformInner />
    </AuthFlowProvider>
```

### Overlay (2)

**AnimatedAiChat** — `src/components/ui/animated-ai-chat.tsx`
- Variants: `Tab`
- Props: `minHeight`, `maxHeight`
- Key Styles: `rounded-md`, `border-white/[0.08]`, `bg-transparent`, `p-6`, `text-3xl`, `font-serif`, `blur-[128px]`, `pointer-events-none`
- Animation: framer-motion, transition: {duration: 0.2}, animate-presence
- State: useState, useRef, forwardRef

**CommandCenter** — `src/pages/CommandCenter.tsx`
- Variants: `land`, `mobility`, `water`, `energy`, `env`, `safety`, `economy`, `exchange`, `database`, `shield`, `gauge`, `open`, `internal`, `sensitive`, `layers`, `Enter`, `gov`, `bolt`, `confidential`, `activity`
- Key Styles: `rounded-md`, `border-line-soft`, `bg-paper`, `gap-x-4`, `text-sm`, `font-mono`, `backdrop-blur`, `hover:border-line`
- Animation: tw-animate-ping, tw-animate-marquee, tw-transitions: transition-colors, transition-opacity
- State: useState, useRef

```tsx
typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce
```

### Media (1)

**Icon** — `src/components/Icon.tsx`

```tsx
<svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.spark}
    </svg>
```

### Other (8)

**Disclaimer** — `src/components/Disclaimer.tsx`
- Variants: `platform`, `visit`
- Key Styles: `border-line-soft`, `bg-paper-2`, `py-6`

```tsx
<div className="border-t border-line-soft bg-paper-2">
      <div className="wrap py-6 text-2xs leading-relaxed text-ink-faint">
        <p>
          <strong className="text-ink-muted">Concept prototype — not an official product.</strong>{" "}
          {variant === "visit" ? (
            <>
              Visit Amaravati is an independent concept inspired by the public Amaravati master plan
              and Andhra Pradesh's heritage. It is <strong className="text-ink-muted">not</strong> a
              Government of Andhra Pradesh or APCRDA product and is not endorsed by either. It uses no
              official State Emblem or copyrighted master-plan artwork; all illustrations are original
              abstract impressions and all figures are indicative.
            </>
```

**Reveal** — `src/components/Reveal.tsx`
- State: useRef

**ThemeProvider** — `src/components/ThemeProvider.tsx`
- Props: `dark`
- State: useState, useContext

```tsx
{ ...p, dark: !p.dark }
```

**AnimatedAiChat.demo** — `src/components/ui/animated-ai-chat.demo.tsx`
- Key Styles: `bg-[#05070e]`

```tsx
<div className="flex w-full overflow-x-hidden bg-[#05070e]">
      <AnimatedAIChat />
    </div>
```

**Demo** — `src/components/ui/demo.tsx`

**DigitalAurora.demo** — `src/components/ui/digital-aurora.demo.tsx`

```tsx
<AuroraHero
      title="Experience the Digital Aurora."
      description="A stunning, interactive hero section featuring a real-time volumetric aurora shader. Built with React and WebGL for a captivating user experience."
      badgeText="Generative Art"
      badgeLabel="Live Demo"
      ctaButtons={[
        { text: "Explore Now", href: "#", primary: true },
        { text: "Learn More", href: "#" },
      ]}
      microDetails={["Real-time rendering", "Interactive mouse influence", "Volumetric light simulation"]}
    />
```

**Session** — `src/features/auth/session.tsx`
- Variants: `null`
- State: useState, useContext

**CityTwin** — `src/features/twin/CityTwin.tsx`
- Props: `antialias`, `alpha`, `powerPreference`
- State: useRef



---

## 5. Layout Principles

- **Base grid:** 4px — every margin/padding/gap is a multiple of 4
- **Page container:** the `.wrap` class — `max-width: 1200px` (`maxWidth.content`), centered, `padding-inline: clamp(18px, 5vw, 56px)`. Use `.wrap` for page sections, not Tailwind's `container`.
- **Prose width:** `max-w-prose2` = `68ch` for long-form text
- **Border radius:** card surfaces use `rounded-card` = **14px**; pills/toggles use `rounded-full`; smaller chrome uses `rounded-md`. Larger cards (`rounded-2xl`/`rounded-3xl`) appear on auth/marketing surfaces.
- **Custom utilities:** `.eyebrow` (kicker label), `.reveal` / `.reveal.in` (scroll reveal), `.skip-link` (a11y), `.tabular` (`tabular-nums`)

**Spacing as meaning:**
| Spacing | Use |
|---|---|
| 4–8px | Tight: related items within a group |
| 12–16px | Medium: between groups |
| 24–32px | Wide: between sections |
| 48px+ | Vast: major section breaks |

---

## 6. Depth & Elevation

Elevation comes from two named shadow tokens (`tailwind.config.ts` → `boxShadow`),
tinted with the ink color rather than pure black:

- **`shadow-card`:** `0 1px 2px rgb(var(--ink) / 0.04), 0 18px 40px -28px rgb(var(--ink) / 0.18)` — default cards/panels
- **`shadow-lift`:** `0 24px 60px -30px rgb(var(--ink) / 0.28)` — raised/floating surfaces (modals, sign-in)

### Z-Index

`z-200` is used for the skip link (top of stacking order). Floating chrome like
the AI launcher sits at `z-40`; section content at `z-10`. Keep new layers within
this range.



---

## 7. Animation & Motion

Motion is **subtle and purposeful**, not flashy. The dominant idiom is a quiet
scroll-reveal / fade-up on a shared easing curve. framer-motion is used only on a
few rich surfaces (AuthFlow, animated-ai-chat, travel-connect-signin).

### Signature easing

`ease-gov` = **`cubic-bezier(.2, .7, .2, 1)`** (`transitionTimingFunction.gov`).
This is the house curve — prefer it for enters and hovers.

### Keyframes & animations (`tailwind.config.ts`)

- `animate-fade-up` → `fade-up .6s cubic-bezier(.2,.7,.2,1) both` (from `opacity:0, translateY(14px)`)
- `animate-marquee` → `marquee 40s linear infinite` (`translateX(-50%)`)
- Tailwind built-ins also used: `animate-pulse` (ambient glows), `animate-ping`, `animate-spin`, `animate-bounce`

### The `.reveal` pattern (`index.css`)

```css
.reveal      { opacity: 0; transform: translateY(14px);
               transition: opacity .6s cubic-bezier(.2,.7,.2,1),
                           transform .6s cubic-bezier(.2,.7,.2,1); }
.reveal.in   { opacity: 1; transform: none; }
```

Toggled by the `<Reveal>` component (IntersectionObserver adds `.in`).

### framer-motion (rich surfaces only)

```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
/>
```

### Guidelines

- Default duration ~**600ms** for reveals; **150–300ms** for hovers/micro-interactions
- Use `ease-gov` (`cubic-bezier(.2,.7,.2,1)`) as the default curve
- **`prefers-reduced-motion` is honoured globally** in `index.css` — animations/transitions collapse to ~0ms and `.reveal` shows immediately. Don't override this.


---

## 8. Do's and Don'ts

### Do's

- Use the **token utilities** (`bg-paper`, `text-ink`, `border-line`, `text-brand`, …) — never raw hex
- Use **serif for headings** (`font-serif`, weight 500) and **Inter sans for body**; `font-mono` for tabular data
- Follow the **4px** grid for all margins, padding, and gaps
- Use `shadow-card` / `shadow-lift` for elevation (Section 6)
- Use `rounded-card` (14px) for cards; `rounded-full` for pills/toggles
- Wrap page sections in `.wrap` (max-width 1200px)
- Reuse existing components from Section 4 before creating new ones
- Icons: prefer the project's custom `<Icon name="…">` (24px, `currentColor`, stroke); `lucide-react` is available for richer sets
- **Test all three themes** — light, dark, and `[data-contrast="high"]`

### Don'ts

- Don't introduce colors outside the token set — add a CSS variable first
- Don't hardcode hex (e.g. `#ffffff`, `#05070e`) — use `rgb(var(--token))` / Tailwind token utilities so theming works
- Don't put body text in a serif or headings in sans — keep the serif/sans roles
- Don't use arbitrary spacing — stick to multiples of 4px
- Don't invent box-shadow or radius values outside the tokens
- Don't disable or fight `prefers-reduced-motion`
- Don't duplicate component patterns — check Section 4 first

### Notes on usage (observed in codebase)

- **Gradients ARE used** sparingly for brand accent (e.g. AiLauncher `bg-gradient-to-r from-green to-brand`) and ambient blurred glows — keep them tasteful and brand-colored, not decorative everywhere.
- Deep surfaces (header, hero overlays) use `bg-navy` with light text.


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| sm | 640px | tailwind |
| md | 768px | tailwind |
| lg | 1024px | tailwind |
| xl | 1280px | tailwind |
| 2xl | 1536px | tailwind |

**Approach:** Mobile-first using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
Always design for mobile first, then layer on responsive overrides.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Surface:  bg-paper (or bg-paper-2 for raised)
Border:   border border-line
Radius:   rounded-card (14px)
Padding:  p-6 / p-7
Shadow:   shadow-card
Heading:  font-serif; body text-ink-muted
```

### Build a Button

```
Primary:  bg-brand text-white  (hover: bg-brand-2)
Ghost:    bg-transparent border border-line text-ink (hover: border-brand)
Padding:  px-4 py-2 / px-5 py-3
Radius:   rounded-full (pills) or rounded-md
Transition: ease-gov
Focus:    inherits global :focus-visible (3px brand outline)
```

### Build a Page Layout

```
Wrapper:  <div class="wrap">  → max-width 1200px, clamp padding
Surface:  bg-paper text-ink
Grid:     4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface:  bg-paper-2 rounded-card shadow-card
Label:    .eyebrow (11px, uppercase, tracking-eyebrow, text-brand)
Value:    font-serif text-2xl/3xl text-ink  (add .tabular for numbers)
Status:   classification tokens open/internal/sensitive/confidential
```

### Build a Form

```
Input bg:  bg-paper
Input border: border border-line  (focus: border-brand)
Label:     text-sm text-ink-muted
Spacing:   gap-4 between fields (16px)
Radius:    rounded-md
```

### General Component

```
1. Read references/DESIGN.md Sections 2-7 for tokens
2. Colors: token utilities only (bg-paper, text-ink, text-brand…), never hex
3. Type: font-serif headings (wt 500) · Inter sans body · font-mono for data
4. Spacing: 4px grid; wrap pages in .wrap
5. Components: match patterns from Section 4
6. Elevation: shadow-card / shadow-lift
7. Motion: ease-gov; respect prefers-reduced-motion
8. Verify in light, dark, and high-contrast themes
```
