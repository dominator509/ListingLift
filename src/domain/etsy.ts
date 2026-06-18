import { type RequiredPackageKey } from './database-keys';

export type EtsyOrderSourceMode = 'MANUAL' | 'CSV_IMPORT' | 'API_SCAFFOLD' | 'WEBHOOK_SCAFFOLD';
export type EtsyWorkflowStatus =
  | 'DRAFT'
  | 'ORDER_CAPTURED'
  | 'LISTING_DATA_NEEDED'
  | 'FILES_NEEDED'
  | 'FILES_RECEIVED'
  | 'PROCESSING'
  | 'WAITING_FOR_QC'
  | 'WAITING_FOR_APPROVAL'
  | 'DELIVERY_READY'
  | 'DELIVERED_IN_ETSY'
  | 'REVISION_REQUESTED'
  | 'SHOP_REFRESH_UPSELL_READY'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';
export type EtsyListingImageUseCase =
  | 'SQUARE_LISTING_IMAGE'
  | 'WHITE_BACKGROUND_IMAGE'
  | 'TRANSPARENT_CUTOUT'
  | 'LIFESTYLE_STYLE_MOCKUP'
  | 'SHOP_VISUAL_CONSISTENCY'
  | 'LISTING_SEQUENCE_RECOMMENDATION';
export type EtsyDeliveryMode = 'ETSY_MESSAGE' | 'ETSY_MESSAGE_WITH_ALLOWED_LINK' | 'EMAIL_WITH_ALLOWED_LINK' | 'MANUAL_EXTERNAL_DELIVERY_RECORDED';
export type EtsyRevisionStatus = 'NONE' | 'REQUESTED' | 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'DELIVERED' | 'CLOSED';
export type EtsyReportSectionKey = 'IMAGE_SEQUENCE' | 'CONSISTENCY_NOTES' | 'QUALITY_WARNINGS' | 'SHOP_REFRESH_UPSELL' | 'SELLER_REVIEW_CHECKLIST';

export type EtsyListingPackDefinition = {
  key: string;
  title: string;
  packageKey: RequiredPackageKey;
  imageAllowance: number;
  revisionAllowance: number;
  defaultUseCases: EtsyListingImageUseCase[];
  defaultDeliveryMode: EtsyDeliveryMode;
  includesShopVisualReport: boolean;
  includesListingSequenceRecommendations: boolean;
  safeDescription: string;
};

export const ETSY_CHANNEL_KEY = 'Etsy' as const;
export const ETSY_DEFAULT_PRESET_KEYS = ['EtsyListingSquare', 'WebsiteProductGallery', 'PinterestPin'] as const;

export const ETSY_SAFE_COPY =
  'ListingLift prepares Etsy-formatted product image drafts, square listing images, clean background variants, product cutouts, and shop visual notes for seller review. Review all files against current Etsy policies before publishing. Etsy approval, ranking, traffic, sales, conversion, ad performance, product approval, or listing approval are not guaranteed.';

export const ETSY_MARKETPLACE_SAFETY_RULES = [
  'Use Etsy official APIs, approved webhooks, CSV imports, or manual workflows only.',
  'Do not scrape private Etsy order pages, seller dashboards, messages, customer records, analytics, or shop data.',
  'Do not store Etsy passwords.',
  'Do not automate buyer messaging, review requests, listing edits, or delivery messages unless explicitly allowed by an approved Etsy integration.',
  'Keep delivery inside Etsy messages where required by Etsy transaction context.',
  'Use external upload/download links only when allowed and with buyer consent.',
  'Do not guarantee Etsy listing approval, marketplace ranking, sales, conversion increases, ad performance, or product approval.',
  'Store only minimal order, listing, revenue, and fulfillment attribution needed for ListingLift operations.',
] as const;

