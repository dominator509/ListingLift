# Sales Channels

ListingLift uses a normalized sales-channel layer. Every incoming source becomes one internal external-order record and one ListingLift job creation flow.

## Required Normalized Fields

- Channel name
- External order ID
- External customer ID
- Buyer name
- Buyer email or username
- Package purchased
- Order amount
- Currency
- Deadline
- Revision allowance
- Source URL
- Payment status
- Upload status
- Fulfillment status
- Internal client ID
- Internal job ID

## Supported Sources

The registry includes direct/manual orders, Stripe Checkout, Gumroad, Fiverr, Upwork, Taskrabbit, Freelancer.com, PeoplePerHour, Guru, Contra, Thumbtack, Bark, Etsy, Shopify, Facebook Marketplace, Instagram, TikTok Shop, Amazon seller export/manual workflow, eBay export/manual workflow, Google Business Profile, Craigslist, Nextdoor, Discord, Skool, Circle, LinkedIn, YouTube, X/Twitter, Lemon8, Pinterest, Product Hunt, Indie Hackers, AppSumo, Chamber of Commerce, and Yelp.

## Supported Integration Modes

1. Direct API integration
2. Webhook integration
3. Email parser integration
4. Manual import
5. CSV import

Real integrations are disabled by default. Manual fallback is core and must not be removed.

## Marketplace Safety

- Do not violate platform terms of service.
- Prefer official APIs and approved webhooks.
- Do not scrape private marketplace pages.
- Do not automate messaging in ways that violate platform rules.
- Allow manual workflows where automation is not permitted.
- Store platform tokens securely.
- Do not store marketplace passwords.
- Keep client delivery inside the platform when required.
- Use external download links only where allowed.
- Keep order source attribution for revenue tracking.

## Phase 7 Implementation Contract

ChatGPT v9 seeds:

- canonical channel key mapping.
- adapter registry coverage.
- normalized order schema.
- order-to-client matching draft service.
- order-to-job draft service.
- revenue attribution draft service.
- duplicate external order key generation.
- upload link trigger plan for Phase 8.
- route contracts for normalize/import/manual-order/external-orders.

Codex must connect these to real Prisma transactions, audit logs, tenant isolation, pagination, filters, and tests.
