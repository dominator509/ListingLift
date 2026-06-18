# Core Image Processing Pipeline

ListingLift Phase 11 converts accepted original product photos into review-ready output drafts. The pipeline is intentionally service-first: software does the repeatable processing work, while admin approval remains required before client-facing final delivery.

## Pipeline Stages

1. Resolve job, tenant, client, package, selected presets, and accepted original images.
2. Create an `ImageProcessingRun`.
3. Create deterministic `ImageProcessingStep` rows.
4. Read original files from immutable original storage keys.
5. Run background-removal provider adapter where required.
6. Compose transparent PNGs and white-background JPGs.
7. Generate WebP, square ecommerce, vertical social, and preset outputs.
8. Resize and compress outputs.
9. Store outputs under processed storage namespaces only.
10. Create `ProcessedFile` rows as review-ready and approval-pending.
11. Store per-image `ImageProcessingError` rows for failures.
12. Move the job to `WAITING_FOR_REVIEW` or `FLAGGED_OUTPUTS`.

## Original Preservation

Original uploads must never be overwritten. Processing outputs must use separate storage keys and separate `ProcessedFile` records.

## Manual Fallback

Provider failure, transform failure, corrupt image, unsupported format, or unsafe metadata must not block the whole job. Failed images should be marked for manual fallback while successful outputs proceed to review.

## Delivery Gate

Phase 11 creates review-ready outputs only. It must not expose final downloads. Final delivery remains gated by later manual approval and delivery phases.

## Codex-Owned Runtime Work

- Real storage adapter read/write.
- Sharp or equivalent transform execution.
- Prisma transaction wiring.
- Runtime provider calls where feature-flagged.
- Status/audit persistence.
- Browser and integration verification.
