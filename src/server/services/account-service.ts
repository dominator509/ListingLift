import { prisma } from '@/lib/prisma';
import { changePassword } from '@/server/auth/auth-service';
import { AccountSettingsInput } from '@/schemas/auth';

export async function updateAccountSettings(input: {
  userId: string;
  organizationId: string;
  settings: AccountSettingsInput;
}) {
  const { userId, settings } = input;

  if (settings.name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: settings.name },
    });
  }

  // P18: Password change → revoke all sessions
  if (settings.currentPassword && settings.newPassword) {
    await changePassword(userId, settings.currentPassword, settings.newPassword);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  return user;
}

/**
 * Check if a user has in-flight operations that prevent immediate deletion.
 */
export async function checkDeletionBlockers(userId: string, organizationId: string): Promise<{
  blocked: boolean;
  blockers: string[];
}> {
  const blockers: string[] = [];

  // Active jobs (non-terminal states)
  const activeJobCount = await prisma.job.count({
    where: {
      organizationId,
      status: {
        notIn: ['COMPLETED', 'CANCELLED', 'FAILED', 'DELIVERED'],
      },
    },
  });
  if (activeJobCount > 0) {
    blockers.push(`You have ${activeJobCount} active job(s) that need to be completed or cancelled.`);
  }

  // Active sessions
  const activeSessionCount = await prisma.session.count({
    where: {
      userId,
      active: true,
      expiresAt: { gt: new Date() },
    },
  });
  if (activeSessionCount > 0) {
    blockers.push(`You have ${activeSessionCount} active session(s).`);
  }

  // Pending payouts (manual invoices in unpaid/pending state)
  const pendingInvoiceCount = await prisma.manualInvoice.count({
    where: {
      organizationId,
      paymentStatus: { in: ['UNPAID', 'PENDING'] },
    },
  });
  if (pendingInvoiceCount > 0) {
    blockers.push(`You have ${pendingInvoiceCount} pending invoice(s).`);
  }

  // Active subscriptions
  const activeSubCount = await prisma.subscription.count({
    where: {
      organizationId,
      status: { in: ['TRIALING', 'ACTIVE', 'PAST_DUE'] },
    },
  });
  if (activeSubCount > 0) {
    blockers.push(`You have ${activeSubCount} active subscription(s) that need to be cancelled first.`);
  }

  return { blocked: blockers.length > 0, blockers };
}

/**
 * Request account deletion — flags the account for deletion after a 7-day grace period.
 * Blocks if in-flight operations exist.
 */
export async function requestAccountDeletion(userId: string, organizationId: string): Promise<{
  scheduledForDeletion: boolean;
  deletionScheduledAt: Date;
  blockers?: string[];
  note: string;
}> {
  // Check for in-flight operations
  const { blocked, blockers } = await checkDeletionBlockers(userId, organizationId);

  if (blocked) {
    return {
      scheduledForDeletion: false,
      deletionScheduledAt: new Date(0),
      blockers,
      note: 'Cannot schedule deletion until all in-flight operations are resolved.',
    };
  }

  const now = new Date();
  const gracePeriodDays = 7;
  const deletionAt = new Date(now.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: 'DISABLED',
      deletedAt: deletionAt,
    },
  });

  // Revoke all active sessions
  await prisma.session.updateMany({
    where: { userId, active: true },
    data: { active: false, revokedAt: now },
  });

  return {
    scheduledForDeletion: true,
    deletionScheduledAt: deletionAt,
    note: `Account scheduled for deletion on ${deletionAt.toISOString().slice(0, 10)}. You have ${gracePeriodDays} days to cancel this request.`,
  };
}

/**
 * Cancel a pending account deletion request.
 */
export async function cancelAccountDeletion(userId: string): Promise<{
  cancelled: boolean;
  note: string;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { deletedAt: true, accountStatus: true },
  });

  if (!user || !user.deletedAt) {
    return { cancelled: false, note: 'No pending deletion request found.' };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: null,
      accountStatus: 'ACTIVE',
    },
  });

  return {
    cancelled: true,
    note: 'Account deletion request has been cancelled. Your account is now active.',
  };
}

/**
 * Purge expired scheduled deletions — hard delete accounts past their grace period.
 * Returns the number of accounts purged.
 */
export async function purgeScheduledDeletions(): Promise<number> {
  const now = new Date();
  const expired = await prisma.user.findMany({
    where: {
      deletedAt: { lte: now, not: null },
    },
    select: { id: true },
  });

  if (expired.length === 0) return 0;

  // Hard delete users past their grace period
  const result = await prisma.user.deleteMany({
    where: {
      id: { in: expired.map((u) => u.id) },
      deletedAt: { lte: now },
    },
  });

  return result.count;
}
