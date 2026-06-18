# Phase 15 Implementation Notes — Manual Approval and Revision Workflow

## Scope coded in ChatGPT

This seed adds the manual approval and revision workflow contract for ListingLift. It creates approval-readiness rules, output approval decisions, job approval/rejection drafts, revision request/status drafts, manual replacement markers, delivery approval gates, API route contracts, UI shells, Prisma scaffold models, migration scaffold, tests, and docs.

## Guardrails

- Final downloads remain hidden after approval.
- Approval does not mark a job delivered or completed.
- Open revisions block final approval.
- Blocking QC flags block approval.
- Manual replacement markers never overwrite originals.
- Every approval, rejection, revision, and manual replacement action must be audited.

## Codex must wire

Codex must replace dry-run payloads with Prisma queries and transactions, enforce tenant/client/RBAC scope, persist events, validate storage, and run full checks.
