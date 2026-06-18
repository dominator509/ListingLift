# RBAC and Tenant Isolation

ListingLift requires server-side role-based access control and tenant isolation. UI hiding is not enough.

## Roles

- Super admin
- Operator
- Agency admin
- Client owner
- Client viewer
- Fulfillment reviewer
- Designer/editor
- Billing manager

## Core Rules

1. Every tenant-owned query must include `organizationId` scope unless the actor is an explicitly permitted super admin.
2. Client-scoped roles must also include `clientId` scope.
3. Agency admins can manage only clients inside their organization unless a future agency hierarchy explicitly grants broader scope.
4. Revenue, billing, credit adjustment, integration management, package/preset management, final delivery, and team management all require explicit permissions.
5. Permission changes must be audited.
6. Manual fallback actions that affect paid fulfillment must be audited.
7. Client-facing final downloads must remain hidden until admin approval.

## Server-Side Enforcement Points

- Route handlers must call session resolution.
- Route handlers must call permission checks.
- Services must apply `organizationId` and, where relevant, `clientId` filters.
- Repository helpers must not accept untrusted request-body organization IDs for mutations.
- API tests must prove cross-tenant and cross-client denial.

## Client-Scoped Users

A `CLIENT_OWNER` or `CLIENT_VIEWER` membership may include `clientId`. That client ID locks access to the assigned client account.

Client owners can upload, request revisions, download approved files, view their dashboard, and manage billing. Client viewers can only view/download where permitted.

## Agency Admins

Agency admins require `agencyScope` and `manage:agency-branding` for white-label changes. Agency client lists must be scoped to the active organization.

## Codex Verification

Codex must run RBAC unit, integration, and security tests before marking Phase 4 complete.
