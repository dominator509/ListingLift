import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { createSocialCommerceDeliveryTemplate } from '@/server/services/social-commerce-delivery-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    return jsonOk({ template: createSocialCommerceDeliveryTemplate(body) }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
