# Whole Repo Codex Handoff v17

## Current Seed

ListingLift Repo Seed v17 advances the repository seed through Phase 15 — Manual Approval and Revision Workflow.

## Source Review

ChatGPT unzipped the latest seed and reviewed all Markdown files in the seed plus `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md` before advancing.

## New Phase 15 Artifacts

- Manual approval domain and Zod schemas
- Approval-readiness, output approval, job approval, revision, delivery gate, and manual replacement services
- Approval and revision API route contracts
- Admin approval/revision pages and client revision page
- Approval/revision UI components
- Prisma schema scaffold for manual approval gates/events and revision workflow events
- Phase 15 migration scaffold
- Phase 15 tests
- Phase 15 docs and prompt

## Codex Priority

Codex must stitch this seed into the actual repo, validate/install/migrate/run tests, and repair any type, Prisma, route, UI, or runtime issues. Earlier phases are not complete until Codex verifies them.

## Critical Guardrails

Manual approval does not create delivery links, expose downloads, mark delivered, or complete a job. Open revisions, unresolved QC blockers, and manual replacement requirements block approval. Every approval/revision/replacement mutation must be audited and tenant-scoped.
