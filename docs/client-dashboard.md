# Client Dashboard

The client dashboard is the client-facing workspace for ListingLift fulfillment.

## Required Client Capabilities

- View active jobs.
- View completed jobs.
- Upload product photos through expiring upload tokens.
- Preview approved images.
- Download approved final ZIP archives.
- Request revisions.
- View credits, subscriptions, invoices, and allowance state.
- See upgrade recommendations and approved reports.

## Client Visibility Rules

Clients must never see:

- Cross-tenant data.
- Another client workspace's data.
- Pending outputs.
- Failed outputs.
- Flagged outputs.
- Rejected outputs.
- Admin-only notes.
- Provider errors.
- Secrets, tokens, signed URL internals, webhook payloads, or private marketplace details.

## Download Rules

Final ZIP downloads require:

- Active authenticated session or valid delivery-token flow.
- Client scope match.
- Valid non-expired non-revoked delivery link.
- Approved delivery archive.
- Approved job.
- No unresolved blocking QC flags.
- Download count under the allowed limit.

## Compliance-Safe Copy

Use: "platform-ready drafts" and "seller review recommended."

Do not guarantee marketplace approval, ranking, sales, conversion, product approval, listing approval, or ad performance.
