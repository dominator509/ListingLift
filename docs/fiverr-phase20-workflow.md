# Fiverr Phase 20 Workflow

## Objective

Phase 20 adds a manual-first Fiverr workflow that converts Fiverr orders into normalized ListingLift jobs without scraping, password storage, or unauthorized buyer messaging.

## MVP Flow

1. Operator records Fiverr order ID, buyer username, gig title, package tier, amount, deadline, and order instructions.
2. ListingLift maps the Fiverr gig to a data-driven package.
3. ListingLift plans or creates a secure upload link when source files are needed.
4. ListingLift processes, reviews, flags, revises, approves, packages, and prepares delivery through existing fulfillment phases.
5. Operator uses the Fiverr-safe delivery template and manually delivers inside Fiverr when required.
6. Operator records delivery/revision/completion status in ListingLift.

## Safety Rules

- Do not scrape private Fiverr pages.
- Do not store Fiverr passwords.
- Do not automate Fiverr buyer messaging unless an approved integration path exists.
- Keep delivery inside Fiverr when Fiverr requires it.
- Use external links only when allowed.
- Do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.

## Data Normalization

A Fiverr order must normalize into the internal `ExternalOrder` and `Job` models with:

- Channel name: `Fiverr`
- External order ID
- Buyer username/name
- Package purchased
- Amount/currency
- Deadline
- Revision allowance
- Source URL
- Payment status
- Upload status
- Fulfillment status
- Internal client ID
- Internal job ID

## Codex Ownership

Codex must wire the dry-run services and routes to Prisma transactions, RBAC, tenant isolation, audit logs, and browser-tested UI flows.
