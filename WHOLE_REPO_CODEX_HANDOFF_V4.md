# WHOLE_REPO_CODEX_HANDOFF_V4.md

## Current Objective

Stitch and validate ListingLift Repo Seed v4 in Codex, with priority on Phase 2 — Database Schema and Migrations.

## Source Review Completed in ChatGPT

ChatGPT unzipped `ListingLift_Repo_Seed_v3.zip` and reviewed all Markdown files in the package before making v4 changes. The canonical source docs `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `docs/source/ListingLift.md`, and `docs/source/ListingLift_BUILD_ROADMAP.md` were included in that review.

See `CHATGPT_MARKDOWN_REVIEW_INDEX_V4.md` for reviewed files, byte counts, and hashes.

## What Changed in v4

- Expanded `prisma/schema.prisma` for Phase 2.
- Added required Role model and role-permission mapping.
- Added stricter tenant scoping, status enums, token models, source-channel links, and delivery approval defaults.
- Replaced partial default keys with roadmap-required package, preset, and sales-channel keys.
- Expanded `prisma/seed.ts` into an idempotent seed for defaults and demo records.
- Added DB tenant helpers and repository contracts.
- Added tests for database defaults, Prisma schema contract, tenant filters, and secret-field safety.
- Added Phase 2 runbook, verification matrix, implementation notes, updated gaps, and updated roadmap status.

## Critical Rule

Do not mark Phase 2 complete just because these files exist. Phase 2 is complete only after Codex validates Prisma, applies migration, runs seed twice, and passes tests/checks in the real repo.

## Stitch Order

1. Inspect the existing repository.
2. Back up or diff any existing files that overlap with this seed.
3. Copy v4 files into the repo without deleting user work blindly.
4. Install dependencies.
5. Run Prisma validation/generation.
6. Regenerate or verify migration SQL.
7. Apply migration.
8. Run seed twice.
9. Run tests/checks.
10. Fix failures.
11. Update `ROADMAP_STATUS.md` and `CODEX_GAPS.md` with real results.

## Required Commands

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run test:migration
npm run test:integration -- db
npm run test:unit
npm run test:security
npm run typecheck
npm run lint
npm run build
```

## Highest-Risk Files

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/0001_listinglift_phase2_initial/migration.sql`
- `src/domain/packages.ts`
- `src/domain/platform-presets.ts`
- `src/domain/sales-channels.ts`
- `src/domain/roles.ts`

## Known Codex Gaps

See `CODEX_GAPS.md`.

Primary gaps:

- Migration SQL must be generated/verified in the actual repo.
- Prisma schema must be validated against the installed Prisma version.
- Seed must be run twice to confirm idempotency.
- TypeScript imports/types must be repaired if generated Prisma types expose issues.
- Phase 1 build/smoke tests are still pending.

## Stop Conditions

Stop and update `ROADMAP_STATUS.md` if:

- Prisma schema cannot validate.
- Migration cannot apply.
- Seed duplicates core default records.
- Tenant scope is missing from critical models.
- Any secret/token field is plaintext.
- Auth/RBAC/tenant checks fail after later phases begin.

## Next Phase After Verification

Phase 3 — Authentication and Sessions.

Do not start Phase 3 until Phase 2 is verified or the project owner explicitly authorizes another ChatGPT-only advancement.
