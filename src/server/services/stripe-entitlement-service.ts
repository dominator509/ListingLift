import { evaluatePaidFulfillmentAccess } from '@/domain/stripe-billing';

export function buildStripePaidEntitlementDraft(input: {
  checkoutSessionId: string;
  organizationId?: string;
  clientId?: string;
  jobId?: string;
  packageKey?: string;
  paymentStatus: 'UNPAID' | 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | 'MANUAL_CONFIRMED';
  approvalReady?: boolean;
  duplicate?: boolean;
}) {
  const accessDecision = evaluatePaidFulfillmentAccess({
    paymentStatus: input.paymentStatus,
    approvalReady: input.approvalReady ?? false,
    duplicate: input.duplicate ?? false,
  });
  return {
    ...input,
    accessDecision,
    mayCreateUploadLink: input.paymentStatus === 'PAID' && !(input.duplicate ?? false),
    mayExposeDelivery: accessDecision === 'ALLOW',
    auditRequired: true,
  };
}
