# PHASE_10_VERIFICATION_MATRIX.md — Image Processing Provider Layer

| Area | Verification | Owner |
|---|---|---|
| Registry | All required providers are registered | Codex |
| Mock provider | Works with no paid keys | Codex |
| Real providers | Disabled by default | Codex |
| Feature flags | Real calls require global and provider-specific flags | Codex |
| Secrets | No plaintext provider secrets stored or returned | Codex |
| Errors | Provider errors normalize with retry/manual fallback flags | Codex |
| Health | Health route reports provider readiness safely | Codex |
| UI | Admin image-provider setup page renders | Codex |
| Database | Provider configuration and health-check models validate | Codex |
| Migrations | Phase 10 migration is regenerated/applied successfully | Codex |
| Tests | Unit, adapter-contract, integration, security, E2E, typecheck, lint, build | Codex |

## Required Commands

```bash
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

## Non-Negotiable Acceptance Criteria

- No real provider API key is required for baseline functionality.
- No provider secret is exposed to the frontend.
- Mock provider works.
- Real providers are optional and feature-flagged.
- Manual fallback is always available.
