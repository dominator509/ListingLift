# PHASE_36_VERIFICATION_MATRIX.md

| Area | Requirement | ChatGPT Status | Codex Required Verification |
|---|---|---:|---|
| Markdown review | Review v37 repo Markdown plus source docs | Done | Confirm no source-of-truth conflicts before stitching |
| Roadmap | Advance from Phase 35 to Phase 36 | Done | Confirm v38 roadmap after stitch |
| API scopes | Define all Phase 36 scopes | Scaffolded | Run unit/type tests and enforce server-side |
| Token issue | Generate raw token and hash record draft | Scaffolded | Persist hash only; show raw token once; no raw token in DB/logs |
| Token verify | Hash presented bearer token and compare safely | Scaffolded | Replace dry-run route context with Prisma lookup |
| Token revoke | Revoke token draft | Scaffolded | Transactional tenant-scoped revoke and audit |
| Plan gate | Evaluate plan/scope/token/payment state | Scaffolded | Derive from verified billing/subscription records |
| Admin UI | API access dashboard pages | Scaffolded | Browser render and RBAC guard verification |
| Admin API routes | `/api/admin/api-access/*` contracts | Scaffolded | Auth, `manage:api-access`, tenant isolation, rate limits, audit logs |
| External API routes | `/api/v1/*` contracts | Scaffolded | Real bearer auth, scope checks, tenant data, safe responses |
| Shared upload portal | Hash-only expiring portal token draft | Scaffolded | Upload safety, max file limits, expiry, tenant/client/job scope, original preservation |
| Webhook management | Subscription draft and catalog | Scaffolded | Signing secrets, retries, dead letters, endpoint validation, rate limits |
| Advanced integrations | Zapier/Make/n8n/custom API catalog | Scaffolded | Feature flags, encrypted secrets, provider verification |
| Prisma schema | Models/enums added | Scaffolded | `prisma validate`, migration repair/regeneration, apply migration |
| Tests | Unit/security/integration/E2E scaffolds | Added | Run Vitest/Playwright and repair failures |
| Secrets | No hardcoded real secrets intended | Static scan only | Confirm no leaks, no frontend secret exposure |
| Build | Next build | Not run | `npm run build` |
| Typecheck | TypeScript | Not run | `npm run typecheck` |
| Lint | ESLint | Not run | `npm run lint` |
| Browser | Page rendering | Not run | Manual/Playwright browser verification |
| Security | Token/RBAC/rate/audit/security | Scaffolded | Full security test suite and manual review |
| Claims | No guarantees | Scaffolded | Scan UI/docs/responses for unsafe guarantee copy |

## ChatGPT Verification Notes

The v38 seed includes static checks only. Runtime verification belongs to Codex because this environment did not install dependencies, generate Prisma client, apply migrations, start Next.js, or run browser tests.
