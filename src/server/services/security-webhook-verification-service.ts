import { redactSecurityMetadata, type SecurityWebhookProvider } from '@/domain/security-hardening';
import { webhookSignatureProbeSchema, type WebhookSignatureProbeInput } from '@/schemas/security-hardening';

export function buildWebhookVerificationDecision(input: WebhookSignatureProbeInput) {
  const parsed = webhookSignatureProbeSchema.parse(input);
  const missingSecret = !parsed.secretConfigured;
  const missingSignature = !parsed.signatureHeader;
  const canAutoProcess = !missingSecret && !missingSignature && parsed.provider !== 'CUSTOM';
  const reason = missingSecret
    ? 'missing_secret_reference'
    : missingSignature
      ? 'missing_signature_header'
      : parsed.provider === 'CUSTOM'
        ? 'custom_provider_requires_codex_adapter'
        : 'signature_adapter_required';
  return {
    provider: parsed.provider,
    canAutoProcess: false,
    dryRunVerificationEligible: canAutoProcess,
    reason,
    eventId: parsed.eventId ?? null,
    metadata: redactSecurityMetadata({ provider: parsed.provider, reason, payloadLength: parsed.payload.length, signatureHeader: parsed.signatureHeader ? '[present]' : null }),
    codexNote: 'Codex must call provider-specific signature verification against the raw request body before creating paid/client-facing state changes. This scaffold intentionally never auto-processes.',
  };
}

export function requiredWebhookHeaders(provider: SecurityWebhookProvider) {
  switch (provider) {
    case 'STRIPE':
      return ['stripe-signature'];
    case 'GUMROAD':
      return ['x-gumroad-signature or configured equivalent'];
    case 'SHOPIFY':
      return ['x-shopify-hmac-sha256'];
    case 'ETSY':
      return ['provider-supported signature header when available'];
    case 'API_ACCESS_WEBHOOK':
    case 'AUTOMATION_WEBHOOK':
      return ['x-listinglift-signature', 'x-listinglift-timestamp'];
    default:
      return ['provider-specific signature header'];
  }
}
