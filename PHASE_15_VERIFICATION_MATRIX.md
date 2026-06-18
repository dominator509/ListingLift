# Phase 15 Verification Matrix

| Area | Required Check | Codex Owner |
|---|---|---|
| Prisma | Schema validates and migration applies | Yes |
| Seed | Phase 15 records seed idempotently | Yes |
| RBAC | Only authorized users approve/reject/request revisions | Yes |
| Tenant isolation | Approval/revision queries scoped by organization/client/job | Yes |
| QC gate | Blocking flags prevent job approval | Yes |
| Revision gate | Open revisions prevent final approval | Yes |
| Delivery gate | Approval does not expose downloads | Yes |
| Manual replacement | Replacement does not overwrite original uploads | Yes |
| Audit | Approval/revision/replacement actions logged | Yes |
| UI | Admin/client revision and approval pages render | Yes |
| Tests | Unit, integration, security, E2E, typecheck, lint, build | Yes |