export const DEFAULT_ETSY_LISTING_PACKS: EtsyListingPackDefinition[] = [
  {
    key: 'etsy-quick-cleanup',
    title: 'Etsy Quick Cleanup',
    packageKey: 'QuickCleanup10',
    imageAllowance: 10,
    revisionAllowance: 1,
    defaultUseCases: ['SQUARE_LISTING_IMAGE', 'WHITE_BACKGROUND_IMAGE', 'TRANSPARENT_CUTOUT'],
    defaultDeliveryMode: 'ETSY_MESSAGE_WITH_ALLOWED_LINK',
    includesShopVisualReport: false,
    includesListingSequenceRecommendations: true,
    safeDescription: ETSY_SAFE_COPY,
  },
  {
    key: 'etsy-marketplace-listing-pack',
    title: 'Etsy Marketplace Listing Pack',
    packageKey: 'MarketplaceListing50',
    imageAllowance: 50,
    revisionAllowance: 2,
    defaultUseCases: ['SQUARE_LISTING_IMAGE', 'WHITE_BACKGROUND_IMAGE', 'TRANSPARENT_CUTOUT', 'LISTING_SEQUENCE_RECOMMENDATION', 'SHOP_VISUAL_CONSISTENCY'],
    defaultDeliveryMode: 'ETSY_MESSAGE_WITH_ALLOWED_LINK',
    includesShopVisualReport: true,
    includesListingSequenceRecommendations: true,
    safeDescription: ETSY_SAFE_COPY,
  },
  {
    key: 'etsy-shop-refresh',
    title: 'Etsy Shop Visual Refresh',
    packageKey: 'MonthlySellerRetainer',
    imageAllowance: 100,
    revisionAllowance: 4,
    defaultUseCases: ['SQUARE_LISTING_IMAGE', 'WHITE_BACKGROUND_IMAGE', 'TRANSPARENT_CUTOUT', 'LIFESTYLE_STYLE_MOCKUP', 'SHOP_VISUAL_CONSISTENCY', 'LISTING_SEQUENCE_RECOMMENDATION'],
    defaultDeliveryMode: 'ETSY_MESSAGE_WITH_ALLOWED_LINK',
    includesShopVisualReport: true,
    includesListingSequenceRecommendations: true,
    safeDescription: ETSY_SAFE_COPY,
  },
];

export function normalizeEtsyOrderId(orderId: string) {
  return orderId.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
}

export function buildEtsyDedupeKey(input: { organizationId?: string; orderId: string; shopId?: string }) {
  const org = input.organizationId ? `${input.organizationId}:` : '';
  const shop = input.shopId ? `${input.shopId.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')}:` : '';
  return `${org}etsy:${shop}${normalizeEtsyOrderId(input.orderId)}`;
}

export function redactEtsyBuyer(value?: string) {
  if (!value) return undefined;
  const clean = value.trim();
  if (!clean) return undefined;
  if (clean.includes('@')) {
    const [local, domain] = clean.split('@');
    return `${local.slice(0, 1)}***@${domain}`;
  }
  if (clean.length <= 2) return '**';
  return `${clean.slice(0, 1)}***${clean.slice(-1)}`;
}

export function buildEtsyDeliveryMessage(input: { buyerName?: string; archiveName?: string; includeExternalLink?: boolean; externalLinkAllowed?: boolean }) {
  const greeting = input.buyerName ? `Hi ${input.buyerName},` : 'Hi,';
  const archive = input.archiveName ?? 'your ListingLift Etsy image pack';
  const linkLine = input.includeExternalLink && input.externalLinkAllowed
    ? 'I can provide the secure download link here if this order context permits external delivery links.'
    : 'I can deliver the final files using the Etsy-approved delivery path for this order.';
  return `${greeting}\n\n${archive} is prepared as Etsy-formatted draft image files for seller review. The pack may include square listing images, clean-background JPGs, transparent PNG cutouts, organized folders, a manifest, and seller-review notes. ${linkLine}\n\nPlease review all files against current Etsy listing and shop policies before publishing. Etsy approval, ranking, traffic, sales, conversion, ad performance, product approval, or listing approval are not guaranteed.`;
}

export function buildEtsyVisualConsistencyReport(input: { listingTitles?: string[]; flaggedIssues?: string[]; recommendedSequence?: string[] }) {
  return {
    sections: [
      { key: 'IMAGE_SEQUENCE' as EtsyReportSectionKey, title: 'Suggested listing image sequence', notes: input.recommendedSequence?.length ? input.recommendedSequence : ['Primary square product image', 'Alternate angle', 'Scale/context image', 'Detail close-up', 'Transparent cutout where useful'] },
      { key: 'CONSISTENCY_NOTES' as EtsyReportSectionKey, title: 'Shop visual consistency notes', notes: input.listingTitles?.length ? input.listingTitles.map((title) => `Review ${title} for consistent crop, background, and thumbnail framing.`) : ['Review crop, background, lighting, and thumbnail framing across the shop.'] },
      { key: 'QUALITY_WARNINGS' as EtsyReportSectionKey, title: 'Seller-review warnings', notes: input.flaggedIssues?.length ? input.flaggedIssues : ['Seller review recommended before publishing.'] },
      { key: 'SHOP_REFRESH_UPSELL' as EtsyReportSectionKey, title: 'Refresh opportunity', notes: ['Consider refreshing older listings to match the clean crop/background standard used in this batch.'] },
    ],
    safeCopy: ETSY_SAFE_COPY,
  };
}

export function isUnsafeEtsyAction(action: string) {
  const lower = action.toLowerCase();
  return ['scrape', 'password', 'auto message', 'automated message', 'auto listing edit', 'auto review request', 'seller dashboard scraping', 'buyer message scraping', 'private order scraping'].some((needle) => lower.includes(needle));
}
