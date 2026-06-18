import { sha256 } from '@/lib/hash';
import { SECURITY_RATE_LIMIT_POLICY_DRAFT, type SecurityRateLimitAction } from '@/domain/security-hardening';
import { securityRateLimitEvaluationSchema, type SecurityRateLimitEvaluationInput } from '@/schemas/security-hardening';

type Bucket = { count: number; resetAt: number };
const securityBuckets = new Map<string, Bucket>();

export function getSecurityRateLimitPolicy(action: SecurityRateLimitAction) {
  return SECURITY_RATE_LIMIT_POLICY_DRAFT[action];
}

export function buildSecurityRateLimitSubjectHash(action: SecurityRateLimitAction, subjectParts: Record<string, string | null | undefined>) {
  const stable = Object.entries(subjectParts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value ?? 'unknown'}`)
    .join('|');
  return sha256(`${action}|${stable}`);
}

export function evaluateSecurityRateLimit(input: SecurityRateLimitEvaluationInput) {
  const parsed = securityRateLimitEvaluationSchema.parse(input);
  const policy = getSecurityRateLimitPolicy(parsed.action);
  const subjectHash = buildSecurityRateLimitSubjectHash(parsed.action, parsed.subjectParts);
  const remaining = Math.max(0, policy.limit - parsed.observedCount);
  return {
    action: parsed.action,
    allowed: parsed.observedCount < policy.limit,
    remaining,
    limit: policy.limit,
    windowSeconds: policy.windowSeconds,
    subject: policy.subject,
    subjectHash,
    retryAfterSeconds: parsed.observedCount >= policy.limit ? policy.windowSeconds : 0,
    codexNote: 'In-memory evaluation is scaffold-only. Codex must replace or back this with a deployment-appropriate distributed limiter before production.',
  };
}

export function checkSecurityRateLimit(action: SecurityRateLimitAction, subjectParts: Record<string, string | null | undefined>, now = Date.now()) {
  const policy = getSecurityRateLimitPolicy(action);
  const subjectHash = buildSecurityRateLimitSubjectHash(action, subjectParts);
  const bucketKey = `${action}:${subjectHash}`;
  const existing = securityBuckets.get(bucketKey);
  const bucket = !existing || existing.resetAt <= now ? { count: 0, resetAt: now + policy.windowSeconds * 1000 } : existing;
  bucket.count += 1;
  securityBuckets.set(bucketKey, bucket);
  return {
    action,
    allowed: bucket.count <= policy.limit,
    remaining: Math.max(0, policy.limit - bucket.count),
    limit: policy.limit,
    windowSeconds: policy.windowSeconds,
    resetAt: new Date(bucket.resetAt),
    subjectHash,
  };
}

export function clearSecurityRateLimitBuckets() {
  securityBuckets.clear();
}
