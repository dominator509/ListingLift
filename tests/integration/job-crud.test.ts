/**
 * PHASE 3 — Listing (Job) CRUD Integration
 *
 * Validates real data flow through Prisma for the Job model:
 *   create -> read -> update -> delete
 *
 * Uses real PostgreSQL database.
 */

import { describe, expect, it, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { cleanupAll, createTestUser, trackJob } from './helpers';

afterEach(async () => {
  await cleanupAll();
});

describe('Job (Listing) CRUD with Prisma', () => {
  it('creates a job and reads it back with all fields', async () => {
    const { org } = await createTestUser();

    const job = await prisma.job.create({
      data: {
        organizationId: org.id,
        title: 'Product Photography - Sneakers',
        status: 'DRAFT',
        priority: 'HIGH',
        imageQuantity: 10,
        targetPlatform: 'Amazon',
        backgroundPreference: 'WHITE',
        outputSize: '2000x2000',
        fileFormat: 'JPG',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        clientVisibleNotes: 'Please make backgrounds pure white',
      },
    });
    trackJob(job.id);

    expect(job.id).toBeTruthy();
    expect(job.organizationId).toBe(org.id);
    expect(job.title).toBe('Product Photography - Sneakers');
    expect(job.status).toBe('DRAFT');
    expect(job.priority).toBe('HIGH');
    expect(job.imageQuantity).toBe(10);
    expect(job.targetPlatform).toBe('Amazon');

    const read = await prisma.job.findUnique({ where: { id: job.id } });
    expect(read).not.toBeNull();
    expect(read!.title).toBe('Product Photography - Sneakers');
    expect(read!.createdAt).toBeInstanceOf(Date);
    expect(read!.updatedAt).toBeInstanceOf(Date);
  });

  it('updates job status and tracks the change', async () => {
    const { org } = await createTestUser();

    const job = await prisma.job.create({
      data: { organizationId: org.id, title: 'Etsy Listing Photos', status: 'DRAFT', priority: 'NORMAL' },
    });
    trackJob(job.id);

    const updated = await prisma.job.update({
      where: { id: job.id },
      data: { status: 'WAITING_FOR_UPLOAD', uploadStatus: 'NOT_STARTED' },
    });
    expect(updated.status).toBe('WAITING_FOR_UPLOAD');
    expect(updated.updatedAt.getTime()).toBeGreaterThan(job.updatedAt.getTime());

    const withMeta = await prisma.job.update({
      where: { id: job.id },
      data: { title: 'Etsy Listing Photos - Updated', priority: 'URGENT', adminNotes: 'Client needs this by Friday' },
    });
    expect(withMeta.title).toBe('Etsy Listing Photos - Updated');
    expect(withMeta.priority).toBe('URGENT');
    expect(withMeta.adminNotes).toBe('Client needs this by Friday');
  });

  it('advances job through a realistic status lifecycle', async () => {
    const { org } = await createTestUser();

    const job = await prisma.job.create({
      data: { organizationId: org.id, title: 'Shopify Product Images', status: 'DRAFT', priority: 'NORMAL' },
    });
    trackJob(job.id);

    await prisma.job.update({ where: { id: job.id }, data: { status: 'WAITING_FOR_UPLOAD' } });
    await prisma.job.update({ where: { id: job.id }, data: { status: 'UPLOAD_RECEIVED', uploadStatus: 'COMPLETE', imageQuantity: 25 } });
    await prisma.job.update({ where: { id: job.id }, data: { status: 'PROCESSING_QUEUED', queuedAt: new Date() } });
    await prisma.job.update({ where: { id: job.id }, data: { status: 'PROCESSING' } });
    await prisma.job.update({ where: { id: job.id }, data: { status: 'WAITING_FOR_REVIEW' } });
    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'APPROVED', approvedAt: new Date(), approvedByUserId: 'admin_001' },
    });

    const final = await prisma.job.findUnique({ where: { id: job.id } });
    expect(final!.status).toBe('APPROVED');
    expect(final!.imageQuantity).toBe(25);
    expect(final!.queuedAt).not.toBeNull();
    expect(final!.approvedAt).not.toBeNull();
  });

  it('creates a job with status event tracking', async () => {
    const { org } = await createTestUser();

    const [job] = await prisma.$transaction([
      prisma.job.create({
        data: { organizationId: org.id, title: 'eBay Motors Listings', status: 'DRAFT', priority: 'HIGH' },
      }),
    ]);
    trackJob(job.id);

    await prisma.jobStatusEvent.create({
      data: {
        organizationId: org.id, jobId: job.id, type: 'CREATED',
        actorUserId: 'system', fromStatus: null, toStatus: 'DRAFT',
      },
    });

    await prisma.job.update({ where: { id: job.id }, data: { status: 'WAITING_FOR_UPLOAD' } });
    await prisma.jobStatusEvent.create({
      data: {
        organizationId: org.id, jobId: job.id, type: 'STATUS_CHANGED',
        actorUserId: 'system', fromStatus: 'DRAFT', toStatus: 'WAITING_FOR_UPLOAD',
      },
    });

    const events = await prisma.jobStatusEvent.findMany({
      where: { jobId: job.id }, orderBy: { createdAt: 'asc' },
    });
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe('CREATED');
    expect(events[1].type).toBe('STATUS_CHANGED');
  });

  it('deletes a job and cascades status events', async () => {
    const { org } = await createTestUser();

    const job = await prisma.job.create({
      data: { organizationId: org.id, title: 'Temp Job for Deletion', status: 'DRAFT', priority: 'LOW' },
    });
    trackJob(job.id);

    await prisma.jobStatusEvent.create({
      data: {
        organizationId: org.id, jobId: job.id, type: 'CREATED',
        actorUserId: 'system', fromStatus: null, toStatus: 'DRAFT',
      },
    });

    await prisma.job.delete({ where: { id: job.id } });

    const gone = await prisma.job.findUnique({ where: { id: job.id } });
    expect(gone).toBeNull();

    const events = await prisma.jobStatusEvent.findMany({ where: { jobId: job.id } });
    expect(events).toHaveLength(0);
  });

  it('queries jobs by status and organization', async () => {
    const { org } = await createTestUser();

    const j1 = await prisma.job.create({ data: { organizationId: org.id, title: 'Active A', status: 'DRAFT', priority: 'NORMAL' } });
    trackJob(j1.id);
    const j2 = await prisma.job.create({ data: { organizationId: org.id, title: 'Active B', status: 'DRAFT', priority: 'NORMAL' } });
    trackJob(j2.id);
    const j3 = await prisma.job.create({ data: { organizationId: org.id, title: 'Done C', status: 'COMPLETED', priority: 'NORMAL' } });
    trackJob(j3.id);

    const drafts = await prisma.job.findMany({
      where: { organizationId: org.id, status: 'DRAFT' },
      orderBy: { createdAt: 'asc' },
    });
    expect(drafts).toHaveLength(2);

    const completed = await prisma.job.findMany({
      where: { organizationId: org.id, status: 'COMPLETED' },
    });
    expect(completed).toHaveLength(1);
    expect(completed[0].title).toBe('Done C');

    const count = await prisma.job.count({ where: { organizationId: org.id } });
    expect(count).toBe(3);
  });
});
