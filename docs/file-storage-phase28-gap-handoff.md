# Phase 28 Gap Handoff

## What ChatGPT Project Mode Could Code

- Domain provider registry.
- Zod schemas.
- Adapter contracts.
- Mock/local/Google Drive/Dropbox scaffolds.
- Policy, access, connection, import, export, health, and audit planning services.
- Route contracts.
- Admin UI shells.
- Prisma model scaffolds.
- Tests and docs.

## What Codex Must Complete

- Install dependencies.
- Validate and regenerate Prisma migrations.
- Wire Prisma client types.
- Implement storage persistence, streaming, and signed access.
- Connect encrypted secrets.
- Implement official Google Drive and Dropbox calls where enabled.
- Add rate limits and audit logs.
- Run full checks.

## Stop Conditions

Do not ship if:

- Original uploads can be overwritten.
- Provider secrets are visible in frontend responses or logs.
- Client downloads can access unapproved archives.
- ZIP delivery exports can include flagged/rejected/pending files.
- Real integrations work without explicit feature flags.
