# Phase 19 Implementation Notes — Credits, Subscriptions, Manual Invoices

Phase 19 prepares ListingLift's paid-fulfillment fallback layer after Stripe and Gumroad intake. The goal is to let verified payments, active subscriptions, credit balances, and audited manual invoices unlock the correct internal fulfillment capabilities without bypassing security, tenant isolation, or approval gates.

## Scope coded in ChatGPT

- Credit ledger domain constants and balance helpers.
- Manual credit adjustment drafts.
- Credit consumption evaluation.
- Subscription entitlement draft and access evaluation.
- Manual invoice draft generation.
- Manual payment confirmation draft generation with redacted payment references.
- Billing entitlement gate helper.
- API route contracts for credits, subscriptions, manual invoices, and manual payment confirmation.
- Admin UI shells for credits, subscriptions, and manual invoices.
- Prisma schema scaffold for manual invoices, manual invoice payments, and subscription entitlements.
- Phase 19 tests covering ledger, manual invoice, subscription entitlement, route contracts, and billing security.

## Deliberately not completed in ChatGPT

- Prisma validation and migration generation.
- Real database transactions.
- Real payment confirmation persistence.
- Real credit balance recomputation from database rows.
- Real subscription period reset jobs.
- RBAC enforcement in live route handlers.
- Browser verification.
