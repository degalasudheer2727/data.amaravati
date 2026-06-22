---
name: amaravati-design
description: Design system skill for the data.amaravati project (a gov-credible editorial UI). Activate when building or reviewing UI components, pages, CSS, or Tailwind for this codebase. Provides exact color tokens (light/dark/high-contrast), the serif+sans typography system, 4px spacing grid, elevation, motion, and component patterns. Read references/DESIGN.md before writing any CSS or JSX.
---

# amaravati-design Design System

UI for **data.amaravati** — a **gov-credible editorial** interface. Restrained,
institutional, typographically led. India tricolour-derived palette anchored on
institutional **chakra blue**. Three themes share one CSS-variable token set:
**light** (default), **dark**, and **high-contrast** (GIGW).

> **Source of truth:** `tailwind.config.ts` + `src/styles/index.css`.
> Read **`references/DESIGN.md`** for the full token tables, component scan, and
> agent prompt recipes before writing UI. This file is the quick reference.

## Design philosophy

- **Editorial, not flashy** — restraint reads as credibility. Headings carry the design.
- **Two typefaces on purpose** — serif display (Newsreader / Georgia) for headings, **Inter** sans for body/UI, mono for tabular data.
- **Tokens, never hex** — every color is a CSS variable (`rgb(var(--x) / <alpha>)`) so all three themes work. Hardcoded hex is a bug.
- **4px grid** — every dimension is a multiple of 4.
- **Subtle, purposeful motion** — quiet reveal/fade-up on the `ease-gov` curve; framer-motion only on rich surfaces. `prefers-reduced-motion` honoured globally.
- **Accessibility floor** — skip link, visible focus ring, high-contrast theme, reduced-motion.

## Color tokens (use the Tailwind utilities, never hex)

Light-theme values shown; full light/dark/high-contrast table is in `references/DESIGN.md`.

| Utility | Token | Light hex | Role |
|---|---|---|---|
| `bg-paper` | `--paper` | `#ffffff` | Page background |
| `bg-paper-2` | `--paper-2` | `#f7f8fa` | Raised surface |
| `bg-paper-3` | `--paper-3` | `#f0f2f6` | Sunken surface |
| `text-ink` | `--ink` | `#0e192d` | Primary text |
| `text-ink-muted` | `--ink-muted` | `#47556e` | Secondary text |
| `text-ink-faint` | `--ink-faint` | `#6e7b91` | Tertiary / captions |
| `border-line` | `--line` | `#d6dbe3` | Borders / inputs |
| `border-line-soft` | `--line-soft` | `#e9ecf1` | Soft dividers |
| `bg-navy` | `--navy` | `#0a1f44` | Deep brand surface |
| `text-brand` / `bg-brand` | `--brand` | `#1d4ed8` | **Primary** chakra blue |
| `*-brand-2` | `--brand-2` | `#2563eb` | Brand hover/secondary |
| `*-saffron` | `--saffron` | `#ff9933` | Tricolour accent |
| `*-green` | `--green` | `#138808` | Tricolour accent |
| `*-gold` | `--gold` | `#e7c46b` | Premium gold accent |

Classification utilities: `open` · `internal` · `sensitive` · `confidential`
(e.g. `text-sensitive`, `bg-open`). shadcn aliases map on top:
`primary→--brand`, `background→--paper`, `foreground→--ink`, `input→--line`, `accent→--paper-2`.

## Typography

- **Headings h1–h4:** `font-serif` (Newsreader Variable / Georgia), weight **500**, letter-spacing **-0.015em**, balanced wrap. *Not* bold, *not* sans.
- **Body / UI:** `font-sans` (Inter), **17px** (`1.0625rem`) / **1.65**.
- **Data / labels:** `font-mono` + `.tabular` (`tabular-nums`).
- **Eyebrow/kicker:** `.eyebrow` — 11px, uppercase, `tracking-eyebrow` (0.22em), `text-brand`.
- Fonts self-hosted via `@fontsource-variable/*` (no CDN).

## Spacing, layout & elevation

- **Grid:** 4px base — all spacing is a multiple of 4.
- **Page container:** `.wrap` → `max-width: 1200px`, centered, `padding-inline: clamp(18px, 5vw, 56px)`. Use `.wrap`, not Tailwind `container`. Long-form text: `max-w-prose2` (68ch).
- **Radius:** `rounded-card` (**14px**) for cards; `rounded-full` for pills/toggles; `rounded-md` for small chrome.
- **Elevation:** `shadow-card` (default panels) and `shadow-lift` (floating/modals) — ink-tinted, defined in `tailwind.config.ts`. Don't invent shadows.
- **Z-index:** skip link `z-200`; floating chrome `z-40`; content `z-10`.

## Motion

- House easing: **`ease-gov`** = `cubic-bezier(.2,.7,.2,1)`.
- `animate-fade-up` (`.6s`, from `translateY(14px)`), `animate-marquee` (`40s linear infinite`); Tailwind `animate-pulse/ping/spin` for ambient effects.
- Scroll reveal: `.reveal` / `.reveal.in` via the `<Reveal>` component.
- framer-motion only on AuthFlow / animated-ai-chat / travel-connect-signin.
- **Never** fight the global `prefers-reduced-motion` reset.

## Breakpoints (Tailwind, mobile-first)

`sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`

## Icons

Prefer the project's custom `<Icon name="…">` (24px viewBox, `currentColor`,
stroke, round caps). `lucide-react` is also available for richer sets.

## Anti-patterns

- ❌ Hardcoded hex / off-palette colors → use token utilities so theming works.
- ❌ Serif body text or sans/bold headings → keep the serif-display / sans-body roles.
- ❌ Arbitrary spacing, radius, or shadow values → use the tokens.
- ❌ Overriding `prefers-reduced-motion`.
- ✅ Gradients **are** allowed but sparingly and brand-colored (e.g. `bg-gradient-to-r from-green to-brand`), not as default surfaces.

## Workflow

1. **Read `references/DESIGN.md`** (full tokens, component scan in Section 4, recipes in Section 10).
2. Reuse an existing component (Section 4) before building new.
3. Colors via token utilities only; serif headings + Inter body; 4px grid; wrap pages in `.wrap`.
4. Elevation with `shadow-card`/`shadow-lift`; motion with `ease-gov`.
5. Verify in **light, dark, and high-contrast** themes. Every value traces to a token.

## Project guardrails (from CLAUDE.md — never violate)

- No official State Emblem of Andhra Pradesh — only the abstract chakra mark.
- No Foster + Partners / official master-plan artwork — original interpretation only.
- Keep the "concept / not official / not endorsed" disclaimer; don't soften it.
- Headline figures are indicative (public reporting).
