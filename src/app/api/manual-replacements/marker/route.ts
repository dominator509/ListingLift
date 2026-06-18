import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';

import { manualReplacementMarkerSchema } from '@/schemas/manual-approval';
import { buildManualReplacementMarker } from '@/server/services/manual-edited-replacement-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'review:outputs');
    const payload = manualReplacementMarkerSchema.parse(await parseJson(request, {}));
    return jsonOk({ marker: buildManualReplacementMarker(payload, { organizationId: session.organizationId, actorUserId: session.userId }), note: 'Dry-run manual replacement marker. Codex must validate actual uploaded file and preserve original upload.' });
  } catch (error) { return mapServiceError(error); }
}
