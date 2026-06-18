import { SHOPIFY_MARKETPLACE_SAFETY_RULES, normalizeShopifyStoreDomain } from '@/domain/shopify';
import { shopifyOAuthScaffoldInputSchema, type ShopifyOAuthScaffoldInput } from '@/schemas/shopify';

export function createShopifyOAuthScaffoldPlan(input: ShopifyOAuthScaffoldInput) {
  const parsed = shopifyOAuthScaffoldInputSchema.parse(input);
  const storeDomain = normalizeShopifyStoreDomain(parsed.storeDomain);
  const uniqueScopes = [...new Set(parsed.requestedScopes)].sort();
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    channelKey: 'Shopify',
    storeDomain,
    oauthStatus: parsed.oauthStatus,
    requestedScopes: uniqueScopes,
    secretStorageRequired: true,
    featureFlagsRequired: ['SHOPIFY_ENABLED', 'SHOPIFY_OAUTH_ENABLED', 'REAL_INTEGRATIONS_ENABLED'],
    frontendTokenExposureAllowed: false,
    manualFallbackAvailable: true,
    safetyRules: SHOPIFY_MARKETPLACE_SAFETY_RULES,
    notes: [
      'OAuth is scaffold-only in this seed and must remain disabled unless explicitly configured.',
      'Codex must store access tokens only through encrypted secret references.',
      'Codex must not replace manual workflows with live API calls until feature flags and tests pass.',
    ],
  };
}
