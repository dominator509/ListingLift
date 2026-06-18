import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { fiverrRevisionUpdateSchema } from '@/schemas/fiverr';
import { buildFiverrRevisionStatusDraft } from '@/server/services/fiverr-revision-workflow-service';

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const input = fiverrRevisionUpdateSchema.parse({ ...body, dryRun: body.dryRun ?? true });
    return jsonOk({ draft: buildFiverrRevisionStatusDraft(input), note: 'Seed route. Codex must persist revision workflow events and job status changes transactionally.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
