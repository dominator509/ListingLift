You are Codex stitching ListingLift_Repo_Seed_v12 into the real repository.

Start by reading:

- ARCHITECTURE.md
- BUILD_ROADMAP.md
- ROADMAP_STATUS.md
- CODEX_GAPS.md
- WHOLE_REPO_CODEX_HANDOFF_V12.md
- PHASE_10_IMPLEMENTATION_NOTES.md
- PHASE_10_EXECUTION_RUNBOOK.md
- PHASE_10_VERIFICATION_MATRIX.md

Current seed phase: Phase 10 — Image Processing Provider Layer.

Before editing, report:

1. Current roadmap phase.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run.

Stitch the seed carefully. Preserve existing repo changes. Do not blindly overwrite active work.

Phase 10 priorities:

- Validate image provider registry and adapter contracts.
- Keep mock provider working without paid keys.
- Keep real providers disabled by default.
- Enforce `REAL_IMAGE_PROVIDER_CALLS_ENABLED` and provider-specific flags.
- Ensure provider secrets are stored only as encrypted secret references.
- Ensure no provider secret can reach frontend responses, logs, snapshots, or seed data.
- Normalize provider errors and preserve manual fallback.
- Wire provider config persistence to Prisma only after schema validation.
- Regenerate/verify migration SQL.
- Update ROADMAP_STATUS.md with real command results.

Run:

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

Do not mark Phase 10 complete until all acceptance criteria pass or blockers are documented.
Do not advance to Phase 11 until Phase 10 is clean.
