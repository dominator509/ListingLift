# PHASE_26_EXECUTION_RUNBOOK.md

## Current Phase
Phase 26 — Social Commerce Workflows

## Codex Execution Steps
1. Inspect the existing repo and compare against this v28 seed.
2. Stitch social-commerce files into the repository without deleting prior phases.
3. Run `npm install` if package metadata changed.
4. Run Prisma validation and regenerate the Phase 26 migration from the actual schema.
5. Wire dry-run route contracts to tenant-scoped Prisma transactions only after validation.
6. Persist social-commerce mappings, workflow events, creative plans, jobs, external orders, upload tokens, and audit logs transactionally.
7. Verify all safety checks block scraping, password storage, and unauthorized automation.
8. Verify admin pages render.
9. Update `ROADMAP_STATUS.md` with real command results.

## Stop Conditions
- Stop if Prisma schema validation fails.
- Stop if tenant isolation/RBAC checks fail.
- Stop if social-commerce safety tests fail.
- Stop if any route can create jobs without duplicate prevention and audit logging.
