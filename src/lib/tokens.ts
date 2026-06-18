import { createHash, randomBytes } from 'node:crypto';

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createOpaqueToken(byteLength: number): string {
  return randomBytes(byteLength).toString('base64url');
}

export function safeTokenPreview(token: string): string {
  if (token.length <= 8) return '[redacted]';
  const first4 = token.slice(0, 4);
  const last4 = token.slice(-4);
  return `${first4}…${last4}`;
}
