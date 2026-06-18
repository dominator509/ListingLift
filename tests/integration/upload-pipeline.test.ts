/**
 * PHASE 3 — File Upload Pipeline Integration
 *
 * Validates the upload token -> intake plan pipeline through actual service code.
 * Uses real Prisma for token persistence.
 *
 * Targets:
 *   1. Upload token creation (stateless + persistable parts)
 *   2. Token hash verification (deterministic hashing)
 *   3. Token persistence and retrieval in real DB
 *   4. Upload intake plan building (file counting, size totaling)
 *   5. Complete flow: issue token -> persist -> validate -> build intake plan
 */

import { describe, expect, it, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';
import { buildUploadTokenIssuePlan, redactUploadTokenForLogs } from '@/server/services/upload-token-service';
import { buildUploadIntakePlan } from '@/server/services/upload-intake-service';
import { cleanupAll, createTestUser, createTestJob, trackUploadToken } from './helpers';

afterEach(async () => {
  await cleanupAll();
});

describe('Upload token creation and management', () => {
  it('creates an upload token with response + persistable parts', () => {
    const plan = buildUploadTokenIssuePlan({
      organizationId: 'org_test',
      jobId: 'job_test',
      expiresInMinutes: 60,
    });

    expect(plan.response.token).toBeTruthy();
    expect(typeof plan.response.token).toBe('string');
    expect(plan.response.token.length).toBeGreaterThan(20);
    expect(plan.response.expiresAt).toBeTruthy();
    expect(plan.response.uploadUrl).toContain('/api/uploads/upload?token=');

    expect(plan.persistable.tokenHash).toBeTruthy();
    expect(plan.persistable.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(plan.persistable.expiresAt).toBeInstanceOf(Date);
    expect(plan.persistable.organizationId).toBe('org_test');
    expect(plan.persistable.jobId).toBe('job_test');
  });

  it('creates different tokens for different organizations', () => {
    const p1 = buildUploadTokenIssuePlan({ organizationId: 'org_a' });
    const p2 = buildUploadTokenIssuePlan({ organizationId: 'org_b' });
    expect(p1.response.token).not.toBe(p2.response.token);
    expect(p1.persistable.tokenHash).not.toBe(p2.persistable.tokenHash);
  });

  it('creates different tokens for the same input (nonce-based)', () => {
    const p1 = buildUploadTokenIssuePlan({ organizationId: 'org_same', jobId: 'job_1' });
    const p2 = buildUploadTokenIssuePlan({ organizationId: 'org_same', jobId: 'job_1' });
    expect(p1.response.token).not.toBe(p2.response.token);
  });

  it('token hash is deterministic from the token', () => {
    const plan = buildUploadTokenIssuePlan({ organizationId: 'org_det' });
    const expectedHash = hashToken(plan.response.token);
    expect(plan.persistable.tokenHash).toBe(expectedHash);
  });

  it('persists and retrieves an upload token from the database', async () => {
    const { org } = await createTestUser();
    const job = await createTestJob(org.id);
    const plan = buildUploadTokenIssuePlan({ organizationId: org.id, jobId: job.id, expiresInMinutes: 120 });

    await prisma.uploadToken.create({
      data: {
        organizationId: org.id,
        jobId: job.id,
        tokenHash: plan.persistable.tokenHash,
        expiresAt: plan.persistable.expiresAt,
        purpose: 'UPLOAD',
      },
    });
    trackUploadToken(plan.persistable.tokenHash);

    const record = await prisma.uploadToken.findUnique({
      where: { tokenHash: plan.persistable.tokenHash },
    });
    expect(record).not.toBeNull();
    expect(record!.tokenHash).toBe(plan.persistable.tokenHash);
    expect(record!.organizationId).toBe(org.id);
    expect(record!.jobId).toBe(job.id);
    expect(record!.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('properly redacts token hash for logging', () => {
    const plan = buildUploadTokenIssuePlan({ organizationId: 'org_log' });
    const redacted = redactUploadTokenForLogs(plan.persistable);
    expect(redacted.tokenHash).toContain('...');
    expect(redacted.tokenHash).not.toBe(plan.persistable.tokenHash);
    expect(redacted.organizationId).toBe('org_log');
  });
});

describe('Upload intake plan building', () => {
  it('builds an intake plan counting files and sizes', () => {
    const plan = buildUploadIntakePlan({
      organizationId: 'org_01',
      jobId: 'job_01',
      source: 'direct_upload',
      files: [
        { name: 'photo01.jpg', size: 2 * 1024 * 1024, type: 'image/jpeg' },
        { name: 'photo02.jpg', size: 3 * 1024 * 1024, type: 'image/jpeg' },
      ],
    });

    expect(plan.phase).toBe('intake_planned');
    expect(plan.organizationId).toBe('org_01');
    expect(plan.jobId).toBe('job_01');
    expect(plan.fileCount).toBe(2);
    expect(plan.totalSize).toBe(5 * 1024 * 1024);
    expect(plan.source).toBe('direct_upload');
    expect(plan.note).toContain('Placeholder');
  });

  it('handles empty file list', () => {
    const plan = buildUploadIntakePlan({
      organizationId: 'org_02',
      jobId: 'job_02',
      files: [],
    });
    expect(plan.fileCount).toBe(0);
    expect(plan.totalSize).toBe(0);
  });

  it('handles single file', () => {
    const plan = buildUploadIntakePlan({
      organizationId: 'org_03',
      files: [{ name: 'single.png', size: 500 * 1024, type: 'image/png' }],
    });
    expect(plan.fileCount).toBe(1);
    expect(plan.totalSize).toBe(500 * 1024);
  });

  it('defaults source to direct_upload', () => {
    const plan = buildUploadIntakePlan({
      organizationId: 'org_04',
      files: [{ name: 'test.jpg', size: 100, type: 'image/jpeg' }],
    });
    expect(plan.source).toBe('direct_upload');
  });
});

describe('Upload token + intake plan end-to-end', () => {
  it('completes a full round trip: issue token -> persist -> retrieve -> build intake plan', async () => {
    const { org } = await createTestUser();
    const job = await createTestJob(org.id);

    // Step 1: Issue upload token
    const tokenPlan = buildUploadTokenIssuePlan({
      organizationId: org.id,
      jobId: job.id,
      expiresInMinutes: 120,
    });

    // Step 2: Persist token
    await prisma.uploadToken.create({
      data: {
        organizationId: org.id,
        jobId: job.id,
        tokenHash: tokenPlan.persistable.tokenHash,
        expiresAt: tokenPlan.persistable.expiresAt,
        purpose: 'UPLOAD',
      },
    });
    trackUploadToken(tokenPlan.persistable.tokenHash);

    // Step 3: Verify token in DB
    const dbRecord = await prisma.uploadToken.findUnique({
      where: { tokenHash: tokenPlan.persistable.tokenHash },
    });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord!.tokenHash).toBe(tokenPlan.persistable.tokenHash);

    // Step 4: Build intake plan referencing the same job
    const intakePlan = buildUploadIntakePlan({
      organizationId: org.id,
      jobId: job.id,
      source: 'direct_upload',
      files: [
        { name: 'batch_01.jpg', size: 5 * 1024 * 1024, type: 'image/jpeg' },
        { name: 'batch_02.png', size: 3 * 1024 * 1024, type: 'image/png' },
        { name: 'batch_03.webp', size: 1 * 1024 * 1024, type: 'image/webp' },
      ],
    });

    expect(intakePlan.organizationId).toBe(org.id);
    expect(intakePlan.jobId).toBe(job.id);
    expect(intakePlan.fileCount).toBe(3);
    expect(intakePlan.totalSize).toBe(9 * 1024 * 1024);
    expect(intakePlan.source).toBe('direct_upload');
  });
});
