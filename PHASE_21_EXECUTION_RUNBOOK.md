# PHASE_21_EXECUTION_RUNBOOK.md

## Objective

Implement and verify the Upwork manual/semi-automated workflow in the real repository.

## Codex Steps

1. Inspect the repository and compare it to `ListingLift_Repo_Seed_v23`.
2. Stitch in the Upwork phase files carefully, preserving existing implementation improvements.
3. Install dependencies and update lockfile if needed.
4. Validate Prisma schema.
5. Regenerate/repair Phase 21 migration SQL.
6. Apply migrations.
7. Generate Prisma client.
8. Seed Upwork mappings/templates idempotently with fake IDs only.
9. Wire `/api/upwork/*` routes to auth, RBAC, tenant isolation, Prisma transactions, and audit logs.
10. Ensure contract ID duplicate prevention.
11. Connect job/client/external-order/upload-token creation transactionally.
12. Verify proposal/delivery/retainer template output is marketplace-safe.
13. Verify all Upwork admin pages render.
14. Run all tests and update `ROADMAP_STATUS.md` with real results.

## Stop Conditions

- Any Upwork workflow stores passwords or secrets.
- Any code scrapes private Upwork pages/messages/work diaries.
- Any code automates Upwork proposal/message/delivery without approved integration.
- Duplicate Upwork contract IDs can create duplicate jobs.
- Delivery templates can expose unapproved, flagged, failed, pending, rejected, or admin-only outputs.
- Tenant isolation or RBAC fails.
