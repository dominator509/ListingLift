import { addMinutes, isExpired } from '@/lib/date';
import { randomToken, sha256 } from '@/lib/hash';
import { securityTokenLifecycleDraftSchema, securityTokenRecordProbeSchema, type SecurityTokenLifecycleDraftInput, type SecurityTokenRecordProbeInput } from '@/schemas/security-hardening';

export function buildHashedSecurityTokenDraft(input: SecurityTokenLifecycleDraftInput) {
  const parsed = securityTokenLifecycleDraftSchema.parse(input);
  const rawToken = `ll_${parsed.tokenKind.toLowerCase()}_${randomToken(32)}`;
  const expiresAt = addMinutes(new Date(), parsed.expiresInMinutes);
  return {
    rawToken,
    tokenPreview: `${rawToken.slice(0, 8)}…${rawToken.slice(-6)}`,
    recordDraft: {
      organizationId: parsed.organizationId,
      tokenKind: parsed.tokenKind,
      resourceId: parsed.resourceId,
      tokenHash: sha256(rawToken),
      tokenPrefix: rawToken.slice(0, 12),
      scope: parsed.scope,
      expiresAt,
      maxUses: parsed.maxUses ?? null,
      approvedOnly: parsed.approvedOnly,
      createdByUserId: parsed.createdByUserId ?? null,
      rawTokenStored: false as const,
    },
    showOnceWarning: 'Raw token is returned only in this draft response. Codex must persist tokenHash only and never display the raw token again.',
  };
}

export function evaluateSecurityTokenRecord(input: SecurityTokenRecordProbeInput, now = new Date()) {
  const parsed = securityTokenRecordProbeSchema.parse(input);
  const expired = isExpired(parsed.expiresAt, now);
  const revoked = Boolean(parsed.revokedAt);
  const scoped = Boolean(parsed.organizationId || parsed.clientId || parsed.jobId || parsed.agencyWorkspaceId);
  const issues = [
    expired ? { code: 'token_expired', severity: 'error' as const, message: 'Token is expired and must be rejected.' } : null,
    revoked ? { code: 'token_revoked', severity: 'error' as const, message: 'Token has been revoked and must be rejected.' } : null,
    !scoped ? { code: 'missing_scope', severity: 'error' as const, message: 'Token must be scoped to organization/client/job/workspace.' } : null,
  ].filter((issue): issue is { code: string; severity: 'error'; message: string } => Boolean(issue));

  return {
    accepted: issues.length === 0,
    tokenKind: parsed.tokenKind,
    hashPresent: true,
    rawTokenStored: false,
    expiresAt: parsed.expiresAt,
    approvedOnly: parsed.approvedOnly ?? false,
    scoped,
    issues,
  };
}

export function redactTokenLikeRecord<T extends Record<string, unknown>>(record: T) {
  const clone: Record<string, unknown> = { ...record };
  for (const key of Object.keys(clone)) {
    if (/token|secret|password|authorization|cookie/i.test(key)) {
      clone[key] = '[redacted]';
    }
  }
  return clone as T;
}
