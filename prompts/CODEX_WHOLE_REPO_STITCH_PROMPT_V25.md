You are Codex implementing ListingLift from the v25 repo seed.

Current seed phase: Phase 23 — Other Sales Channel Workflows.

Tasks:
1. Inspect the existing repo and compare it with `ListingLift_Repo_Seed_v25`.
2. Stitch in Phase 23 files carefully without deleting working implementation.
3. Validate Prisma schema and regenerate/repair migration `0022_phase23_other_sales_channels`.
4. Generate Prisma client, apply migrations, and run seed twice.
5. Wire `/api/other-sales-channels/*` dry-run route contracts to tenant-scoped Prisma services.
6. Enforce RBAC, tenant isolation, duplicate prevention, and audit logging.
7. Verify all Phase 23 channels are selectable sources.
8. Verify no unsafe automation, scraping, or password storage exists.
9. Run tests: unit, security, integration, E2E, typecheck, lint, build, Prisma validate, and seed checks.
10. Update `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, and any implementation notes with actual results.

Stop before moving to Phase 24 unless Phase 23 acceptance criteria are met or remaining blockers are documented as external/runtime gaps.
