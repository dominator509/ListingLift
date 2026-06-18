import { type MarketplaceRevisionStatus } from '@/domain/amazon-ebay-woocommerce';

export interface MarketplaceRevisionStatusInput {
  revisionStatus: MarketplaceRevisionStatus;
  jobId?: string;
  channelKey?: string;
  manualExternalStatus?: string;
  revisionNotes?: string;
}

export function createMarketplaceRevisionStatusDraft(input: MarketplaceRevisionStatusInput) {
  const open = ['REQUESTED', 'IN_PROGRESS', 'READY_FOR_REVIEW'].includes(input.revisionStatus);
  return {
    jobId: input.jobId,
    channelKey: input.channelKey,
    revisionStatus: input.revisionStatus,
    revisionOpen: open,
    blockCompletion: open,
    manualExternalStatus: input.manualExternalStatus,
    sanitizedNotes: sanitize(input.revisionNotes),
    auditRequired: true,
  };
}

function sanitize(value?: string) {
  return value?.replace(/[<>]/g, '').slice(0, 2000);
}
