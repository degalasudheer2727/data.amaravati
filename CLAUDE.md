# data.amaravati — Project Brief

> The governed data platform of the People's Capital. A concept that serves city
> data by authority — open, internal, sensitive and confidential — with a digital
> twin, a Flutter hybrid app, shipped via Vercel + DevSecOps. (Formerly "AMARATWIN".)

Read this before making changes.

## Non-negotiable rules (never violate, even if asked)

1. **No official State Emblem of Andhra Pradesh.** Use only the abstract
   chakra-inspired mark. The real emblem's use is legally restricted.
2. **No Foster + Partners or official master-plan artwork.** The 3D model stays an
   *original interpretation* of the publicly documented layout (spine, grid,
   riverfront diagonal, nine theme cities + Quantum Valley).
3. **Keep the "concept / not official / not endorsed" disclaimer** in the website
   footer and the app profile screen. Do not soften it.
4. **All headline figures are indicative** and sourced from public reporting.

## Visual identity (shared across web + app)

India tricolour-derived, govt-credible: saffron `#ff9933`, green `#138808`, navy
`#0a1f44`, Ashoka-chakra "pulse" `#3b7bff`, premium gold `#e7c46b`. Display face is a
serif (Georgia on web / Noto Serif in app). English throughout (the earlier
bilingual Telugu layer has been retired).

## Architecture

- Web is a **Vite + React + TypeScript + Tailwind** app (gov-credible editorial design).
  - `src/pages/` — the three routes: `Platform` (`/`), `CommandCenter` (`/command-center`),
    `Visit` (`/visit`). Routing in `src/App.tsx`.
  - `src/data/` — the `*_DATA`-style content arrays (datasets, personas, entities, etc.).
    Edit content here; pages build themselves from it.
  - `src/components/` (shared chrome + UI primitives + `ThemeProvider`/`A11yControls`),
    `src/lib/` (brand mark, classification, KPI scoring), `src/features/` (3D `twin/`,
    `auth/` SSO + persona flow). Design tokens live in `tailwind.config.ts` + `src/styles/index.css`
    (one CSS-variable set powers light · dark · high-contrast).
  - Three.js is an npm dep (`src/features/twin/CityTwin.tsx`), code-split out of the main bundle.
  - Build → `dist/`; `public/` holds favicon, manifest, robots. Self-hosted fonts (no CDN).
- `mobile/` — Flutter, decoupled: `models/` (pure data) → `data/repository.dart`
  (abstraction + `MockRepository`) → `features/<name>/` (screens). Swap the repository
  in `lib/app.dart` to go live; screens never change.
- `.github/workflows/` — CI, DevSecOps (CodeQL, Gitleaks, Trivy, SBOM), Vercel deploy.

## Quality floor

- Accessibility: skip link, visible focus, ARIA, `prefers-reduced-motion`, WebGL fallback.
- Performance: cap pixel ratio at 2, idle-time 3D init, `content-visibility`, reduced
  particle counts under reduced-motion.
- Security: hardened headers in `vercel.json`; no secrets in code.

## How to run

```bash
npm install        # install web deps (Node 18+)
npm run dev        # Vite dev server at :5173
npm run build      # production build → dist/
npm run lint       # type-check (tsc --noEmit)
make mobile-run    # Flutter app
./scripts/bootstrap.sh   # automated first deploy
```
