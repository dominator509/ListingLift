export interface CsrfTokenDraftInput {
  sessionId: string;
  organizationId: string;
  csrfSecret: string;
  expiresInMinutes: number;
}

export interface CsrfVerificationInput {
  sessionId: string;
  organizationId: string;
  csrfSecret: string;
  token: string;
  nowIso?: string;
}

export interface SecurityRateLimitEvaluationInput {
  action: string;
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
  secretClass: string;
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
  provider: string;
  payload: string;
  secretConfigured: boolean;
  signatureHeader: string | null;
  eventId?: string;
}

export const csrfTokenDraftSchema = {
  parse: (input: CsrfTokenDraftInput) => {
    if (!input.sessionId) throw new Error('sessionId required');
    if (!input.organizationId) throw new Error('organizationId required');
    if (!input.csrfSecret || input.csrfSecret.length < 16) throw new Error('csrfSecret must be at least 16 chars');
    if (!Number.isFinite(input.expiresInMinutes) || input.expiresInMinutes < 1) throw new Error('expiresInMinutes must be >= 1');
    return input;
  },
};

export const csrfVerificationSchema = {
  parse: (input: CsrfVerificationInput) => {
    if (!input.sessionId) throw new Error('sessionId required');
    if (!input.organizationId) throw new Error('organizationId required');
    if (!input.csrfSecret) throw new Error('csrfSecret required');
    if (!input.token) throw new Error('token required');
    return input;
  },
};

export const securityAuditEventDraftSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return { sessionId: input.sessionId, action: input.action, resource: input.resource, metadata: input.metadata };
  },
};

export const securityDashboardQuerySchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') return {};
    return { timeframe: input.timeframe as string | undefined };
  },
};

export const securityRateLimitEvaluationSchema = {
  parse: (input: unknown): SecurityRateLimitEvaluationInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      action: input.action as string,
      subjectParts: input.subjectParts as Record<string, string | null | undefined>,
      observedCount: input.observedCount as number,
    };
  },
};

export const securitySecretReferenceDraftSchema = {
  parse: (input: unknown): SecuritySecretReferenceDraftInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      organizationId: input.organizationId as string,
      provider: input.provider as string,
      secretClass: input.secretClass as string,
      label: input.label as string,
      encryptedSecretRef: input.encryptedSecretRef as string | undefined,
      createdByUserId: input.createdByUserId as string | undefined,
      metadata: input.metadata as Record<string, unknown>,
    };
  },
};

export const securityTokenLifecycleDraftSchema = {
  parse: (input: unknown): SecurityTokenLifecycleDraftInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      organizationId: input.organizationId as string,
      tokenKind: input.tokenKind as string,
      resourceId: input.resourceId as string,
      expiresInMinutes: input.expiresInMinutes as number,
      approvedOnly: input.approvedOnly as boolean | undefined,
      scope: input.scope as Record<string, unknown> | undefined,
      maxUses: input.maxUses as number | undefined,
      createdByUserId: input.createdByUserId as string | undefined,
    };
  },
};

export const securityTokenRecordProbeSchema = {
  parse: (input: unknown): SecurityTokenRecordProbeInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      tokenKind: input.tokenKind as string,
      tokenHash: input.tokenHash as string,
      expiresAt: input.expiresAt as Date,
      revokedAt: input.revokedAt as Date | null | undefined,
      organizationId: input.organizationId as string | undefined,
      clientId: input.clientId as string | undefined,
      jobId: input.jobId as string | undefined,
      agencyWorkspaceId: input.agencyWorkspaceId as string | undefined,
      approvedOnly: input.approvedOnly as boolean | undefined,
    };
  },
};

export const securityUploadProbeSchema = {
  parse: (input: unknown): SecurityUploadProbeInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      fileName: input.fileName as string,
      mimeType: input.mimeType as string,
      sizeBytes: input.sizeBytes as number,
      sourceSurface: input.sourceSurface as string,
      sha256: input.sha256 as string | undefined,
      width: input.width as number | undefined,
      height: input.height as number | undefined,
    };
  },
};

export const securityZipEntryProbeSchema = {
  parse: (input: unknown): SecurityZipEntryProbeInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      path: input.path as string,
      sizeBytes: input.sizeBytes as number,
      isDirectory: input.isDirectory as boolean,
    };
  },
};

export const webhookSignatureProbeSchema = {
  parse: (input: unknown): WebhookSignatureProbeInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      provider: input.provider as string,
      payload: input.payload as string,
      secretConfigured: input.secretConfigured as boolean,
      signatureHeader: input.signatureHeader as string | null,
      eventId: input.eventId as string | undefined,
    };
  },
};
