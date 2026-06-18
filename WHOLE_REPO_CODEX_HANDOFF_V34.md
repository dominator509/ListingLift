# WHOLE_REPO_CODEX_HANDOFF_V34.md

## Package

`ListingLift_Repo_Seed_v34.zip`

## Current Seed Phase

Phase 32 — Reports and Upsell Engine

## What ChatGPT Added

- Report and upsell domain constants
- Report/upsell Zod schemas
- Report builder, metric, export, and safety services
- Upsell opportunity, template, engine, and safety services
- Dry-run API route contracts
- Admin/client UI shells
- Prisma model and migration scaffold
- Unit, security, integration, and E2E test scaffolds
- Phase 32 docs, runbook, verification matrix, and gap handoff

## Codex Instructions

1. Unzip this package into the target repository.
2. Inspect existing repo files before overwriting.
3. Reconcile conflicts manually.
4. Install dependencies only as needed.
5. Validate Prisma schema.
6. Regenerate migration SQL if needed.
7. Run tests and repair failures.
8. Keep all real integrations feature-flagged.
9. Update `ROADMAP_STATUS.md` with real results.

## Non-Negotiable Rules

- Do not expose reports to clients before approval.
- Do not derive report or upsell state from client-submitted values.
- Do not include secrets, raw signed URLs, tokens, provider errors, webhook payloads, or private admin notes in reports.
- Do not guarantee marketplace approval, ranking, sales, conversion, ad performance, product approval, or listing approval.
- Do not send automated marketplace messages.
- Audit every sensitive report and upsell action.
