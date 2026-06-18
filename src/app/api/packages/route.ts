import { listDefaultPackages, buildPackageAdminDraft } from '@/server/services/package-service';
import { guardedPost, parseJson } from '@/server/routes/route-helpers';

export async function GET() {
  return Response.json({ ok: true, data: listDefaultPackages({ activeOnly: true }) });
}

export async function POST(request: Request) {
  return guardedPost(request, 'manage:packages', async () => {
    const body = await parseJson(request, {});
    return buildPackageAdminDraft(body as never);
  });
}
