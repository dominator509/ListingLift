import { NextResponse } from 'next/server';
import { clientDashboardEventSchema } from '@/schemas/client-dashboard';
import { buildClientDashboardEventDraft } from '@/server/services/client-dashboard-event-service';

export async function POST(request: Request) {
  const body = clientDashboardEventSchema.parse(await request.json());
  return NextResponse.json({ dryRun: true, event: buildClientDashboardEventDraft(body, { organizationId: 'active-session-org', userId: 'active-session-user' }), codexNote: 'Codex must persist dashboard events only after auth/session and rate-limit checks.' });
}
