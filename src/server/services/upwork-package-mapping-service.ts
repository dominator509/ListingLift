import { DEFAULT_UPWORK_OFFER_MAPPINGS, findUpworkOfferMapping, type UpworkOfferMapping } from '@/domain/upwork';
import { upworkOfferMappingSchema } from '@/schemas/upwork';

export function listDefaultUpworkOfferMappings() {
  return DEFAULT_UPWORK_OFFER_MAPPINGS.map((mapping) => upworkOfferMappingSchema.parse(mapping));
}

export function resolveUpworkOfferMapping(input: { contractTitle?: string; contractType?: string; offerKey?: string; packagePurchased?: string; packageKey?: string }) {
  const mapping = findUpworkOfferMapping(input);
  const packageKey = input.packageKey ?? mapping.packageKey;
  return {
    mapping: upworkOfferMappingSchema.parse(mapping),
    packageKey,
    imageAllowance: mapping.imageAllowance,
    revisionAllowance: mapping.revisionAllowance,
    defaultTurnaroundDays: mapping.defaultTurnaroundDays,
    defaultMilestoneStatus: mapping.defaultMilestoneStatus,
    deliveryMode: mapping.deliveryMode,
  };
}

export function validateUpworkOfferMappingDraft(input: UpworkOfferMapping) {
  return upworkOfferMappingSchema.parse(input);
}
