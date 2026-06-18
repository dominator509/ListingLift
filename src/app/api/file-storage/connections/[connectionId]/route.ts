import { NextResponse } from 'next/server';

import { buildFileStorageConnectionUpdateDraft } from '@/server/services/file-storage-connection-service';

export async function GET(_: Request, { params }: { params: Promise<{ connectionId: string }> }) {
  return NextResponse.json({ ok: true, connectionId: (await params).connectionId, gap: 'Codex must query scoped storage connection.' });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ connectionId: string }> }) {
  const body = await request.json();
  const draft = buildFileStorageConnectionUpdateDraft({ ...body, connectionId: (await params).connectionId, actorUserId: body.actorUserId ?? 'demo-user' });
  return NextResponse.json({ ok: true, dryRun: true, draft });
}
