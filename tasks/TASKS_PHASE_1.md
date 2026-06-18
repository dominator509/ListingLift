# TASKS_PHASE_1.md — Design System and UI Shell

## Rule

Execute this phase only after all previous phases are complete in `ROADMAP_STATUS.md`, unless a controlled deviation is explicitly documented. ChatGPT has generated Phase 1 seed artifacts; Codex must verify them in the real repo before marking this phase complete.

## Pre-change checklist

- State current phase and task.
- State acceptance criteria.
- List expected files.
- List checks to run.
- Read `PHASE_1_EXECUTION_RUNBOOK.md` and `PHASE_1_VERIFICATION_MATRIX.md`.
- Read `CODEX_GAPS.md`.

## Implementation focus

Implement and verify the roadmap requirements for Phase 1: Design System and UI Shell.

## Seeded Artifacts

- UI primitives: Button, Card, DataTable, Input, Select, Badge, Modal, Toast, Tabs, Skeleton, EmptyState, ErrorState.
- Workflow components: UploadDropzone, ImageCard, BeforeAfterCard, JobStatusBadge, SourceChannelBadge, CreditBalanceCard, ProgressBar, PreviewGallery, DeliveryReadinessPanel.
- Shells: PublicShell, AuthShell, AppShell, admin/client/agency layouts.
- Navigation config for public, admin, client, agency, and sales-channel pages.
- Unit and E2E shell tests.

## Acceptance gate

- Required files created or updated.
- Public, admin, client, and agency shells render.
- Navigation works.
- Upload/gallery components exist but do not implement upload logic.
- Loading/empty/error states exist.
- No secrets exposed in client bundle.
- Relevant tests/checks run.
- Failures fixed or documented with blocker status.
- `ROADMAP_STATUS.md` updated.
- No roadmap phase silently skipped.

## Required checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e -- ui-shell
```

## Commit-style entry

`phase-1: design system and ui shell`
