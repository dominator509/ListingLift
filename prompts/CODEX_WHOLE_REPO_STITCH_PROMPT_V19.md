You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v19.zip`.

Start by reading:
- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `AGENTS.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V19.md`
- `PHASE_17_EXECUTION_RUNBOOK.md`
- `PHASE_17_VERIFICATION_MATRIX.md`

Current advanced seed phase: Phase 17 — Stripe Checkout and Billing.

Your tasks:
1. Stitch the v19 seed into the repository without deleting unrelated user work.
2. Install dependencies and generate lockfile updates.
3. Validate Prisma schema and regenerate the Phase 17 migration if needed.
4. Generate Prisma client and apply migrations in the dev database.
5. Run seed twice and confirm idempotence.
6. Replace seed Stripe checkout draft calls with official Stripe SDK calls in test mode only.
7. Implement raw-body Stripe webhook signature verification and idempotent event processing.
8. Ensure failed payments do not grant access, credits, upload links, jobs, dashboard access, or subscriptions.
9. Ensure paid checkout creates the correct normalized records and audit logs transactionally.
10. Run typecheck, lint, unit, security, integration, E2E where practical, build, and smoke checks.
11. Update `ROADMAP_STATUS.md` and `CODEX_GAPS.md` with real results.

Do not move to Phase 18 until Phase 17 checks pass or the failure is clearly documented with a safe checkpoint.
