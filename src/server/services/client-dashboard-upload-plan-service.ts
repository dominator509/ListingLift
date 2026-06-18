export type ClientDashboardUploadPlanInput = {
  organizationId: string;
  clientId?: string | null;
  jobId: string;
  requestedFileCount: number;
  requestedZipUpload?: boolean;
  packageImageAllowance?: number | null;
  currentUploadedCount?: number;
};

export function buildClientDashboardUploadPlan(input: ClientDashboardUploadPlanInput) {
  const currentUploadedCount = input.currentUploadedCount ?? 0;
  const requestedFileCount = input.requestedFileCount;
  const packageAllowance = input.packageImageAllowance ?? null;
  const projectedCount = currentUploadedCount + requestedFileCount;
  const exceedsAllowance = packageAllowance !== null && projectedCount > packageAllowance;
  return {
    organizationId: input.organizationId,
    clientId: input.clientId ?? null,
    jobId: input.jobId,
    requestedFileCount,
    requestedZipUpload: Boolean(input.requestedZipUpload),
    projectedCount,
    packageAllowance,
    allowed: !exceedsAllowance,
    requiresOperatorReview: exceedsAllowance || Boolean(input.requestedZipUpload),
    uploadTokenRequired: true,
    originalPreservationRequired: true,
    unsafeFileRejectionRequired: true,
    codexNote: 'Codex must create/resolve upload tokens server-side and never trust client-submitted organization/client/job IDs.',
  };
}
