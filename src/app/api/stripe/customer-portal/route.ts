import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createStripeCustomerPortalDraft } from '@/server/services/stripe-customer-service';
import type { StripeCustomerPortalRequest } from '@/schemas/stripe-billing';

export async function POST(request: Request) {
  const body = await parseJson<Partial<StripeCustomerPortalRequest>>(request, {});
  const draft = createStripeCustomerPortalDraft({ ...body, stripeCustomerId: body.stripeCustomerId ?? 'cus_seed_placeholder' });
  return jsonOk({ draft }, { status: 201 });
}
