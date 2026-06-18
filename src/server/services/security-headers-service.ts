import { SECURITY_HEADER_POLICY_DRAFT } from '@/domain/security-hardening';
import { applySecurityHeaders, buildSecurityHeaderEntries, type SecurityHeaderEnvironment } from '@/lib/security-headers';

export function getSecurityHeaderPolicyRows(environment: SecurityHeaderEnvironment = 'production') {
  const entries = buildSecurityHeaderEntries(environment);
  return entries.map(([header, value]) => ({
    header,
    value,
    reason: SECURITY_HEADER_POLICY_DRAFT.find((item) => item.header === header)?.reason ?? 'Production HTTPS hardening header.',
    codexVerificationRequired: true,
  }));
}

export function applySecurityHeaderPolicy(response: Response, environment: SecurityHeaderEnvironment = 'production') {
  applySecurityHeaders(response.headers, environment);
  return response;
}
