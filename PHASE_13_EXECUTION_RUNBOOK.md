# PHASE_13_EXECUTION_RUNBOOK.md — Preview Gallery and Before/After

## Phase

Phase 13 — Preview Gallery and Before/After

## Acceptance Criteria

- Admin can review outputs.
- Client can view approved previews if allowed.
- Flagged outputs are visible to admin.
- Bulk approval works.

## Pre-Change Checklist for Codex

Before changing code, Codex must state:

1. Current roadmap phase: Phase 13.
2. Current task: wire preview gallery and before/after review to real persistence/runtime.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run.

## Implementation Order

1. Validate schema and migration scaffold.
2. Generate Prisma client.
3. Wire preview routes to Prisma with organization/job/client scope.
4. Build admin preview listing from `Image` and `ProcessedFile` records.
5. Build client preview listing from approved client-visible preview records only.
6. Persist preview gallery metadata and item rows.
7. Implement bulk preview approval mutation transactionally.
8. Add audit logs for preview generation, visibility enablement, image detail review, and bulk approval.
9. Verify admin and client pages in browser.
10. Update `ROADMAP_STATUS.md` with actual command results.

## Forbidden Drift

- Do not expose final delivery downloads from preview routes.
- Do not make failed or flagged outputs client-visible.
- Do not trust client-submitted organization/client/job IDs.
- Do not use UI hiding as authorization.
- Do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.
