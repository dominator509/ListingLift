import { NextResponse } from 'next/server';
import { automationEventDraftSchema } from '@/schemas/automation-webhooks';
import { buildAutomationEventPayload } from '@/server/services/automation-event-payload-service';

export async function GET() {
  return NextResponse.json({ ok: true, events: [], note: 'Codex must query AutomationEvent/AutomationWebhookDelivery rows by organization.' });
}

export async function POST(request: Request) {
  const body = automationEventDraftSchema.parse(await request.json());
  const event = buildAutomationEventPayload({ ...body, actionKey: 'NOTIFY_ADMIN' });
  return NextResponse.json({ ok: true, event, persistence: 'dry-run' }, { status: 202 });
}
