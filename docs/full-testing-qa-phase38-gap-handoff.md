# Full Testing and QA Phase 38 Gap Handoff

## Package

ListingLift Repo Seed v40

## Current state

Phase 38 scaffolds QA plans, command sequences, smoke targets, coverage matrices, evidence ledger draft contracts, admin UI shells, admin API route contracts, Prisma models, and tests.

No runtime QA was performed in ChatGPT Project Mode.

## Codex must complete

1. Install dependencies.
2. Validate environment.
3. Validate Prisma schema.
4. Repair/regenerate migrations.
5. Generate Prisma client.
6. Apply migrations.
7. Run seed twice.
8. Run typecheck and lint.
9. Run unit/security/integration/adapter-contract/E2E tests.
10. Run dependency/security checks.
11. Run production build.
12. Run smoke checks.
13. Browser-render critical pages.
14. Wire QA ledger to real Prisma persistence and evidence references.
15. Update `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, and `PHASE_38_VERIFICATION_MATRIX.md` with actual results.

## Critical unresolved gaps

- Dependencies are not installed.
- Prisma schema is not validated.
- Migration SQL is scaffold-only.
- Prisma client is not generated.
- Database migrations are not applied.
- Seed idempotency is not verified.
- Typecheck/lint/tests/build/smoke/browser checks are not run.
- QA admin routes are dry-run contract routes.
- QA ledger is not persisted.
- Browser rendering is unverified.
- Many prior phase routes remain dry-run contracts until Codex wires real persistence, auth, RBAC, tenant isolation, audit logs, rate limits, billing gates, token gates, and approval gates.

## Required guardrails

- Keep real integrations disabled by default.
- Never commit secrets.
- Never expose provider keys to frontend.
- Never store marketplace passwords.
- Store tokens only as hashes.
- Preserve original uploads.
- Reject unsafe uploads.
- Prevent ZIP slip.
- Verify webhooks before paid/client-facing state changes.
- Rate-limit sensitive routes.
- Audit paid/client-facing/manual override/security/API/agency/QA actions with redacted metadata.
- Never expose final downloads before approval.
- Never guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.

## No production claim allowed until

- `npm run test-all` or the equivalent command sequence is run successfully.
- All failures are fixed or explicitly documented.
- Browser rendering is verified.
- Prisma and seed are verified.
- Security gates are verified.
- QA evidence is recorded without leaking secrets.
