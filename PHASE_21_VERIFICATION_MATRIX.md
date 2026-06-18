# PHASE_21_VERIFICATION_MATRIX.md

| Area | Required Verification | Owner |
|---|---|---|
| Prisma | Schema validates and migration applies cleanly | Codex |
| Seed | Upwork mappings/templates seed idempotently with fake IDs | Codex |
| Manual contract intake | Creates/matches client, external order, job, upload token, event, and audit log transactionally | Codex |
| Dedupe | Same Upwork contract ID cannot create duplicate jobs | Codex |
| RBAC | Only authorized users can create contracts, mappings, revisions, and delivery records | Codex |
| Tenant isolation | Upwork contracts are organization-scoped | Codex |
| Proposal template | Contains safe non-guarantee language | Codex |
| Delivery template | Uses approved archive only and safe Upwork language | Codex |
| Revisions | Open revisions block completion | Codex |
| Retainers | Reminder is manual-only and audited | Codex |
| Marketplace safety | No scraping, no password storage, no unauthorized messaging automation | Codex |
| UI | `/admin/upwork`, `/admin/upwork/contract-intake`, `/admin/upwork/proposals`, `/admin/upwork/delivery`, `/admin/upwork/revisions`, `/admin/upwork/retainers` render | Codex |
| Tests | Unit, integration, security, E2E, typecheck, lint, build pass | Codex |
