import { jsonOk, mapServiceError } from '@/lib/api-response';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { parseJson } from '@/server/routes/route-helpers';

import { summarizeRevisionQueue } from '@/server/services/revision-workflow-service';

export async function GET(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const session = await requireSession(request);
    assertPermission(session, 'view:client-dashboard');
    return jsonOk({ jobId: (await params).jobId, summary: summarizeRevisionQueue([]), note: 'Dry-run revision list. Codex must scope by organization, client, and job permissions.', organizationId: session.organizationId });
  } catch (error) { return mapServiceError(error); }
}
