# Phase 19 Gap Handoff for Codex

The ChatGPT seed includes contracts and scaffold code only. Codex must complete runtime wiring.

## Gaps

- Prisma schema validation is not run.
- Migration SQL is scaffolded and must be regenerated or repaired.
- Routes use seed/dry-run behavior and must be wired to Prisma.
- Credit balances must be derived from persisted ledger rows.
- Manual invoice confirmation must be transactional.
- Subscription entitlement resets need a real scheduled/server process later.
- RBAC and tenant isolation must be enforced server-side.
- UI pages must be browser-tested.

## Critical security gaps to close

- Do not trust client-submitted credit balance or invoice status.
- Do not allow manual payment confirmation without `manage:billing`.
- Do not allow credit adjustment without `adjust:credits` or equivalent.
- Do not leak payment references, invoice evidence, webhook payloads, or secrets.
- Do not grant paid access for failed, refunded, disputed, duplicate, unverified, or void invoice states.
