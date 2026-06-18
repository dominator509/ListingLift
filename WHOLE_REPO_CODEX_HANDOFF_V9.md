# WHOLE_REPO_CODEX_HANDOFF_V9.md

## Current Package

Use `ListingLift_Repo_Seed_v9.zip`.

This package was produced inside ChatGPT Project Mode after unzipping v8, reading every Markdown file in the repo seed, and reviewing the source documents:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

## Current Roadmap Position

Current seeded phase:

```txt
Phase 7 — Sales Channel Normalization Layer
```

Previous phases 0–6 are seeded but still require Codex runtime verification. Phase 7 is seeded but not complete until Codex validates, migrates, tests, and wires persistence.

## What Changed in v9

### Phase 7 Sales Channel Normalization

Added or expanded:

- Canonical normalized sales-channel field list.
- Canonical sales-channel key mapping.
- Adapter alias mapping.
- Package alias mapping.
- Marketplace safety helpers.
- Expanded `NormalizedExternalOrder` schema.
- Expanded sales-channel adapter interface.
- Direct/manual, Stripe, Gumroad, Fiverr, Upwork, Taskrabbit, and manual marketplace/export adapter coverage.
- Registry coverage check for all required source channels.
- External order dedupe key generation.
- Order-to-client matching service.
- Order-to-job draft service.
- Revenue attribution draft service.
- Upload-link trigger planning for Phase 8.
- Sales-channel normalization orchestration service.
- API route contracts for normalize/import/manual-order/external-orders/dedupe/detail.
- Admin sales-channel and external-order UI shells.
- Prisma schema additions and Phase 7 migration scaffold.
- Seed updates for canonical adapter keys, dedupe key, normalized demo payload, and revenue attribution.
- Phase 7 tests.
- Updated gaps, roadmap status, review index, runbook, verification matrix, manifest, and prompt.

## Critical Codex Instructions

Codex must not assume this package is runtime-valid until it runs checks.

Codex must:

1. Stitch v9 into the actual repo carefully.
2. Preserve better existing code if present.
3. Install dependencies.
4. Validate Prisma.
5. Regenerate or repair migration SQL.
6. Generate Prisma client.
7. Apply migration.
8. Run seed twice.
9. Connect dry-run Phase 7 routes to Prisma transactions.
10. Enforce duplicate external order prevention.
11. Enforce server-side RBAC and tenant isolation.
12. Add audit logs for sensitive mutations.
13. Run tests, typecheck, lint, and build.
14. Update `ROADMAP_STATUS.md` with real command results.

## Phase 7 Acceptance Criteria

- Manual order creates external order and job.
- Duplicate external order is prevented.
- Source revenue attribution is stored.
- Registry includes all named channels.
- Every channel has manual fallback.
- Real integrations remain feature-flagged and disabled by default.
- Sales-channel routes enforce auth, RBAC, and tenant isolation.
- Audit logs capture manual order creation, imports, dedupe, client matching, client creation, external order creation, job creation, and revenue attribution changes.
- Marketplace safety rules are preserved.
- No marketplace passwords are stored.
- No private marketplace scraping is implemented.
- No unsafe messaging automation is implemented.
- Phase 7 tests pass.

## Files to Review First

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `PHASE_7_IMPLEMENTATION_NOTES.md`
- `PHASE_7_EXECUTION_RUNBOOK.md`
- `PHASE_7_VERIFICATION_MATRIX.md`
- `src/domain/sales-channel-normalization.ts`
- `src/schemas/sales-channel.ts`
- `src/server/services/sales-channel-normalization-service.ts`
- `src/server/adapters/sales-channel/registry.ts`
- `prisma/schema.prisma`
- `prisma/migrations/0006_phase7_sales_channel_normalization/migration.sql`

## Required Commands

Run and repair failures:

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run test:unit -- sales-channel-normalization
npm run test:unit -- order-client-matching
npm run test:unit -- revenue-attribution
npm run test:integration -- phase7-external-order-normalization
npm run test:adapter-contract -- sales-channel-adapter-registry
npm run test:security -- sales-channel-marketplace-safety
npm run typecheck
npm run lint
npm run build
```

## Stop Condition

Stop at a clean Phase 7 checkpoint. Do not start Phase 8 unless the user explicitly asks or all Phase 7 acceptance criteria are met and documented.
