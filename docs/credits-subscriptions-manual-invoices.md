# Credits, Subscriptions, and Manual Invoices

ListingLift supports multiple paid-fulfillment paths because marketplace/service work often arrives through Stripe, Gumroad, freelance marketplaces, direct website checkout, and manual invoices.

## Credit rules

Credits are internal image-cleanup allowances. A credit does not guarantee marketplace approval, ranking, conversion, sales, ad performance, or product approval. Credits must be recorded in an append-only ledger style, with every manual adjustment audited.

## Subscription rules

Subscriptions grant allowance only while active and verified. Monthly resets must be server-side. Inactive, failed-payment, refunded, or disputed subscriptions must not grant new upload links, delivery links, credits, or dashboard access.

## Manual invoice rules

Manual invoices are a core fallback. They allow the operator to confirm external payments, retainers, agency arrangements, or offline payments. Manual payment confirmation must require billing permission, redact payment references, and write invoice, payment, credit, and audit records transactionally.

## Client safety

Client-facing pages must never expose internal payment references, private admin notes, raw webhook payloads, or billing secrets.
