import { NextResponse } from 'next/server';
import { buildSlackAlertPlan } from '@/server/services/slack-alert-service';
import { dispatchTaskNotification } from '@/server/services/task-notification-dispatch-service';

export async function POST(request: Request) {
  const body = await request.json();
  const plan = buildSlackAlertPlan(body);
  const dispatch = await dispatchTaskNotification({ organizationId: body.organizationId, providerKey: plan.providerKey, actionKey: plan.actionKey, title: body.title, message: body.message, payload: plan.payload, dryRun: body.dryRun ?? true });
  return NextResponse.json({ ok: true, plan, dispatch, persistence: 'dry-run' }, { status: 202 });
}
