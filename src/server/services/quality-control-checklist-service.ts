import { buildQualityChecklist, QUALITY_FLAG_DEFINITIONS } from '@/domain/quality-control';

export function getQualityControlChecklist() {
  return {
    version: 'phase-14-qc-v1',
    items: buildQualityChecklist(),
    blockerKeys: QUALITY_FLAG_DEFINITIONS.filter((flag) => flag.blocksDelivery).map((flag) => flag.key),
    safeLanguage: 'Quality control is an internal fulfillment review. Outputs are platform-ready drafts with seller review recommended; no marketplace approval, ranking, sales, conversion, or ad-performance guarantees.',
  };
}

export function groupQualityChecklistByCategory() {
  return getQualityControlChecklist().items.reduce<Record<string, ReturnType<typeof getQualityControlChecklist>['items']>>((groups, item) => {
    groups[item.category] = [...(groups[item.category] ?? []), item];
    return groups;
  }, {});
}
