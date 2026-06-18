# PHASE_17_EXECUTION_RUNBOOK.md

## Current phase
Phase 17 — Stripe Checkout and Billing

## Codex execution order

1. Inspect v19 diff and reconcile with existing repo.
2. Install dependencies, including `stripe`.
3. Validate environment schema and `.env.example` placeholders.
4. Validate Prisma schema.
5. Regenerate migration SQL for Phase 17.
6. Generate Prisma client.
7. Apply migrations to a safe dev database.
8. Run seed twice and confirm idempotence.
9. Replace seed Stripe adapter drafts with official Stripe SDK calls in test mode.
10. Persist checkout sessions before redirecting to Stripe.
11. Verify webhook signatures using raw request bodies.
12. Dedupe webhook events by Stripe event ID.
13. Process paid events transactionally: invoice payment, external order, job, upload token, credit or subscription updates.
14. Ensure failed payments never grant access.
15. Add audit logs for all payment-state changes.
16. Run Phase 17 unit, security, integration, E2E, typecheck, lint, build, and smoke checks.
17. Update `ROADMAP_STATUS.md` with real results.

## Stop condition

Stop after Phase 17 is verified or after documenting any blocking test/build/migration issue in `CODEX_GAPS.md` and `ROADMAP_STATUS.md`.
