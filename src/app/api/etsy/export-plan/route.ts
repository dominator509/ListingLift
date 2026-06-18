import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createEtsyRevenueAttribution } from '@/server/services/etsy-revenue-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({
      exportPlan: {
        channelKey: 'Etsy',
        folder: 'Etsy/square-listing',
        presetKeys: ['EtsyListingSquare', 'WebsiteProductGallery', 'PinterestPin'],
        revenueAttribution: createEtsyRevenueAttribution({ orderId: String(body.orderId ?? 'draft'), shopId: typeof body.shopId === 'string' ? body.shopId : undefined, amountCents: typeof body.amountCents === 'number' ? body.amountCents : 0 }),
        sellerReviewRequired: true,
      },
      note: 'Seed export planner. Codex must connect this to approved DeliveryArchive files only.',
    });
  } catch (error) {
    return mapServiceError(error);
  }
}
