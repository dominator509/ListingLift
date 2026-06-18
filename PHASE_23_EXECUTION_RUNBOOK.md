# Phase 23 Execution Runbook — Other Sales Channel Workflows

## Before Editing

1. Inspect existing repo state.
2. Compare current repo with v25 seed files.
3. Confirm previous phases are either complete or documented as runtime gaps.
4. Confirm `ROADMAP_STATUS.md` reflects Phase 23 work.

## Implementation Steps

1. Install dependencies if missing.
2. Stitch v25 seed files into the repo carefully.
3. Run Prisma format/validate.
4. Regenerate Phase 23 migration SQL from the schema.
5. Apply migration to dev database.
6. Run seed twice to verify idempotency.
7. Wire dry-run API route contracts to Prisma services.
8. Enforce RBAC and tenant isolation.
9. Add audit logs for manual order, template generation, follow-up changes, safety blockers, exports, and revenue attribution.
10. Run unit, security, integration, E2E, lint, typecheck, and build checks.
11. Update `ROADMAP_STATUS.md` with actual results.

## Stop Conditions

Stop and fix before advancing if any of these fail:

- Prisma validation
- Tenant isolation tests
- RBAC tests
- Duplicate external-order prevention
- Safety tests preventing scraping/password storage/unauthorized automation
- Build/typecheck
