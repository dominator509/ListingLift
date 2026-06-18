import type { ImageProviderError, ImageProviderErrorCode } from '@/server/adapters/image/types';

function inferErrorCode(message: string): ImageProviderErrorCode {
  const lower = message.toLowerCase();
  if (lower.includes('disabled')) return 'provider_disabled';
  if (lower.includes('real calls')) return 'real_calls_disabled';
  if (lower.includes('secret') || lower.includes('key') || lower.includes('token')) return 'missing_secret';
  if (lower.includes('rate')) return 'rate_limited';
  if (lower.includes('timeout') || lower.includes('timed out')) return 'timeout';
  if (lower.includes('unsupported')) return 'unsupported_operation';
  if (lower.includes('invalid')) return 'invalid_input';
  if (lower.includes('ssrf') || lower.includes('unsafe')) return 'unsafe_request';
  if (lower.includes('upstream') || lower.includes('provider')) return 'upstream_error';
  return 'unknown';
}

function retryableFor(code: ImageProviderErrorCode) {
  return ['rate_limited', 'timeout', 'upstream_error'].includes(code);
}

export function normalizeImageProviderError(providerKey: string, error: unknown, safeDetails?: Record<string, unknown>): ImageProviderError {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown image provider error.';
  const code = inferErrorCode(message);
  return {
    providerKey,
    code,
    message,
    retryable: retryableFor(code),
    manualFallbackRequired: true,
    safeDetails,
  };
}

export function providerDisabledError(providerKey: string, message = 'Image provider is disabled by feature flags.'): ImageProviderError {
  return {
    providerKey,
    code: 'provider_disabled',
    message,
    retryable: false,
    manualFallbackRequired: true,
  };
}

export function realCallsDisabledError(providerKey: string): ImageProviderError {
  return {
    providerKey,
    code: 'real_calls_disabled',
    message: 'Real image-provider calls are disabled. Enable REAL_IMAGE_PROVIDER_CALLS_ENABLED and the provider-specific flag after storing encrypted secrets.',
    retryable: false,
    manualFallbackRequired: true,
  };
}

export function missingSecretError(providerKey: string, secretNames: string[]): ImageProviderError {
  return {
    providerKey,
    code: 'missing_secret',
    message: `Missing encrypted secret reference(s): ${secretNames.join(', ')}.`,
    retryable: false,
    manualFallbackRequired: true,
    safeDetails: { missingSecretNames: secretNames },
  };
}
