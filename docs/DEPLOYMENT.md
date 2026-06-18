# Deployment & DevSecOps Runbook

This project is built to deploy itself. Here is the full picture.

## TL;DR — first time

```bash
# prerequisites (install once)
brew install gh            # GitHub CLI         → then: gh auth login
npm i -g vercel            # Vercel CLI         → then: vercel login

# one command does everything
./scripts/bootstrap.sh amara-twin
```

`bootstrap.sh` will: init git → create the GitHub repo → push → link a Vercel
project → set `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` as GitHub
Action secrets → ship the first production deploy.

## What runs on every push / PR

```
 git push
    │
    ├─ CI (.github/workflows/ci.yml)
    │    ├─ web:    HTMLHint · JSON validation · Lighthouse budget
    │    └─ mobile: dart format · flutter analyze · flutter test · build web
    │
    ├─ DevSecOps (.github/workflows/security.yml)
    │    ├─ CodeQL (SAST)            ├─ Gitleaks (secret scan)
    │    ├─ Trivy (vuln + IaC)       ├─ Dependency review (PRs)
    │    └─ Syft (CycloneDX SBOM)
    │
    └─ Deploy (.github/workflows/deploy.yml)
         ├─ PR  → ephemeral Vercel preview (URL commented on the PR)
         └─ main → Vercel production
```

## Required secrets (GitHub → Settings → Secrets → Actions)

| Secret | How to get it |
|--------|---------------|
| `VERCEL_TOKEN` | Vercel → Account → Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link` |

`bootstrap.sh` sets the last two automatically.

## Recommended branch protection (makes the security gate real)

GitHub → Settings → Branches → add rule for `main`:
- Require status checks: `CI`, `DevSecOps`
- Require PR before merging
- Require branches up to date

## Manual deploy (no GitHub needed)

```bash
make deploy      # vercel --prod
make preview     # vercel preview
```

## Vercel project settings

- Framework preset: **Vite** (or **Other**)
- Build command / Output: handled by `vercel.json` (`buildCommand: npm run build`, `outputDirectory: dist`)
- Nothing else required — Vercel runs the build and serves the static `dist/` output.

## Mobile release (out of CI scope, documented for completeness)

```bash
cd mobile
flutter build apk --release         # Android
flutter build ios --release         # iOS (on macOS, signed)
flutter build appbundle --release   # Play Store
```
