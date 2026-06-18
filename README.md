<div align="center">

# data.amaravati

**The governed data platform & living digital twin of Amaravati — the People's Capital.**
అమరావతి · ప్రజల రాజధాని డేటా

Access city data by your authority — open, internal, sensitive and confidential — with a governed catalogue, a CRDA-governed inter-agency exchange hub, single sign-on and a navigable 3D twin. A sleek, GIGW/WCAG 2.1 AA-aligned 3D website + a Flutter hybrid app, deployed on Vercel with an end-to-end DevSecOps pipeline.

`concept prototype · not an official government product` · `Three.js` · `Flutter` · `Vercel` · `DevSecOps`

</div>

---

> ⚠️ **Concept — not official.** AMARATWIN is not a Government of Andhra Pradesh or APCRDA product and is not endorsed by either. It does not use the official State Emblem or any copyrighted master-plan artwork. The 3D model is an original interpretation of the publicly documented layout. All figures are indicative.

## What's in here

```
amara-twin/
├─ src/                  # the website — Vite + React + TypeScript + Tailwind
│  ├─ pages/             # Platform · CommandCenter · Visit (3 routes)
│  ├─ data/              # content arrays (datasets, personas, entities, KPIs)
│  ├─ components/ lib/ features/   # shared UI, brand/classification/KPI, 3D twin + auth
│  └─ styles/index.css · App.tsx · main.tsx
├─ public/               # favicon.svg · manifest.webmanifest · robots.txt
├─ index.html            # Vite entry · tailwind.config.ts · vite.config.ts
├─ mobile/               # Flutter hybrid app (decoupled: models → repository → features)
│  └─ lib/
│     ├─ models/ data/ widgets/ theme.dart
│     └─ features/{home,connectors,twin,cities,futures,profile}/
├─ .github/workflows/    # ci.yml · security.yml (DevSecOps) · deploy.yml
├─ scripts/bootstrap.sh  # one-command: repo + secrets + Vercel + first deploy
├─ vercel.json           # static deploy + hardened security headers + caching
├─ Makefile              # `make help` — the human control center
└─ SECURITY.md
```

## Quick start

```bash
npm install      # install web deps (Node 18+)
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # production build → dist/
make mobile-run  # run the Flutter app on a device/emulator
```

## Deploy it (fully automated)

One command wires GitHub + Vercel + secrets and ships production:

```bash
./scripts/bootstrap.sh amara-twin
```

After that, **every `git push` auto-builds, security-scans, and deploys** — PRs get a
preview URL, merges to `main` ship to production. See [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Architecture at a glance

| Layer | What | Where |
|------|------|-------|
| **Spatial** | 9 theme cities + Quantum Valley as 3D zones | `web` + `mobile/.../cities` |
| **Data** | 12 governed connectors (live feeds) | `mobile/.../data/repository.dart` |
| **Pillars** | Statistical Reference · Open Data · Secure Exchange · Analytics | shared |
| **Futures 2040** | AI co-pilot, AR twin, CBDC, autonomous mobility, quantum-secured exchange… | `mobile/.../futures` |
| **Platform** | Sources → Ingestion → Governance → Experiences | `web` |

The Flutter app is **decoupled by design**: every screen depends on the
`AmaraverseRepository` abstraction, never on a data source. Swap `MockRepository`
for an `ApiRepository` in `lib/app.dart` to go live — no screen changes.

## Performance

The website is engineered to be fast: route-level code-splitting (the Three.js twin is a
separate chunk), self-hosted variable fonts, lazy on-scroll reveals, capped device-pixel-ratio,
reduced-motion fallbacks, and immutable asset caching via `vercel.json`.

## License

Concept work, all rights reserved (`UNLICENSED`). Not for redistribution as an official or
government-endorsed product.
