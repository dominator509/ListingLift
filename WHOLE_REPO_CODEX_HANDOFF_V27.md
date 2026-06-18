# WHOLE_REPO_CODEX_HANDOFF_V27.md

## Current seed

ListingLift Repo Seed v27 advances the codebase scaffold through Phase 25 — Shopify Workflow.

## Source reviewed

- All Markdown files from v26 were unzipped and reviewed.
- `ListingLift.md` reviewed.
- `ListingLift_BUILD_ROADMAP.md` reviewed.

## New in v27

- Shopify domain constants, safe copy, safety rules, dedupe helpers, delivery copy, product-folder helper, and audit helper.
- Shopify Zod schemas.
- Shopify package mapping, manual order intake, product CSV import, delivery/audit, replacement approval, OAuth scaffold, revenue, and safety services.
- `/api/shopify/*` dry-run route contracts.
- Shopify admin UI pages and components.
- Prisma schema and migration scaffold additions.
- Phase 25 tests.
- Updated docs, gaps, roadmap status, and manifest.

## Codex execution instruction

Stitch v27 into the real repository, install dependencies, validate TypeScript and Prisma, regenerate migrations, wire dry-run routes to real persistence, run tests, fix failures, and update `ROADMAP_STATUS.md` with real command results. Do not enable real Shopify API/OAuth behavior unless feature flags and secrets are explicitly configured.
