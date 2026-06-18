# Fiverr Phase 20 Gap Handoff

## Cannot Be Completed Inside ChatGPT Project Environment

The following must be completed by Codex in the real repository/runtime:

- Validate Prisma schema and regenerate migration SQL.
- Apply migrations.
- Generate Prisma client.
- Run seed twice.
- Persist organization-scoped Fiverr gig mappings.
- Persist Fiverr delivery templates.
- Connect manual-order route to Client, ExternalOrder, Job, UploadToken, FiverrWorkflowEvent, and AuditLog creation in one transaction.
- Enforce duplicate prevention by Fiverr order ID/dedupe key.
- Enforce `manage:sales-channels`, `create:manual-orders`, `manage:jobs`, `send:delivery`, and revision permissions server-side.
- Connect delivery-template generation to approved DeliveryArchive records only.
- Ensure no unapproved archive/file can be exposed through Fiverr delivery workflow.
- Persist revision status updates and block completion while revisions are open.
- Record manual Fiverr delivery completion without sending messages automatically.
- Verify no Fiverr password, private page scrape, or unauthorized automation code exists.
- Run Phase 20 unit, integration, security, E2E, typecheck, lint, build, Prisma validate, and seed checks.

## Required Production Decisions

- Confirm whether any approved Fiverr API/partner integration is available.
- Confirm whether external download links are allowed for each gig/order context.
- Decide final internal policy for retaining Fiverr order instructions and buyer usernames.
- Decide whether Fiverr ZIP delivery should attach files directly, link to storage, or remain operator-selected per order.
