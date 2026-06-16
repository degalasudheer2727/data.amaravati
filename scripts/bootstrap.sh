#!/usr/bin/env bash
# =============================================================================
# AMARATWIN — one-command bootstrap.
# Initialises git, creates the GitHub repo, wires CI/CD secrets, links Vercel,
# and ships the first production deploy. Idempotent: safe to re-run.
#
#   Usage:  ./scripts/bootstrap.sh <github-repo-name>
#   Needs:  git, gh (GitHub CLI, authenticated), vercel (Vercel CLI, logged in)
# =============================================================================
set -euo pipefail

REPO="${1:-data.amaravati}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
say() { printf "\n\033[1;33m▸ %s\033[0m\n" "$*"; }
need() { command -v "$1" >/dev/null 2>&1 || { echo "✗ Missing '$1'. Install it first → $2"; exit 1; }; }

say "Checking tools"
need git "https://git-scm.com"
need gh  "https://cli.github.com"
need vercel "npm i -g vercel"

say "Initialising git"
[ -d .git ] || git init -b main
git add -A
git diff --cached --quiet || git commit -m "AMARATWIN: revamped 3D site + Flutter app + DevSecOps pipeline"

say "Creating / connecting GitHub repo: $REPO"
if gh repo view "$REPO" >/dev/null 2>&1; then
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "$(gh repo view "$REPO" --json sshUrl -q .sshUrl)"
else
  gh repo create "$REPO" --private --source=. --remote=origin --push
fi
git push -u origin main

say "Linking Vercel project"
vercel link --yes
VERCEL_ORG_ID=$(node -e "console.log(require('./.vercel/project.json').orgId)")
VERCEL_PROJECT_ID=$(node -e "console.log(require('./.vercel/project.json').projectId)")

say "Pushing CI/CD secrets to GitHub"
TOKEN="${VERCEL_TOKEN:-$(vercel whoami >/dev/null 2>&1 && cat ~/.vercel/auth.json 2>/dev/null | node -e "try{console.log(JSON.parse(require('fs').readFileSync(0)).token)}catch(e){}" || true)}"
[ -n "${VERCEL_TOKEN:-}" ] && gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" || echo "  (set VERCEL_TOKEN env var, then: gh secret set VERCEL_TOKEN)"
gh secret set VERCEL_ORG_ID     --body "$VERCEL_ORG_ID"
gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID"

say "Shipping first production deploy"
vercel deploy --prod --yes

say "Done. Every future 'git push' now auto-builds, scans, and deploys. 🚀"
