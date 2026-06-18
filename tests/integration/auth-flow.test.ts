/**
 * PHASE 3 — Auth Flow Integration
 *
 * Validates real data flow across service boundaries:
 *   signup -> login -> session persistence -> session resolution -> logout
 *
 * Uses real Prisma with PostgreSQL via adapter.
 */

import { describe, expect, it, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';
import { serializeSessionCookie } from '@/server/auth/session-cookie';
import { cleanupAll, uniqueEmail, uniqueSlug } from './helpers';
import { signup, login, logout, resolveSessionFromRequest, verifyEmail } from '@/server/auth/auth-service';

afterEach(async () => {
  await cleanupAll();
});

describe('Auth flow: signup -> login -> session -> logout', () => {
  it('completes a full signup flow: creates user, org, membership, session', async () => {
    const email = uniqueEmail();
    const orgName = `Alice Org ${uniqueSlug()}`;

    const result = await signup({
      email,
      password: 'StrongP4ss!!',
      name: 'Alice Chen',
      organizationName: orgName,
    });

    // Verify email before proceeding
    await verifyEmail(result.verificationToken!);

    expect(result.sessionToken).toBeTruthy();
    expect(typeof result.sessionToken).toBe('string');
    expect(result.session.userId).toBeTruthy();
    expect(result.session.organizationId).toBeTruthy();
    expect(result.session.role).toBe('CLIENT_OWNER');
    expect(result.user.email).toBe(email);
    expect(result.user.name).toBe('Alice Chen');
    expect((result.user as { passwordHash?: unknown }).passwordHash).toBeUndefined();

    const dbUser = await prisma.user.findUnique({ where: { email } });
    expect(dbUser).not.toBeNull();
    expect(dbUser!.accountStatus).toBe('ACTIVE');

    // Look up org from the session's organizationId (signup generates slug from name)
    const dbOrg = await prisma.organization.findUnique({ where: { id: result.session.organizationId } });
    expect(dbOrg).not.toBeNull();
    expect(dbOrg!.name).toBe(orgName);

    const membership = await prisma.membership.findUnique({
      where: { organizationId_userId: { organizationId: result.session.organizationId, userId: result.session.userId } },
    });
    expect(membership).not.toBeNull();
    expect(membership!.roleKey).toBe('CLIENT_OWNER');

    const tokenHash = hashToken(result.sessionToken);
    const dbSession = await prisma.session.findUnique({ where: { sessionTokenHash: tokenHash } });
    expect(dbSession).not.toBeNull();
    expect(dbSession!.active).toBe(true);
    expect(dbSession!.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('completes a full login flow: validates password, returns session, updates lastLoginAt', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const signupResult = await signup({ email, password: 'Str0ngP4ss!!', name: 'Bob', organizationName: `Bob Corp ${slug}` });
    await verifyEmail(signupResult.verificationToken!);

    const loginResult = await login({ email, password: 'Str0ngP4ss!!' });
    expect(loginResult.sessionToken).toBeTruthy();
    expect(loginResult.session.userId).toBe(signupResult.session.userId);
    expect(loginResult.user.email).toBe(email);

    const dbUser = await prisma.user.findUnique({ where: { email } });
    expect(dbUser!.lastLoginAt).not.toBeNull();
  });

  it('rejects login with wrong password', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'C0rrectP4ss!!', name: 'Carol', organizationName: `Carol Inc ${slug}` });
    await verifyEmail(result.verificationToken!);
    await expect(login({ email, password: 'Wr0ngP4ss!!' })).rejects.toThrow('Invalid email or password');
  });

  it('rejects login for deleted user', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'Str0ngP4ss!!', name: 'Dave', organizationName: `Dave LLC ${slug}` });
    await verifyEmail(result.verificationToken!);

    const { user } = result;
    await prisma.user.update({ where: { id: user.id }, data: { deletedAt: new Date() } });

    await expect(login({ email, password: 'Str0ngP4ss!!' })).rejects.toThrow('Invalid email or password');
  });

  it('resolves session from request cookie', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'MyStr0ngP4ss!', name: 'Eve', organizationName: `Eve Ltd ${slug}` });

    const cookie = serializeSessionCookie(result.sessionToken);
    const request = new Request('http://localhost:3000/api/test', { headers: { cookie } });

    const session = await resolveSessionFromRequest(request);
    expect(session).not.toBeNull();
    expect(session!.userId).toBe(result.session.userId);
    expect(session!.organizationId).toBe(result.session.organizationId);
    expect(session!.role).toBe('CLIENT_OWNER');
  });

  it('returns null for revoked session', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'P4ssw0rd!?!?', name: 'Frank', organizationName: `Frank Co ${slug}` });

    const tokenHash = hashToken(result.sessionToken);
    await prisma.session.update({
      where: { sessionTokenHash: tokenHash },
      data: { active: false, revokedAt: new Date() },
    });

    const cookie = serializeSessionCookie(result.sessionToken);
    const request = new Request('http://localhost:3000/api/test', { headers: { cookie } });
    const session = await resolveSessionFromRequest(request);
    expect(session).toBeNull();
  });

  it('completes logout: revokes session and records audit log', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'P4ssw0rd!?!?', name: 'Grace', organizationName: `Grace Inc ${slug}` });

    const cookie = serializeSessionCookie(result.sessionToken);
    const request = new Request('http://localhost:3000/api/test', { headers: { cookie } });
    await logout(request);

    const tokenHash = hashToken(result.sessionToken);
    const dbSession = await prisma.session.findUnique({ where: { sessionTokenHash: tokenHash } });
    expect(dbSession!.active).toBe(false);
    expect(dbSession!.revokedAt).not.toBeNull();

    const auditLog = await prisma.auditLog.findFirst({
      where: { actorUserId: result.session.userId, action: 'auth.logout' },
    });
    expect(auditLog).not.toBeNull();
  });

  it('signup creates unique organization slugs for duplicate names', async () => {
    const baseSlug = `unique-${Date.now()}`;
    const email1 = uniqueEmail();
    const email2 = uniqueEmail();
    const orgName = `Unique Org ${baseSlug}`;

    const result1 = await signup({ email: email1, password: 'P4ssw0rd!?!?', name: 'User A', organizationName: orgName });
    const result2 = await signup({ email: email2, password: 'P4ssw0rd!?!?', name: 'User B', organizationName: orgName });

    expect(result1.session.organizationId).not.toBe(result2.session.organizationId);

    const org1 = await prisma.organization.findUnique({ where: { id: result1.session.organizationId } });
    const org2 = await prisma.organization.findUnique({ where: { id: result2.session.organizationId } });
    expect(org1!.slug).not.toBe(org2!.slug);
  });
});
