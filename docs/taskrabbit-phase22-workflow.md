# Taskrabbit Phase 22 Workflow

Phase 22 adds manual-first Taskrabbit/local-service tracking for ListingLift.

## Supported service angles

- Product photo cleanup support
- Marketplace listing photo preparation
- Restaurant menu image cleanup
- Real estate listing visual organization
- Facebook Marketplace/eBay listing image prep
- Small business ecommerce setup support
- Direct retainer conversion follow-up

## MVP workflow

1. Admin manually enters a Taskrabbit task.
2. System maps task category to a ListingLift package.
3. System builds a normalized external order and job draft.
4. System plans an upload token where source files are needed.
5. Admin collects photos and fulfills through the normal ListingLift pipeline.
6. Admin prepares safe delivery copy.
7. Admin records delivery and conversion/follow-up status.

## Safety rules

- Do not scrape private Taskrabbit pages.
- Do not store Taskrabbit passwords.
- Do not automate platform messaging or booking actions outside an approved integration.
- Avoid storing full customer addresses unless task fulfillment requires it.
- External links require task-context permission and customer consent.
- Direct-retainer conversion tracking is internal and must obey platform rules.
