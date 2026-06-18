# Preview Gallery and Before/After

## Purpose

The preview gallery lets operators inspect processed outputs before delivery and lets clients view approved previews when preview access is enabled.

## Rules

- Admins may review all outputs for jobs they are authorized to access.
- Clients may only view approved previews that have been explicitly made client-visible.
- Flagged, failed, rejected, and pending outputs are admin-only.
- Preview approval is separate from final delivery approval.
- Preview access does not expose final ZIP downloads.
- Marketplace approval, ranking, sales, conversion lift, ad performance, and product/listing approval are never guaranteed.

## Core Views

- Admin job preview gallery.
- Admin global preview queue.
- Client approved-preview gallery.
- Image detail view.
- Before/after comparison cards.
- Bulk preview approval panel.

## Filters

Previews should filter by:

- Output type.
- Platform preset.
- Platform.
- Approved.
- Ready for review.
- Flagged.
- Failed.
- Rejected.
- Search string.

## Codex Runtime Work

Codex must replace dry-run route contracts with tenant-scoped database queries and transactional updates.
