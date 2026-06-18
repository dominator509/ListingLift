import { NextResponse } from 'next/server';

import { buildStorageReadAccessPlan } from '@/server/services/file-storage-access-service';

export async function POST(request: Request) {
  const body = await request.json();
  const plan = await buildStorageReadAccessPlan({ ...body, organizationId: body.organizationId ?? 'demo-org' });
  return NextResponse.json({ ok: true, dryRun: true, plan });
}
