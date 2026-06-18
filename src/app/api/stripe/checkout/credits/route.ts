import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createStripeCreditCheckoutDraft } from '@/server/services/stripe-checkout-service';
import type { StripeCreditPurchaseInput } from '@/schemas/stripe-billing';

export async function POST(request: Request) {
  const body = await parseJson<Partial<StripeCreditPurchaseInput>>(request, {});
  const draft = createStripeCreditCheckoutDraft({ ...body, creditAmount: body.creditAmount ?? 25 });
  return jsonOk({ draft, note: 'Seed route. Codex must persist credit checkout and call Stripe SDK when flags are enabled.' }, { status: 201 });
}
