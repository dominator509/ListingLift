# CODEX_STITCHING_HANDOFF.md

## Objective

Stitch this repo seed into the actual ListingLift implementation repository without drifting from the architecture or roadmap.

## Source priority

1. Existing user repository files, if present.
2. `ARCHITECTURE.md` and `BUILD_ROADMAP.md`.
3. This repo seed's source files and docs.
4. Existing generated docs under `docs/source/`.

## Operating rule

Do not blindly overwrite existing repository files. Inspect first, then merge. If there is no existing implementation, this seed can become the initial repository structure.

## Required Codex pre-change report

Before making changes, Codex must state:

1. Current roadmap phase.
2. Current task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after the change.

## Phase boundary

This package contains scaffolds beyond Phase 0 so Codex can assemble faster later, but Codex must still execute roadmap phases in order.

Allowed immediately:

- Repository initialization.
- Dependency setup.
- Config setup.
- Basic health endpoint.
- Environment validation.
- Documentation placement.
- Initial typecheck/lint/test scaffolding.

Not allowed during Phase 0:

- Real auth.
- Real database migrations beyond baseline scaffold validation.
- Real image processing.
- Real payments.
- Real upload/delivery flows.
- Real marketplace API calls.
- Real dashboards beyond placeholders.

## Stitching sequence

1. Inspect the target repository.
2. Confirm package manager and framework.
3. Copy or merge root config files.
4. Copy or merge `src/`, `prisma/`, `tests/`, `scripts/`, `docs/`, and `prompts/`.
5. Install dependencies.
6. Generate Prisma client if applicable.
7. Run checks in this order:
   - `npm run verify-env`
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test`
   - `npm run build`
8. Fix failures before progressing.
9. Update `ROADMAP_STATUS.md`.
10. Stop after the currently approved phase.

## Required checkpoint after stitching

Codex must report:

- Files created/modified.
- Commands run.
- Passing checks.
- Failing checks.
- Fixes applied.
- Known remaining issues.
- Next phase readiness.

## Production caution

This seed is intentionally adapter-driven and mock-first. Do not enable real paid providers until environment variables, webhooks, token encryption, rate limiting, audit logs, and tenant isolation tests are in place.

---

## v3 Update — Phase 1 UI Shell Seed

ChatGPT advanced the seed into Phase 1 because Phase 0 install/build/runtime verification cannot be completed inside the ChatGPT project environment.

Additional files to read before stitching:

- `WHOLE_REPO_CODEX_HANDOFF_V3.md`
- `CODEX_GAPS.md`
- `CHATGPT_MARKDOWN_REVIEW_INDEX.md`
- `PHASE_1_IMPLEMENTATION_NOTES.md`
- `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V3.md`

Codex must still verify Phase 0 before marking phases complete. Phase 1 artifacts are code seed files, not proof of a passing build.
