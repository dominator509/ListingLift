# Upload and File Intake

ListingLift accepts product photos through scoped upload links, admin/manual upload, ZIP uploads, and later file-storage integrations.

## Required Intake Rules

- Upload tokens are public only once and stored as hashes.
- Upload tokens expire and may be revoked or marked used.
- Client-facing upload links do not grant access to delivery files.
- Original uploads are preserved and never overwritten.
- Unsafe file types are rejected before storage.
- ZIP entries are inspected before extraction.
- Every accepted upload creates upload history.
- Manual/admin upload fallback must be audited.

## Supported Phase 8 Upload Inputs

- Direct image files: JPG, PNG, WebP, HEIC/HEIF metadata scaffold.
- ZIP archives: inspected and accepted only when entries are safe image files.
- Admin manual upload: used for files received outside the portal.

## ZIP Safety

Reject:

- `../` traversal.
- Absolute paths.
- Windows drive-letter paths.
- Executables and scripts.
- Nested archives.
- Unsafe file names.

## Codex Runtime Work

Codex must connect these contracts to real storage, Prisma transactions, metadata extraction, and test execution in the target repository.
