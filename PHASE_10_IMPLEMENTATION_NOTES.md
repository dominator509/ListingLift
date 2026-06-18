# PHASE_10_IMPLEMENTATION_NOTES.md — Image Processing Provider Layer

## Phase Advanced

Phase 10 — Image Processing Provider Layer.

## What ChatGPT Project Mode Added

- Expanded image provider domain definitions.
- Added provider operation/capability registry.
- Reworked adapter interface with health, process, error, feature flag, secret-field, runtime mode, and operation contracts.
- Added mock provider baseline behavior.
- Added real-provider scaffolds for Remove.bg, Cloudinary, Replicate, and Clipdrop-style provider.
- Added future scaffolds for open-source background removal and local image worker.
- Added feature-flag enforcement helpers.
- Added provider error normalization.
- Added provider selection, registry, secret-reference, health, policy, and dry-run test services.
- Added admin API route contracts for provider registry, detail, setup, health, selection, secrets, and dry-run tests.
- Added admin image provider setup UI shell.
- Added Prisma schema scaffold for provider configurations and health checks.
- Added seed scaffold for default provider configurations.
- Added unit, adapter-contract, integration, security, and E2E test scaffolds.

## Scope Boundary

This phase intentionally does not implement the full image-processing pipeline. That belongs to Phase 11.

## Security Decisions

- No provider secret values are included.
- Real calls are disabled by default.
- Provider config policy rejects apparent plaintext secret values.
- Secret setup returns secret names and completeness only.
- UI copy reinforces that secret values must never be displayed.

## Manual Fallback Decisions

Every real provider scaffold returns normalized failure/manual fallback until Codex implements real provider API calls and verifies feature flags, encrypted secrets, timeouts, retries, and adapter-contract tests.
