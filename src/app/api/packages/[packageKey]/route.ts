import { jsonFail, jsonOk } from '@/lib/api-response';
import { findPackageByKey, buildPackageAdminDraft } from '@/server/services/package-service';
import { guardedPatch, parseJson } from '@/server/routes/route-helpers';

export async function GET(_request: Request, context: { params: Promise<{ packageKey: string }> | { packageKey: string } }) {
  const params = await context.params;
  const pkg = findPackageByKey(params.packageKey);
  if (!pkg) return jsonFail('not_found', 'Package not found.', 404);
  return jsonOk(pkg);
}

export async function PATCH(request: Request, context: { params: Promise<{ packageKey: string }> | { packageKey: string } }) {
  const params = await context.params;
  return guardedPatch(request, 'manage:packages', async () => {
    const body = await parseJson(request, {});
    return buildPackageAdminDraft({ ...(body as object), key: params.packageKey } as never);
  });
}
