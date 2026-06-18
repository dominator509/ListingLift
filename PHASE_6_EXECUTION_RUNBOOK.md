# PHASE_6_EXECUTION_RUNBOOK.md

## Phase

Phase 6 — Platform Preset System

## Current ChatGPT Seed State

ChatGPT v8 advanced into Phase 6 because prior seeded phases require Codex runtime verification and there was no further safe work to code for Phase 5 inside ChatGPT Project Mode.

## Codex Pre-Change Report

Before editing, Codex must report:

1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks to run after the change.

## Implementation Steps for Codex

1. Unzip `ListingLift_Repo_Seed_v8.zip` in a safe branch/worktree.
2. Compare against existing repo and preserve user-authored changes.
3. Install dependencies if not installed.
4. Run Prisma validation.
5. Regenerate/repair `0005_phase6_platform_presets` migration.
6. Generate Prisma client.
7. Apply migration.
8. Run seed twice and verify required preset records exist.
9. Connect preset admin create/update routes to Prisma with server-side tenant scope.
10. Add audit logs for preset mutations.
11. Verify folder path sanitization and ZIP-safety.
12. Verify admin preset UI renders.
13. Run tests and repair failures.
14. Update `ROADMAP_STATUS.md` with true results.

## Stop Condition

Stop at a clean checkpoint after Phase 6 verification or after documenting blockers. Do not start Phase 7 unless the user explicitly instructs Codex to continue.
