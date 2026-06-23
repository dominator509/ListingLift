export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  created?: number;
  livemode?: boolean;
  pending_webhooks?: number;
  request?: { id: string | null; idempotency_key: string | null };
}

export interface StripeCheckoutRequestInput {
  packageKey: string;
  purpose: 'PACKAGE' | 'SUBSCRIPTION' | 'CREDITS' | 'RETAINER' | 'AGENCY';
  quantity?: number;
  imageQuantity?: number;
  buyerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, unknown>;
  organizationId?: string;
  clientId?: string;
}

export interface StripeCreditPurchaseInput {
  creditAmount: number;
  amount?: number;
  currency?: string;
  successUrl?: string;
  cancelUrl?: string;
  buyerEmail?: string;
  organizationId?: string;
  clientId?: string;
}

export interface StripeCustomerPortalRequest {
  stripeCustomerId?: string;
  returnUrl?: string;
}

export const stripeWebhookEventSchema = {
  parse: (input: unknown): StripeWebhookEvent => {
    if (!input || typeof input !== 'object') throw new Error('Invalid stripe webhook event');
    const obj = input as Record<string, unknown>;
    if (!obj.id || typeof obj.id !== 'string') throw new Error('Missing event id');
    if (!obj.type || typeof obj.type !== 'string') throw new Error('Missing event type');
    return obj as unknown as StripeWebhookEvent;
  },
};

export const stripeCheckoutRequestSchema = {
  parse: (input: unknown): StripeCheckoutRequestInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      packageKey: obj.packageKey as string,
      purpose: obj.purpose as StripeCheckoutRequestInput['purpose'],
      quantity: obj.quantity as number | undefined,
      imageQuantity: obj.imageQuantity as number | undefined,
      buyerEmail: obj.buyerEmail as string | undefined,
      successUrl: obj.successUrl as string | undefined,
      cancelUrl: obj.cancelUrl as string | undefined,
      metadata: obj.metadata as Record<string, unknown> | undefined,
      organizationId: obj.organizationId as string | undefined,
      clientId: obj.clientId as string | undefined,
    };
  },
};

export const stripeCreditPurchaseSchema = {
  parse: (input: unknown): StripeCreditPurchaseInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      creditAmount: (obj.creditAmount ?? obj.credits) as number,
      amount: obj.amount as number,
      currency: (obj.currency as string) ?? 'usd',
      successUrl: obj.successUrl as string | undefined,
      cancelUrl: obj.cancelUrl as string | undefined,
      buyerEmail: obj.buyerEmail as string | undefined,
      organizationId: obj.organizationId as string | undefined,
      clientId: obj.clientId as string | undefined,
    };
  },
};

export const stripeCustomerPortalRequestSchema = {
  parse: (input: unknown): StripeCustomerPortalRequest => {
    if (!input || typeof input !== 'object') return {};
    const obj = input as Record<string, unknown>;
    return {
      stripeCustomerId: obj.stripeCustomerId as string | undefined,
      returnUrl: obj.returnUrl as string | undefined,
    };
  },
};

export type StripeWebhookEventInput = StripeWebhookEvent;
