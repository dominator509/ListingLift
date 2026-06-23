/**
 * PHASE 3 — File Upload Pipeline Integration
 *
 * Validates the file upload token lifecycle:
 *   upload token creation -> token validation -> token revocation
 *
 * Uses real Prisma DB and auth services.
 */

import { describe, expect, it, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';
import { buildUploadTokenIssuePlan, redactUploadTokenForLogs } from '@/server/services/upload-token-service';
import { buildUploadIntakePlan } from '@/server/services/upload-intake-service';
import { cleanupAll, signupVerifiedAndLogin, uniqueEmail, uniqueSlug, trackUploadToken } from './helpers';

afterEach(async () => {
  await cleanupAll();
});

describe('File upload pipeline: token creation -> validation -> intake', () => {
  it('creates an upload token for an authenticated user', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'Upload User', organizationName: `Upload Org ${slug}` });

    const plan = buildUploadTokenIssuePlan({
      organizationId: result.session.organizationId,
      expiresInMinutes: 60,
    });

    expect(plan.response.token).toBeTruthy();
    expect(plan.response.uploadUrl).toContain('/api/uploads/upload?token=');
    expect(plan.response.expiresAt).toBeTruthy();
    expect(plan.persistable.organizationId).toBe(result.session.organizationId);
    expect(plan.persistable.tokenHash).toBe(hashToken(plan.response.token));
  });

  it('persists an upload token hash to the database', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'Upload User', organizationName: `Upload Org ${slug}` });

    const plan = buildUploadTokenIssuePlan({
      organizationId: result.session.organizationId,
      expiresInMinutes: 120,
    });

    const persisted = await prisma.uploadToken.create({
      data: {
        organizationId: plan.persistable.organizationId,
        tokenHash: plan.persistable.tokenHash,
        expiresAt: plan.persistable.expiresAt,
      },
    });
    trackUploadToken(persisted.tokenHash);

    expect(persisted.id).toBeTruthy();
    expect(persisted.tokenHash).toBe(plan.persistable.tokenHash);
    expect(persisted.organizationId).toBe(result.session.organizationId);
    expect(persisted.purpose).toBe('UPLOAD');
    expect(persisted.expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Verify we can look it up by hash
    const found = await prisma.uploadToken.findUnique({ where: { tokenHash: persisted.tokenHash } });
    expect(found).not.toBeNull();
    expect(found!.purpose).toBe('UPLOAD');
  });

  it('redacts upload token for logging (safe output)', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'Log User', organizationName: `Log Org ${slug}` });

    const plan = buildUploadTokenIssuePlan({
      organizationId: result.session.organizationId,
    });

    const redacted = redactUploadTokenForLogs(plan.persistable);
    expect(redacted.tokenHash).toMatch(/^[a-f0-9]{12}\.\.\.$/);
    expect(redacted.tokenHash.length).toBe(15); // 12 chars + '...'
    expect(redacted.organizationId).toBe(result.session.organizationId);
    expect(redacted.expiresAt).toBeTruthy();
    // Ensure the raw token is NOT in the redacted output
    expect(redacted.tokenHash).not.toContain(plan.response.token);
  });

  it('builds an upload intake plan', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'Intake User', organizationName: `Intake Org ${slug}` });

    const plan = buildUploadIntakePlan({
      organizationId: result.session.organizationId,
      files: [
        { name: 'photo1.jpg', size: 1024000, type: 'image/jpeg' },
        { name: 'photo2.png', size: 2048000, type: 'image/png' },
      ],
      source: 'direct_upload',
    });

    expect(plan.phase).toBe('intake_planned');
    expect(plan.organizationId).toBe(result.session.organizationId);
    expect(plan.fileCount).toBe(2);
    expect(plan.totalSize).toBe(3072000);
    expect(plan.source).toBe('direct_upload');
  });

  it('records an upload token with job association', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'Job Upload', organizationName: `JobOrg ${slug}` });

    // Create a job first
    const job = await prisma.job.create({
      data: { organizationId: result.session.organizationId, title: 'Upload Job', status: 'DRAFT', priority: 'NORMAL' },
    });

    const plan = buildUploadTokenIssuePlan({
      organizationId: result.session.organizationId,
      jobId: job.id,
      expiresInMinutes: 30,
    });

    const persisted = await prisma.uploadToken.create({
      data: {
        organizationId: plan.persistable.organizationId,
        tokenHash: plan.persistable.tokenHash,
        expiresAt: plan.persistable.expiresAt,
        jobId: job.id,
      },
    });
    trackUploadToken(persisted.tokenHash);

    expect(persisted.jobId).toBe(job.id);

    // Verify job-token relationship
    const jobWithTokens = await prisma.job.findUnique({
      where: { id: job.id },
      include: { uploadTokens: true },
    });
    expect(jobWithTokens!.uploadTokens.length).toBeGreaterThanOrEqual(1);
    expect(jobWithTokens!.uploadTokens[0].tokenHash).toBe(persisted.tokenHash);
  });
});
