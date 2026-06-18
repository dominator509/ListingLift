export function evaluatePaidFulfillmentGate(input: {
  paymentStatus: 'UNPAID' | 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | 'MANUAL_CONFIRMED';
  creditBalance?: number;
  requiredCredits?: number;
  manualInvoiceStatus?: 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'VOID' | 'OVERDUE' | 'FAILED' | null;
  subscriptionStatus?: 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED' | 'PENDING_PAYMENT' | null;
}) {
  if (input.paymentStatus === 'PAID' || input.paymentStatus === 'MANUAL_CONFIRMED') return { allowed: true, source: 'payment', reason: null };
  if (input.manualInvoiceStatus === 'PAID' || input.manualInvoiceStatus === 'PARTIALLY_PAID') return { allowed: true, source: 'manual_invoice', reason: null };
  if (input.subscriptionStatus === 'ACTIVE') return { allowed: true, source: 'subscription', reason: null };
  if ((input.creditBalance ?? 0) >= (input.requiredCredits ?? 1)) return { allowed: true, source: 'credits', reason: null };
  return { allowed: false, source: null, reason: 'No verified payment, manual invoice confirmation, active subscription, or available credits.' };
}
