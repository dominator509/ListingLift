# PHASE_7_EXECUTION_RUNBOOK.md — Sales Channel Normalization Layer

## Pre-change Codex Checklist

Before editing, Codex must state:

1. Current roadmap phase: Phase 7 — Sales Channel Normalization Layer.
2. Current task: stitch and verify ChatGPT-seeded sales-channel normalization contracts.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks to run after changes.

## Execution Steps

### Step 1 — Stitch

- Unzip `ListingLift_Repo_Seed_v9.zip`.
- Compare with current repository.
- Preserve stronger existing implementation if present.
- Copy Phase 7 files and reconcile imports.

### Step 2 — Validate Schema and Migrations

Run:

```bash
npm run db:validate
npm run db:generate
```

Then regenerate/repair:

```bash
prisma/migrations/0006_phase7_sales_channel_normalization/migration.sql
```

Apply migration only after validation.

### Step 3 — Verify Seed Idempotency

Run seed twice:

```bash
npm run db:seed
npm run db:seed
```

Confirm:

- sales channels are not duplicated.
- demo external order is not duplicated.
- demo job is not duplicated.
- audit seed entries are not duplicated.

### Step 4 — Wire Persistence

Replace dry-run route responses with transaction-backed services:

- normalize payload.
- find sales channel by organization/key.
- dedupe external order.
- match or create client.
- create external order.
- create job.
- record revenue attribution.
- record audit log.
- return created IDs.

### Step 5 — Security Review

Verify:

- server-side auth on all admin routes.
- `create:manual-orders` for manual order creation.
- `manage:sales-channels` for registry/import/admin views.
- tenant isolation on every query.
- no marketplace passwords stored.
- webhook/API real calls disabled unless feature-flagged.
- marketplace safety language present.

### Step 6 — Tests

Run and repair:

```bash
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

### Step 7 — ROADMAP_STATUS.md

Update:

- Files changed.
- Tests/checks run.
- Test results.
- Known issues.
- Deviations.
- Commit-style history.

Only mark Phase 7 complete if all acceptance criteria pass in the real repo.

## Stop Condition

Stop after a clean Phase 7 checkpoint unless explicitly instructed to continue.
