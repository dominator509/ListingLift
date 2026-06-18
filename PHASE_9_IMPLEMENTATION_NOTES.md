# PHASE_9_IMPLEMENTATION_NOTES.md — Job Creation and Admin Queue

## Current Objective

Seed the Phase 9 operational job queue for Codex implementation without claiming runtime completion.

## What Was Added

- Manual job creation schemas and draft service.
- Admin job queue filters, sorting, summary counts, and deadline-warning rules.
- Status transition draft service with server-side approval guard for delivery-visible states.
- Admin/client-visible note draft service with redaction of secret-looking values.
- Admin queue route contracts and job detail/status/notes/deadline route contracts.
- Admin queue and job detail UI shell components.
- Prisma scaffold updates for queue priority, deadline warning, selected presets, admin notes, and job status events.
- Phase 9 unit, security, integration, and E2E test scaffolds.

## Intentional Limits

This is a portable seed. Codex must connect routes and services to Prisma transactions, run migrations, and verify runtime behavior.

## Security Notes

- Delivery-visible status transitions still require `approvedAt`.
- Manual job creation must not trust client-submitted tenant IDs.
- Admin note content is sanitized and must be audited when persisted.
- Manual order/source/revenue metadata must be tenant-scoped and permission-gated.
