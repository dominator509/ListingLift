import { randomToken, safeCompare, sha256 } from '@/lib/hash';
import { getApiTokenPrefix, maskApiToken, normalizeApiScopes, type ApiAccessScope } from '@/domain/api-access';
import { apiTokenCreateSchema, apiTokenRevokeSchema, type ApiTokenCreateInput, type ApiTokenRevokeInput } from '@/schemas/api-access';

export const API_TOKEN_PREFIX = 'll_api_' as const;

export type ApiTokenRecordDraft = {
  organizationId: string;
  clientId?: string | null;
  agencyWorkspaceId?: string | null;
  label: string;
  tokenHash: string;
  tokenPrefix: string;
  scopes: ApiAccessScope[];
  status: 'ACTIVE';
  planKey: string;
  expiresAt?: Date | null;
  createdByUserId?: string | null;
  shownAt: Date;
  metadata: { tokenShownOnce: true; rawTokenStored: false; codexPersistenceRequired: true };
};

export function hashApiToken(rawToken: string) {
  return sha256(rawToken);
}

export function createRawApiToken() {
  return `${API_TOKEN_PREFIX}${randomToken(32)}`;
}

export function issueApiTokenDraft(input: ApiTokenCreateInput & { organizationId: string; createdByUserId?: string | null }) {
  const parsed = apiTokenCreateSchema.parse(input);
  const token = createRawApiToken();
  const scopes = normalizeApiScopes(parsed.scopes);
  const record: ApiTokenRecordDraft = {
    organizationId: input.organizationId,
    clientId: parsed.clientId ?? null,
    agencyWorkspaceId: parsed.agencyWorkspaceId ?? null,
    label: parsed.label,
    tokenHash: hashApiToken(token),
    tokenPrefix: getApiTokenPrefix(token),
    scopes,
    status: 'ACTIVE',
    planKey: parsed.planKey,
    expiresAt: parsed.expiresAt ?? null,
    createdByUserId: input.createdByUserId ?? null,
    shownAt: new Date(),
    metadata: { tokenShownOnce: true, rawTokenStored: false, codexPersistenceRequired: true },
  };
  return {
    token,
    maskedToken: maskApiToken(token),
    showOnceWarning: 'Copy this token now. ListingLift must only store the hash and cannot display the raw token again.',
    record,
    auditEvent: { eventType: 'CREATED' as const, scope: null, metadata: { scopes, tokenPrefix: record.tokenPrefix, rawTokenStored: false } },
  };
}

export function verifyApiTokenAgainstRecord(rawToken: string, record: { tokenHash: string; status?: string | null; expiresAt?: Date | string | null; revokedAt?: Date | string | null }) {
  const hashMatches = safeCompare(hashApiToken(rawToken), record.tokenHash);
  const active = (record.status ?? 'ACTIVE').toString().toUpperCase() === 'ACTIVE';
  const expiresAt = record.expiresAt ? new Date(record.expiresAt) : null;
  const expired = Boolean(expiresAt && expiresAt.getTime() <= Date.now());
  const revoked = Boolean(record.revokedAt);
  if (!hashMatches) return { valid: false, reason: 'hash_mismatch' as const };
  if (!active) return { valid: false, reason: 'inactive_token' as const };
  if (expired) return { valid: false, reason: 'expired' as const };
  if (revoked) return { valid: false, reason: 'revoked' as const };
  return { valid: true, reason: null };
}

export function buildApiTokenRevokeDraft(input: ApiTokenRevokeInput & { organizationId: string; actorUserId?: string | null }) {
  const parsed = apiTokenRevokeSchema.parse(input);
  return {
    organizationId: input.organizationId,
    tokenId: parsed.tokenId,
    status: 'REVOKED' as const,
    revokedAt: new Date(),
    revokedByUserId: input.actorUserId ?? null,
    reason: parsed.reason,
    auditEvent: { eventType: 'TOKEN_REVOKED' as const, tokenId: parsed.tokenId, metadata: { reason: parsed.reason } },
  };
}

export function redactedApiTokenRecord(record: ApiTokenRecordDraft) {
  const { tokenHash, ...safeRecord } = record;
  return {
    ...safeRecord,
    tokenHash: '[redacted-hash]',
    rawTokenStored: false,
  };
}
