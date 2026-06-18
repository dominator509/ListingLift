import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { deliveryLinkIssueSchema } from '@/schemas/delivery-notification';
import { issueDeliveryLinkDraft } from '@/server/services/delivery-link-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'send:delivery');
    const body = deliveryLinkIssueSchema.parse(await parseJson(request, {}));
    const draft = issueDeliveryLinkDraft({ ...body, organizationId: session.organizationId, actorUserId: session.userId });
    return jsonOk({ ...draft, tokenHash: '[redacted]', note: 'Dry-run link issue. Codex must persist tokenHash only and never log raw token.' }, { status: 201 });
  } catch (error) {
    return mapServiceError(error);
  }
}
