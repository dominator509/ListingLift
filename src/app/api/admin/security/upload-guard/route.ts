import { PERMISSIONS } from '@/domain/permissions';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { evaluateSecurityUploadProbe, evaluateSecurityZipProbe } from '@/server/services/security-upload-guard-service';
import { securityUploadProbeSchema, securityZipEntryProbeSchema } from '@/schemas/security-hardening';

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    const body = await parseJson(request, {});
    const bodyObject = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {};
    const parsed = securityUploadProbeSchema.parse(body);
    const zipEntries = Array.isArray(bodyObject.zipEntries)
      ? bodyObject.zipEntries.map((e: unknown) => securityZipEntryProbeSchema.parse(e))
      : undefined;
    return {
      upload: evaluateSecurityUploadProbe(parsed),
      zip: zipEntries ? evaluateSecurityZipProbe(zipEntries) : null,
      codexNote: 'Dry-run probe only. Codex must enforce these checks before storage, extraction, processing, or shared delivery/API use for organization ' + session.organizationId + '.',
    };
  });
}
