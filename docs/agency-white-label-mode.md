# Agency White-Label Mode

## Purpose

Agency white-label mode turns ListingLift into a high-ticket fulfillment layer for agencies serving ecommerce clients. It supports multi-client workspaces, branded delivery, branded reports, agency billing, team access, bulk processing queues, and volume pricing.

## Seeded Capabilities

- Agency dashboard summary.
- Client workspace table.
- White-label brand preview.
- Branded delivery page preview.
- Branded report preview.
- Bulk processing queue table and queue plan draft.
- Agency billing and volume pricing quote.
- Agency team member table and invite draft.
- Agency route contracts.
- Agency Prisma model scaffolds.

## Production Rules

- Agency data must be tenant-scoped server-side.
- Agency admins require agency scope and explicit permissions.
- Client-scoped users cannot access agency dashboard, branding, billing, team, queue, or workspace admin routes.
- White-label settings must remain drafts until manually approved.
- Branded delivery must still enforce approved output, approved archive, expiring hashed token, download limit, QC, and admin approval gates.
- Branded reports must exclude secrets, raw provider data, raw webhook payloads, signed URLs, tokens, private notes, provider errors, unapproved outputs, and marketplace credentials.
- Team invites must store only hashed expiring tokens.
- Volume pricing cannot charge or invoice without verified billing records and admin approval.
- Bulk processing must preserve originals and write only new output files.
- Real integrations remain disabled unless feature flags are explicitly enabled.

## No-Guarantee Copy Rule

Agency delivery, report, billing, and upsell copy must not guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.
