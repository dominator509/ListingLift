# docs/etsy-workflow.md

## Purpose

Phase 24 adds a manual-first Etsy workflow for sellers who need square listing images, clean/white background images, transparent cutouts, appropriate lifestyle-style variants, listing sequence suggestions, and shop visual consistency notes.

## Workflow

1. Operator captures Etsy order or seller request.
2. System normalizes the order into an internal ListingLift job draft.
3. System selects Etsy-oriented presets such as `EtsyListingSquare`.
4. Client uploads raw files or Etsy listing exports through secure upload links.
5. Processing, QC, approval, delivery archive generation, and delivery links follow existing ListingLift gates.
6. Operator uses Etsy-safe delivery copy inside the permitted delivery channel.
7. Open revisions block completion.

## Safety

- Do not scrape private Etsy pages.
- Do not store Etsy passwords.
- Do not automate buyer messages or listing edits unless an approved Etsy integration explicitly permits it.
- Do not guarantee Etsy approval, ranking, traffic, sales, conversion, ad performance, product approval, or listing approval.
- Use “platform-ready draft” and “seller review recommended” language.
