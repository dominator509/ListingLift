# PHASE_9_VERIFICATION_MATRIX.md — Job Creation and Admin Queue

| Area | Required Verification | Owner |
|---|---|---|
| Prisma | Schema validates and migration applies cleanly | Codex |
| Seed | Seed can run twice without duplicates or hard failures | Codex |
| Manual job creation | Admin can create manual job from server-side schema only | Codex |
| Tenant isolation | Job query/create/update scopes by organization and client | Codex |
| RBAC | `manage:jobs` and `create:manual-orders` enforced server-side | Codex |
| Status transitions | Invalid transitions rejected unless audited manual override is allowed | Codex |
| Delivery guard | Ready/delivered/completed require admin approval | Codex |
| Deadline warnings | Upcoming/due soon/overdue behavior verified | Codex |
| Queue filters | Filter by status/source/deadline/priority/client | Codex |
| Revenue/source | Payment/source/revenue metadata visible without exposing secrets | Codex |
| Admin notes | Notes sanitized, persisted, and audited | Codex |
| UI | `/admin/jobs` and `/admin/jobs/[jobId]` render | Codex |
| Tests | Unit, security, integration, E2E, typecheck, lint, build pass | Codex |

## Required Commands

```bash
npm run db:validate
npm run db:generate
npm run test:unit -- jobs
npm run test:integration -- jobs
npm run test:security -- job
npm run test:e2e -- admin-job-queue
npm run typecheck
npm run lint
npm run build
```
