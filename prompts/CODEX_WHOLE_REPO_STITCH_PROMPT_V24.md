You are Codex implementing ListingLift from Repo Seed v24.

Current prepared phase: Phase 22 — Taskrabbit Workflow.

Tasks:
1. Inspect the repository and compare it with ListingLift_Repo_Seed_v24.
2. Stitch in the Phase 22 Taskrabbit workflow files carefully.
3. Preserve existing repo work and reconcile conflicts explicitly.
4. Validate Prisma schema and regenerate/repair migration SQL.
5. Generate Prisma client and apply migrations in the dev/test database.
6. Run the seed twice to verify idempotency.
7. Wire Taskrabbit dry-run route contracts to real tenant-scoped Prisma transactions where this phase requires it.
8. Enforce RBAC, tenant isolation, duplicate prevention, and audit logs.
9. Verify no Taskrabbit scraping, password storage, unnecessary full-address storage, or unauthorized messaging/booking/cancellation automation exists.
10. Run relevant checks: typecheck, lint, build, unit, security, integration, E2E where practical, Prisma validate, seed.
11. Update ROADMAP_STATUS.md with real results.

Stop at a clean checkpoint after Phase 22 verification. Do not claim production readiness unless all required checks actually pass.
