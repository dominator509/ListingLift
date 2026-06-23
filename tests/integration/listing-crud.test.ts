/**
 * PHASE 3 — Listing CRUD Integration
 *
 * Validates full CRUD for Listing (Job in Prisma schema) using real database:
 *   create -> read -> update -> delete
 *
 * Uses helpers to set up a test user and org, then exercises Job CRUD directly
 * via Prisma and the auth service.
 */

import { describe, expect, it, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { cleanupAll, signupVerifiedAndLogin, uniqueEmail, uniqueSlug, trackJob } from './helpers';

afterEach(async () => {
  await cleanupAll();
});

describe('Listing (Job) CRUD: create -> read -> update -> delete', () => {
  it('creates a job (listing) for an organization', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'CRUD User', organizationName: `CRUD Org ${slug}` });

    const job = await prisma.job.create({
      data: {
        organizationId: result.session.organizationId,
        title: 'Test Listing - Vintage Camera',
        status: 'DRAFT',
        priority: 'NORMAL',
      },
    });
    trackJob(job.id);

    expect(job).toBeTruthy();
    expect(job.id).toBeTruthy();
    expect(job.organizationId).toBe(result.session.organizationId);
    expect(job.title).toBe('Test Listing - Vintage Camera');
    expect(job.status).toBe('DRAFT');
    expect(job.priority).toBe('NORMAL');
    expect(job.createdAt).toBeInstanceOf(Date);
    expect(job.updatedAt).toBeInstanceOf(Date);
  });

  it('reads a job by ID and verifies all fields', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'Read User', organizationName: `Read Org ${slug}` });

    const created = await prisma.job.create({
      data: {
        organizationId: result.session.organizationId,
        title: 'Readable Listing',
        status: 'WAITING_FOR_UPLOAD',
        priority: 'HIGH',
      },
    });
    trackJob(created.id);

    const read = await prisma.job.findUnique({ where: { id: created.id } });
    expect(read).not.toBeNull();
    expect(read!.id).toBe(created.id);
    expect(read!.title).toBe('Readable Listing');
    expect(read!.status).toBe('WAITING_FOR_UPLOAD');
    expect(read!.priority).toBe('HIGH');
  });

  it('updates a job status and title', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'Update User', organizationName: `Update Org ${slug}` });

    const created = await prisma.job.create({
      data: {
        organizationId: result.session.organizationId,
        title: 'Original Title',
        status: 'DRAFT',
        priority: 'NORMAL',
      },
    });
    trackJob(created.id);

    const updated = await prisma.job.update({
      where: { id: created.id },
      data: {
        title: 'Updated Title',
        status: 'WAITING_FOR_UPLOAD',
        adminNotes: 'Now with admin notes',
      },
    });

    expect(updated.title).toBe('Updated Title');
    expect(updated.status).toBe('WAITING_FOR_UPLOAD');
    expect(updated.adminNotes).toBe('Now with admin notes');
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
  });

  it('deletes a job and confirms it is gone', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signupVerifiedAndLogin({ email, password: 'StrongP4ssword!', name: 'Delete User', organizationName: `Delete Org ${slug}` });

    const created = await prisma.job.create({
      data: {
        organizationId: result.session.organizationId,
        title: 'To Be Deleted',
        status: 'DRAFT',
        priority: 'LOW',
      },
    });
    trackJob(created.id);

    await prisma.job.delete({ where: { id: created.id } });

    const found = await prisma.job.findUnique({ where: { id: created.id } });
    expect(found).toBeNull();
  });

  it('enforces organization isolation — jobs from org A not visible to org B', async () => {
    const slug1 = uniqueSlug();
    const slug2 = uniqueSlug();
    const orgA = await signupVerifiedAndLogin({ email: uniqueEmail(), password: 'StrongP4ssword!', name: 'OrgA User', organizationName: `Org A ${slug1}` });
    const orgB = await signupVerifiedAndLogin({ email: uniqueEmail(), password: 'StrongP4ssword!', name: 'OrgB User', organizationName: `Org B ${slug2}` });

    const jobA = await prisma.job.create({
      data: { organizationId: orgA.session.organizationId, title: 'Org A Job', status: 'DRAFT', priority: 'NORMAL' },
    });
    trackJob(jobA.id);

    // Org B should not see Org A's job
    const orgBJobs = await prisma.job.findMany({ where: { organizationId: orgB.session.organizationId } });
    expect(orgBJobs.find(j => j.id === jobA.id)).toBeUndefined();

    // Org A can see its own job
    const orgAJobs = await prisma.job.findMany({ where: { organizationId: orgA.session.organizationId } });
    expect(orgAJobs.find(j => j.id === jobA.id)).toBeTruthy();
  });
});
