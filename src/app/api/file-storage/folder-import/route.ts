import { NextResponse } from 'next/server';

import { planFileStorageFolderImport } from '@/server/services/file-storage-folder-import-service';

export async function POST(request: Request) {
  const body = await request.json();
  const plan = await planFileStorageFolderImport({ ...body, organizationId: body.organizationId ?? 'demo-org' });
  return NextResponse.json({ ok: true, dryRun: true, plan });
}
