You are Codex implementing ListingLift from the ChatGPT Project Mode repo seed.

Use `ListingLift_Repo_Seed_v9.zip`.

Start by reading:

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `PHASE_7_IMPLEMENTATION_NOTES.md`
- `PHASE_7_EXECUTION_RUNBOOK.md`
- `PHASE_7_VERIFICATION_MATRIX.md`
- `WHOLE_REPO_CODEX_HANDOFF_V9.md`

Current seeded phase: Phase 7 — Sales Channel Normalization Layer.

Important context:

- Phases 0–6 are seeded but not runtime-verified.
- Phase 7 is seeded but not complete.
- Do not claim tests passed unless you run them.
- Do not mark any phase complete unless acceptance criteria are met.
- Do not call real integrations unless explicitly feature-flagged.
- Do not scrape private marketplace pages.
- Do not store marketplace passwords.
- Manual fallback is mandatory.
- RBAC and tenant isolation must be server-side.

Before editing, state:

1. Current roadmap phase.
2. Current task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks to run after changes.

Then stitch the v9 seed into the repo.

Phase 7 work to complete:

1. Validate and repair TypeScript imports.
2. Validate and repair Prisma schema.
3. Regenerate or repair `prisma/migrations/0006_phase7_sales_channel_normalization/migration.sql`.
4. Generate Prisma client.
5. Apply migrations.
6. Run seed twice and verify idempotency.
7. Connect sales-channel normalization routes to Prisma transactions:
   - normalize payload.
   - resolve sales channel.
   - prevent duplicate external order.
   - match/create client.
   - create external order.
   - create job.
   - record revenue attribution.
   - record audit log.
8. Replace external-order demo UI data with tenant-scoped data, filters, pagination, empty states, and error states where practical.
9. Verify all required channels exist in adapter registry.
10. Verify manual fallback exists for every channel.
11. Verify real integrations are disabled by default.
12. Run tests and fix failures.
13. Update `ROADMAP_STATUS.md` with real files changed, checks run, results, known issues, deviations, and commit-style history.
14. Commit if git is available using: `phase-7: sales channel normalization layer`.

Required checks:

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run test:unit -- sales-channel-normalization
npm run test:unit -- order-client-matching
npm run test:unit -- revenue-attribution
npm run test:integration -- phase7-external-order-normalization
npm run test:adapter-contract -- sales-channel-adapter-registry
npm run test:security -- sales-channel-marketplace-safety
npm run typecheck
npm run lint
npm run build
```

Stop after a clean Phase 7 checkpoint unless explicitly instructed to continue.
