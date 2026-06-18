import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { upworkDeliveryTemplateInputSchema } from '@/schemas/upwork';
import { buildUpworkDeliveryTemplateDraft } from '@/server/services/upwork-template-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const deliveryInput = upworkDeliveryTemplateInputSchema.parse(body);
    const deliveryTemplate = buildUpworkDeliveryTemplateDraft(deliveryInput);
    return jsonOk({
      exportPlan: {
        deliveryTemplate,
        requiredArchiveStatus: 'APPROVED',
        deliveryChannel: deliveryInput.deliveryMode,
        manualCompletionRequired: true,
      },
      note: 'Codex must connect this to approved DeliveryArchive records and prevent unapproved output exposure.',
    });
  } catch (error) {
    return mapServiceError(error);
  }
}
