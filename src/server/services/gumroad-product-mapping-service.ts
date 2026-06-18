import { DEFAULT_GUMROAD_OFFER_MAPPINGS, normalizeGumroadText, type GumroadOfferMapping } from '@/domain/gumroad';
import type { GumroadSalePayload } from '@/schemas/gumroad';

export type GumroadMappingResult = {
  matched: boolean;
  confidence: number;
  reason: string;
  offer: GumroadOfferMapping | null;
};

export function listGumroadOfferMappings() {
  return DEFAULT_GUMROAD_OFFER_MAPPINGS;
}

export function resolveGumroadOfferMapping(payload: Pick<GumroadSalePayload, 'product_id' | 'product_name' | 'permalink' | 'short_product_id'>): GumroadMappingResult {
  const productName = normalizeGumroadText(payload.product_name);
  const permalink = normalizeGumroadText(payload.permalink ?? payload.short_product_id ?? payload.product_id);

  for (const offer of DEFAULT_GUMROAD_OFFER_MAPPINGS) {
    if (offer.permalinkHints.some((hint) => permalink.includes(normalizeGumroadText(hint)))) {
      return { matched: true, confidence: 0.98, reason: 'permalink_hint', offer };
    }
  }

  for (const offer of DEFAULT_GUMROAD_OFFER_MAPPINGS) {
    if (offer.productNameHints.some((hint) => productName.includes(normalizeGumroadText(hint)))) {
      return { matched: true, confidence: 0.9, reason: 'product_name_hint', offer };
    }
  }

  return { matched: false, confidence: 0, reason: 'no_mapping_found', offer: null };
}

export function buildGumroadProductMappingAuditNote(result: GumroadMappingResult) {
  if (!result.matched || !result.offer) return 'Gumroad product could not be mapped automatically. Manual review required before fulfillment.';
  return `Gumroad product mapped to ${result.offer.key} using ${result.reason} at confidence ${Math.round(result.confidence * 100)}%.`;
}
