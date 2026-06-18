import { NextResponse } from 'next/server';
import { buildTaskDataExportPlan } from '@/server/services/task-data-export-planner-service';
import { dispatchTaskNotification } from '@/server/services/task-notification-dispatch-service';

export async function POST(request: Request) {
  const body = await request.json();
  const plan = buildTaskDataExportPlan(body);
  const dispatch = await dispatchTaskNotification({ organizationId: body.organizationId, providerKey: plan.providerKey, actionKey: plan.actionKey, payload: { exportKind: plan.exportKind, rowCount: plan.rowCount }, dryRun: body.dryRun ?? true });
  return NextResponse.json({ ok: true, plan, dispatch, persistence: 'dry-run' }, { status: 202 });
}
