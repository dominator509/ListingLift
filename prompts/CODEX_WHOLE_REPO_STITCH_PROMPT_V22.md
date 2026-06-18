You are Codex stitching ListingLift Repo Seed v22 into the real repository.

Use `ListingLift_Repo_Seed_v22.zip` as the seed package.

Current seed phase: Phase 20 — Fiverr Workflow.

Before editing:
1. Inspect the current repository.
2. Read `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V22.md`, `PHASE_20_EXECUTION_RUNBOOK.md`, and `PHASE_20_VERIFICATION_MATRIX.md`.
3. State current phase, task, acceptance criteria, expected files, and tests/checks to run.

Implementation requirements:
- Preserve roadmap order in `ROADMAP_STATUS.md`.
- Stitch seed files carefully; do not overwrite unrelated work blindly.
- Wire Phase 20 dry-run Fiverr routes to Prisma transactions only after validating schema/migrations.
- Enforce server-side auth, RBAC, and tenant isolation.
- Dedupe Fiverr orders by Fiverr order ID/dedupe key.
- Persist Client, ExternalOrder, Job, UploadToken plan, FiverrWorkflowEvent, and AuditLog transactionally.
- Keep Fiverr workflow manual-first.
- Do not scrape Fiverr private pages.
- Do not store Fiverr passwords.
- Do not automate Fiverr buyer messaging unless an approved integration exists.
- Do not expose final delivery until QC, approval, delivery archive, and delivery-token gates pass.
- Use marketplace-safe wording only.

Run checks:
- npm run typecheck
- npm run lint
- npm run test -- fiverr
- npm run test:security -- fiverr
- npm run test:integration -- fiverr
- npm run test:e2e -- fiverr-manual-order
- npm run build
- npm run test:migration
- npm run verify-env
- npm run security-check

After work:
1. Update `ROADMAP_STATUS.md` with real files changed and tests run.
2. Fix failures before advancing.
3. Do not mark Phase 20 complete unless acceptance criteria and checks pass.
4. If git is available, commit with: `phase-20: add fiverr workflow`.
