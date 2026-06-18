import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';
import { createSessionToken, parseSignedToken, sessionExpiresAt, verifySessionTokenSignature } from '@/server/auth/session-cookie';
import { hashPassword, verifyPassword } from '@/server/auth/password';
import { checkSignupRateLimit, checkAuthRateLimit, clearAuthRateLimit, getRateLimitKey } from '@/server/auth/rate-limit';
import { computeBindingHash, checkBinding } from '@/server/auth/session-binding';
import { createOpaqueToken } from '@/lib/tokens';
import { sessionCache } from '@/server/auth/session-cache';

export interface AuthMeta {
  ipAddress: string | null;
  userAgent: string | null;
}

export async function signup(input: {
  email: string;
  password: string;
  name: string;
  organizationName: string;
}, meta?: AuthMeta) {
  const email = input.email.toLowerCase().trim();

  // P9: Per-IP signup rate limiting
  const ipAddress = meta?.ipAddress;
  if (ipAddress) {
    const rateResult = await checkSignupRateLimit(ipAddress);
    if (!rateResult.allowed) {
      throw Object.assign(new Error('Too many signup attempts. Please try again later.'), { code: 'RATE_LIMITED' });
    }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw Object.assign(new Error('Email already in use.'), { code: 'CONFLICT' });

  const passwordHash = await hashPassword(input.password);

  const slug = input.organizationName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

  const role = await prisma.role.upsert({
    where: { key: 'CLIENT_OWNER' },
    create: { key: 'CLIENT_OWNER', name: 'Client Owner', description: 'Client-side account owner', system: true },
    update: {},
  });

  // P5: Compute session binding hash
  const bindingHash = computeBindingHash(meta?.ipAddress, meta?.userAgent);

  // P9: Generate email verification token — no session until email is verified
  const verificationToken = createOpaqueToken(32);
  const verificationTokenHash = hashToken(verificationToken);

  const result = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: input.organizationName, slug, organizationType: 'SELLER' },
    });

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        name: input.name,
        accountStatus: 'ACTIVE',
        emailVerified: false,
        emailVerificationToken: verificationTokenHash,
        emailVerificationExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await tx.membership.create({
      data: { organizationId: org.id, userId: user.id, roleId: role.id, roleKey: 'CLIENT_OWNER' },
    });

    return { user, org };
  });

  return {
    user: { id: result.user.id, email: result.user.email, name: result.user.name },
    verificationToken, // Return for tests/integration; in production would be emailed
    emailVerificationRequired: true,
  };
}

