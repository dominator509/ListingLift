import { prisma } from '@/lib/prisma';
import { createSessionToken } from '@/server/auth/session-cookie';
import { login, signup, verifyEmail } from '@/server/auth/auth-service';

/**
 * Cleanup IDs that tests register during setup so we can tear them down.
 */
const cleanupIds: {
  users: string[]; sessions: string[]; orgs: string[]; jobs: string[];
  clients: string[]; roles: string[]; uploadTokens: string[];
} = {
  users: [], sessions: [], orgs: [], jobs: [], clients: [], roles: [], uploadTokens: [],
};

export function trackUser(id: string) { cleanupIds.users.push(id); }
export function trackSession(id: string) { cleanupIds.sessions.push(id); }
export function trackOrg(id: string) { cleanupIds.orgs.push(id); }
export function trackJob(id: string) { cleanupIds.jobs.push(id); }
export function trackClient(id: string) { cleanupIds.clients.push(id); }
export function trackRole(id: string) { cleanupIds.roles.push(id); }
export function trackUploadToken(hash: string) { cleanupIds.uploadTokens.push(hash); }

/**
 * Teardown all tracked resources in reverse dependency order.
 */
export async function cleanupAll() {
  try {
    if (cleanupIds.uploadTokens.length) await prisma.uploadToken.deleteMany({ where: { tokenHash: { in: cleanupIds.uploadTokens } } });
    if (cleanupIds.users.length) await prisma.auditLog.deleteMany({ where: { actorUserId: { in: cleanupIds.users } } });
    if (cleanupIds.jobs.length) await prisma.job.deleteMany({ where: { id: { in: cleanupIds.jobs } } });
    if (cleanupIds.sessions.length) await prisma.session.deleteMany({ where: { id: { in: cleanupIds.sessions } } });
    if (cleanupIds.users.length) await prisma.session.deleteMany({ where: { userId: { in: cleanupIds.users } } });
    if (cleanupIds.users.length) await prisma.membership.deleteMany({ where: { userId: { in: cleanupIds.users } } });
    if (cleanupIds.users.length) await prisma.user.deleteMany({ where: { id: { in: cleanupIds.users } } });
    if (cleanupIds.orgs.length) await prisma.organization.deleteMany({ where: { id: { in: cleanupIds.orgs } } });
    if (cleanupIds.clients.length) await prisma.client.deleteMany({ where: { id: { in: cleanupIds.clients } } });
    if (cleanupIds.roles.length) await prisma.role.deleteMany({ where: { id: { in: cleanupIds.roles } } });
  } catch {
    // cleanup failures should not crash tests
  }

  cleanupIds.users = []; cleanupIds.sessions = []; cleanupIds.orgs = [];
  cleanupIds.jobs = []; cleanupIds.clients = []; cleanupIds.roles = []; cleanupIds.uploadTokens = [];
}

const UNIQUE_TAG = `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
let emailCounter = 0;
let slugCounter = 0;

export function uniqueEmail() {
  emailCounter++;
  return `integ_${UNIQUE_TAG}_${emailCounter}@test.example`;
}

export function uniqueSlug() {
  slugCounter++;
  return `slug_${UNIQUE_TAG}_${slugCounter}`;
}

export async function signupVerifiedAndLogin(input: {
  email?: string;
  password?: string;
  name?: string;
  organizationName?: string;
}) {
  const password = input.password ?? 'StrongP4ssword!';
  const signupResult = await signup({
    email: input.email ?? uniqueEmail(),
    password,
    name: input.name ?? 'Integration User',
    organizationName: input.organizationName ?? `Integration Org ${uniqueSlug()}`,
  });
  trackUser(signupResult.user.id);
  await verifyEmail(signupResult.verificationToken);
  const loginResult = await login({ email: signupResult.user.email, password });
  trackOrg(loginResult.session.organizationId);
  return loginResult;
}

/**
 * Create a test user + organization + CLIENT_OWNER role + membership in one shot.
 */
export async function createTestUser() {
  const role = await prisma.role.upsert({
    where: { key: 'CLIENT_OWNER' },
    create: { key: 'CLIENT_OWNER', name: 'Client Owner', description: 'Client-side account owner (integration test)', system: true },
    update: {},
  });
  trackRole(role.id);

  const email = uniqueEmail();
  const slug = uniqueSlug();
  const orgName = `Test Org ${slug}`;

  const org = await prisma.organization.create({
    data: { name: orgName, slug, organizationType: 'SELLER' },
  });
  trackOrg(org.id);

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Test User',
      passwordHash: '$2a$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Qkz3xYj9q5AV0Bv1uC8nF5e7Kqy',
      accountStatus: 'ACTIVE',
    },
  });
  trackUser(user.id);

  await prisma.membership.create({
    data: { organizationId: org.id, userId: user.id, roleId: role.id, roleKey: 'CLIENT_OWNER' },
  });

  return { user, org, role, email };
}

/**
 * Create a persisted session for a test user.
 */
export async function createTestSession(userId: string, organizationId: string) {
  const { token, tokenHash } = createSessionToken();
  const session = await prisma.session.create({
    data: {
      userId, organizationId, sessionTokenHash: tokenHash,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), lastSeenAt: new Date(),
    },
  });
  trackSession(session.id);
  return { session, token, tokenHash };
}

/**
 * Create a test job for a given org.
 */
export async function createTestJob(organizationId: string, overrides: any = {}) {
  const job = await prisma.job.create({
    data: {
      organizationId,
      title: 'Integration Test Job',
      status: 'DRAFT',
      priority: 'NORMAL',
      ...overrides,
    },
  });
  trackJob(job.id);
  return job;
}
