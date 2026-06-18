# PHASE_8_IMPLEMENTATION_NOTES.md — Direct Upload and File Intake

## Current Objective

Prepare the Direct Upload and File Intake layer so Codex can wire secure client/admin uploads into the real repository with transactional persistence, storage, and runtime validation.

## Source Context Reviewed

ChatGPT unzipped the v9 repository seed and read all Markdown files in the package, then re-read the source documents:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

The roadmap identifies Phase 8 as secure upload links, direct image upload, ZIP upload, file validation, metadata extraction, upload history, and admin upload fallback.

## Code Added

Phase 8 adds seed implementations for:

- Upload intake domain constants and file safety helpers.
- Zod schemas for upload tokens, upload file metadata, ZIP inspection, public intake, and completion.
- Upload token issue/validation helpers using public token hashing.
- File validation service for MIME type, size, extension, allowance, duplicate, and unsafe-name checks.
- ZIP safety service for traversal, absolute path, executable, nested archive, system file, and image-only extraction checks.
- Original storage key service that rejects unsafe storage paths.
- File metadata planning and original Image record drafts.
- Upload intake orchestration service that creates dry-run UploadBatch/Image/UploadEvent/job-update plans.
- Upload history event helpers.
- Upload API route contracts.
- Public upload-token page UI and admin upload fallback shell.
- Prisma schema additions for UploadBatch, UploadEvent, upload token limits, and Image upload provenance.
- Seed data for demo upload token, batch, event, and original image linkage.
- Unit, integration, security, and E2E test scaffolds.

## Key Product Rules Preserved

- Originals must be preserved and never overwritten.
- Upload tokens must be hashed, expiring, and scoped.
- Client-facing upload links do not grant delivery access.
- Final delivery remains hidden until admin approval.
- Executables and unsafe ZIP paths are rejected.
- Manual upload fallback is core and must be audited.
- No paid API or real storage provider is required for baseline operation.

## Intentional Limits

ChatGPT cannot install dependencies, run Prisma, store binary uploads, extract ZIP files, run Sharp, or verify browser upload flows in this environment. Codex must complete those runtime tasks.
