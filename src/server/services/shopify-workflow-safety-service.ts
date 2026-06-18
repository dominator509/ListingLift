import { isUnsafeShopifyAction, SHOPIFY_MARKETPLACE_SAFETY_RULES } from '@/domain/shopify';
import { shopifySafetyCheckSchema, type ShopifySafetyCheckInput } from '@/schemas/shopify';

export function checkShopifyWorkflowSafety(input: ShopifySafetyCheckInput) {
  const parsed = shopifySafetyCheckSchema.parse(input);
  const unsafeActions = parsed.intendedActions.filter(isUnsafeShopifyAction);
  const blockers = [
    parsed.storesPassword ? 'Do not store Shopify passwords or staff credentials.' : undefined,
    parsed.scrapesPrivatePages ? 'Do not scrape private Shopify admin pages.' : undefined,
    parsed.exposesOauthTokenToFrontend ? 'Do not expose Shopify OAuth access tokens to the frontend.' : undefined,
    parsed.autoReplacesImages && !parsed.hasMerchantApprovalForReplacement ? 'Do not replace product images automatically without explicit merchant approval.' : undefined,
    ...unsafeActions.map((action) => `Unsafe Shopify action requested: ${action}`),
  ].filter(Boolean) as string[];
  return {
    allowed: blockers.length === 0,
    blockers,
    warnings: [
      parsed.sourceMode === 'OAUTH_APP_SCAFFOLD' ? 'OAuth app mode must remain feature-flagged and scoped.' : undefined,
      parsed.deliveryMode === 'EMAIL_WITH_ALLOWED_LINK' && !parsed.externalLinkAllowed ? 'External link delivery needs merchant/context permission.' : undefined,
      'Seller/merchant review required before publishing or replacing product images.',
    ].filter(Boolean),
    safetyRules: SHOPIFY_MARKETPLACE_SAFETY_RULES,
  };
}
