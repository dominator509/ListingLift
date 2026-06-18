# Gumroad Checkout and Webhook Intake

## Purpose

Gumroad is a productized sales channel for ListingLift offers such as cleanup packs, launch kits, credits, digital templates, checklists, dashboard access, and agency starter purchases.

## Internal normalization

A Gumroad sale must normalize to one of these internal outcomes:

1. `ExternalOrder` + `Job` + upload link for image-pack service purchases.
2. `ExternalOrder` + `CreditLedger` for credit packs.
3. `ExternalOrder` only for digital downloads.
4. `ExternalOrder` + admin setup task for dashboard or agency access.
5. Manual review for unmapped, unverified, refunded, disputed, or malformed sales.

## Offer mapping

Mappings are seeded in `src/domain/gumroad.ts` and should be persisted through `GumroadProductMapping` after Codex validation. Real Gumroad product IDs should be configured in the admin UI or environment only after the app is installed and secured.

## Webhook safety

- Verify signatures before processing automatically.
- Dedupe by Gumroad sale ID and product ID.
- Do not store Gumroad secrets in plaintext.
- Do not expose raw webhook payloads to the frontend.
- Do not create upload links for refunded/disputed sales.
- Do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.

## Manual fallback

When a sale cannot be verified or mapped, create an admin review item instead of blocking the business. Admins can manually map the product, create the job, apply credits, or mark the Gumroad order as digital-only.
