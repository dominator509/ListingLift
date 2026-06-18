# Manual Approval and Revision Workflow

Manual approval is a mandatory ListingLift fulfillment gate. The system may prepare previews, QC records, processed outputs, manifests, and ZIP drafts, but client-facing final downloads stay hidden until approval and delivery gates pass.

## Approval rules

- Admin approval is required before final delivery.
- Approval is blocked by unresolved blocking QC flags.
- Approval is blocked by open revisions.
- Approval is blocked by required manual replacements.
- Output approval and job approval are separate decisions.
- Job approval does not automatically send delivery.

## Revision rules

- Clients and admins can request revisions through scoped routes.
- Revision text must be sanitized.
- Revision requests are tenant/job/client scoped.
- Open revisions block final approval.
- Resolved revisions return the job to review rather than direct delivery.

## Manual replacement rules

- Manual Photoshop/Canva/other edited replacements are tracked as replacement records.
- Originals are preserved and never overwritten.
- Manual replacement markers must be audited.
- Replacements must pass QC before approval.

## Delivery guardrail

Use safe language: "platform-ready draft," "seller-review recommended," and "review against current platform guidelines before publishing." Do not guarantee marketplace approval, ranking, conversion, or sales.
