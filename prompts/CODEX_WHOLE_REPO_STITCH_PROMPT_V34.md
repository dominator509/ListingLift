You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v34.zip`.

Current seed phase: Phase 32 — Reports and Upsell Engine.

Before editing:
1. Inspect the current repo.
2. Read `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V34.md`, `PHASE_32_EXECUTION_RUNBOOK.md`, and `PHASE_32_VERIFICATION_MATRIX.md`.
3. State current phase, task, acceptance criteria, expected files, and tests/checks.

Implementation requirements:
- Stitch the v34 seed carefully.
- Validate Prisma schema and repair migration SQL.
- Wire reports and upsells to tenant-scoped Prisma queries and transactions.
- Enforce RBAC and client/agency visibility gates server-side.
- Add audit logs for all report/upsell mutations.
- Keep upsell sends manual-review only.
- Remove unsafe copy and guarantee language.
- Run relevant tests, typecheck, lint, build, Prisma validate, migration, and seed checks.
- Update `ROADMAP_STATUS.md` with real results.

Stop if report visibility leaks private data, if upsell copy contains guarantee language, or if Prisma validation fails.
