You are Codex implementing ListingLift from Repo Seed v20.

Start by inspecting the repository and this seed package. Stitch the seed carefully; do not blindly overwrite local work without checking diffs.

Current seeded phase: Phase 18 — Gumroad Checkout/Webhook Intake.

Important:
- Prior phases 0–17 are scaffolded but not complete until runtime checks pass.
- Continue to preserve roadmap order in ROADMAP_STATUS.md.
- It is acceptable that ChatGPT advanced scaffolds ahead of runtime verification, but Codex must not mark phases complete until tests/checks pass.

Phase 18 tasks:
1. Install dependencies and update lockfile if needed.
2. Run typecheck/lint/tests and repair issues.
3. Validate Prisma schema and regenerate/apply Phase 18 migration.
4. Run seed twice.
5. Wire Gumroad webhook signature verification using the actual configured mechanism.
6. Persist Gumroad webhook events, product mappings, external orders, jobs, credit ledger entries, upload-token creation, and notifications transactionally.
7. Enforce duplicate sale prevention.
8. Ensure refunded/disputed/unverified/unmapped sales cannot grant access.
9. Audit every Gumroad mutation and manual fallback.
10. Verify /admin/gumroad and relevant API routes in browser/runtime.
11. Update CODEX_GAPS.md and ROADMAP_STATUS.md with real results.

Required checks where practical:
- npm run typecheck
- npm run lint
- npm run test:unit -- gumroad
- npm run test:security -- gumroad
- npm run test:integration -- gumroad
- npm run test:e2e -- gumroad-intake
- npm run db:validate
- npm run build

Stop at a clean checkpoint if any critical security, auth, tenant, webhook, upload-token, payment, or migration check fails.
