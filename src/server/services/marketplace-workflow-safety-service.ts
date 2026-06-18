import { MARKETPLACE_EXPORT_SAFETY_RULES, type MarketplaceExportChannelKey } from '@/domain/amazon-ebay-woocommerce';

const unsafePatterns = [
  /scrap(e|ing)/i,
  /seller central password/i,
  /ebay password/i,
  /woocommerce admin password/i,
  /auto[-\s]?publish/i,
  /auto[-\s]?upload/i,
  /auto[-\s]?edit/i,
  /buyer message automation/i,
  /guarantee(d)? (approval|ranking|sales|conversion|compliance)/i,
];

export function runMarketplaceWorkflowSafetyCheck(input: { action: string; channelKey?: MarketplaceExportChannelKey }) {
  const violations = unsafePatterns.filter((pattern) => pattern.test(input.action)).map((pattern) => pattern.source);
  return {
    channelKey: input.channelKey,
    action: input.action,
    allowed: violations.length === 0,
    violations,
    rules: MARKETPLACE_EXPORT_SAFETY_RULES,
    manualFallbackRequired: true,
  };
}
