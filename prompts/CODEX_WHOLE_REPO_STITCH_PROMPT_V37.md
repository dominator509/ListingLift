# CODEX_WHOLE_REPO_STITCH_PROMPT_V37.md

You are Codex working on ListingLift Repo Seed v37.

## Objective

Stitch and verify Phase 35 — Agency White-Label Mode without breaking prior phases.

## Required Context Review

Before coding, read:

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V37.md`
- `PHASE_35_IMPLEMENTATION_NOTES.md`
- `PHASE_35_EXECUTION_RUNBOOK.md`
- `PHASE_35_VERIFICATION_MATRIX.md`
- `docs/agency-white-label-mode.md`
- `docs/agency-white-label-phase35-gap-handoff.md`
- `BUILD_ROADMAP.md`
- `ARCHITECTURE.md`

## Required Work

1. Install dependencies if needed.
2. Validate Prisma schema.
3. Regenerate the Phase 35 migration from Prisma.
4. Generate Prisma client.
5. Apply migrations.
6. Run seed twice and verify idempotency.
7. Wire `/api/agency/*` routes to real auth/session context.
8. Enforce agency RBAC, tenant isolation, and client workspace isolation.
9. Replace dry-run agency data with Prisma-backed workspaces, branding, delivery/report templates, reports, delivery archives, queue, billing, team, and event records.
10. Add rate limits and audit logs for sensitive agency actions.
11. Verify white-label settings and branded delivery/report outputs require manual review before client-facing use.
12. Verify team invites store only hashed expiring tokens.
13. Verify bulk queue processing preserves originals.
14. Verify volume pricing cannot charge or invoice without verified billing records and admin approval.
15. Run the full verification matrix.
16. Update `ROADMAP_STATUS.md` and `CODEX_GAPS.md` with actual results.

## Required Commands

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

## Non-Negotiable Guardrails

- Never hardcode secrets.
- Never log secrets.
- Never expose provider keys to the frontend.
- Never store marketplace passwords.
- Store tokens/keys only as encrypted secret references or env values.
- Store invite/delivery/upload tokens only as hashes.
- Preserve original uploads and never overwrite originals.
- Use server-side auth, RBAC, and tenant isolation.
- Validate inputs with Zod/shared schemas.
- Rate-limit sensitive routes.
- Audit paid/client-facing/manual override/agency white-label actions.
- Keep real integrations disabled unless feature flags are explicitly enabled.
- Preserve manual fallback.
- Preserve admin approval before final delivery.
- Never expose final downloads before approval.
- Never guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, ad performance, or marketplace/ecommerce approval.

Do not claim any command passed unless you actually ran it.
