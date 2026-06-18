# PHASE_2_EXECUTION_RUNBOOK.md

## Purpose

Guide Codex through validating and completing Phase 2 — Database Schema and Migrations — using the v4 repo seed.

## Required Pre-Change Statement

Before changing files, Codex must state:

1. Current roadmap phase: Phase 2 — Database Schema and Migrations.
2. Current task: validate and finalize the Prisma schema, migration, seed, and database contract tests.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after the change.

## Phase Boundary

Allowed:

- Prisma schema fixes.
- Migration generation/repair.
- Seed repair.
- Database default registry fixes.
- Tenant helper fixes.
- Database contract tests.
- `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, and handoff updates.

Forbidden unless needed to make Phase 2 compile:

- Auth implementation.
- Live dashboard data wiring.
- Upload processing implementation.
- Real payment, image, marketplace, or storage API calls.
- Production deployment setup.

## Required Verification Sequence

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
```

The seed must be run twice to verify idempotency.

## Required Phase 2 Acceptance Criteria

- Migration applies cleanly.
- Seed runs repeatedly without duplicate default packages, presets, channels, roles, permissions, demo client, demo external order, or demo job.
- Default packages, presets, and channels match required roadmap keys.
- Jobs link to source channel and external order.
- External orders link to clients and internal jobs.
- Credits/subscriptions/invoices are represented.
- No plaintext secret fields exist in the Prisma schema.
- Tenant-critical models include organization scope.
- Tests/checks pass or failures are documented as blockers.

## Required Status Update

After completion or blocker discovery, update:

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V4.md`

Use commit-style entry:

```txt
phase-2: database schema and migrations
```
