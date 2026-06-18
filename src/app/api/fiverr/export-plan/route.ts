import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildFiverrRevenueAttributionDraft } from '@/server/services/fiverr-revenue-service';

export async function POST(request: Request) {
  const body = await parseJson<Record<string, unknown>>(request, {});
  const orderId = String(body.orderId ?? body.externalOrderId ?? 'FIVERR-SEED-ORDER');
  const amountCents = Number(body.amountCents ?? 0);
  return jsonOk({
    exportPlan: {
      provider: 'fiverr',
      orderId,
      deliveryZip: body.deliveryZip ?? 'ListingLift_Delivery_Fiverr_Order.zip',
      includeManifest: true,
      includeReadMe: true,
      includeSafeDeliveryTemplate: true,
      revenue: buildFiverrRevenueAttributionDraft({ orderId, amountCents, gigTitle: String(body.gigTitle ?? ''), packageKey: String(body.packageKey ?? '') }),
    },
    note: 'Seed route. Codex must derive delivery ZIP from approved DeliveryArchive and never expose unapproved files.',
  });
}
