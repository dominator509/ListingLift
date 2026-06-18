You are Codex implementing ListingLift.

Use `ListingLift_Repo_Seed_v11.zip` as the latest ChatGPT Project Mode seed.

Start by reading:

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V11.md`
- `PHASE_9_EXECUTION_RUNBOOK.md`
- `PHASE_9_VERIFICATION_MATRIX.md`

Current seeded phase: Phase 9 — Job Creation and Admin Queue.

Before editing, state:

1. Current roadmap phase.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to create/modify.
5. Tests/checks to run.

Then:

1. Stitch v11 seed into the repo carefully.
2. Preserve existing user/repo changes.
3. Install dependencies if needed.
4. Validate Prisma schema and regenerate/fix migration SQL.
5. Generate Prisma client.
6. Apply migrations.
7. Run seed twice.
8. Wire Phase 9 routes/services to real Prisma transactions.
9. Enforce RBAC and tenant isolation.
10. Run tests/typecheck/lint/build.
11. Fix failures.
12. Update `ROADMAP_STATUS.md` with real results.
13. Stop at a clean checkpoint.

Do not start Phase 10 until Phase 9 acceptance criteria pass or blockers are documented.
