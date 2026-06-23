export interface CsrfTokenDraftInput {
  sessionId?: string;
  organizationId: string;
  csrfSecret: string;
  expiresInMinutes: number;
}

export interface CsrfVerificationInput {
  sessionId?: string;
  organizationId: string;
  csrfSecret: string;
  token?: string;
  nowIso?: string;
}

export interface SecurityRateLimitEvaluationInput {
  action: SecurityRateLimitAction;
  subjectParts: Record<string, string | null | undefined>;
  observedCount: number;
}

export interface SecurityTokenLifecycleDraftInput {
  organizationId: string;
  tokenKind: string;
  resourceId: string;
  expiresInMinutes: number;
  approvedOnly?: boolean;
  scope?: Record<string, unknown>;
  maxUses?: number;
  createdByUserId?: string;
}

export interface SecurityTokenRecordProbeInput {
  tokenKind: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  organizationId?: string;
  clientId?: string;
  jobId?: string;
  agencyWorkspaceId?: string;
  approvedOnly?: boolean;
}

export interface SecuritySecretReferenceDraftInput {
  organizationId: string;
  provider: string;
  secretClass: SecuritySecretClass;
  label: string;
  encryptedSecretRef?: string;
  createdByUserId?: string;
  metadata: Record<string, unknown>;
}

export interface SecurityUploadProbeInput {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sourceSurface: string;
  sha256?: string;
  width?: number;
  height?: number;
}

export interface SecurityZipEntryProbeInput {
  path: string;
  sizeBytes: number;
  isDirectory: boolean;
}

export interface WebhookSignatureProbeInput {
  provider: 'STRIPE' | 'GUMROAD' | 'SHOPIFY' | 'ETSY' | 'API_ACCESS_WEBHOOK' | 'AUTOMATION_WEBHOOK' | 'CUSTOM';
  payload: string;
  secretConfigured: boolean;
  signatureHeader: string | null;
  eventId?: string;
}

export interface SecurityAuditEventDraftInput {
  sessionId: string;
  organizationId?: string;
  userId?: string;
  action: string;
  eventType?: string;
  controlArea?: string;
  route?: string;
  resource: string;
  resourceType?: string;
  resourceId?: string;
  metadata: Record<string, unknown>;
}

export const csrfTokenDraftSchema = {
  parse: (input: unknown): CsrfTokenDraftInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    const parsed = {
      sessionId: obj.sessionId as string | undefined,
      organizationId: obj.organizationId as string,
      csrfSecret: obj.csrfSecret as string,
      expiresInMinutes: obj.expiresInMinutes as number,
    };
    if (!parsed.organizationId) throw new Error('organizationId required');
    if (!parsed.csrfSecret || parsed.csrfSecret.length < 16) throw new Error('csrfSecret must be at least 16 chars');
    if (!Number.isFinite(parsed.expiresInMinutes) || parsed.expiresInMinutes < 1) throw new Error('expiresInMinutes must be >= 1');
    return parsed;
  },
};

export const csrfVerificationSchema = {
  parse: (input: unknown): CsrfVerificationInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    const parsed = {
      sessionId: obj.sessionId as string | undefined,
      organizationId: obj.organizationId as string,
      csrfSecret: obj.csrfSecret as string,
      token: obj.token as string | undefined,
      nowIso: obj.nowIso as string | undefined,
    };
    if (!parsed.organizationId) throw new Error('organizationId required');
    if (!parsed.csrfSecret) throw new Error('csrfSecret required');
    return parsed;
  },
};

export const securityAuditEventDraftSchema = {
  parse: (input: unknown): SecurityAuditEventDraftInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      sessionId: obj.sessionId as string,
      organizationId: obj.organizationId as string | undefined,
      userId: obj.userId as string | undefined,
      action: obj.action as SecurityRateLimitAction,
      eventType: obj.eventType as string | undefined,
      controlArea: obj.controlArea as string | undefined,
      route: obj.route as string | undefined,
      resource: obj.resource as string,
      resourceType: obj.resourceType as string | undefined,
      resourceId: obj.resourceId as string | undefined,
      metadata: (obj.metadata as Record<string, unknown> | undefined) ?? {},
    };
  },
};

