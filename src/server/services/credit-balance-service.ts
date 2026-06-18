import { canConsumeCredits, calculateBalanceAfter } from '@/domain/credits-subscriptions';
import { creditConsumptionInputSchema, type CreditConsumptionInput } from '@/schemas/credits-subscriptions';

export function evaluateCreditConsumption(input: CreditConsumptionInput & { subscriptionStatus?: 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED' | 'PENDING_PAYMENT' | null }) {
  const parsed = creditConsumptionInputSchema.parse(input);
  const allowed = canConsumeCredits({ available: parsed.availableCredits, requested: parsed.requestedCredits, subscriptionStatus: input.subscriptionStatus });
  return {
    allowed,
    clientId: parsed.clientId,
    jobId: parsed.jobId,
    requestedCredits: parsed.requestedCredits,
    availableCredits: parsed.availableCredits,
    balanceAfter: allowed ? calculateBalanceAfter(parsed.availableCredits, -parsed.requestedCredits) : parsed.availableCredits,
    denialReason: allowed ? null : 'Insufficient active credits or inactive subscription entitlement.',
  };
}

export function summarizeCreditLedger(entries: Array<{ amount: number; createdAt?: string | Date; reason?: string }>) {
  const balance = entries.reduce((sum, entry) => Math.max(0, sum + Math.trunc(entry.amount)), 0);
  const creditsAdded = entries.filter((entry) => entry.amount > 0).reduce((sum, entry) => sum + entry.amount, 0);
  const creditsUsed = Math.abs(entries.filter((entry) => entry.amount < 0).reduce((sum, entry) => sum + entry.amount, 0));
  return { balance, creditsAdded, creditsUsed, entryCount: entries.length };
}
