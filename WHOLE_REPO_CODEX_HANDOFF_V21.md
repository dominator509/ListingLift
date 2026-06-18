# WHOLE_REPO_CODEX_HANDOFF_V21.md

## 1. Project Summary

ListingLift is a service-first, software-powered ecommerce product image cleanup and fulfillment platform. This v21 seed advances the repo scaffold through Phase 19: Credits, Subscriptions, Manual Invoices.

## 2. Source Review Completed

ChatGPT unzipped `ListingLift_Repo_Seed_v20.zip` into a fresh v21 working copy and reviewed all Markdown files plus:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

See `CHATGPT_MARKDOWN_REVIEW_INDEX_V21.md`.

## 3. Phase Advanced

Phase 19 — Credits, Subscriptions, Manual Invoices

This advancement is allowed by the user because remaining Phase 18 work requires Codex-only runtime/payment/database verification.

## 4. Major Additions

- `src/domain/credits-subscriptions.ts`
- `src/schemas/credits-subscriptions.ts`
- Credit ledger services
- Credit balance services
- Subscription entitlement services
- Manual invoice services
- Manual payment confirmation services
- Billing entitlement gate service
- Credit/subscription/manual invoice API route contracts
- Admin credits/subscriptions/manual invoice UI shells
- Prisma schema scaffold for manual invoice, manual invoice payment, and subscription entitlement records
- Phase 19 migration placeholder
- Phase 19 unit/security/integration/E2E tests
- Phase 19 docs, runbook, verification matrix, gap handoff, and Codex prompt

## 5. Critical Security Rules

- Never trust client-submitted credit balance, invoice status, subscription status, or entitlement state.
- Every manual credit adjustment must be audited.
- Every manual payment confirmation must require billing permission and be audited.
- Failed, refunded, disputed, duplicate, unverified, void, or reversed payment states must not grant fulfillment access.
- Payment references must be redacted and must not leak to client UI/logs.
- Manual fallback is required, but it must not bypass RBAC, tenant isolation, or audit trails.

## 6. Codex Required Work

Codex must:

1. Stitch this v21 seed into the actual repo carefully.
2. Validate and repair Prisma schema.
3. Regenerate/repair Phase 19 migration SQL.
4. Generate Prisma client.
5. Apply migrations in development.
6. Run seed twice.
7. Wire all Phase 19 route contracts to real Prisma transactions.
8. Enforce RBAC and tenant/client/agency scope.
9. Add transactional audit logging for all billing/credit/manual invoice mutations.
10. Run all relevant checks and update `ROADMAP_STATUS.md` with real results.

## 7. Do Not Claim Complete Until

- Prisma validates.
- Migrations apply.
- Seeds are repeatable.
- Unit/security/integration/E2E tests pass.
- Typecheck/lint/build pass.
- Browser checks pass.
- Credits, manual invoices, and subscription entitlements are server-derived and audited.

## 8. Files to Review First

- `CODEX_GAPS.md`
- `ROADMAP_STATUS.md`
- `PHASE_19_EXECUTION_RUNBOOK.md`
- `PHASE_19_VERIFICATION_MATRIX.md`
- `docs/credits-subscriptions-manual-invoices.md`
- `docs/phase19-gap-handoff.md`
- `REPO_FILE_MANIFEST_V21.md`

## 9. Next Planned Phase

Phase 20 — Fiverr Workflow
