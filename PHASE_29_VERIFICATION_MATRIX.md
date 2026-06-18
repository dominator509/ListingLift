# Phase 29 Verification Matrix — Automation Webhooks

| Area | Required check | Owner |
|---|---|---|
| Prisma | Schema validates and migration applies | Codex |
| Seed | Seed runs twice without duplicates | Codex |
| Mock adapter | Works without external API keys | Codex |
| Feature flags | Real dispatch disabled by default | Codex |
| Secret safety | No webhook secrets exposed | Codex |
| Payload safety | Redacts emails/secrets/tokens/signed URLs | Codex |
| Signature | HMAC signing and verification pass | Codex |
| Rate limits | Dispatch/test/retry routes rate-limited | Codex |
| RBAC | Manage integrations required for subscription changes | Codex |
| Tenant isolation | Subscriptions/events scoped by organization | Codex |
| Dead letter | Failed dispatch creates manual fallback | Codex |
| Delivery gate | No unapproved delivery link is sent | Codex |
| UI | Admin automation pages render | Codex |
| Tests | Unit/security/integration/E2E/typecheck/lint/build pass | Codex |
