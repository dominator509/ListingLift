import { evaluateClientDownloadGate } from '@/server/services/client-dashboard-access-service';

export type ClientDownloadCardInput = {
  jobId: string;
  title: string;
  deliveryArchiveApproved: boolean;
  jobApproved: boolean;
  deliveryLinkValid: boolean;
  downloadCount?: number;
  maxDownloads?: number | null;
  blockingQualityFlags?: number;
};

export function buildClientDownloadCard(input: ClientDownloadCardInput) {
  const downloadLimitExceeded = input.maxDownloads !== null && input.maxDownloads !== undefined && (input.downloadCount ?? 0) >= input.maxDownloads;
  const gate = evaluateClientDownloadGate({
    activeSession: true,
    clientScopeMatch: true,
    deliveryLinkValid: input.deliveryLinkValid,
    deliveryArchiveApproved: input.deliveryArchiveApproved,
    jobApproved: input.jobApproved,
    blockingQualityFlags: input.blockingQualityFlags ?? 0,
    downloadLimitExceeded,
  });
  return {
    jobId: input.jobId,
    title: input.title,
    downloadable: gate.allowed,
    failedRequirements: gate.failedRequirements,
    downloadCount: input.downloadCount ?? 0,
    maxDownloads: input.maxDownloads ?? null,
    sellerReviewRecommended: true,
  };
}
