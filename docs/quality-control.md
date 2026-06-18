# docs/quality-control.md — Phase 14 Quality Control and Flagged Outputs

## Purpose

Phase 14 adds the internal QC layer between preview generation and final delivery approval. It helps operators identify bad masks, bad crops, product accuracy issues, missing parts, wrong backgrounds, preset errors, naming/folder issues, and unsafe marketplace language before a client-facing archive can be delivered.

## Non-negotiable rules

- QC pass is not final delivery approval.
- Flagged, failed, rejected, pending, and manual-replacement outputs must remain admin-only.
- Client downloads remain hidden until the delivery approval workflow permits access.
- Original uploads must never be overwritten.
- Manual fallback is required when automation or provider output is not good enough.
- Marketplace/sales/performance guarantees are prohibited.

## Review categories

The seed defines checks for:

- Edge quality
- Product accuracy
- Weird cutoff
- Missing product parts
- Lighting issues
- Blurry photos
- Wrong crop
- Failed mask
- Duplicate files
- Wrong background
- Marketplace preset accuracy
- File naming
- Folder organization
- Client instruction mismatch
- Marketplace claim risk

## Codex implementation requirements

Codex must connect the seed services to Prisma transactions:

1. Query `Job`, `Image`, `ProcessedFile`, and `PreviewGalleryItem` by active organization scope.
2. Persist `QualityReview`, `QualityFlag`, and `QualityReviewEvent` records.
3. Update processed-file and preview item statuses safely.
4. Block final delivery when unresolved blocking flags exist.
5. Audit every QC mutation.
6. Verify flagged outputs never leak to client routes.
7. Run security tests for client visibility and delivery gate behavior.
