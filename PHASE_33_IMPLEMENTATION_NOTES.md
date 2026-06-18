# PHASE_33_IMPLEMENTATION_NOTES.md

## Phase

Phase 33 — Client Dashboard

## What ChatGPT Project Mode Coded

This seed adds the client-facing dashboard shell and server-side contracts for:

- Client dashboard overview.
- Client-scoped job list.
- Upload planning.
- Approved preview visibility.
- Final delivery download gates.
- Revision request draft flow.
- Billing/credit/subscription summary.
- Upgrade recommendation drafts.
- Dashboard event/audit planning.

## Important Security Rules

- Client dashboard data must be scoped by organization and client membership server-side.
- UI hiding is not sufficient.
- Clients may never see unapproved, flagged, failed, rejected, pending, or admin-only output data.
- Final downloads must require valid delivery link, approved archive, job approval, client scope, and download-limit gates.
- Upload flows must use server-issued expiring tokens and immutable original storage.
- Upgrade copy must not guarantee marketplace approval, ranking, sales, conversion, or ad performance.

## Runtime Status

This is a repo seed. It has not been installed, typechecked, linted, built, migrated, seeded, or browser-tested in this environment.
