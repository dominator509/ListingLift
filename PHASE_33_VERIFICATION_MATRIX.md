# PHASE_33_VERIFICATION_MATRIX.md

| Area | Required Check | Codex Owner |
|---|---|---|
| Auth | Client dashboard requires authenticated session | Yes |
| Tenant isolation | Client can only query own organization | Yes |
| Client isolation | Client owner/viewer can only see scoped client records | Yes |
| Jobs | Active/completed jobs are filtered server-side | Yes |
| Uploads | Upload plan never trusts client-submitted org/client/job IDs | Yes |
| Previews | Only approved client-visible previews are returned | Yes |
| Downloads | Final ZIP requires approval, archive, token, scope, and download gates | Yes |
| Revisions | Revision request output IDs are client/job scoped | Yes |
| Billing | Credits/subscriptions/manual invoices are server-derived | Yes |
| Upsells | Upgrade copy contains no guarantees | Yes |
| Audit | Sensitive dashboard actions are audited | Yes |
| UI | `/client`, `/client/jobs`, `/client/downloads`, `/client/revisions`, `/client/billing`, `/client/upgrade` render | Yes |
