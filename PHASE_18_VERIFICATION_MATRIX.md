# PHASE_18_VERIFICATION_MATRIX.md — Gumroad Checkout/Webhook Intake

| Area | Required verification | Owner |
|---|---|---|
| Prisma | Schema validates and migration applies | Codex |
| Seed | Gumroad mappings seed twice without duplicates | Codex |
| Webhook signature | Valid signatures pass; missing/mismatched signatures do not auto-process | Codex |
| Dedupe | Duplicate sale ID does not duplicate job/credits/upload link | Codex |
| Mapping | All required Gumroad offer types map correctly | Codex |
| Image pack | Verified purchase creates external order, job, upload token, notification plan | Codex |
| Credit pack | Verified purchase creates credit ledger entry without immediate job | Codex |
| Digital-only | Template/checklist/guide products do not create jobs | Codex |
| Refund/dispute | Refunded/disputed/chargebacked sale blocks access | Codex |
| RBAC | Admin routes require `manage:sales-channels` or equivalent | Codex |
| Audit | Webhook, mapping, client, job, credit, upload-token, and notification actions are audited | Codex |
| UI | `/admin/gumroad` renders in browser | Codex |
| Tests | Unit, security, integration, E2E, typecheck, lint, build pass or safe blockers documented | Codex |
