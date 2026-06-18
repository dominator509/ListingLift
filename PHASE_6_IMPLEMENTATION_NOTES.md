# PHASE_6_IMPLEMENTATION_NOTES.md

## Phase

Phase 6 — Platform Preset System

## ChatGPT-Seeded Scope

This seed adds a data-driven platform preset system that can be stitched into the real repo by Codex.

## Files Added or Updated

- `src/domain/platform-presets.ts`
- `src/schemas/preset.ts`
- `src/server/services/preset-service.ts`
- `src/server/services/preset-validation-service.ts`
- `src/server/services/preset-selection-service.ts`
- `src/server/services/preset-folder-service.ts`
- `src/app/api/presets/route.ts`
- `src/app/api/presets/[presetKey]/route.ts`
- `src/app/api/presets/selector/route.ts`
- `src/app/api/presets/custom/route.ts`
- `src/app/api/presets/validate/route.ts`
- `src/components/presets/*`
- `src/app/admin/presets/page.tsx`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/0005_phase6_platform_presets/migration.sql`
- `tests/unit/preset-service.test.ts`
- `tests/unit/platform-presets-contract.test.ts`
- `tests/integration/phase6-presets-contract.test.ts`
- `tests/e2e/preset-manager.spec.ts`

## Important Constraints

- Presets are data records, not UI-only cards.
- Presets drive output dimensions, background, file format, compression, safe margin, naming, and folder destination.
- Admin preset mutations require `manage:presets`.
- Admin preset mutations must be audited by Codex when connected to persistence.
- Custom presets must be organization-scoped and must not break tenant isolation.
- Folder paths must be ZIP-safe.
- Marketplace copy must not guarantee compliance, approval, ranking, sales, conversion, or ad performance.

## Runtime Work Remaining for Codex

- Validate generated TypeScript.
- Validate Prisma schema.
- Regenerate or repair migration SQL.
- Apply migration.
- Run seed twice.
- Connect admin preset routes to Prisma persistence.
- Add audit logs for preset create/update/archive/reactivate actions.
- Verify preset selector and admin UI in browser.
- Run unit, integration, E2E, typecheck, lint, and build checks.
