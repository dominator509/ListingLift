# Phase 19 Execution Runbook — Credits, Subscriptions, Manual Invoices

## Current phase

Phase 19 — Credits, Subscriptions, Manual Invoices

## Before coding in Codex

1. Read `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, and this runbook.
2. Inspect the existing repo and compare it to `ListingLift_Repo_Seed_v21`.
3. Preserve all prior phases and do not mark them complete until real checks pass.

## Required implementation sequence

1. Validate Prisma schema and repair Phase 19 model relations if needed.
2. Generate/repair migration SQL for manual invoices, manual invoice payments, subscription entitlements, and credit ledger metadata.
3. Generate Prisma client and apply migrations in a safe dev database.
4. Wire credit routes to tenant-scoped Prisma queries.
5. Wire manual invoice routes to audited transactions.
6. Wire manual payment confirmation to `ManualInvoice`, `InvoicePayment`, `CreditLedger`, and `AuditLog` updates in one transaction.
7. Wire subscription entitlement routes to verified Stripe/Gumroad/manual state only.
8. Enforce RBAC: `manage:billing`, `adjust:credits`, `view:revenue`, `manage:jobs`, and client/agency scope.
9. Run unit, integration, security, E2E, typecheck, lint, build, Prisma validate, and seed checks.
10. Update `ROADMAP_STATUS.md` with real results.

## Stop conditions

Stop and fix before advancing if credit adjustments are unaudited, failed payments grant access, client-submitted balances are trusted, manual invoice payments lack authorization, tenant isolation fails, or secrets/payment references leak.
