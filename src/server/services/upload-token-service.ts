import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';

export interface UploadTokenPlan {
  response: {
    token: string;
    expiresAt: string;
    uploadUrl: string;
  };
  persistable: {
    tokenHash: string;
    expiresAt: Date;
    organizationId: string;
    jobId: string | null;
  };
}

export function buildUploadTokenIssuePlan(input: {
  organizationId: string;
  jobId?: string;
  expiresInMinutes?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
}): UploadTokenPlan {
  const rawToken = randomBytes(32).toString('base64url');
  const expiresIn = input.expiresInMinutes ?? 60;
  const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);

  return {
    response: {
      token: rawToken,
      expiresAt: expiresAt.toISOString(),
      uploadUrl: `/api/uploads/upload?token=${rawToken}`,
    },
    persistable: {
      tokenHash: hashToken(rawToken),
      expiresAt,
      organizationId: input.organizationId,
      jobId: input.jobId ?? null,
    },
  };
}

export function hashUploadToken(token: string): string {
  return hashToken(token);
}

export function redactUploadTokenForLogs(persistable: UploadTokenPlan['persistable']) {
  return {
    tokenHash: persistable.tokenHash.substring(0, 12) + '...',
    expiresAt: persistable.expiresAt.toISOString(),
    organizationId: persistable.organizationId,
  };
}

interface UploadTokenRecord {
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  revokedAt?: Date | null;
}

export function validateUploadTokenRecord(
  token: string,
  record: UploadTokenRecord
): { valid: boolean; reason?: string } {
  const computedHash = hashToken(token);
  if (computedHash !== record.tokenHash) {
    return { valid: false, reason: 'hash_mismatch' };
  }
  if (new Date() > record.expiresAt) {
    return { valid: false, reason: 'expired' };
  }
  if (record.usedAt) {
    return { valid: false, reason: 'already_used' };
  }
  if (record.revokedAt) {
    return { valid: false, reason: 'revoked' };
  }
  return { valid: true };
}

export async function consumeUploadToken(
  token: string
): Promise<{ consumed: boolean; reason?: string; statusCode?: number }> {
  const tokenHash = hashToken(token);

  // Atomic consumption: only updates if token is unconsumed, unrevoked, and not expired.
  // WHERE clause acts as the lock — Prisma translates updateMany to a single atomic SQL statement.
  const result = await prisma.uploadToken.updateMany({
    where: {
      tokenHash,
      usedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { usedAt: new Date() },
  });

  if (result.count === 1) {
    return { consumed: true };
  }

  // Determine why consumption failed by reading the current record
  const record = await prisma.uploadToken.findUnique({ where: { tokenHash } });
  if (!record) {
    return { consumed: false, reason: 'token_not_found', statusCode: 404 };
  }
  if (record.usedAt) {
    return { consumed: false, reason: 'already_used', statusCode: 409 };
  }
  if (record.revokedAt) {
    return { consumed: false, reason: 'revoked', statusCode: 403 };
  }
  if (new Date() > record.expiresAt) {
    return { consumed: false, reason: 'expired', statusCode: 410 };
  }
  return { consumed: false, reason: 'unknown', statusCode: 500 };
}
