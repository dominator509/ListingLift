# PHASE_18_EXECUTION_RUNBOOK.md — Gumroad Checkout/Webhook Intake

## Before coding in Codex

State:

1. Current roadmap phase: Phase 18 — Gumroad Checkout/Webhook Intake.
2. Current task: stitch and verify Gumroad intake scaffolds.
3. Acceptance criteria targeted.
4. Files expected to be touched.
5. Tests/checks that will be run.

## Execution steps

1. Install/update dependencies and lockfile if needed.
2. Run `npm run typecheck` and repair TypeScript issues.
3. Run `npm run db:validate` and repair Prisma schema issues.
4. Regenerate the Phase 18 migration with Prisma rather than trusting scaffold SQL blindly.
5. Apply migration to a local/test database.
6. Run seed twice to verify repeatability.
7. Verify Gumroad product mappings are seeded without real product IDs or secrets.
8. Implement real database transactions for Gumroad webhook intake:
   - Persist `GumroadWebhookEvent`.
   - Dedupe by sale ID and dedupe key.
   - Match/create client.
   - Create/update `ExternalOrder`.
   - Create `Job` and upload token for mapped image-pack purchases.
   - Apply credit ledger entries for credit packs.
   - Hold digital-only purchases as non-job records.
   - Audit every mutation.
9. Verify webhook signatures using the actual configured Gumroad mechanism.
10. Keep failed, refunded, disputed, duplicate, unsupported, unmapped, or unverifiable payloads from granting access.
11. Verify admin Gumroad UI and dry-run routes.
12. Update `ROADMAP_STATUS.md` with actual command results.

## Stop conditions

Stop and document blockers if:

- Webhook signature verification cannot be confirmed.
- Duplicate sale prevention fails.
- Refunded sales create jobs/credits/access.
- Secrets or raw tokens appear in responses or logs.
- Tenant isolation or RBAC checks fail.
