import { createHash } from 'crypto';

/**
 * Generate a weak ETag for a JSON payload.
 * Uses SHA-1 for speed (not security-critical). 20-byte hex digest.
 * Returns null if called with undefined/null body (no ETag for empty responses).
 */
export function computeETag(body: unknown): string | null {
  if (body === null || body === undefined) return null;
  const json = JSON.stringify(body);
  const hash = createHash('sha1').update(json).digest('hex');
  return `W/"${hash}"`;
}

/**
 * Check if an incoming If-None-Match header matches the computed ETag.
 * If match: returns 304 Response. Otherwise: returns null (proceed with full response).
 */
export function handleConditionalGet(
  request: Request,
  etag: string | null,
): Response | null {
  if (!etag) return null;
  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304 });
  }
  return null;
}
