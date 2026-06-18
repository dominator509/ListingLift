import { ETSY_MARKETPLACE_SAFETY_RULES, isUnsafeEtsyAction } from '@/domain/etsy';
import { etsySafetyCheckSchema, type EtsySafetyCheckInput } from '@/schemas/etsy';

export function checkEtsyWorkflowSafety(input: EtsySafetyCheckInput) {
  const parsed = etsySafetyCheckSchema.parse(input);
  const unsafeActions = parsed.intendedActions.filter(isUnsafeEtsyAction);
  const blockingReasons = [
    parsed.storesPassword ? 'Etsy password storage is prohibited.' : undefined,
    parsed.scrapesPrivatePages ? 'Scraping private Etsy seller/order/message pages is prohibited.' : undefined,
    parsed.automatesBuyerMessages ? 'Automated Etsy buyer messaging is prohibited unless an approved integration explicitly permits it.' : undefined,
    parsed.editsListingsAutomatically ? 'Automated Etsy listing edits are out of scope for this phase.' : undefined,
    ...unsafeActions.map((action) => `Unsafe intended action: ${action}`),
  ].filter(Boolean) as string[];
  return {
    allowed: blockingReasons.length === 0,
    blockingReasons,
    safetyRules: ETSY_MARKETPLACE_SAFETY_RULES,
    manualFallbackRequired: parsed.sourceMode !== 'MANUAL' || blockingReasons.length > 0,
    externalLinkAllowed: parsed.externalLinkAllowed,
  };
}
