import { AGENCY_WHITE_LABEL_SAFE_COPY, getAgencyQueueStatusTone, normalizeAgencyQueueStatus, summarizeAgencyQueue, type AgencyQueueItemInput } from '@/domain/agency-white-label';
import { agencyBulkQueuePlanSchema, agencyQueueQuerySchema, type AgencyBulkQueuePlanInput, type AgencyQueueQuery } from '@/schemas/agency-white-label';

export const demoAgencyQueueItems: AgencyQueueItemInput[] = [
  { id: 'agency_queue_001', workspaceId: 'agency_workspace_aster', clientName: 'Aster Handmade', jobTitle: 'Spring jewelry cleanup batch', packageName: 'Marketplace Listing Pack', status: 'PROCESSING', imageCount: 48, priority: 'HIGH', dueAt: '2026-06-09T18:00:00.000Z', requiresManualReview: true },
  { id: 'agency_queue_002', workspaceId: 'agency_workspace_northstar', clientName: 'Northstar Goods', jobTitle: 'Shopify launch hero pack', packageName: 'Product Launch Image Pack', status: 'WAITING_FOR_REVIEW', imageCount: 96, priority: 'URGENT', dueAt: '2026-06-10T18:00:00.000Z', requiresManualReview: true },
  { id: 'agency_queue_003', workspaceId: 'agency_workspace_bright', clientName: 'Bright Pantry', jobTitle: 'TikTok Shop recipe social set', packageName: 'Quick Cleanup Pack', status: 'FLAGGED', imageCount: 24, priority: 'NORMAL', dueAt: '2026-06-12T18:00:00.000Z', requiresManualReview: true },
  { id: 'agency_queue_004', workspaceId: 'agency_workspace_northstar', clientName: 'Northstar Goods', jobTitle: 'Amazon comparison image set', packageName: 'Marketplace Listing Pack', status: 'READY_FOR_DELIVERY', imageCount: 36, priority: 'NORMAL', dueAt: '2026-06-08T18:00:00.000Z', requiresManualReview: false },
];

export function buildAgencyQueueRows(items: AgencyQueueItemInput[] = demoAgencyQueueItems, query: Record<string, unknown> = {}) {
  const parsed = agencyQueueQuerySchema.parse(query);
  return items
    .filter((item) => (parsed.workspaceId ? item.workspaceId === parsed.workspaceId : true))
    .filter((item) => (parsed.status ? normalizeAgencyQueueStatus(item.status) === parsed.status : true))
    .filter((item) => (parsed.priority ? item.priority === parsed.priority : true))
    .filter((item) => (typeof parsed.requiresManualReview === 'boolean' ? Boolean(item.requiresManualReview) === parsed.requiresManualReview : true))
    .map((item) => {
      const status = normalizeAgencyQueueStatus(item.status);
      return {
        ...item,
        status,
        statusTone: getAgencyQueueStatusTone(status),
        imageCount: item.imageCount ?? 0,
        priority: item.priority ?? 'NORMAL',
        requiresManualReview: Boolean(item.requiresManualReview),
      };
    });
}

export function buildAgencyQueueSummary(items: AgencyQueueItemInput[] = demoAgencyQueueItems) {
  return {
    ...summarizeAgencyQueue(items),
    safeCopy: AGENCY_WHITE_LABEL_SAFE_COPY.deliveryNotice,
    dryRun: true,
  };
}

export function buildAgencyBulkQueuePlan(input: AgencyBulkQueuePlanInput) {
  const parsed = agencyBulkQueuePlanSchema.parse(input);
  return {
    ...parsed,
    itemCount: parsed.jobIds.length,
    presetCount: parsed.targetPresetKeys.length,
    status: 'PLANNED' as const,
    requiresManualReview: true,
    auditRequired: true,
    codexNote: 'Codex must convert this draft to tenant-scoped queue records and never overwrite original uploads.',
  };
}
