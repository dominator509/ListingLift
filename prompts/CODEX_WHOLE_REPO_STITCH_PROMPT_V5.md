You are Codex implementing ListingLift from the v5 repo seed.

Start by reading:
- ARCHITECTURE.md
- BUILD_ROADMAP.md
- ROADMAP_STATUS.md
- CODEX_GAPS.md
- WHOLE_REPO_CODEX_HANDOFF_V5.md
- PHASE_3_EXECUTION_RUNBOOK.md
- PHASE_3_VERIFICATION_MATRIX.md

Current ChatGPT advancement: Phase 3 — Authentication and Sessions has been seeded but not runtime-verified.

Before editing, report:
1. Current phase.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to be created or modified.
5. Tests/checks to run.

Stitch v5 into the actual repository. Preserve source-of-truth docs. Do not weaken architecture, marketplace safety, tenant isolation, RBAC, manual fallback, or admin approval rules.

Required work:
- Install dependencies.
- Validate Prisma schema.
- Generate Prisma client.
- Generate/apply migration including Session model.
- Run seed twice.
- Verify signup/login/logout/session/account routes.
- Verify protected dashboard middleware.
- Verify password hashes are never returned.
- Verify session tokens are stored as hashes.
- Verify HTTP-only cookie behavior.
- Run required tests and build checks.
- Fix failures before moving forward.
- Update ROADMAP_STATUS.md with exact results.

Required commands:

npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run test:unit -- auth
npm run test:security -- auth
npm run test:integration -- auth
npm run typecheck
npm run lint
npm run build

Run npm run test:e2e -- auth if the runtime supports it.

Do not mark Phase 3 complete unless acceptance criteria are actually met. If blocked, document the blocker in ROADMAP_STATUS.md and CODEX_GAPS.md.

Do not start Phase 4 until Phase 3 is complete or explicitly authorized after a clean checkpoint.
