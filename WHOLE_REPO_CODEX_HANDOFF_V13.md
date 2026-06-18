# WHOLE_REPO_CODEX_HANDOFF_V13.md

## Package

`ListingLift_Repo_Seed_v13.zip`

## Current Seed Coverage

This seed contains coded scaffolds through Phase 11 — Core Image Processing Pipeline.

## Mandatory Codex Behavior

- Inspect the existing repo before copying files.
- Preserve user changes.
- Stitch files carefully instead of blind overwrites when the target repo has active work.
- Run real commands and update `ROADMAP_STATUS.md` with actual results.
- Do not mark any phase complete unless acceptance criteria and tests pass.
- Do not expose secrets.
- Do not require paid APIs for baseline functionality.
- Never overwrite original uploads.
- Never expose delivery/download artifacts before admin approval.

## New in v13

- Core image-processing domain rules and original-preservation helpers.
- Zod schemas for processing run plans, queue requests, single-image processing, run/step/error drafts.
- Preset-driven output planner.
- Processing step planner.
- Queue service and core pipeline service.
- Transform contract service for future Sharp/local processing.
- Per-image error normalization service.
- ProcessedFile/run/step/error record draft helpers.
- Processing progress service.
- Processing API route contracts.
- Admin processing UI at `/admin/processing`.
- Prisma schema scaffold for `ImageProcessingRun`, `ImageProcessingStep`, and `ImageProcessingError`.
- Phase 11 migration scaffold and seed additions.
- Phase 11 docs, runbook, verification matrix, tests, and Codex gaps.

## Critical Phase 11 Rules

- Originals must remain immutable and separate from processed outputs.
- Provider calls must go through the Phase 10 adapter registry.
- Mock provider must remain enough for baseline tests.
- Real provider calls remain feature-flagged.
- Processing errors must be stored per image.
- Successful outputs should still proceed if one image fails.
- Processed outputs must be review-ready, not delivery-visible.
- Manual fallback must be available for failed outputs.

## Codex Must Verify

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- image-processing
npm run test:integration -- phase11
npm run test:security -- image-processing
npm run test:e2e -- admin-processing
npm run typecheck
npm run lint
npm run build
```

## Known ChatGPT Environment Limits

- npm install was not run.
- Prisma validation and migrations were not run.
- Tests, lint, typecheck, and build were not run.
- Browser UI was not executed.
- Real provider APIs were not called.
- Real image files were not transformed.

## Next Phase After Codex Verification

Phase 12 — Smart Naming, Folder Generation, Manifest, and ZIP.
