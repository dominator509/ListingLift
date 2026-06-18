# Image Provider Layer

Phase 10 creates the adapter layer for background removal and image-processing providers. It does **not** complete the Phase 11 processing pipeline.

## Required Providers

- Mock Image Provider
- Remove.bg
- Cloudinary
- Replicate
- Clipdrop-style provider
- Open-source background removal scaffold
- Local image worker scaffold

## Baseline Rule

The mock image provider must work without paid API keys. No automated test may require a real paid provider.

## Feature Flag Rule

Real provider calls require both:

1. The provider-specific flag, such as `REMOVE_BG_ENABLED=true`.
2. `REAL_IMAGE_PROVIDER_CALLS_ENABLED=true`.

Both must remain disabled by default in `.env.example`.

## Secret Rule

Provider API keys, tokens, and secrets must be stored only as encrypted secret references. They must not be stored in frontend state, plain JSON config, seed data, logs, screenshots, test snapshots, or public docs.

## Manual Fallback Rule

Provider failure must never block fulfillment. If a provider is disabled, fails health checks, times out, returns unusable output, or lacks secrets, the job must route to manual fallback.

## Phase 10 Scope

In scope:

- Provider registry
- Adapter contracts
- Mock provider
- Real provider scaffolds
- Feature-flag checks
- Secret-reference policy
- Error normalization
- Health-check contracts
- Provider setup UI shell
- Contract tests

Out of scope until Phase 11:

- Actual image transformation pipeline
- Sharp-based output generation
- File persistence of processed outputs
- Queue execution
- Batch processing
- Per-image persisted provider run records
