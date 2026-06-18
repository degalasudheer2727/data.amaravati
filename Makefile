# AMARATWIN — human-friendly command center. Run `make` to see everything.
.DEFAULT_GOAL := help
.PHONY: help setup dev web mobile-run mobile-test analyze scan sbom deploy preview push bootstrap clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN{FS=":.*?## "}{printf "  \033[1;33m%-14s\033[0m %s\n", $$1, $$2}'

setup: ## Install dev tooling (node + flutter deps + pre-commit)
	npm install
	cd mobile && flutter pub get
	pip install pre-commit >/dev/null 2>&1 && pre-commit install || true

dev: web ## Alias for `web`

web: ## Run the Vite dev server at :5173
	npm run dev

build: ## Build the production site to dist/
	npm run build

mobile-run: ## Run the Flutter app on a connected device/emulator
	cd mobile && flutter run

mobile-test: ## Run Flutter analyze + tests
	cd mobile && flutter analyze && flutter test

analyze: ## Type-check the website (tsc)
	npm run lint

scan: ## Run the local DevSecOps gate (secrets, vuln, misconfig)
	pre-commit run --all-files || true
	npx --yes @cyclonedx/cdxgen -o sbom.json . || true

sbom: ## Generate a CycloneDX software bill of materials
	npx --yes @cyclonedx/cdxgen -o sbom.json .

preview: ## Deploy a Vercel preview build
	vercel deploy

deploy: ## Deploy to Vercel production
	vercel deploy --prod

push: ## Commit everything and push to GitHub (triggers CI/CD)
	git add -A && git commit -m "update" || true
	git push

bootstrap: ## First-time: create repo, wire secrets, link Vercel, deploy
	./scripts/bootstrap.sh

clean: ## Remove build artefacts
	rm -rf mobile/build sbom.json .vercel/output
