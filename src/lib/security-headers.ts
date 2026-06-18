import { SECURITY_HEADER_POLICY_DRAFT } from '@/domain/security-hardening';

export type SecurityHeaderEnvironment = 'development' | 'test' | 'production';

export function buildSecurityHeaderEntries(environment: SecurityHeaderEnvironment = 'production') {
  const entries: Array<[string, string]> = SECURITY_HEADER_POLICY_DRAFT.map((item) => [item.header, item.value]);
  if (environment === 'production') {
    entries.push(['Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload']);
  }
  return entries;
}

export function applySecurityHeaders(headers: Headers, environment: SecurityHeaderEnvironment = 'production') {
  for (const [header, value] of buildSecurityHeaderEntries(environment)) {
    headers.set(header, value);
  }
  return headers;
}
