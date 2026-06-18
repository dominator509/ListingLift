import { addMinutes } from '@/lib/date';
import { randomToken, sha256 } from '@/lib/hash';
import { evaluateDeliveryAccess } from '@/domain/delivery-notifications';
import { deliveryLinkIssueSchema, deliveryTokenResolveSchema, type DeliveryLinkIssueInput, type DeliveryTokenResolveInput } from '@/schemas/delivery-notification';

export function issueDeliveryLinkDraft(input: DeliveryLinkIssueInput & { organizationId?: string; clientId?: string | null; actorUserId?: string | null; appUrl?: string }) {
  const data = deliveryLinkIssueSchema.parse(input);
  const token = randomToken();
  const expiresAt = addMinutes(new Date(), data.expiresInMinutes);
  const baseUrl = input.appUrl ?? process.env.APP_URL ?? 'http://localhost:3000';
  return {
    organizationId: input.organizationId ?? 'codex-wire-organization-id',
    jobId: data.jobId,
    clientId: input.clientId ?? null,
    deliveryArchiveId: data.deliveryArchiveId ?? null,
    token,
    tokenHash: sha256(token),
    publicUrl: `${baseUrl.replace(/\/$/, '')}/delivery/${token}`,
    recipientEmail: data.recipientEmail,
    recipientName: data.recipientName ?? null,
    expiresAt,
    maxDownloads: data.maxDownloads,
    downloadCount: 0,
    status: 'ACTIVE',
    approvedOnly: true,
    deliveryNotes: data.deliveryNotes ?? null,
    sentByUserId: input.actorUserId ?? null,
    auditEvent: 'delivery.link_issue_requested',
    guardrail: 'Persist tokenHash only. Never persist or log raw token. Client download remains gated by approval, archive status, expiry, and RBAC/token checks.',
  };
}

export function resolveDeliveryTokenDraft(input: DeliveryTokenResolveInput & {
  jobId: string;
  jobStatus?: string | null;
  deliveryLinkStatus?: string | null;
  deliveryArchiveStatus?: string | null;
  tokenHashFromDatabase: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  approvedAt?: Date | null;
  deliveryArchiveApprovedAt?: Date | null;
  downloadCount?: number | null;
  maxDownloads?: number | null;
}) {
  const data = deliveryTokenResolveSchema.parse(input);
  const tokenHash = sha256(data.token);
  const hashMatches = tokenHash === input.tokenHashFromDatabase;
  const access = hashMatches
    ? evaluateDeliveryAccess({
        jobId: input.jobId,
        jobStatus: input.jobStatus,
        deliveryLinkStatus: input.deliveryLinkStatus,
        deliveryArchiveStatus: input.deliveryArchiveStatus,
        tokenExpiresAt: input.expiresAt,
        tokenRevokedAt: input.revokedAt,
        approvedAt: input.approvedAt,
        deliveryArchiveApprovedAt: input.deliveryArchiveApprovedAt,
        downloadCount: input.downloadCount,
        maxDownloads: input.maxDownloads,
      })
    : { jobId: input.jobId, allowed: false, publicStatus: 'NOT_READY' as const, blockers: ['Delivery token was not found.'], warnings: [], safeLanguage: 'Delivery links are private and expiring.' };
  return {
    tokenHash,
    hashMatches,
    access,
    eventDraft: {
      type: access.allowed ? 'TOKEN_RESOLVED' : 'DOWNLOAD_DENIED',
      requestIp: data.requestIp ?? null,
      userAgent: data.userAgent ?? null,
      metadata: { publicStatus: access.publicStatus, blockerCount: access.blockers.length },
    },
  };
}

export function buildDeliveryLinkPublicView(input: { publicUrl: string; expiresAt: Date; fileName?: string | null; fileCount?: number | null; downloadCount?: number | null; maxDownloads?: number | null }) {
  return {
    publicUrl: input.publicUrl,
    expiresAt: input.expiresAt.toISOString(),
    fileName: input.fileName ?? 'ListingLift_Delivery.zip',
    fileCount: input.fileCount ?? 0,
    downloadsRemaining: input.maxDownloads ? Math.max(input.maxDownloads - (input.downloadCount ?? 0), 0) : null,
    safeLanguage: 'Download and review all files before publishing. Marketplace approval, ranking, sales, and ad performance are not guaranteed.',
  };
}
