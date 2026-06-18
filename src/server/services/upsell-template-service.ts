import type { UpsellChannel, UpsellOpportunityType } from '@/domain/reports-upsells';

const TEMPLATE_COPY: Record<UpsellOpportunityType, { title: string; body: string; cta: string; suggestedPriceCents?: number }> = {
  MORE_IMAGE_PACKS: {
    title: 'Add another image cleanup pack',
    body: 'Your latest image pack is ready for seller review. A follow-up cleanup pack can help keep additional listings consistent.',
    cta: 'Request another image pack',
    suggestedPriceCents: 9900,
  },
  MONTHLY_RETAINER: {
    title: 'Move to a monthly seller image retainer',
    body: 'A monthly retainer can keep new products, seasonal updates, and listing refreshes moving without starting from scratch each time.',
    cta: 'Review retainer options',
    suggestedPriceCents: 19900,
  },
  LISTING_SEO: {
    title: 'Add listing SEO support',
    body: 'Pair your refreshed visuals with listing copy and keyword cleanup. Seller review is still recommended before publishing.',
    cta: 'Add listing SEO',
    suggestedPriceCents: 14900,
  },
  PRODUCT_DESCRIPTION_REWRITE: {
    title: 'Refresh product descriptions',
    body: 'Updated photos often work best with clearer product descriptions, benefits, and FAQs.',
    cta: 'Request description rewrite',
    suggestedPriceCents: 9900,
  },
  AD_CREATIVE_PACK: {
    title: 'Turn product images into ad creatives',
    body: 'Create platform-ready draft ad variations from your approved product images. No ad performance guarantee.',
    cta: 'Create ad creatives',
    suggestedPriceCents: 19900,
  },
  GUMROAD_OFFER_IMAGE_PACK: {
    title: 'Create Gumroad offer visuals',
    body: 'Use approved product visuals to create offer-card and promo image drafts for Gumroad or creator stores.',
    cta: 'Build offer images',
    suggestedPriceCents: 12900,
  },
  SHOPIFY_PRODUCT_PAGE_IMPROVEMENT: {
    title: 'Improve Shopify product-page visuals',
    body: 'Organize approved images into a clearer product gallery sequence and page-ready draft assets.',
    cta: 'Improve Shopify visuals',
    suggestedPriceCents: 24900,
  },
  TIKTOK_SHOP_CREATIVE_PACK: {
    title: 'Create TikTok Shop creative variations',
    body: 'Generate vertical and thumbnail-ready draft variations for social-commerce review before publishing.',
    cta: 'Create TikTok Shop creatives',
    suggestedPriceCents: 19900,
  },
  DASHBOARD_ACCESS: {
    title: 'Enable ongoing dashboard access',
    body: 'Give your team a simple place to request new image work, download approved packs, and track revisions.',
    cta: 'Enable dashboard access',
    suggestedPriceCents: 4900,
  },
  AGENCY_WHITE_LABEL_LICENSE: {
    title: 'White-label image fulfillment for agencies',
    body: 'Support multiple client workspaces with branded delivery and review workflows.',
    cta: 'Explore white-label fulfillment',
    suggestedPriceCents: 100000,
  },
};

export function buildUpsellTemplate(type: UpsellOpportunityType, channel: UpsellChannel = 'CLIENT_DASHBOARD') {
  const template = TEMPLATE_COPY[type];
  return {
    type,
    channel,
    ...template,
    safeClaim: 'Seller-review recommended. No marketplace approval, ranking, sales, conversion, or ad-performance guarantee.',
  };
}

export function listUpsellTemplates() {
  return Object.keys(TEMPLATE_COPY).map((type) => buildUpsellTemplate(type as UpsellOpportunityType));
}
