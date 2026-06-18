# PHASE_25_EXECUTION_RUNBOOK.md — Shopify Workflow

## Before coding in Codex

State current phase, task, acceptance criteria, expected files, and checks.

## Implementation blocks

1. Validate the v27 seed against the real repository.
2. Repair TypeScript imports and route contracts as needed.
3. Validate Prisma schema and regenerate migration SQL.
4. Wire manual Shopify order intake to Prisma transactions.
5. Wire product/SKU CSV import to Prisma transactions.
6. Wire image replacement approval to persisted workflow events and audit logs.
7. Keep OAuth scaffold disabled unless explicitly feature-flagged.
8. Verify ZIP-by-product/SKU planning with approved delivery archives only.
9. Run all Phase 25 tests and global checks.
10. Update `ROADMAP_STATUS.md` with real results.

## Stop conditions

Stop and fix before advancing if auth, tenant isolation, RBAC, upload security, delivery approval, Shopify token secrecy, duplicate prevention, or marketplace safety tests fail.
