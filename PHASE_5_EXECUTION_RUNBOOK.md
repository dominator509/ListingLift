# PHASE_5_EXECUTION_RUNBOOK.md

## Purpose

Guide Codex through verifying and completing Phase 5 — Packages and Pricing in the real repository.

## Current ChatGPT Seed Status

ChatGPT has produced package/pricing source files, UI shells, route contracts, tests, Prisma model additions, and migration scaffold. Runtime completion remains Codex-owned.

## Before Coding

Codex must state:

1. Current roadmap phase: Phase 5 — Packages and Pricing.
2. Current task: verify and wire ChatGPT-seeded package/pricing implementation.
3. Acceptance criteria being targeted.
4. Files expected to change.
5. Tests/checks that will be run.

## Required Verification Sequence

1. Unzip/stitch `ListingLift_Repo_Seed_v7.zip` into a safe branch.
2. Preserve any existing handwritten repo work.
3. Run dependency install if needed.
4. Validate Prisma schema.
5. Regenerate/repair migration SQL for Package model additions.
6. Generate Prisma client.
7. Apply migrations.
8. Run seed twice to prove idempotency.
9. Connect package routes to Prisma persistence.
10. Ensure package admin mutations require `manage:packages`.
11. Ensure package changes create audit logs.
12. Ensure checkout uses server-side package/pricing services.
13. Ensure frontend never controls final price, allowance, or revision entitlement.
14. Run package/pricing unit, integration, and E2E checks.
15. Update `ROADMAP_STATUS.md` with true command results.

## Codex Implementation Requirements

- Read package records from the database for admin workflows.
- Public pages may use cached server-side records or seeded defaults while DB connection is being wired, but Codex must document the chosen path.
- Admin package edits must persist to `Package` records.
- Admin package edits must be audited.
- Package records must retain marketplace-safe claims.
- Direct checkout must not call Stripe until Phase 17.
- Gumroad checkout/webhook behavior must not be implemented until Phase 18.

## Stop Conditions

Stop and document gaps if:

- Prisma migration fails.
- Package schema does not validate.
- Typecheck fails in package/pricing modules.
- Checkout can be manipulated from the frontend.
- Package mutation lacks server-side RBAC.
- Marketplace-safe claims are removed.

## Completion Gate

Phase 5 can be marked complete only when all acceptance criteria pass in the real repo and results are documented in `ROADMAP_STATUS.md`.
