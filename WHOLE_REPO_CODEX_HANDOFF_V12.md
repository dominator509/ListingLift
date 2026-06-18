# WHOLE_REPO_CODEX_HANDOFF_V12.md

## Package

`ListingLift_Repo_Seed_v12.zip`

## Current Seed Coverage

This seed contains coded scaffolds through Phase 10 — Image Processing Provider Layer.

## Mandatory Codex Behavior

- Inspect the existing repo before copying files.
- Preserve user changes.
- Stitch files carefully instead of blind overwrites when the target repo has active work.
- Run real commands and update `ROADMAP_STATUS.md` with actual results.
- Do not mark any phase complete unless acceptance criteria and tests pass.
- Do not expose secrets.
- Do not require paid APIs for baseline functionality.

## New in v12

- Image provider domain registry.
- Expanded image provider adapter contracts.
- Mock provider baseline behavior.
- Real provider scaffolds for Remove.bg, Cloudinary, Replicate, and Clipdrop-style provider.
- Future scaffolds for open-source background removal and local image worker.
- Provider feature-flag enforcement helpers.
- Provider error normalization.
- Provider registry, selection, secret-reference, policy, health, and dry-run services.
- Admin API route contracts for image providers.
- Admin setup UI at `/admin/integrations/image-providers`.
- Prisma schema scaffold for image provider configurations and health checks.
- Seed scaffold for provider configuration defaults.
- Phase 10 runbook, verification matrix, implementation notes, and Codex gaps.
- Unit, adapter-contract, integration, security, and E2E test scaffolds.

## Critical Phase 10 Rules

- Mock provider must work without paid keys.
- Real providers must remain optional and feature-flagged.
- Real calls require both the provider flag and `REAL_IMAGE_PROVIDER_CALLS_ENABLED=true`.
- Provider secrets must be stored only as encrypted secret references.
- Never send secret values to the frontend.
- Never log provider secrets.
- Provider failures must normalize to manual fallback.
- Phase 10 is not the full image pipeline; Phase 11 owns actual output generation.

## Codex Must Verify

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- image-provider
npm run test:adapter-contract -- image-provider
npm run test:integration -- phase10
npm run test:security -- image-provider
npm run test:e2e -- image-provider-admin
npm run typecheck
npm run lint
npm run build
```

## Known ChatGPT Environment Limits

- npm install was not run.
- Prisma validation and migrations were not run.
- Tests, lint, typecheck, and build were not run.
- Browser UI was not executed.
- Real provider APIs were not called and must remain disabled until Codex implements and verifies them.

## Next Phase After Codex Verification

Phase 11 — Core Image Processing Pipeline.
