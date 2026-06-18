You are Codex implementing ListingLift from Repo Seed v4.

Current target: Phase 2 — Database Schema and Migrations.

Before editing, inspect the repo and state:
1. Current roadmap phase.
2. Current task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run.

Use these files as current handoff authority:
- WHOLE_REPO_CODEX_HANDOFF_V4.md
- CODEX_GAPS.md
- ROADMAP_STATUS.md
- PHASE_2_EXECUTION_RUNBOOK.md
- PHASE_2_VERIFICATION_MATRIX.md
- ARCHITECTURE.md
- BUILD_ROADMAP.md

Stitch v4 into the actual repository. Preserve existing user work and document any conflict before overwriting.

Focus on Phase 2 only:
- Validate and repair prisma/schema.prisma.
- Generate or verify migration SQL.
- Run migration.
- Run seed twice and confirm idempotency.
- Run database, security, typecheck, lint, and build checks.
- Fix failures.
- Update ROADMAP_STATUS.md and CODEX_GAPS.md with real results.

Do not implement Phase 3 auth unless a compile failure requires a small compatibility adjustment. Do not enable real integrations. Do not add secrets. Do not mark production ready.

Required commands:

npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run test:migration
npm run test:integration -- db
npm run test:unit
npm run test:security
npm run typecheck
npm run lint
npm run build

If a command fails, fix the failure before continuing. If blocked by environment, document the exact blocker in ROADMAP_STATUS.md and CODEX_GAPS.md.

Commit-style entry when complete or checkpointed:
phase-2: database schema and migrations
