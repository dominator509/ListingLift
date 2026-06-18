import { CLIENT_DOWNLOAD_REQUIREMENTS, CLIENT_HIDDEN_OUTPUT_STATUSES, isClientVisiblePreview } from '@/domain/client-dashboard';

export type ClientDashboardSessionLike = {
  organizationId: string;
  userId: string;
  role?: string | null;
  clientId?: string | null;
  permissions?: readonly string[];
};

export type ClientScopedResource = {
  organizationId: string;
  clientId?: string | null;
};

export function assertClientDashboardResourceAccess(session: ClientDashboardSessionLike, resource: ClientScopedResource) {
  if (session.organizationId !== resource.organizationId) {
    throw new Error('Tenant scope mismatch. Client dashboard access denied.');
  }
  if (session.clientId && resource.clientId && session.clientId !== resource.clientId) {
    throw new Error('Client scope mismatch. Client dashboard access denied.');
  }
  return true;
}

export function buildClientDashboardWhere(session: ClientDashboardSessionLike, clientId?: string | null) {
  return {
    organizationId: session.organizationId,
    ...(session.clientId ? { clientId: session.clientId } : clientId ? { clientId } : {}),
    deletedAt: null,
  };
}

export function evaluateClientPreviewVisibility(input: { visibility?: string | null; reviewStatus?: string | null; flagged?: boolean | null; failed?: boolean | null; status?: string | null }) {
  const hidden = CLIENT_HIDDEN_OUTPUT_STATUSES.includes(((input.status ?? '').toUpperCase() as typeof CLIENT_HIDDEN_OUTPUT_STATUSES[number]));
  return {
    visible: !hidden && isClientVisiblePreview(input),
    reason: hidden ? 'Output status is not client-visible.' : isClientVisiblePreview(input) ? 'Approved for client preview.' : 'Pending admin approval.',
  };
}

export function evaluateClientDownloadGate(input: {
  activeSession: boolean;
  clientScopeMatch: boolean;
  deliveryLinkValid: boolean;
  deliveryArchiveApproved: boolean;
  jobApproved: boolean;
  blockingQualityFlags: number;
  downloadLimitExceeded: boolean;
}) {
  const failed: string[] = [];
  if (!input.activeSession) failed.push('active_session');
  if (!input.clientScopeMatch) failed.push('client_scope_match');
  if (!input.deliveryLinkValid) failed.push('delivery_link_valid');
  if (!input.deliveryArchiveApproved) failed.push('delivery_archive_approved');
  if (!input.jobApproved) failed.push('job_approved');
  if (input.blockingQualityFlags > 0) failed.push('no_blocking_quality_flags');
  if (input.downloadLimitExceeded) failed.push('download_limit_not_exceeded');
  return {
    allowed: failed.length === 0,
    failedRequirements: failed,
    requiredChecks: [...CLIENT_DOWNLOAD_REQUIREMENTS],
  };
}
