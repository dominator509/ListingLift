import type { AdapterDefinition } from '../adapter-types';
import type { z } from 'zod';

export type CheckoutRequest = {
  packageKey: string;
  clientEmail?: string;
  successUrl: string;
  cancelUrl: string;
  purpose?: 'PACKAGE' | 'SUBSCRIPTION' | 'CREDITS' | 'RETAINER' | 'AGENCY';
  amountCents?: number;
  currency?: string;
  metadata?: Record<string, string>;
};

export type CheckoutResult = {
  ok: boolean;
  checkoutUrl?: string;
  externalId?: string;
  provider?: string;
  mode?: 'mock' | 'manual' | 'test' | 'real' | 'disabled';
  error?: string;
  manualFallbackRequired?: boolean;
  raw?: unknown;
};

export type WebhookVerificationResult = {
  ok: boolean;
  provider: string;
  eventId?: string;
  eventType?: string;
  error?: string;
};

export type PaymentAdapter<TConfig extends z.ZodTypeAny = z.ZodTypeAny> = AdapterDefinition<TConfig> & {
  createCheckout: (request: CheckoutRequest) => Promise<CheckoutResult>;
  verifyWebhook?: (payload: string, signature?: string) => Promise<WebhookVerificationResult>;
};
