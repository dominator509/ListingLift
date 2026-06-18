# PHASE_11_IMPLEMENTATION_NOTES.md — Core Image Processing Pipeline

## Current Objective

Seed the core image-processing pipeline that turns accepted uploaded originals into review-ready output drafts while preserving originals, using the Phase 10 provider layer and Phase 6 platform presets.

## What ChatGPT Coded

- Processing domain constants and original-preservation helpers.
- Zod schemas for processing run plans, queue requests, single-image processing, run/step/error drafts.
- Output planner that generates transparent PNG, white JPG, WebP, square ecommerce, vertical social, and preset-driven outputs.
- Step planner that creates deterministic metadata, background-removal, transparent, white-background, WebP, resize, compression, and preset-output steps.
- Queue service for dry-run processing run creation.
- Core pipeline service that calls the Phase 10 provider adapter contract and creates ProcessedFile drafts.
- Transform contract service describing the future Sharp transform sequence without overwriting originals.
- Per-image error normalization and manual-fallback summaries.
- Processing progress service.
- API route contracts for queue/start/status/single-image/retry/run lookup.
- Admin UI shell at `/admin/processing`.
- Prisma schema scaffold for `ImageProcessingRun`, `ImageProcessingStep`, and `ImageProcessingError`.
- Migration scaffold and seed additions.
- Unit, integration, security, and E2E test scaffolds.

## Non-Negotiable Product Rules Preserved

- Originals are never overwritten.
- Processing outputs are separate records/files.
- Provider failures create per-image errors and manual fallback decisions.
- Final delivery remains hidden until admin approval in later phases.
- Mock provider remains the baseline path and does not require paid API keys.
- Real providers remain feature-flagged and optional.

## Codex Must Finish

- Replace dry-run route contracts with tenant-scoped Prisma transactions.
- Connect processing queue/start/retry to actual job/image records.
- Implement file read/write with safe storage adapter and Sharp or equivalent.
- Persist `ImageProcessingRun`, `ImageProcessingStep`, `ImageProcessingError`, and `ProcessedFile` rows transactionally.
- Update `Job.status`, `Image.status`, and run counters safely.
- Keep per-image errors isolated so a single failed image does not block successful outputs.
- Verify originals cannot be overwritten in both service tests and storage adapter tests.

## Runtime Caution

This phase is a coded seed. ChatGPT did not run the application, execute Prisma, install dependencies, call image providers, or process real files.
