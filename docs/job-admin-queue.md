# Job Creation and Admin Queue

ListingLift jobs are the central fulfillment record created from direct uploads, manual orders, marketplace workflows, Stripe/Gumroad checkouts, agency workspaces, or sales-channel normalization.

## Phase 9 Scope

Phase 9 owns:

- Manual job creation.
- Admin job queue.
- Job detail page.
- Status transitions.
- Deadline tracking and warnings.
- Revenue/source attribution visibility.
- Admin notes.

## Required Server Rules

- Enforce tenant isolation on every job query and mutation.
- Enforce `manage:jobs` for queue/detail/status/deadline/note operations.
- Enforce `create:manual-orders` for manual job creation.
- Never trust client-submitted organization, client, package, price, revenue, upload, or status data without server-side validation.
- Persist status changes and manual overrides with `JobStatusEvent` and `AuditLog` records.
- Delivery-visible statuses require admin approval.
- Manual fallback actions must remain possible and audited.

## Queue Sorting

Default sort priority:

1. Explicit queue position.
2. Active jobs before terminal jobs.
3. Earliest deadline.
4. Higher priority.
5. Created time.

## Deadline Warning Levels

- `NONE` — no deadline pressure.
- `UPCOMING` — due within 72 hours.
- `DUE_SOON` — due within 24 hours.
- `OVERDUE` — deadline passed.
- `BLOCKED` — reserved for future dependency blockers.

## Compliance-Safe Notes

Admin notes and client-visible notes must not include marketplace passwords, API tokens, private buyer data beyond what is necessary for fulfillment, or claims that guarantee marketplace approval, ranking, conversions, or sales.
