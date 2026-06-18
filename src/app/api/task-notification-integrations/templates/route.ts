import { NextResponse } from 'next/server';
import { buildOperatorNotificationTemplate } from '@/server/services/notification-template-service';

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ok: true, template: buildOperatorNotificationTemplate({ eventKey: body.eventKey ?? 'WAITING_FOR_REVIEW', title: body.title, message: body.message, jobId: body.jobId }) });
}
