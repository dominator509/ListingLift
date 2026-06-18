import { buildGumroadDedupeKey, isGumroadRefunded } from '@/domain/gumroad';
import { gumroadSalePayloadSchema, type GumroadNormalizedPurchase, type GumroadSalePayload } from '@/schemas/gumroad';

export function getGumroadSaleId(payload: GumroadSalePayload) {
  const parsed = gumroadSalePayloadSchema.parse(payload);
  const fallback = parsed.order_number ? String(parsed.order_number) : '';
  const saleId = parsed.sale_id ?? parsed.id ?? fallback;
  if (!saleId) throw new Error('Gumroad sale payload is missing sale_id/id/order_number.');
  return saleId;
}

export function normalizeGumroadPurchase(payload: GumroadSalePayload): GumroadNormalizedPurchase {
  const parsed = gumroadSalePayloadSchema.parse(payload);
  const saleId = getGumroadSaleId(parsed);
  const amountCents = Number(parsed.price_cents ?? parsed.price ?? 0);
  const refunded = isGumroadRefunded(parsed);
  return {
    provider: 'gumroad',
    saleId,
    dedupeKey: buildGumroadDedupeKey(saleId, parsed.product_id),
    productId: parsed.product_id ?? parsed.short_product_id,
    productName: parsed.product_name,
    permalink: parsed.permalink,
    buyerEmail: parsed.email || parsed.purchase_email || undefined,
    buyerName: parsed.full_name,
    amountCents: Number.isFinite(amountCents) ? Math.max(0, Math.round(amountCents)) : 0,
    currency: (parsed.currency ?? 'USD').toUpperCase(),
    paymentStatus: refunded ? 'REFUNDED' : 'PAID',
    rawPayload: parsed,
  };
}

export function buildGumroadWebhookEventDraft(input: { payload: GumroadSalePayload; signatureVerified: boolean; organizationId?: string }) {
  const purchase = normalizeGumroadPurchase(input.payload);
  return {
    organizationId: input.organizationId,
    provider: 'gumroad' as const,
    gumroadSaleId: purchase.saleId,
    externalId: purchase.saleId,
    eventType: purchase.paymentStatus === 'REFUNDED' ? 'refund' : 'sale',
    signatureVerified: input.signatureVerified,
    processingStatus: input.signatureVerified ? 'VERIFIED' : 'RECEIVED',
    payload: purchase.rawPayload,
    dedupeKey: purchase.dedupeKey,
  };
}

export function shouldIgnoreGumroadPurchase(purchase: GumroadNormalizedPurchase) {
  if (purchase.paymentStatus === 'REFUNDED') return { ignore: true, reason: 'refunded_sale' };
  if (!purchase.buyerEmail) return { ignore: false, reason: 'missing_email_manual_review' };
  return { ignore: false, reason: 'paid_sale' };
}