export async function login(input: { email: string; password: string }, meta?: AuthMeta) {
  const email = input.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.deletedAt) throw new Error('Invalid email or password');
  if (user.accountStatus === 'SUSPENDED' || user.accountStatus === 'DISABLED') throw new Error('Invalid email or password');

  // Q15-H4: Per-email brute force protection — 5 failures in 15min window
  const rateLimitKey = getRateLimitKey(email, meta?.ipAddress);
  const rateResult = checkAuthRateLimit(rateLimitKey);
  if (!rateResult.allowed) {
    throw Object.assign(new Error('Too many login attempts. Please try again later.'), { code: 'RATE_LIMITED' });
  }

  // P9: Block login for unverified email
  if (!user.emailVerified) {
    throw Object.assign(new Error('Email not verified. Please check your inbox.'), { code: 'EMAIL_NOT_VERIFIED' });
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) throw new Error('Invalid email or password');

  // Q15-H4: Reset brute force counter on successful login
  clearAuthRateLimit(rateLimitKey);

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: { role: true },
  });

  if (!membership) throw new Error('Invalid email or password');

  // P5: Compute session binding hash
  const bindingHash = computeBindingHash(meta?.ipAddress, meta?.userAgent);

  const { token, tokenHash } = createSessionToken();

  // P14: Enforce max 5 active sessions per user
  const activeSessions = await prisma.session.count({
    where: { userId: user.id, active: true, revokedAt: null, expiresAt: { gt: new Date() } },
  });

  if (activeSessions >= 5) {
    // Expire the oldest active session
    const oldestSession = await prisma.session.findFirst({
      where: { userId: user.id, active: true, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'asc' },
    });
    if (oldestSession) {
      await prisma.session.update({
        where: { id: oldestSession.id },
        data: { active: false, revokedAt: new Date() },
      });
    }
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      organizationId: membership.organizationId,
      sessionTokenHash: tokenHash,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
      bindingHash,
      expiresAt: sessionExpiresAt(),
      lastSeenAt: new Date(),
    },
  });

  // Update lastLoginAt
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  return {
    sessionToken: token,
    session: { userId: user.id, organizationId: membership.organizationId, role: membership.roleKey as string },
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export async function logout(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const match = cookieHeader?.match(/ll_session=([^;]+)/);
  if (!match) return;

  const signedToken = match[1];
  const parsed = parseSignedToken(signedToken);
  if (!parsed) return;

  // Verify HMAC signature before hashing
  if (!verifySessionTokenSignature(parsed.raw, parsed.signature)) return;

  const tokenHash = hashToken(parsed.raw);

  // Q18 P2: Invalidate session cache on logout
  sessionCache.delete(tokenHash);

  const session = await prisma.session.findUnique({ where: { sessionTokenHash: tokenHash } });
  if (!session) return;

  await prisma.$transaction([
    prisma.session.update({
      where: { sessionTokenHash: tokenHash },
      data: { active: false, revokedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        organizationId: session.organizationId,
        actorUserId: session.userId,
        action: 'auth.logout',
        targetType: 'session',
        targetId: session.id,
        ipAddress: null,
        metadata: {},
      },
    }),
  ]);
}

export async function resolveSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const match = cookieHeader?.match(/ll_session=([^;]+)/);
  if (!match) return null;

  const signedToken = match[1];
  const parsed = parseSignedToken(signedToken);
  if (!parsed) return null;

  // Verify HMAC signature before hash lookup — reject tampered tokens
  if (!verifySessionTokenSignature(parsed.raw, parsed.signature)) return null;

  const tokenHash = hashToken(parsed.raw);

  // Q18 P2: Check session cache before hitting DB (30s TTL, LRU)
  const cached = sessionCache.get(tokenHash);
  if (cached) return cached;

  const session = await prisma.session.findUnique({
    where: { sessionTokenHash: tokenHash },
    include: { user: true },
  });

  if (!session || !session.active || session.revokedAt || session.expiresAt < new Date()) return null;
  if (session.user.deletedAt) return null;

  // P5: Session token binding — verify request IP/UA against stored binding hash
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent');
  if (!checkBinding(ipAddress, userAgent, session.bindingHash)) {
    return null; // Silent reject — treat as no session (attacker gets no info)
  }

  // Get role from membership
  const membership = await prisma.membership.findFirst({
    where: { userId: session.userId, organizationId: session.organizationId },
  });

  const result = {
    userId: session.userId,
    organizationId: session.organizationId,
    role: membership?.roleKey ?? 'CLIENT_VIEWER',
    tokenHash,
  };

  // Q18 P2: Cache resolved session for subsequent requests
  sessionCache.set(tokenHash, result);
  return result;
}

/** P18: Revoke all sessions on password change. */
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) throw new Error('User not found');

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) throw new Error('Current password is incorrect');

  const newHash = await hashPassword(newPassword);

  // Q18 P2: Clear all cached sessions on password change (prevents stale cache after session revocation)
  sessionCache.clear();

  // Single transaction: update password + expire all sessions
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    await tx.session.updateMany({
      where: { userId, active: true, revokedAt: null },
      data: { active: false, revokedAt: new Date() },
    });
  });
}

export async function verifyEmail(token: string) {
  const tokenHash = hashToken(token);
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: tokenHash,
      emailVerificationExpiresAt: { gt: new Date() },
      emailVerified: false,
    },
  });

  if (!user) {
    throw Object.assign(new Error('Invalid or expired verification token.'), { code: 'INVALID_TOKEN' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
    },
  });
}
