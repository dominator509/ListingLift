# upwork-workflow.md

Upwork workflow is manual-first unless an approved integration is available. Preserve contract attribution and manual external delivery status.

# Upwork Workflow

Upwork is a high-value manual/semi-automated sales channel for fixed-price product image projects, hourly catalog support, monthly retainers, agency subcontracting, and bulk ecommerce catalog cleanup.

## MVP Workflow

1. Admin manually creates a project from the Upwork contract.
2. Admin records client name, contract title, contract type, milestone status, deadline, and billed amount.
3. ListingLift maps the contract to an internal service package.
4. ListingLift creates or matches the client record.
5. ListingLift creates an external order and job draft.
6. ListingLift creates an upload link where source files are needed.
7. Fulfillment proceeds through processing, preview, QC, approval, archive generation, and delivery.
8. Admin delivers through Upwork messages/files or records a manual external delivery only when allowed.
9. Admin tracks revisions and optional retainer upsell reminders.

## Marketplace Safety

- Do not scrape private Upwork pages, messages, work diaries, or client profiles.
- Do not store Upwork passwords.
- Do not automate proposals, messages, or delivery unless an approved integration allows it.
- Keep delivery inside Upwork when required.
- Use external links only where allowed.
- Preserve source attribution and revenue tracking.
- Use platform-ready/seller-review language; do not guarantee approval, sales, rankings, or ad performance.

## Codex Responsibilities

Codex must wire these seed contracts to Prisma, RBAC, tenant isolation, audit logs, duplicate prevention, and browser-tested UI before marking Phase 21 complete.
