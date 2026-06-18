# WHOLE_REPO_CODEX_HANDOFF_V3.md

## Current Objective

Stitch `ListingLift_Repo_Seed_v3.zip` into the real ListingLift repository, verify Phase 0, then verify the ChatGPT-coded Phase 1 Design System and UI Shell artifacts.

## Source Review Completed in ChatGPT

The v2 seed ZIP was unzipped and all Markdown files were read for context before advancing. See:

- `CHATGPT_MARKDOWN_REVIEW_INDEX.md`
- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `docs/source/ListingLift.md`
- `docs/source/ListingLift_BUILD_ROADMAP.md`

## What Changed in v3

Phase 1 UI shell artifacts were coded inside the seed package:

- UI primitives expanded/added.
- Workflow preview components added.
- Public/auth/admin/client/agency shells added or improved.
- Navigation config added.
- Major shell pages updated.
- UI shell unit and E2E test scaffolds added.
- `CODEX_GAPS.md` added.
- `ROADMAP_STATUS.md` updated with the controlled Phase 1 advancement.

## Critical Rule

Do not mark Phase 0 or Phase 1 complete merely because files exist. Completion requires Codex to install dependencies, run checks, fix failures, and update `ROADMAP_STATUS.md` with real results.

## Codex Stitch Order

1. Inspect current repo.
2. Back up or diff existing files before overwriting.
3. Copy in v3 seed files.
4. Reconcile existing package manager/framework choices.
5. Install dependencies.
6. Run Prisma generation/validation if applicable.
7. Run typecheck, lint, tests, build, and E2E UI shell check.
8. Fix failures.
9. Update `ROADMAP_STATUS.md`.
10. Commit if git is available; otherwise add a commit-style status entry.

## Required Commands

```bash
npm install
npm run db:generate
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e -- ui-shell
```

If a command is unavailable due to package manager or environment differences, document the exact reason and substitute the closest equivalent.

## Must Verify

- `src/components/ui/card.tsx` supports existing `title` prop usage.
- `/`, `/login`, `/signup`, `/admin`, `/client`, and `/agency` render.
- `/admin`, `/client`, and `/agency` layouts do not break nested pages.
- UI components do not import server-only code.
- No real secrets are present.
- Upload/gallery components remain non-functional UI shells until their owning roadmap phases.
- E2E tests are updated if route text or navigation labels change.

## Codex-Owned Gaps

See `CODEX_GAPS.md` for the full list of repo/runtime checks and environment-specific implementation gaps that ChatGPT could not complete.

## Completion Gate

Codex may mark Phase 1 complete only when:

- Phase 0 is verified or blocker/deviation is recorded.
- Phase 1 acceptance criteria pass.
- Required checks pass or blockers are documented.
- `ROADMAP_STATUS.md` is accurate.
- No upload, auth, payment, image-processing, or real-integration phase was silently implemented early.
