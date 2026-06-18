# PHASE_4_EXECUTION_RUNBOOK.md

## Current Phase

Phase 4 — Tenant, Client, RBAC, and Agency Model

## Objective

Implement multi-tenant organization scope, client-specific access control, role-permission enforcement, agency workspace behavior, and role-escalation prevention.

## Codex Pre-Change Report Required

Before editing, Codex must state:

1. Current roadmap phase: Phase 4.
2. Current roadmap task: tenant/client/RBAC/agency implementation and runtime validation.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after changes.

## Step 1 — Inspect Existing Repo

- Confirm whether the actual repo already contains Phase 0–3 changes.
- Compare current repo files against `REPO_FILE_MANIFEST_V6.md`.
- Do not overwrite user changes blindly.
- Preserve canonical docs.

## Step 2 — Validate Prisma Model

- Run `npm run db:validate`.
- Fix schema issues from `OrganizationType`, organization hierarchy, membership client scope, and brand-setting fields.
- Regenerate the Phase 4 migration if Prisma rejects the scaffold SQL.
- Run `npm run db:generate`.

## Step 3 — Connect Session Scope

Verify session resolution returns:

- `userId`
- `organizationId`
- `role`
- `membershipId`
- `clientId`
- `agencyScope`
- `organizationType`

Do not trust client-provided organization or client IDs when creating or mutating scoped records.

## Step 4 — Enforce Permissions and Tenant Isolation

- Use RBAC services for every sensitive route.
- Add `organizationId` filter to all tenant-owned queries.
- Add `clientId` filter for client-scoped roles.
- Confirm super admin behavior is explicitly intended on every global action.
- Confirm revenue endpoints require `view:revenue`.
- Confirm delivery endpoints require `send:delivery` or `download:files` depending on action.

## Step 5 — Connect Placeholder Routes to Prisma

Connect these routes to real persistence:

- `/api/rbac/roles`
- `/api/rbac/permissions`
- `/api/organizations`
- `/api/organizations/team`
- `/api/clients`
- `/api/clients/[clientId]`
- `/api/agency/clients`
- `/api/agency/brand-settings`

Every mutation must write an `AuditLog` record.

## Step 6 — Run Tests

Run at minimum:

```bash
npm run test:unit -- rbac
npm run test:security -- tenant role-escalation client-access
npm run test:integration -- phase4
npm run typecheck
npm run lint
npm run build
```

## Step 7 — Update ROADMAP_STATUS.md

Codex must update:

- Current Phase
- Current Task
- Phase Checklist
- Acceptance Criteria
- Implementation Log
- Files Changed
- Tests/Checks Run
- Test Results
- Known Issues
- Deviations
- Commit-Style History

## Stop Condition

Stop at a clean checkpoint after Phase 4 validation or a clearly documented blocker. Do not proceed to Phase 5 unless Phase 4 is either complete or the project owner explicitly authorizes advancement past a blocker.
