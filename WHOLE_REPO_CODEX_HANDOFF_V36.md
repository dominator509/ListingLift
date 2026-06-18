# WHOLE_REPO_CODEX_HANDOFF_V36.md

## Current Seed

ListingLift Repo Seed v36 advances the project through Phase 34 — Admin Dashboard and Revenue Analytics.

## Source Reviewed

- Unzipped `ListingLift_Repo_Seed_v35.zip`.
- Reviewed every Markdown file in the unzipped repo seed.
- Reviewed `ListingLift.md`.
- Reviewed `ListingLift_BUILD_ROADMAP.md`.
- Confirmed status from `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V35.md`, and `REPO_FILE_MANIFEST_V35.md`.

## Confirmed Roadmap Position

- Latest completed seeded phase before this package: Phase 33 — Client Dashboard.
- Current seeded phase in this package: Phase 34 — Admin Dashboard and Revenue Analytics.
- Next planned phase: Phase 35 — Agency White-Label Mode.
- Prior phases remain repo-seed scaffolds until Codex performs install, Prisma validation, migrations, seeds, typecheck, lint, tests, build, browser rendering, and runtime/security verification.

## New Phase 34 Scope

This seed adds admin dashboard/revenue analytics domain rules, schemas, services, route contracts, UI shells, Prisma/migration scaffolds, tests, docs, and Codex handoff/gap files.

Phase 34 covers:

- Active jobs.
- Completed jobs.
- New jobs by source.
- Flagged outputs.
- Jobs due soon.
- Revenue by sales channel.
- Source tracking.
- Marketplace-to-direct conversion tracking.
- Retainer opportunity alerts.
- Upsell/revenue context.

## Codex Required Behavior

1. Stitch the v36 seed into the real repository.
2. Validate all schema and route imports.
3. Repair any scaffold-specific compile issues.
4. Regenerate migration SQL from Prisma.
5. Generate Prisma client.
6. Apply migrations.
7. Run all checks listed in `PHASE_34_VERIFICATION_MATRIX.md`.
8. Replace dry-run analytics with real tenant-scoped Prisma queries and verified source/payment data.
9. Add rate limiting and audit logging for sensitive analytics actions.
10. Update `ROADMAP_STATUS.md` with real results.
11. Do not mark Phase 34 complete until admin RBAC, tenant isolation, revenue derivation, source tracking, conversion safety, retainer manual-review gates, privacy exclusions, safe-copy checks, and browser rendering pass.

## Do Not Drift

The admin dashboard is not a static dashboard. It must be the operational command center for ListingLift fulfillment and revenue operations while preserving tenant isolation, admin-only analytics access, verified revenue derivation, source attribution, manual fallback, approval gates, marketplace-safe wording, and no-guarantee claims.

## Runtime Honesty

ChatGPT Project Mode did not install dependencies, validate Prisma, generate Prisma client, apply migrations, run seeds, typecheck, lint, build, run tests, smoke-test routes, verify browser rendering, or call real providers.
