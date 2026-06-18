export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request: { id: string | null; idempotency_key: string | null };
}

export interface StripeCheckoutRequestInput {
  packageKey: string;
  purpose: string;
  quantity?: number;
  imageQuantity?: number;
  buyerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, unknown>;
  organizationId?: string;
  clientId?: string;
}

export const stripeWebhookEventSchema = {
  parse: (input: unknown): StripeWebhookEvent => {
    if (!input || typeof input !== 'object') throw new Error('Invalid stripe webhook event');
    const obj = input as Record<string, unknown>;
    if (!obj.id || typeof obj.id !== 'string') throw new Error('Missing event id');
    if (!obj.type || typeof obj.type !== 'string') throw new Error('Missing event type');
    return obj as StripeWebhookEvent;
  },
};

export const stripeCheckoutRequestSchema = {
  parse: (input: unknown): StripeCheckoutRequestInput => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      packageKey: input.packageKey as string,
      purpose: input.purpose as string,
      quantity: input.quantity as number | undefined,
      imageQuantity: input.imageQuantity as number | undefined,
      buyerEmail: input.buyerEmail as string | undefined,
      successUrl: input.successUrl as string | undefined,
      cancelUrl: input.cancelUrl as string | undefined,
      metadata: input.metadata as Record<string, unknown> | undefined,
      organizationId: input.organizationId as string | undefined,
      clientId: input.clientId as string | undefined,
    };
  },
};

export const stripeCreditPurchaseSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return { credits: input.credits as number, amount: input.amount as number, currency: (input.currency as string) ?? 'usd' };
  },
};

export const stripeCustomerPortalRequestSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') return {};
    return { returnUrl: input.returnUrl as string | undefined };
  },
};
