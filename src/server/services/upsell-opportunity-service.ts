import {
  recommendUpsellTypes,
  scoreUpsellPriority,
  type UpsellOpportunityType,
  type UpsellSignalInput,
} from '@/domain/reports-upsells';

export type UpsellOpportunityDraft = {
  organizationId: string;
  clientId?: string;
  jobId?: string;
  type: UpsellOpportunityType;
  priorityScore: number;
  reason: string;
  status: 'DETECTED';
};

export function detectUpsellOpportunities(signal: UpsellSignalInput): UpsellOpportunityDraft[] {
  const priorityScore = scoreUpsellPriority(signal);
  return recommendUpsellTypes(signal).map((type) => ({
    organizationId: signal.organizationId,
    clientId: signal.clientId,
    jobId: signal.jobId,
    type,
    priorityScore,
    reason: buildReason(type, signal),
    status: 'DETECTED' as const,
  }));
}

function buildReason(type: UpsellOpportunityType, signal: UpsellSignalInput) {
  if (type === 'MONTHLY_RETAINER') return 'Client has completed fulfillment but does not currently have an active retainer.';
  if (type === 'AD_CREATIVE_PACK') return 'Delivered image volume indicates enough assets for ad/social creative variations.';
  if (type === 'AGENCY_WHITE_LABEL_LICENSE') return 'Buyer type or workflow suggests multi-client fulfillment potential.';
  if (type === 'SHOPIFY_PRODUCT_PAGE_IMPROVEMENT') return 'Shopify source detected; product-page visual improvement is a natural next offer.';
  if (type === 'TIKTOK_SHOP_CREATIVE_PACK') return 'TikTok/social source detected; vertical social-commerce creative is a natural add-on.';
  return `Recent delivery with ${signal.deliveredImageCount ?? 0} images can support additional image packs or refreshes.`;
}
