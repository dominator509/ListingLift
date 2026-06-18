# PHASE_30_VERIFICATION_MATRIX.md

| Area | Required verification |
|---|---|
| Prisma | `prisma validate`, migration generation, migration apply, seed twice |
| RBAC | Only integration managers/admins can manage providers and exports |
| Tenant isolation | Connections, deliveries, exports, tasks scoped by organization |
| Secrets | No plaintext tokens in DB, logs, frontend, tests, seed data, or responses |
| Payload safety | No raw files, signed URLs, delivery tokens, private notes, or credentials in exports |
| Feature flags | Real Slack/email/Sheets/Airtable/Trello/ClickUp/Asana/Notion calls disabled by default |
| Manual fallback | Provider failure creates operator fallback and does not block fulfillment |
| UI | Admin pages render for providers, exports, tasks, templates, health |
| Tests | Unit, security, integration, E2E, typecheck, lint, build |
