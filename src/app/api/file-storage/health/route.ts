import { NextResponse } from 'next/server';

import { checkFileStorageHealth } from '@/server/services/file-storage-health-service';

export async function GET() {
  const health = await checkFileStorageHealth();
  return NextResponse.json({ ok: true, health });
}
