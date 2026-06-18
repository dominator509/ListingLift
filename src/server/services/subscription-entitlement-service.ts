import { subscriptionEntitlementInputSchema, type SubscriptionEntitlementInput } from '@/schemas/credits-subscriptions';
import { calculateBalanceAfter } from '@/domain/credits-subscriptions';

export function buildSubscriptionEntitlementDraft(input: SubscriptionEntitlementInput & { organizationId: string }) {
  const parsed = subscriptionEntitlementInputSchema.parse(input);
  return {
    organizationId: input.organizationId,
    clientId: parsed.clientId ?? null,
    subscriptionId: parsed.subscriptionId ?? null,
    entitlementKey: parsed.entitlementKey,
    monthlyImageAllowance: parsed.monthlyImageAllowance,
    usedThisPeriod: parsed.usedThisPeriod,
    remainingThisPeriod: calculateBalanceAfter(parsed.monthlyImageAllowance, -parsed.usedThisPeriod),
    status: parsed.status,
    resetsAt: parsed.resetsAt ? new Date(parsed.resetsAt) : null,
  };
}

export function evaluateSubscriptionEntitlementAccess(input: { status: string; monthlyImageAllowance: number; usedThisPeriod: number; paymentStatus?: string | null }) {
  if (input.status !== 'ACTIVE') return { allowed: false, reason: 'Subscription entitlement is not active.' };
  if (input.paymentStatus && ['FAILED', 'REFUNDED', 'UNPAID'].includes(input.paymentStatus)) return { allowed: false, reason: 'Subscription payment is not confirmed.' };
  if (input.usedThisPeriod >= input.monthlyImageAllowance) return { allowed: false, reason: 'Monthly allowance exhausted.' };
  return { allowed: true, reason: null };
}

export function buildSubscriptionAllowanceLedgerDraft(input: { organizationId: string; clientId?: string; subscriptionId?: string; monthlyImageAllowance: number; previousBalance: number }) {
  return {
    organizationId: input.organizationId,
    clientId: input.clientId ?? null,
    amount: input.monthlyImageAllowance,
    balanceAfter: calculateBalanceAfter(input.previousBalance, input.monthlyImageAllowance),
    creditType: 'SUBSCRIPTION_ALLOWANCE',
    source: 'subscription_entitlement',
    sourceReferenceType: 'Subscription',
    sourceReferenceId: input.subscriptionId ?? null,
    reason: 'SUBSCRIPTION_RESET',
  };
}
