# Phase 34 Gap Handoff — Admin Dashboard and Revenue Analytics

## ChatGPT-Coded Scope

- Domain rules for admin analytics sections, job groups, revenue channels, due-soon jobs, safe copy, and retainer scoring.
- Zod schemas for admin dashboard summary, job queue filters, revenue analytics, conversion candidates, retainer alerts, and admin analytics events.
- Dry-run services for dashboard summary, job queue buckets, revenue snapshots, source tracking, conversion candidates, retainer alerts, and analytics events.
- Admin UI shells for dashboard overview, revenue analytics, source tracking, marketplace-to-direct conversions, and retainer alerts.
- API route contracts under `/api/admin/dashboard/*`.
- Prisma schema and migration scaffolds for admin preferences, revenue snapshots, conversion signals, retainer alerts, and admin dashboard events.
- Unit, security, integration, and E2E test scaffolds.

## Codex-Only Gaps

- Install dependencies.
- Validate Prisma schema.
- Regenerate and repair Phase 34 migration SQL.
- Generate Prisma client.
- Apply migrations.
- Run seed twice.
- Wire API routes to real authenticated session context.
- Enforce admin RBAC and tenant isolation on every analytics route.
- Replace demo analytics with Prisma-backed queries.
- Derive revenue only from verified payments, refunds, invoices, external orders, credits, subscriptions, and job data.
- Persist revenue analytics snapshots, conversion signals, retainer alerts, and dashboard events transactionally.
- Add rate limits for admin analytics filters, events, exports, conversion actions, and retainer alert actions.
- Add audit logs for analytics views, exports, retainer dismiss/convert actions, conversion action review, and manual overrides.
- Verify no client role can access admin analytics.
- Verify analytics exports exclude secrets, tokens, signed URLs, raw webhook payloads, provider errors, private notes, and marketplace credentials.
- Verify marketplace-to-direct conversion tracking is internal only and never automates marketplace outreach.
- Verify retainer and upsell language contains no approval, ranking, sales, conversion, or ad-performance guarantees.
- Verify admin dashboard pages render in browser.
- Run unit, security, integration, E2E, typecheck, lint, build, Prisma validate, migration, and seed checks.

## Do Not Ship Until

- Server-side tenant and admin RBAC tests pass.
- Revenue derivation is verified against real source records.
- Conversion and retainer alerts are audited/manual-review only.
- Admin analytics pages render in browser.
- Safe-copy and privacy tests pass.
