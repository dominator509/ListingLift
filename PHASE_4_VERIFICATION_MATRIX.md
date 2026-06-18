# PHASE_4_VERIFICATION_MATRIX.md

| Area | Check | Expected Result | Codex Required |
|---|---|---|---|
| Prisma | `prisma validate` | Schema validates with org hierarchy and membership client scope | Yes |
| Prisma | Migration applies | Phase 4 migration applies cleanly | Yes |
| Seed | Demo agency admin | Seed creates agency admin membership with agencyScope | Yes |
| Seed | Demo client owner | Seed creates client owner with clientId scope | Yes |
| RBAC | Permission matrix | Roles map to required permissions | Yes |
| RBAC | Role escalation | Non-super-admin cannot grant equal/higher role | Yes |
| Tenant isolation | Cross-org access | Cross-org requests are denied server-side | Yes |
| Client isolation | Cross-client access | Client user cannot access another client | Yes |
| Agency scope | Agency clients | Agency admin only sees organization clients | Yes |
| Revenue | Revenue routes | Requires `view:revenue` | Yes |
| Billing | Billing routes | Requires `manage:billing` or scoped client billing rules | Yes |
| Team | Team mutations | Requires `manage:team` and audits changes | Yes |
| Branding | Agency branding | Requires `manage:agency-branding` and audits changes | Yes |
| Routes | Placeholder routes | Replaced or connected to Prisma safely | Yes |
| Tests | Unit/security/integration | Relevant Phase 4 tests pass | Yes |
| Build | TypeScript/build | Typecheck/lint/build pass | Yes |
