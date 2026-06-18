import { NextResponse } from 'next/server';

import { planFileStorageDeliveryExport } from '@/server/services/file-storage-export-service';

export async function POST(request: Request) {
  const body = await request.json();
  const plan = await planFileStorageDeliveryExport({ ...body, organizationId: body.organizationId ?? 'demo-org' });
  return NextResponse.json({ ok: true, dryRun: true, plan });
}
