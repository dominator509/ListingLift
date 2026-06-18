import { NextResponse } from 'next/server';
import { taskNotificationTestInputSchema } from '@/schemas/task-notification-integrations';
import { dispatchTaskNotification } from '@/server/services/task-notification-dispatch-service';

export async function POST(request: Request) {
  const body = taskNotificationTestInputSchema.parse(await request.json());
  const dispatch = await dispatchTaskNotification({ organizationId: 'dry-run-org', providerKey: body.providerKey, actionKey: body.actionKey, title: 'ListingLift integration test', message: 'Dry-run test payload only.', payload: { test: true }, dryRun: true });
  return NextResponse.json({ ok: true, dispatch, persistence: 'dry-run' });
}
