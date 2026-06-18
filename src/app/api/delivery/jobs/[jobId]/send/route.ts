import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { deliveryLinkIssueSchema } from '@/schemas/delivery-notification';
import { prepareDeliverySendDraft } from '@/server/services/delivery-send-orchestrator';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'send:delivery');
    const body = deliveryLinkIssueSchema.parse({ ...(await parseJson(request, {})), jobId: (await params).jobId });
    const draft = await prepareDeliverySendDraft({ ...body, organizationId: session.organizationId, actorUserId: session.userId });
    return jsonOk(draft, { status: 201 });
  } catch (error) {
    return mapServiceError(error);
  }
}
