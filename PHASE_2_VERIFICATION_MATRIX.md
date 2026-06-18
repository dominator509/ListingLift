# PHASE_2_VERIFICATION_MATRIX.md

## ChatGPT-Coded Checks

| Area | Status | Notes |
|---|---|---|
| Required core models represented | Seeded | Must be validated by Prisma. |
| Role and permission registry | Seeded | Must be generated and seeded by Codex. |
| Required sales channel keys | Seeded | Covered by `db-defaults-contract.test.ts`. |
| Required package keys | Seeded | Covered by `db-defaults-contract.test.ts`. |
| Required preset keys | Seeded | Covered by `db-defaults-contract.test.ts`. |
| Tenant indexes/scoping | Seeded | Covered by schema contract tests and must be reviewed by Codex. |
| Secret storage | Seeded | `EncryptedSecret.ciphertext` only; Codex must verify. |
| Migration SQL | Scaffolded | Codex must regenerate/verify with installed Prisma. |

## Codex-Only Checks

| Command | Required Result |
|---|---|
| `npm run db:validate` | Prisma schema valid. |
| `npm run db:generate` | Prisma client generated. |
| `npm run db:migrate` | Migration applies cleanly. |
| `npm run db:seed` twice | Seed is idempotent except audit-run log if intentionally retained. |
| `npm run test:migration` | Migration/schema check passes. |
| `npm run test:integration -- db` | DB contract/default tests pass. |
| `npm run test:security` | Tenant and secret checks pass. |
| `npm run typecheck` | Types compile. |
| `npm run lint` | Lint passes. |

## Blocker Conditions

Do not mark Phase 2 complete if:

- Prisma schema fails validation.
- Migration cannot apply.
- Seed creates duplicate default records.
- External orders cannot link to jobs.
- Tenant-critical queries lack organization scoping.
- Plaintext token/API secret fields are added.
