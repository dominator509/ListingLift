import { NextResponse } from 'next/server';
import { buildTaskCreationPlan } from '@/server/services/task-creation-planner-service';
import { dispatchTaskNotification } from '@/server/services/task-notification-dispatch-service';

export async function POST(request: Request) {
  const body = await request.json();
  const plan = buildTaskCreationPlan(body);
  const dispatch = await dispatchTaskNotification({ organizationId: body.organizationId, providerKey: plan.providerKey, actionKey: plan.actionKey, title: plan.title, message: plan.description, payload: plan.redactedPayload, dryRun: body.dryRun ?? true });
  return NextResponse.json({ ok: true, plan, dispatch, persistence: 'dry-run' }, { status: 202 });
}
