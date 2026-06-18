# Whole Repo Codex Handoff — v31

## Current seed version

ListingLift Repo Seed v31 advances the scaffold through **Phase 29 — Automation Webhooks**.

## Source review performed

The v30 ZIP was unzipped into a fresh working directory. All Markdown files in the repo seed were read, along with `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md`. See `CHATGPT_MARKDOWN_REVIEW_INDEX_V31.md`.

## What changed in v31

- Added automation webhook domain and schemas.
- Added mock/generic/Zapier/Make/n8n webhook adapter scaffolds.
- Added automation policy, payload, signature, subscription, dispatch, retry, rate-limit, health, and dead-letter services.
- Added automation webhook route contracts.
- Added admin automation webhook pages and reusable components.
- Added Prisma schema and migration scaffolds.
- Added unit/security/integration/E2E test scaffolds.
- Updated API/Admin docs, env examples, navigation, roadmap status, gaps, and manifest.

## Codex instructions

Codex must stitch this seed into the actual repository, reconcile generated scaffolds with existing code, install dependencies, run validation, regenerate migrations, connect real persistence, and update `ROADMAP_STATUS.md` with actual results.

Do not enable real automation dispatch by default. Mock automation must work without paid API keys.
