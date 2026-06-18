# CODEX_WHOLE_REPO_STITCH_PROMPT_V35.md

You are Codex implementing ListingLift.

Use `ListingLift_Repo_Seed_v35.zip` as the latest seed package. Stitch it into the repository carefully.

## Current Phase

Phase 33 — Client Dashboard

## Required Source of Truth

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `PHASE_33_EXECUTION_RUNBOOK.md`
- `PHASE_33_VERIFICATION_MATRIX.md`

## Mandatory Work

1. Inspect the repo and package manager.
2. Apply v35 files carefully without deleting existing valid work.
3. Validate imports and route paths.
4. Repair Prisma schema and regenerate migration SQL.
5. Generate Prisma client.
6. Wire client-dashboard APIs to session, RBAC, tenant isolation, client isolation, and Prisma.
7. Replace demo client dashboard data with real scoped queries.
8. Enforce preview, download, upload, revision, billing, and upgrade safety gates.
9. Run required checks.
10. Update `ROADMAP_STATUS.md` with real command output.

## Stop Conditions

Stop and report if auth, RBAC, tenant isolation, client isolation, preview visibility, delivery token/download gates, revision scope, or billing derivation tests fail.

## Do Not Do

- Do not expose final downloads before approval.
- Do not expose pending/flagged/failed/rejected/admin-only outputs.
- Do not trust client-submitted organization/client/job IDs.
- Do not guarantee marketplace approval, sales, ranking, conversion, or ad performance.
- Do not store or log secrets/tokens.
