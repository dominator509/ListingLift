import { NextResponse } from 'next/server';

import { buildFileStorageConnectionDraft } from '@/server/services/file-storage-connection-service';

export async function GET() {
  return NextResponse.json({ ok: true, connections: [], gap: 'Codex must query FileStorageConnection by tenant scope and RBAC.' });
}

export async function POST(request: Request) {
  const body = await request.json();
  const draft = buildFileStorageConnectionDraft({ ...body, organizationId: body.organizationId ?? 'demo-org', actorUserId: body.actorUserId ?? 'demo-user' });
  return NextResponse.json({ ok: true, dryRun: true, draft });
}
