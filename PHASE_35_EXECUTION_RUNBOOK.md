# PHASE_35_EXECUTION_RUNBOOK.md

## Phase 35 — Agency White-Label Mode

### Before Implementation

Codex must report:

1. Current branch/repo state.
2. Whether dependencies are installed.
3. Prisma schema validation status.
4. Existing migration state.
5. Runtime route import status.
6. Whether prior Phase 0–34 checks have known failures.

### Required Implementation Steps

1. Install dependencies if not already installed.
2. Validate Prisma schema.
3. Regenerate Phase 35 migration SQL from Prisma.
4. Generate Prisma client.
5. Apply migrations in a safe local/dev database.
6. Run seed twice and confirm idempotency.
7. Wire `/api/agency/*` routes to real session resolution.
8. Enforce server-side agency RBAC, tenant isolation, and client workspace scoping.
9. Replace dry-run data with Prisma-backed agency workspace, brand, queue, report, delivery, billing, team, and event queries.
10. Add rate limits for sensitive agency routes.
11. Add audit logging for branding, team, billing, queue, delivery/report previews, and manual override actions.
12. Verify team invites store only hashed expiring tokens and cannot escalate roles.
13. Verify branded delivery still respects approval, QC, delivery archive, hashed token, expiration, and download-limit gates.
14. Verify branded reports exclude all private/sensitive/unapproved data.
15. Verify bulk processing preserves original uploads and writes only new output objects.
16. Verify volume pricing is manual-review only until billing records and admin approval are wired.
17. Run Phase 35 tests and full repo checks.
18. Browser-render `/agency`, `/agency/workspaces`, `/agency/queue`, `/agency/white-label-settings`, `/agency/delivery`, `/agency/reports`, `/agency/billing`, `/agency/volume-pricing`, and `/agency/team`.
19. Update `ROADMAP_STATUS.md` with actual results.
20. Update `CODEX_GAPS.md` with remaining issues.

### Stop Conditions

Stop and report blockers if:

- Prisma schema or migration validation fails.
- Agency users can cross tenant boundaries.
- Client-scoped users can access agency admin/branding/team/billing routes.
- Raw invite tokens, secrets, provider keys, signed URLs, raw webhook payloads, or marketplace credentials are exposed.
- Branded delivery can bypass approval, QC, token, archive, or download gates.
- Branded reports include private/unapproved/sensitive data.
- Bulk processing overwrites original uploads.
- Volume pricing can charge without verified billing state and admin approval.
- Any copy guarantees marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.

### Required Commands

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run typecheck
npm run lint
npm run test:unit -- agency
npm run test:integration -- white-label
npm run test:security -- agency-access
npm run test:e2e -- agency
npm run build
npm run smoke
```

Record actual command output in the final Codex handoff. Do not invent results.
