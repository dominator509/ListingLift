import { taskCreationInputSchema } from '@/schemas/task-notification-integrations';
import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';

export function buildTaskCreationPlan(input: unknown) {
  const parsed = taskCreationInputSchema.parse(input);
  return {
    providerKey: parsed.providerKey,
    actionKey: parsed.actionKey,
    dryRun: parsed.dryRun,
    title: parsed.title,
    description: parsed.description,
    jobId: parsed.jobId,
    dueAt: parsed.dueAt,
    labels: parsed.labels,
    redactedPayload: redactTaskIntegrationPayload({ title: parsed.title, description: parsed.description, jobId: parsed.jobId, dueAt: parsed.dueAt, labels: parsed.labels }),
    persistence: 'dry-run',
  };
}
