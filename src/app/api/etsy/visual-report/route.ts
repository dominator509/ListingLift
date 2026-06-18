import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { etsyReportInputSchema } from '@/schemas/etsy';
import { createEtsyVisualReport } from '@/server/services/etsy-delivery-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = etsyReportInputSchema.parse(body);
    return jsonOk({ report: createEtsyVisualReport(input), note: 'Seed report generator. Codex must persist report rows and enforce seller-review wording.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
