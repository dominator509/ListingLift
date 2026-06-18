# PHASE_4_IMPLEMENTATION_NOTES.md

## Phase

Phase 4 — Tenant, Client, RBAC, and Agency Model

## ChatGPT Project Environment Work Completed

This seed advances ListingLift into Phase 4 with codeable server-side access-control contracts. It does not claim runtime completion. Codex must install dependencies, generate Prisma types, validate migrations, run tests, and connect placeholder route responses to real Prisma queries.

## Implemented Artifacts

### Prisma/Data Model

- Added `OrganizationType` enum.
- Added `Organization.organizationType`.
- Added `Organization.parentOrganizationId` hierarchy scaffold.
- Added `Membership.clientId` for client-scoped users.
- Added `Membership.agencyScope` for agency-admin workspace permission gates.
- Added `Client.memberships` relation.
- Added agency white-label fields to `BrandSetting`.
- Added Phase 4 migration scaffold at `prisma/migrations/0003_phase4_tenant_rbac_agency/migration.sql`.

### Domain/Schema Layer

- Added tenant/client/agency policy constants.
- Added agency workspace summary helpers.
- Added RBAC schemas for team invites, membership updates, and permission checks.
- Added agency brand settings schema.
- Extended session context with membership, client, agency, and organization-type scope.

### Service Layer

- Added `rbac-policy-service` with explicit permission and tenant decisions.
- Added `client-access-service` for client/job where-scope builders.
- Added `team-service` with role-escalation prevention.
- Added `organization-service` with organization scoping and slug normalization.
- Added `agency-service` with agency workspace gates and white-label validation.
- Extended session resolution to include membership/client/agency/org-type context.

### API Layer

- Added `/api/rbac/roles`.
- Added `/api/rbac/permissions`.
- Added `/api/organizations/team`.
- Added `/api/agency/clients`.
- Added `/api/agency/brand-settings`.
- Added `/api/clients/[clientId]`.
- Expanded `/api/clients` and `/api/organizations` with scoped request contracts.

### UI Layer

- Added RBAC display components:
  - `PermissionChipList`
  - `RoleMatrixCard`
  - `ClientScopeCard`
- Added admin RBAC shell page at `/admin/rbac`.
- Added admin navigation entry for RBAC.

### Tests

- Added unit RBAC policy contract test.
- Added security role-escalation contract test.
- Added security client-access contract test.
- Added route contract test for RBAC/agency routes.

## Important Implementation Notes for Codex

1. The API routes currently return safe placeholders with scoped `where` objects. Codex must connect these to Prisma queries after validating generated Prisma types.
2. Tenant scoping must happen server-side on every data query. UI hiding is not sufficient.
3. Client-scoped users must never be allowed to query another client’s jobs, files, deliveries, reports, invoices, or revisions.
4. Agency admins must only see clients inside their own organization unless the system later supports explicit parent/child agency orgs.
5. Role assignment must prevent non-super-admin actors from granting equal or higher roles.
6. Revenue, billing, credit adjustment, package management, preset management, integration management, final delivery, and team management require explicit permissions.
7. All permission changes and agency branding changes must be audited once real persistence is connected.

## Runtime Verification Required

Codex must run:

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- rbac
npm run test:security -- rbac tenant-isolation role-escalation client-access
npm run test:integration -- phase4
npm run typecheck
npm run lint
npm run build
```

## Not Marked Complete

Phase 4 is seeded but not complete until Codex validates migrations, compiles TypeScript, connects persistence, and passes tests.
