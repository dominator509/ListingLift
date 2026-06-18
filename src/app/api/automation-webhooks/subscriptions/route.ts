import { NextResponse } from 'next/server';
import { buildAutomationSubscriptionDraft } from '@/server/services/automation-subscription-service';

export async function GET() {
  return NextResponse.json({ ok: true, subscriptions: [], note: 'Codex must connect to tenant-scoped AutomationWebhookSubscription rows.' });
}

export async function POST(request: Request) {
  const body = await request.json();
  const draft = buildAutomationSubscriptionDraft(body);
  return NextResponse.json({ ok: true, draft, persistence: 'dry-run' }, { status: 202 });
}
