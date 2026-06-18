import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { etsyDeliveryTemplateInputSchema } from '@/schemas/etsy';
import { createEtsyDeliveryTemplate } from '@/server/services/etsy-delivery-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = etsyDeliveryTemplateInputSchema.parse(body);
    return jsonOk({ template: createEtsyDeliveryTemplate(input), note: 'Manual operator copy only. Do not automate Etsy buyer messages.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
