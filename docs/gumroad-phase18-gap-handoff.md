# Gumroad Phase 18 Gap Handoff

## ChatGPT completed

- Gumroad domain constants.
- Gumroad Zod schemas.
- Signature helper scaffold.
- Product mapping service.
- Purchase intake planning service.
- Webhook processing plan service.
- Dry-run route contracts.
- Admin UI panels.
- Prisma schema and migration scaffold.
- Unit, security, integration, and E2E test scaffolds.

## Codex must complete

- Confirm Gumroad webhook signing behavior for the production account/configuration.
- Wire webhook route to raw-body verification in the chosen framework runtime.
- Persist `GumroadWebhookEvent` transactionally.
- Dedupe sale IDs at the database layer.
- Persist and administer `GumroadProductMapping` records.
- Match/create clients server-side.
- Create external orders, jobs, upload tokens, credit ledger entries, and admin notifications transactionally.
- Audit every mutation and manual override.
- Verify tests and browser routes in the real repo.
