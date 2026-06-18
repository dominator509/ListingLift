# CODEX_WHOLE_REPO_STITCH_PROMPT_V15.md

You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v15.zip`.

## Required Start

1. Unzip the package.
2. Inspect repository structure.
3. Read:
   - `ARCHITECTURE.md`
   - `BUILD_ROADMAP.md`
   - `ROADMAP_STATUS.md`
   - `CODEX_GAPS.md`
   - `WHOLE_REPO_CODEX_HANDOFF_V15.md`
   - `PHASE_13_EXECUTION_RUNBOOK.md`
   - `PHASE_13_VERIFICATION_MATRIX.md`
4. State current phase, current task, acceptance criteria, files expected to change, and checks to run.

## Current Seed Phase

Phase 13 — Preview Gallery and Before/After

## Your Work

- Stitch v15 into the real repository.
- Install dependencies.
- Validate and repair TypeScript imports.
- Validate and regenerate Prisma migrations.
- Apply migrations.
- Run seed twice.
- Replace dry-run preview route payloads with tenant-scoped Prisma queries and transactions.
- Persist preview galleries/items.
- Implement bulk preview approval transactionally with audit logs.
- Ensure client preview visibility only exposes approved client-visible previews.
- Confirm final delivery/downloads remain hidden until later delivery approval gates.
- Run required tests and checks.
- Update `ROADMAP_STATUS.md` with real results.

## Stop Condition

Stop at a clean checkpoint after Phase 13 verification or documented blockers. Do not silently proceed to Phase 14.
