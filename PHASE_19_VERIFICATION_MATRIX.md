# Phase 19 Verification Matrix

| Area | Check | Owner |
|---|---|---|
| Prisma | Validate schema and migration | Codex |
| Seed | Repeat seed twice without duplicates | Codex |
| Credits | Ledger balance derives from rows, not client input | Codex |
| Credits | Manual adjustments require permission and audit | Codex |
| Credits | Credit debits cannot drive balance negative | Codex |
| Subscriptions | Entitlements derive from verified subscription/manual state | Codex |
| Subscriptions | Inactive subscriptions do not grant allowance | Codex |
| Manual invoices | Invoice creation is tenant-scoped and audited | Codex |
| Manual payments | Confirmation updates invoice/payment/credits atomically | Codex |
| Security | Failed/refunded/unverified payments do not grant access | Codex |
| Security | Payment references are redacted in UI/logs | Codex |
| UI | `/admin/credits`, `/admin/subscriptions`, `/admin/billing/manual-invoices` render | Codex |
| Tests | Unit, integration, security, E2E, typecheck, lint, build pass | Codex |
