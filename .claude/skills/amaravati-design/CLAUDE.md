# amaravati-design Design System

This is the **amaravati-design** skill — the design system for the
**data.amaravati** project, extracted by skillui and hand-enriched from the
project's actual tokens (`tailwind.config.ts` + `src/styles/index.css`).

## How to use

Read `SKILL.md` first for the quick reference, then `references/DESIGN.md` for the
full token tables and component scan before writing any UI code.

Files in this skill:
- `SKILL.md` — quick reference: tokens, typography, spacing, motion, anti-patterns (read first)
- `DESIGN.md` / `references/DESIGN.md` — full design system: complete light/dark/high-contrast token tables, typography rules, the codebase component scan (Section 4), and agent prompt recipes (Section 10)

## Source of truth

The canonical tokens live in the project itself:
- `tailwind.config.ts` — color/font/radius/shadow/animation tokens
- `src/styles/index.css` — CSS variables for light · dark · high-contrast themes

If those files change, update this skill to match.

When building any UI, match colors (token utilities, never hex), the serif-heading
/ Inter-body typography, the 4px spacing grid, elevation tokens, and motion
exactly — and verify in all three themes.
