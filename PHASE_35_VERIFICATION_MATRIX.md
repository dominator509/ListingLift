# PHASE_35_VERIFICATION_MATRIX.md

| Area | Required verification | Status in v37 seed |
|---|---|---|
| Markdown review | v36 repo Markdown plus project source docs reviewed before coding | Done in ChatGPT Project Mode |
| Roadmap status | Phase 35 selected after Phase 34 remaining work was Codex-only | Done in ChatGPT Project Mode |
| Agency dashboard | Dashboard shell and summary service scaffolded | Seeded, not runtime-verified |
| Client workspaces | Workspace rows, filters, schemas, page, and route contracts scaffolded | Seeded, not Prisma-backed |
| White-label settings | Brand settings preview and manual-review notices scaffolded | Seeded, not persisted |
| Branded delivery | Delivery preview scaffold with approval/token guardrails | Seeded, not connected to delivery archives/tokens |
| Branded reports | Report draft scaffold with privacy/no-guarantee guardrails | Seeded, not connected to report records |
| Agency billing | Volume pricing quote scaffold | Seeded, not connected to verified billing records |
| Team members | Team table and invite draft scaffold | Seeded, not connected to Membership/User records |
| Bulk queue | Queue rows and bulk plan scaffold | Seeded, not connected to Jobs/Images/Processing records |
| API routes | `/api/agency/*` route contracts added | Seeded, dry-run |
| Prisma | Phase 35 schema/migration scaffold added | Not validated |
| Unit tests | Domain, dashboard, billing tests added | Not run |
| Security tests | Agency access test added | Not run |
| Integration tests | Route contract test added | Not run |
| E2E tests | Agency page render test added | Not run |
| Browser render | Agency pages must render | Not run |
| Static scaffold sanity | Phase 35 new TS/TSX alias imports resolve to existing source files | 47 files checked in ChatGPT Project Mode; 0 missing alias targets detected |
| Secret pattern scan | Phase 35 new code/test files should not contain common hardcoded secret patterns | 0 suspicious pattern hits detected in ChatGPT Project Mode |
| Typecheck/lint/build | Full repo checks required | Not run |

## Codex Acceptance Gate

Codex may mark Phase 35 complete only after all runtime checks pass and any remaining issues are documented with severity, owner, and next action.
