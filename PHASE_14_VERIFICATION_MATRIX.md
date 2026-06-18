# PHASE_14_VERIFICATION_MATRIX.md

| Area | Required check | Owner |
|---|---|---|
| Prisma | Validate schema, generate client, apply migration | Codex |
| Seed | Run seed twice without duplicates | Codex |
| QC domain | Flag definitions cover required checklist | Codex |
| QC service | Blocker flags block final delivery | Codex |
| Flagging | Create, acknowledge, resolve, dismiss flags | Codex |
| Manual fallback | Manual replacement required for failed mask/missing parts | Codex |
| Access | Client cannot see flagged/failed/admin-only output data | Codex |
| Audit | QC mutations create audit logs/events | Codex |
| UI | `/admin/quality-control`, `/admin/flagged-outputs`, `/admin/jobs/[jobId]/quality` render | Codex |
| Tests | Unit, security, integration, E2E, typecheck, lint, build | Codex |

## Required commands

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- quality
npm run test:security -- quality
npm run test:integration -- phase14
npm run test:e2e -- quality-control
npm run typecheck
npm run lint
npm run build
```

No automated test may require real paid image-provider keys.
