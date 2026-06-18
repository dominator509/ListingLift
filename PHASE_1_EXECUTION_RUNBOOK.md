# PHASE_1_EXECUTION_RUNBOOK.md

## Purpose

This runbook tells Codex how to verify and complete the ChatGPT-coded Phase 1 Design System and UI Shell work.

## Phase Boundary

Allowed:

- UI primitives.
- Public shell.
- Auth shell.
- Admin shell.
- Client shell.
- Agency shell.
- Navigation config.
- Upload/gallery visual components.
- Empty/loading/error states.
- Shell smoke tests.

Forbidden:

- Real upload logic.
- Auth/session implementation.
- Database-backed dashboard data.
- Payment logic.
- Image processing logic.
- Final delivery logic.
- Real integrations.
- Marketplace automation.

## Required Pre-Change Statement

Before making changes, Codex must state:

1. Current roadmap phase: Phase 1 — Design System and UI Shell.
2. Current task: verify/stitch Phase 1 UI shell seed.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks to run.

## Verification Sequence

1. Install dependencies.
2. Generate Prisma client if the schema is present.
3. Run typecheck.
4. Run lint.
5. Run unit tests.
6. Run build.
7. Run E2E UI shell smoke test.
8. Check rendered public/admin/client/agency shells manually or through Playwright.
9. Verify no secrets are exposed.
10. Update `ROADMAP_STATUS.md`.

## Expected Phase 1 Files

- `src/config/navigation.ts`
- `src/components/ui/*`
- `src/components/workflow/*`
- `src/components/layout/*`
- `src/app/admin/layout.tsx`
- `src/app/client/layout.tsx`
- `src/app/agency/layout.tsx`
- `tests/unit/ui-shell-contract.test.ts`
- `tests/e2e/ui-shell.spec.ts`

## Completion Rule

Codex may mark Phase 1 complete only after checks pass or blockers are explicitly documented. Do not treat scaffold existence as completion.
