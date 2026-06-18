# Whole Repo Codex Handoff v33

## Package

`ListingLift_Repo_Seed_v33.zip`

## Source reviewed

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`
- All Markdown files inside the v32 repo seed

## Current phase

Phase 31 — Advanced Image Processing

## What changed in v33

Added advanced image-processing scaffolds:

- domain catalog
- Zod schemas
- planning services
- safety services
- quality-report services
- sequence recommendation service
- API route contracts
- admin UI shells
- Prisma schema and migration scaffold
- tests
- docs
- gap handoff

## Codex instructions

1. Unzip this package into a working repo.
2. Inspect existing files before editing.
3. Do not assume generated scaffolds compile without repair.
4. Validate Prisma and repair relations/enums as needed.
5. Run migrations and seed checks.
6. Wire route contracts to authenticated, RBAC-protected, tenant-scoped server logic.
7. Keep real advanced image/model/provider calls feature-flagged.
8. Preserve originals and create new outputs only.
9. Keep all outputs hidden until QC/approval/delivery gates pass.
10. Run all relevant tests and update `ROADMAP_STATUS.md` with real results.

## Start prompt

Use `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V33.md`.
