import { createHash, timingSafeEqual } from 'node:crypto';

/** Compute a session binding hash from IP + user-agent for token binding (P5). */
export function computeBindingHash(ipAddress: string | null | undefined, userAgent: string | null | undefined): string | null {
  const ip = ipAddress ?? '';
  const ua = userAgent ?? '';
  if (!ip && !ua) return null;
  // Fuzzy IP: use first 2 octets for carrier-grade NAT tolerance
  const fuzzyIp = ip.split('.').slice(0, 2).join('.');
  return createHash('sha256').update(`${fuzzyIp}|${ua}`).digest('hex');
}

function safeBufferCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Constant-time length comparison: compare against self to avoid short-circuit
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/** Check if a request's IP/UA matches the session's binding hash. */
export function checkBinding(
  requestIp: string | null | undefined,
  requestUa: string | null | undefined,
  storedHash: string | null | undefined,
): boolean {
  if (!storedHash) return true; // No binding on record — allow (legacy sessions)
  const computed = computeBindingHash(requestIp, requestUa);
  if (!computed) return false;
  return safeBufferCompare(computed, storedHash);
}
