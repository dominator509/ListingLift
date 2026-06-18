# WHOLE_REPO_CODEX_HANDOFF_V26.md

## Project

ListingLift — Repo Seed v26

## Current seeded phase

Phase 24 — Etsy Workflow

## What changed in this seed

This package adds Etsy workflow scaffolding on top of v25:

- Domain constants and marketplace-safe language in `src/domain/etsy.ts`.
- Zod schemas in `src/schemas/etsy.ts`.
- Services for manual Etsy order intake, listing import planning, package mapping, delivery template generation, visual reports, revision status, revenue attribution, and safety checks.
- API route contracts under `/api/etsy/*`.
- Admin pages under `/admin/etsy`, `/admin/etsy/order-intake`, `/admin/etsy/listings`, `/admin/etsy/delivery`, and `/admin/etsy/reports`.
- Reusable Etsy UI components under `src/components/etsy`.
- Prisma schema append and migration scaffold for Etsy mappings/listing rows/workflow events.
- Unit, security, integration, and E2E test scaffolds.
- Updated `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, phase docs, API/admin docs, and manifest.

## Codex must do next

1. Unzip this seed into the real repository carefully.
2. Install dependencies and update the lockfile.
3. Run Prisma validation and regenerate migrations.
4. Repair any schema/type issues.
5. Wire dry-run Etsy route contracts to tenant-scoped Prisma transactions.
6. Add audit logs and enforce RBAC/tenant isolation.
7. Run all checks listed in `PHASE_24_VERIFICATION_MATRIX.md`.
8. Update `ROADMAP_STATUS.md` with actual command results.

## Critical safety rules

- Do not scrape private Etsy pages.
- Do not store Etsy passwords.
- Do not automate buyer messages, review requests, or listing edits unless an approved Etsy integration explicitly permits it.
- Do not guarantee Etsy approval, ranking, traffic, sales, conversion, ad performance, product approval, or listing approval.
- Keep manual fallback available.
- Keep real Etsy API/OAuth/webhook behavior feature-flagged and disabled by default.
