import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { marketplaceComplianceWarningInputSchema } from '@/schemas/amazon-ebay-woocommerce';
import { createMarketplaceComplianceWarnings } from '@/server/services/marketplace-compliance-warning-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = marketplaceComplianceWarningInputSchema.parse(body);
    return jsonOk({ warnings: createMarketplaceComplianceWarnings(input) });
  } catch (error) {
    return mapServiceError(error);
  }
}
