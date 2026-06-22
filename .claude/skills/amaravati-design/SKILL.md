---
name: amaravati-design
description: Design system skill for the data.amaravati project (amaravati-design). Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# amaravati-design Design System

You are building UI for **amaravati-design**. Light-themed, neutral palette, sans-serif typography (sans-serif), compact density on a 4px grid, expressive motion.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Solid colors only** — no gradients anywhere. Every surface is a single flat color.
- **Single typeface** — sans-serif carries all text. Hierarchy comes from size, weight, and color — never font mixing.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **neutral palette** — the color temperature runs neutral, matching the sans-serif typography.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.
- **Lucide icons** — use Lucide for all iconography. Do not mix icon libraries.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Text Primary | `--text-primary` | `#05070e` | Headings, body text |

### CSS Variable Tokens

```css
--ink-muted: 71 85 110;
```

## Typography

### Font Stack

- **sans-serif** — Heading 1, Heading 2, Heading 3, Body, Caption

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | sans-serif | 48px / 3rem | 700 |
| Heading 2 | sans-serif | 32px / 2rem | 600 |
| Heading 3 | sans-serif | 24px / 1.5rem | 600 |
| Body | sans-serif | 16px / 1rem | 400 |
| Caption | sans-serif | 12px / 0.75rem | 400 |

### Typography Rules

- All text uses **sans-serif** — never add another font family
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `0 0 8px 0, 3px, 4px, 6px, 8px, 12px, 14px, 16px, 24px`
Default: `8px`

### Breakpoints