export const securityDashboardQuerySchema = {
  parse: (input: unknown): { timeframe?: string; area?: string; status?: string } => {
    if (!input || typeof input !== 'object') return {};
    const obj = input as Record<string, unknown>;
    return {
      timeframe: obj.timeframe as string | undefined,
      area: obj.area as string | undefined,
      status: obj.status as string | undefined,
    };
  },
};

export const securityRateLimitEvaluationSchema = {
  parse: (input: unknown): SecurityRateLimitEvaluationInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      action: obj.action as SecurityRateLimitAction,
      subjectParts: obj.subjectParts as Record<string, string | null | undefined>,
      observedCount: obj.observedCount as number,
    };
  },
};

export const securitySecretReferenceDraftSchema = {
  parse: (input: unknown): SecuritySecretReferenceDraftInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      organizationId: obj.organizationId as string,
      provider: obj.provider as string,
      secretClass: obj.secretClass as SecuritySecretClass,
      label: obj.label as string,
      encryptedSecretRef: obj.encryptedSecretRef as string | undefined,
      createdByUserId: obj.createdByUserId as string | undefined,
      metadata: (obj.metadata as Record<string, unknown> | undefined) ?? {},
    };
  },
};

export const securityTokenLifecycleDraftSchema = {
  parse: (input: unknown): SecurityTokenLifecycleDraftInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      organizationId: obj.organizationId as string,
      tokenKind: obj.tokenKind as string,
      resourceId: obj.resourceId as string,
      expiresInMinutes: obj.expiresInMinutes as number,
      approvedOnly: obj.approvedOnly as boolean | undefined,
      scope: obj.scope as Record<string, unknown> | undefined,
      maxUses: obj.maxUses as number | undefined,
      createdByUserId: obj.createdByUserId as string | undefined,
    };
  },
};

export const securityTokenRecordProbeSchema = {
  parse: (input: unknown): SecurityTokenRecordProbeInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      tokenKind: obj.tokenKind as string,
      tokenHash: obj.tokenHash as string,
      expiresAt: obj.expiresAt as Date,
      revokedAt: obj.revokedAt as Date | null | undefined,
      organizationId: obj.organizationId as string | undefined,
      clientId: obj.clientId as string | undefined,
      jobId: obj.jobId as string | undefined,
      agencyWorkspaceId: obj.agencyWorkspaceId as string | undefined,
      approvedOnly: obj.approvedOnly as boolean | undefined,
    };
  },
};

export const securityUploadProbeSchema = {
  parse: (input: unknown): SecurityUploadProbeInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      fileName: obj.fileName as string,
      mimeType: obj.mimeType as string,
      sizeBytes: obj.sizeBytes as number,
      sourceSurface: obj.sourceSurface as string,
      sha256: obj.sha256 as string | undefined,
      width: obj.width as number | undefined,
      height: obj.height as number | undefined,
    };
  },
};

export const securityZipEntryProbeSchema = {
  parse: (input: unknown): SecurityZipEntryProbeInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      path: obj.path as string,
      sizeBytes: obj.sizeBytes as number,
      isDirectory: obj.isDirectory as boolean,
    };
  },
};

export const webhookSignatureProbeSchema = {
  parse: (input: unknown): WebhookSignatureProbeInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      provider: obj.provider as WebhookSignatureProbeInput['provider'],
      payload: obj.payload as string,
      secretConfigured: obj.secretConfigured as boolean,
      signatureHeader: obj.signatureHeader as string | null,
      eventId: obj.eventId as string | undefined,
    };
  },
};
import type { SecurityRateLimitAction, SecuritySecretClass } from '@/domain/security-hardening';
