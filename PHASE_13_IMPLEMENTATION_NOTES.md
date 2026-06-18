# PHASE_13_IMPLEMENTATION_NOTES.md — Preview Gallery and Before/After

## Current Objective

Seed Phase 13 preview gallery and before/after functionality without claiming runtime completion.

## Implemented in ChatGPT Project Mode

- Preview gallery domain rules.
- Admin and client preview visibility logic.
- Before/after grouping by original image.
- Output filtering by type, preset, platform, review status, flagged, failed, approved, and search.
- Bulk preview approval plan generation.
- Image detail preview contract.
- Admin preview gallery UI shell.
- Job-level preview UI shell.
- Client approved-preview UI shell.
- API route contracts for admin previews, client previews, image detail, job previews, and bulk preview approval.
- Prisma preview gallery/item schema scaffold.
- Migration scaffold for preview models.
- Seed demo preview gallery/item.
- Unit, integration, security, and E2E test scaffolds.

## Important Boundaries

- Preview approval is not final delivery approval.
- Client-visible previews are allowed only for approved preview items when client preview access is enabled.
- Final downloads remain hidden until later delivery/approval phases allow access.
- Flagged and failed outputs remain admin-visible.
- Marketplace approval, ranking, sales, conversion, and ad performance are never guaranteed.

## Codex Must Complete

- Validate Prisma schema.
- Regenerate migration SQL if needed.
- Query real `Image` and `ProcessedFile` records by tenant/job.
- Persist preview gallery and preview item records transactionally.
- Implement real bulk approval mutation with audit logs.
- Enforce tenant/client/job scope server-side.
- Verify UI pages and route handlers at runtime.
