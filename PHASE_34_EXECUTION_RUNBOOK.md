# PHASE_34_EXECUTION_RUNBOOK.md

## Phase 34 — Admin Dashboard and Revenue Analytics

### Before Implementation

Codex must state:

1. Current phase: Phase 34 — Admin Dashboard and Revenue Analytics.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to change.
5. Tests/checks that will be run.

### Required Implementation Steps

1. Install dependencies if not already installed.
2. Validate the Prisma schema and repair the Phase 34 migration.
3. Generate Prisma client.
4. Apply migrations.
5. Wire `/api/admin/dashboard/*` routes to real auth/session, RBAC, tenant isolation, and Prisma queries.
6. Replace dry-run dashboard and revenue data with server-derived records.
7. Derive active jobs, completed jobs, flagged outputs, due-soon jobs, and job source counts from tenant-scoped `Job`, `Client`, `SalesChannel`, `ExternalOrder`, `QualityFlag`, `DeliveryArchive`, and `Report` records.
8. Derive revenue analytics from verified Stripe, Gumroad, manual invoice, external-order, refund, credit, and subscription records.
9. Persist revenue snapshots, conversion signals, retainer alerts, and admin dashboard events transactionally.
10. Add server-side rate limits for analytics exports/events and sensitive filter routes.
11. Audit admin analytics views, exports, conversion actions, retainer alert dismissals, manual overrides, and report/upsell handoffs.
12. Verify admin pages in browser: `/admin`, `/admin/revenue`, `/admin/revenue/source-tracking`, `/admin/revenue/conversions`, and `/admin/revenue/retainers`.
13. Run all checks in `PHASE_34_VERIFICATION_MATRIX.md`.
14. Update `ROADMAP_STATUS.md` with real command results.

### Stop Conditions

Do not mark Phase 34 complete if tenant isolation, admin-only access, revenue derivation, marketplace-to-direct safety, retainer manual-review gates, audit logging, or analytics privacy checks fail.
