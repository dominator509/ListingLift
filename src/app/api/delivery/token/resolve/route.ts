import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { deliveryTokenResolveSchema } from '@/schemas/delivery-notification';
import { resolveDeliveryTokenDraft } from '@/server/services/delivery-link-service';

export async function POST(request: Request) {
  try {
    const body = deliveryTokenResolveSchema.parse(await parseJson(request, {}));
    const draft = resolveDeliveryTokenDraft({
      ...body,
      jobId: 'codex-wire-job-id',
      jobStatus: 'READY_FOR_DELIVERY',
      deliveryLinkStatus: 'ACTIVE',
      deliveryArchiveStatus: 'APPROVED',
      tokenHashFromDatabase: 'codex-wire-hash-from-database',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      approvedAt: new Date(),
      deliveryArchiveApprovedAt: new Date(),
      downloadCount: 0,
      maxDownloads: 5,
    });
    return jsonOk({ ...draft, tokenHash: '[redacted]', note: 'Dry-run only. Codex must look up delivery link by token hash and record a download event.' });
  } catch (error) {
    return mapServiceError(error);
  }
}
