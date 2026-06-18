# TASKS_PHASE_29.md — Automation Webhooks

## Goal

Implement optional automation webhooks for ListingLift lifecycle events without making fulfillment dependent on automation success.

## Tasks

1. Validate provider/trigger/action catalogs.
2. Wire subscription persistence.
3. Wire dispatch persistence.
4. Add encrypted secret references.
5. Add signed payload support.
6. Add retry/backoff and dead-letter handling.
7. Add manual fallback task creation.
8. Add RBAC and tenant isolation.
9. Add rate limits.
10. Add audit logs.
11. Run unit/security/integration/E2E/build checks.

## Guardrails

- Real dispatch disabled by default.
- No secrets in frontend/logs/responses/tests/seeds.
- Redacted payloads only.
- No unapproved delivery links.
- Manual fallback required for failures.
