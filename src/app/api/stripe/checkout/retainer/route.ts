import { jsonFail, jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createStripeCheckoutSession } from '@/server/services/stripe-checkout-service';
import { validateStripeCheckoutPrice } from '@/server/services/validate-server-price';
import type { StripeCheckoutRequestInput } from '@/schemas/stripe-billing';

export async function POST(request: Request) {
  const body = await parseJson<Partial<StripeCheckoutRequestInput & { amountCents?: number; stripePriceId?: string }>>(request, {});
  const packageKey = body.packageKey ?? 'MonthlySellerRetainer';
  const purpose = body.purpose ?? 'RETAINER';

  // P11: Server-side price validation
  const validation = validateStripeCheckoutPrice({
    packageKey,
    purpose,
    imageQuantity: body.imageQuantity,
    clientAmountCents: body.amountCents,
    stripePriceId: body.stripePriceId,
  });
  if (!validation.ok) {
    return jsonFail('price_validation_failed', validation.error, validation.status);
  }

  const result = await createStripeCheckoutSession({
    purpose,
    packageKey,
    ...body,
    quantity: body.quantity ?? 1,
    metadata: body.metadata ?? {},
  });
  return jsonOk({ ...result, note: 'Seed route. Codex must persist checkout session and call Stripe SDK when flags are enabled.' }, { status: 201 });
}
