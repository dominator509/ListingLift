import { NextResponse } from 'next/server';
import { planAutomationSubscriptionUpdate } from '@/server/services/automation-subscription-service';

export async function GET(_request: Request, { params }: { params: Promise<{ subscriptionId: string }> }) {
  return NextResponse.json({ ok: true, subscriptionId: (await params).subscriptionId, note: 'Codex must load this subscription by tenant scope.' });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ subscriptionId: string }> }) {
  const body = await request.json();
  return NextResponse.json({ ok: true, plan: planAutomationSubscriptionUpdate({ subscriptionId: (await params).subscriptionId, ...body }) }, { status: 202 });
}
