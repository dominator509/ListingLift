import { DEFAULT_FIVERR_GIG_MAPPINGS, findFiverrGigMapping, type FiverrGigMapping } from '@/domain/fiverr';

export function listFiverrGigMappings() {
  return DEFAULT_FIVERR_GIG_MAPPINGS.map((mapping) => ({ ...mapping }));
}

export function getFiverrGigMapping(key: string) {
  return DEFAULT_FIVERR_GIG_MAPPINGS.find((mapping) => mapping.key === key) ?? null;
}

export function resolveFiverrGigMapping(input: { gigTitle?: string; packagePurchased?: string; tierKey?: string; packageKey?: string }) {
  const explicit = input.tierKey ? getFiverrGigMapping(input.tierKey) : null;
  const mapped = explicit ?? findFiverrGigMapping(input);
  return {
    mapping: mapped,
    confidence: explicit ? 'EXACT_TIER_KEY' : mapped.searchHints.some((hint) => `${input.gigTitle ?? ''} ${input.packagePurchased ?? ''}`.toLowerCase().includes(hint.toLowerCase())) ? 'HINT_MATCH' : 'DEFAULT',
    packageKey: input.packageKey ?? mapped.packageKey,
    imageAllowance: mapped.imageAllowance,
    revisionAllowance: mapped.revisionAllowance,
    defaultTurnaroundDays: mapped.defaultTurnaroundDays,
  };
}

export function buildFiverrMappingUpsertDraft(mapping: FiverrGigMapping, organizationId = 'seed-org') {
  return {
    organizationId,
    gigKey: mapping.key,
    gigTitle: mapping.gigTitle,
    packageKey: mapping.packageKey,
    imageAllowance: mapping.imageAllowance,
    revisionAllowance: mapping.revisionAllowance,
    deliveryMode: mapping.deliveryMode,
    createsUploadLink: mapping.createsUploadLink,
    active: mapping.active,
    auditAction: 'fiverr.gig_mapping.upsert',
  };
}
