# PHASE_2_IMPLEMENTATION_NOTES.md

## Current Objective

Advance the repo seed into Phase 2 — Database Schema and Migrations — as far as possible inside ChatGPT Project Mode.

## Source Review

Before coding, the v3 ZIP was unzipped and all Markdown files in the package were read for context. The architecture and roadmap were also reviewed from the canonical source documents.

## What Was Coded

- Expanded `prisma/schema.prisma` into a Phase 2 database contract with required core models.
- Added required `Role` and `RolePermission` models instead of relying only on a membership enum.
- Added enums for roles, statuses, channel types, output types, output formats, backgrounds, reports, revisions, webhook event status, subscriptions, approvals, and tokens.
- Added tenant-scoped indexes and uniqueness constraints for organizations, clients, sales channels, external orders, jobs, packages, presets, tokens, and processed files.
- Added upload token model to support later secure upload workflows.
- Added stronger delivery token uniqueness and admin-approval defaults.
- Added source-channel linking from jobs to sales channels.
- Added idempotent seed logic for roles, permissions, demo organization, demo user, brand settings, sales channels, packages, presets, client, external order, job, image, mock output, and credit ledger.
- Added default key registries for required package, preset, and sales-channel keys.
- Added tenant-filter helpers and database repository contract helpers.
- Added unit/integration/security test scaffolds for schema contract, default records, and tenant filtering.

## What Is Deliberately Not Completed Here

- Prisma client generation was not run.
- Database migration was not applied.
- Migration SQL was not generated from Prisma in a live environment.
- Seed script was not executed.
- Typecheck/lint/tests were not run.
- No production database was connected.

## Codex Must Verify

Codex must install dependencies and run:

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:migration
npm run test:integration -- db
npm run test:unit
npm run test:security
npm run typecheck
npm run lint
```

If Prisma detects drift between `prisma/schema.prisma` and the scaffold migration SQL, Codex must regenerate the migration with the installed Prisma version and update `ROADMAP_STATUS.md`.

## Phase Completion Rule

Phase 2 is **seeded but not complete** until Codex successfully validates the schema, applies the migration, runs the seed repeatedly without duplicates, and passes the required checks.
