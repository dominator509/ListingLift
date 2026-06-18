# Phase 22 Verification Matrix — Taskrabbit Workflow

| Area | Check | Owner |
|---|---|---|
| Schema | Prisma validates after Taskrabbit models/enums | Codex |
| Migration | Real migration generated/applied | Codex |
| Seed | Taskrabbit mappings seed idempotently | Codex |
| Intake | Admin can create manual Taskrabbit job | Codex |
| Dedupe | Duplicate task IDs cannot create duplicate jobs | Codex |
| Data | Task ID, customer, category, appointment/deadline, value, conversion status stored | Codex |
| RBAC | Only permitted admin/operator roles can create/update Taskrabbit records | Codex |
| Safety | No scraping, password storage, or unauthorized messaging automation | Codex |
| Delivery | Delivery copy gated to approved archives only | Codex |
| Conversion | Direct-retainer conversion tracked safely | Codex |
| UI | Taskrabbit admin pages render | Codex |
| Tests | Unit/security/integration/E2E/typecheck/lint/build pass | Codex |
