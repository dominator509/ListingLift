# PHASE_14_IMPLEMENTATION_NOTES.md

## Phase

Phase 14 — Quality Control and Flagged Outputs

## ChatGPT-seeded work

This seed adds:

- QC domain catalog and flag definitions.
- QC schemas for review, flagging, resolution, and bulk actions.
- QC services for scoring, checklist, flagging, review decisions, flagged queues, access guards, and manual replacements.
- API route contracts for job QC, flagged queues, flag creation, flag resolution, output review, and bulk review.
- Admin QC and flagged-output UI shells.
- Prisma `QualityReview`, `QualityFlag`, and `QualityReviewEvent` scaffold models.
- Phase 14 migration scaffold.
- Seed QC review/flag/event records.
- Unit, integration, security, and E2E test scaffolds.

## Important boundaries

- This is not runtime-verified.
- QC pass must not approve final delivery.
- QC routes are dry-run contracts until Codex wires Prisma and storage.
- Client routes must not expose admin notes or flagged output details.
- Blocking flags must prevent delivery archive approval and delivery link creation.
