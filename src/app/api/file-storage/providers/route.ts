import { NextResponse } from 'next/server';

import { listFileStorageProviderPolicies } from '@/server/services/file-storage-policy-service';
import { listFileStorageAdapters } from '@/server/adapters/file-storage/registry';

export async function GET() {
  return NextResponse.json({ ok: true, policies: listFileStorageProviderPolicies(), adapters: listFileStorageAdapters() });
}