| Name | Value |
|------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgb(var(--ink) / 0.04), 0 18px 40px -28px rgb(var(--ink) / 0.18);
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #cccccc;
  color: #05070e;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #cccccc;
  color: #05070e;
  border-radius: 8px;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 8px 12px;
  color: #05070e;
  font-size: 14px;
}
.input:focus { border-color: var(--accent); outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #ffffff;
  color: #030408;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 1px 2px rgb(var(--ink) / 0.04), 0 18px 40px -28px rgb(var(--ink) / 0.18);
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #030408;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #cccccc;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #cccccc;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}
.nav-link {
  color: #030408;
  padding: 8px 12px;
  border-radius: 8px;
  transition: color 150ms;
}
.nav-link:hover { color: #05070e; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

### Extracted Components

These components were found in the codebase:

**AiLauncher** (`src/components/AiLauncher.tsx`)
- Styles: `bg-gradient-to-r`, `rounded-full`, `gap-2.5`, `text-sm`, `shadow-[0_18px_40px_-16px_rgb(var(--brand)/0.65)]`

**Disclaimer** (`src/components/Disclaimer.tsx`)
- Variants: `platform`, `visit`
- Styles: `bg-paper-2`, `border-t`, `py-6`, `text-2xs`

**SiteFooter** (`src/components/SiteFooter.tsx`)
- Styles: `bg-paper`, `border-t`, `gap-10`, `text-sm`

**SiteHeader** (`src/components/SiteHeader.tsx`)
- Variants: `light`, `overDark`
- Styles: `bg-navy`, `border-t`, `gap-3`, `text-white/90`, `backdrop-blur-md`

**AnimatedAiChat** (`src/components/ui/animated-ai-chat.tsx`)
- Variants: `Tab`
- Props: `minHeight`, `maxHeight`
- Styles: `bg-transparent`, `rounded-md`, `p-6`, `text-white`, `blur-[128px]`

**DigitalAurora** (`src/components/ui/digital-aurora.tsx`)
- Props: `title`, `description`, `badgeText`, `badgeLabel`, `ctaButtons`, `microDetails`
- Styles: `bg-white/5`, `rounded-full`, `mx-auto`, `text-[10px]`, `backdrop-blur-sm`

**ThemeToggle.demo** (`src/components/ui/theme-toggle.demo.tsx`)
- Styles: `gap-4`, `text-center`

**ThemeToggle** (`src/components/ui/theme-toggle.tsx`)
- Variants: `sm`, `md`, `lg`
- Props: `className`, `size`
- Styles: `rounded-full`

**TravelConnectSignin1** (`src/components/ui/travel-connect-signin-1.tsx`)
- Variants: `citizen`
- Props: `x`, `y`, `r`, `hub`
- Styles: `bg-paper`, `rounded-3xl`, `p-10`, `text-center`, `shadow-lift`

**Ui** (`src/components/ui.tsx`)
- Variants: `primary`, `ghost`, `div`, `article`, `subtle`, `li`
- Styles: `bg-current`, `rounded-full`, `mb-3.5`, `text-balance`, `opacity-80`

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### Framer Motion

```tsx
// Standard enter animation
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>

// List stagger
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
```

### CSS Animations

- `animate-pulse`
- `animate-spin`
- `animate-bounce`
- `animate-ping`
- `animate-marquee`

### Motion Tokens

- **Duration scale:** `600ms`
- **Easing functions:** `cubic-bezier(0.2,0.7,0.2,1)`
- **Animated properties:** `opacity`, `transform`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (600ms) for micro-interactions, long (600ms) for page transitions
- **Easing:** Use `cubic-bezier(0.2,0.7,0.2,1)` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Dark Mode

This project supports **light and dark mode** via CSS variables.

### Token Mapping

| Variable | Light | Dark |
|----------|-------|------|
| `--paper` | `255 255 255` | `8 12 22` |
| `--paper-2` | `247 248 250` | `14 20 34` |
| `--paper-3` | `240 242 246` | `20 28 46` |
| `--ink` | `14 25 45` | `233 238 251` |
| `--ink-muted` | `71 85 110` | `167 178 199` |
| `--ink-faint` | `110 123 145` | `122 134 156` |
| `--line` | `214 219 227` | `39 50 72` |
| `--line-soft` | `233 236 241` | `26 34 52` |
| `--navy` | `10 31 68` | `173 197 240` |
| `--brand` | `29 78 216` | `96 165 250` |
| `--brand-2` | `37 99 235` | `122 162 247` |
| `--saffron` | `255 153 51` | `255 173 92` |
| `--green` | `19 136 8` | `52 196 120` |
| `--cls-open` | `21 115 71` | `52 196 120` |
| `--cls-internal` | `29 78 216` | `122 162 247` |

### Implementation

- Toggle via `.dark` class on `<html>` or `[data-theme="dark"]`
- Always use CSS variables for colors — never hardcode hex values
- Test both modes for contrast and readability

## Depth & Elevation

### Shadow Tokens

- **card** (Overlay (modals, dialogs)): `0 1px 2px rgb(var(--ink) / 0.04), 0 18px 40px -28px rgb(var(--ink) / 0.18)`
- **lift** (Overlay (modals, dialogs)): `0 24px 60px -30px rgb(var(--ink) / 0.28)`

### Z-Index Scale

`200`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No gradients** — solid colors only, everywhere
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only sans-serif are allowed
- **No arbitrary border-radius** — use the scale: 3px, 4px, 6px, 8px, 12px, 14px, 16px, 24px
- **No opacity for disabled states** — use muted colors instead
- **No pill shapes** — this design doesn't use rounded-full / 9999px radius

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — sans-serif only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Brand typeface:** sans-serif

## Quick Reference

```
Background:     #ffffff
Surface:        (not extracted)
Text:           #05070e / (not extracted)
Accent:         (not extracted)
Border:         (not extracted)
Font:           sans-serif
Spacing:        4px grid
Radius:         8px
Frameworks:     Tailwind CSS, React
Icons:          Lucide
Components:     26 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for amaravati-design
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "amaravati-design" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# amaravati-design DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: Tailwind CSS 3.4.17 + React 18.3.1
> Colors: 2 · Fonts: 1 · Components: 26
> Icon library: Lucide · State: not detected
> Primary theme: light · Dark mode toggle: yes · Motion: expressive

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a neutral, approachable feel. The light background emphasizes content clarity. Typography uses **sans-serif** throughout — a clean, modern choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#ffffff` | background | Page background, darkest surface |
| text-primary | `#05070e` | text-primary | Headings and body text |

### Dark Mode Token Mapping

| Variable | Light | Dark |
|---|---|---|
| `--paper` | `255 255 255` | `8 12 22` |
| `--paper-2` | `247 248 250` | `14 20 34` |
| `--paper-3` | `240 242 246` | `20 28 46` |
| `--ink` | `14 25 45` | `233 238 251` |
| `--ink-muted` | `71 85 110` | `167 178 199` |
| `--ink-faint` | `110 123 145` | `122 134 156` |
| `--line` | `214 219 227` | `39 50 72` |
| `--line-soft` | `233 236 241` | `26 34 52` |
| `--navy` | `10 31 68` | `173 197 240` |
| `--brand` | `29 78 216` | `96 165 250` |
| `--brand-2` | `37 99 235` | `122 162 247` |
| `--saffron` | `255 153 51` | `255 173 92` |
| `--green` | `19 136 8` | `52 196 120` |
| `--cls-open` | `21 115 71` | `52 196 120` |
| `--cls-internal` | `29 78 216` | `122 162 247` |
| `--cls-sensitive` | `180 83 9` | `245 158 66` |
| `--cls-confidential` | `71 85 105` | `148 163 184` |

### CSS Variable Tokens

```css
--ink-muted: 71 85 110;
```


---

## 3. Typography Rules

**Font Stack:**
- **sans-serif** — Heading 1, Heading 2, Heading 3, Body, Caption

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | sans-serif | 48px / 3rem | 700 |
| Heading 2 | sans-serif | 32px / 2rem | 600 |
| Heading 3 | sans-serif | 24px / 1.5rem | 600 |
| Body | sans-serif | 16px / 1rem | 400 |
| Caption | sans-serif | 12px / 0.75rem | 400 |

**Typographic Rules:**
- Use **sans-serif** for all text — do not mix font families
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


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

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32
- **Border radius:** 0 0 8px 0, 3px, 4px, 6px, 8px, 12px, 14px, 16px, 24px
- **Grid usage:** `grid-cols-1`, `grid-cols-2`, `col-span-2`
- **Container:** Tailwind `container` class with responsive padding

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Overlay — full-screen overlays, top-level dialogs

- **card:** `0 1px 2px rgb(var(--ink) / 0.04), 0 18px 40px -28px rgb(var(--ink) / 0.18)`
- **lift:** `0 24px 60px -30px rgb(var(--ink) / 0.28)`

### Z-Index Scale

`200`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### Framer Motion Patterns

```tsx
// Standard enter animation
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>

// List stagger
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
}
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
}
```

### CSS Animations

- `@keyframes animate-pulse`
- `@keyframes animate-spin`
- `@keyframes animate-bounce`
- `@keyframes animate-ping`
- `@keyframes animate-marquee`

### Animated Components

- **A11yControls**: tw-transitions: transition-colors
- **AiLauncher**: tw-transitions: transition-transform, hover-transforms
- **SiteHeader**: tw-transitions: transition-colors, duration-300
- **AnimatedAiChat**: framer-motion, transition: {duration: 0.2}, animate-presence
- **DigitalAurora**: tw-transitions: transition-colors, duration-300

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ffffff` as the primary page background
- Use **sans-serif** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 0 0 8px 0, 3px, 4px, 6px, 8px
- Reuse existing components from Section 4 before creating new ones
- Use **Lucide** for all icons
- Always use CSS variables for colors — never hardcode hex
- Test both light and dark modes for contrast

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use sans-serif consistently
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use gradients — the design uses solid colors only
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't mix icon libraries — consistency matters

### Anti-Patterns (detected from codebase)

- No gradient backgrounds
- No zebra striping on tables/lists


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
Background: #ffffff
Border: 1px solid var(--border)
Radius: 8px
Padding: 16px
Font: sans-serif
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 8px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #ffffff
Label: var(--text-muted) (muted, 12px, uppercase)
Value: #05070e (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid var(--border)
Focus: border-color var(--accent)
Label: var(--text-muted) 12px
Spacing: 16px between fields
Radius: 8px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: sans-serif, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

