import { jsonOk, mapServiceError } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { taskrabbitServiceMappingSchema } from '@/schemas/taskrabbit';
import { listTaskrabbitServiceMappings } from '@/server/services/taskrabbit-service-mapping-service';

export async function GET() {
  return jsonOk({ mappings: listTaskrabbitServiceMappings(), note: 'Seed registry. Codex must persist org-scoped Taskrabbit service mappings with audit logs.' });
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<Record<string, unknown>>(request, {});
    const mapping = taskrabbitServiceMappingSchema.parse(body);
    return jsonOk({ mapping, note: 'Dry-run mapping validation only. Codex must persist with manage:sales-channels or manage:integrations permission.' }, { status: 202 });
  } catch (error) {
    return mapServiceError(error);
  }
}
