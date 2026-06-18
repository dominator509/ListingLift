# PHASE_12_IMPLEMENTATION_NOTES.md — Smart Naming, Folders, Manifest, ZIP

## Phase Advanced

Phase 12 — Smart Naming, Folder Generation, Manifest, and ZIP.

## ChatGPT-Coded Scope

This seed adds the deterministic delivery-packaging layer that sits after processing and before preview/review/delivery phases.

Implemented as portable code scaffolds:

- Delivery archive domain constants and safety helpers.
- Delivery packaging Zod schemas.
- Smart file naming service expansion.
- Preset-generated folder tree service expansion.
- Manifest CSV builder with CSV formula neutralization.
- Compliance-safe delivery ReadMe service.
- ZIP entry planning and JSZip archive contract.
- Delivery archive persistence draft service.
- Delivery archive API route contracts.
- Admin job-delivery planning page and UI components.
- Prisma schema/migration scaffold for delivery archives and archive files.
- Seed demo archive rows and Phase 12 audit entry.
- Unit, security, integration, and E2E test scaffolds.

## Rules Preserved

- Original uploads are never overwritten.
- Processed outputs stay separate from originals.
- ZIP paths must be relative and ZIP-slip safe.
- Manifest rows must neutralize spreadsheet formulas.
- ReadMe language must not guarantee marketplace approval, ranking, sales, conversions, product approval, listing approval, or ad performance.
- Client-facing downloads remain hidden until later approval/delivery phases wire visibility gates.

## Not Completed Here

- Runtime JSZip archive generation against real storage bytes.
- Prisma validation and migration application.
- Real database persistence.
- Real storage read/write.
- Browser verification.
- Typecheck/lint/build/tests.
