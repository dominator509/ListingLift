# CODEX_WHOLE_REPO_STITCH_PROMPT_V21.md

You are Codex implementing ListingLift from the v21 repo seed.

Use `ListingLift_Repo_Seed_v21.zip` as the source package. Stitch it into the actual repository carefully.

## Current seed phase

Phase 19 — Credits, Subscriptions, Manual Invoices

## Before changing files

State:

1. Current roadmap phase.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run.

## Required actions

1. Read `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V21.md`, `PHASE_19_EXECUTION_RUNBOOK.md`, and `PHASE_19_VERIFICATION_MATRIX.md`.
2. Inspect the actual repository and preserve existing user code.
3. Merge v21 files without blindly overwriting better existing implementation.
4. Validate Prisma schema.
5. Regenerate or repair migration SQL for Phase 19.
6. Generate Prisma client.
7. Apply migrations in the dev database.
8. Run seed twice.
9. Wire credits, subscriptions, manual invoices, and manual payment confirmation routes to real Prisma transactions.
10. Enforce RBAC, tenant isolation, audit logs, and payment-state safety.
11. Run unit, integration, security, E2E, typecheck, lint, build, Prisma validate, and seed checks.
12. Update `ROADMAP_STATUS.md` with real results.

## Hard safety rules

- Never trust client-submitted credit balance, invoice status, subscription status, price, or entitlement state.
- Never grant access for failed, refunded, disputed, duplicate, unverified, void, rejected, or reversed payment state.
- Every manual credit adjustment and manual payment confirmation must be audited.
- Do not leak payment references, secrets, raw webhook payloads, or private billing notes.
- Preserve manual fallback, but never let it bypass permissions or tenant isolation.

Stop at a clean checkpoint after Phase 19 verification or after documenting blockers.
