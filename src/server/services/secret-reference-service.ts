import { randomToken } from '@/lib/hash';
import { assertNoRawSecretValue, redactSecurityMetadata, type SecuritySecretClass } from '@/domain/security-hardening';
import { securitySecretReferenceDraftSchema, type SecuritySecretReferenceDraftInput } from '@/schemas/security-hardening';

export type SecuritySecretReferenceDraft = {
  organizationId: string;
  provider: string;
  secretClass: SecuritySecretClass;
  label: string;
  encryptedSecretRef: string;
  rawSecretStored: false;
  createdByUserId?: string | null;
  metadata: Record<string, unknown>;
  codexNote: string;
};

export function buildEncryptedSecretRefDraft(provider: string, secretClass: SecuritySecretClass) {
  return `enc_ref_${provider.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${secretClass.toLowerCase()}_${randomToken(10)}`;
}

export function buildSecuritySecretReferenceDraft(input: SecuritySecretReferenceDraftInput): SecuritySecretReferenceDraft {
  const parsed = securitySecretReferenceDraftSchema.parse(input);
  assertNoRawSecretValue(parsed.metadata);
  return {
    organizationId: parsed.organizationId,
    provider: parsed.provider,
    secretClass: parsed.secretClass,
    label: parsed.label,
    encryptedSecretRef: parsed.encryptedSecretRef ?? buildEncryptedSecretRefDraft(parsed.provider, parsed.secretClass),
    rawSecretStored: false,
    createdByUserId: parsed.createdByUserId ?? null,
    metadata: redactSecurityMetadata(parsed.metadata),
    codexNote: 'Scaffold only. Codex must replace draft encryptedSecretRef generation with audited KMS/envelope encryption or provider secret manager storage before production.',
  };
}

export function redactSecretBearingObject(input: Record<string, unknown>) {
  return redactSecurityMetadata(input);
}

export function assertNoPlaintextSecretFields(input: Record<string, unknown>) {
  assertNoRawSecretValue(input);
  return true;
}
