import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildShopifyProductFolderPath } from '@/domain/shopify';
import { createShopifyRevenueAttribution } from '@/server/services/shopify-revenue-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const storeDomain = String(body.storeDomain ?? 'demo-store.myshopify.com');
    return jsonOk({
      exportPlan: {
        channelKey: 'Shopify',
        folder: buildShopifyProductFolderPath({ sku: typeof body.sku === 'string' ? body.sku : undefined, productId: typeof body.productId === 'string' ? body.productId : undefined, title: typeof body.title === 'string' ? body.title : undefined }),
        presetKeys: ['ShopifyProductImage', 'WebsiteProductGallery'],
        zipGrouping: 'PRODUCT_OR_SKU',
        revenueAttribution: createShopifyRevenueAttribution({ storeDomain, amountCents: typeof body.amountCents === 'number' ? body.amountCents : 0, productCount: typeof body.productCount === 'number' ? body.productCount : 0 }),
        merchantReviewRequired: true,
      },
      note: 'Seed export planner. Codex must connect this to approved DeliveryArchive files only and group ZIP entries by product/SKU.',
    });
  } catch (error) {
    return mapServiceError(error);
  }
}
