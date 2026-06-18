You are Codex implementing ListingLift.

Use `ListingLift_Repo_Seed_v8.zip` as the current seed package. Stitch it into the actual repository carefully.

Current ChatGPT-seeded scope now includes Phase 0 through Phase 6. No phase is runtime-complete until you verify it in the actual repo.

Primary current phase to verify: Phase 6 — Platform Preset System.

Before editing, report:
1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks to run after the change.

Required Phase 6 actions:
- Preserve existing user-authored code.
- Validate TypeScript and imports.
- Validate Prisma schema.
- Regenerate or repair `prisma/migrations/0005_phase6_platform_presets/migration.sql`.
- Generate Prisma client.
- Apply migrations.
- Run seed twice and verify all required platform presets exist.
- Connect admin preset mutation routes to Prisma persistence.
- Enforce `manage:presets` server-side.
- Audit preset create/update/archive/reactivate actions.
- Verify custom presets are organization-scoped and tenant-isolated.
- Verify preset folder paths are ZIP-safe.
- Verify marketplace-safe wording does not guarantee compliance, approval, ranking, sales, conversions, or ad performance.
- Run relevant unit, integration, E2E, typecheck, lint, and build checks.
- Update `ROADMAP_STATUS.md` with true command results.

Run at minimum:

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- preset
npm run test:integration -- phase6-presets
npm run test:e2e -- preset-manager
npm run typecheck
npm run lint
npm run build
```

Do not claim production readiness unless all critical checks pass. If a check fails, fix it or document the blocker in `CODEX_GAPS.md` and `ROADMAP_STATUS.md`.
