# PHASE_17_VERIFICATION_MATRIX.md

| Area | Required check | Owner |
|---|---|---|
| Stripe checkout | Package checkout creates test-mode Stripe Checkout Session | Codex |
| Prices | Client-submitted amount ignored | Codex |
| Subscriptions | Retainer/agency subscription checkout uses subscription mode | Codex |
| Credits | Paid credit checkout creates ledger entry only after verified payment | Codex |
| Webhooks | Stripe signature verified from raw body | Codex |
| Idempotency | Duplicate event ID ignored safely | Codex |
| Failed payments | No access, credits, upload links, or subscriptions granted | Codex |
| Secrets | No Stripe secret in frontend/logs/responses/tests | Codex |
| Manual fallback | Manual invoice/payment fallback remains available | Codex |
| UI | `/admin/billing`, `/admin/billing/stripe`, `/client/billing`, `/agency/billing` render | Codex |
| Tests | Unit/security/integration/E2E/typecheck/lint/build pass | Codex |
