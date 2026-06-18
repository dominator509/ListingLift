import { DEFAULT_TASKRABBIT_SERVICE_MAPPINGS, findTaskrabbitServiceMapping } from '@/domain/taskrabbit';
import { taskrabbitServiceMappingSchema, type TaskrabbitManualTaskInput } from '@/schemas/taskrabbit';

export function listTaskrabbitServiceMappings() {
  return DEFAULT_TASKRABBIT_SERVICE_MAPPINGS.map((mapping) => taskrabbitServiceMappingSchema.parse(mapping));
}

export function resolveTaskrabbitServiceMapping(input: Pick<TaskrabbitManualTaskInput, 'taskCategory' | 'serviceAngleKey' | 'taskTitle' | 'taskNotes' | 'packagePurchased' | 'packageKey' | 'revisionAllowance'>) {
  const mapping = findTaskrabbitServiceMapping({
    category: input.taskCategory,
    serviceAngleKey: input.serviceAngleKey,
    taskTitle: input.taskTitle,
    taskNotes: input.taskNotes,
    packagePurchased: input.packagePurchased,
  });
  return {
    mapping,
    packageKey: input.packageKey ?? mapping.packageKey,
    imageAllowance: mapping.imageAllowance,
    revisionAllowance: input.revisionAllowance ?? mapping.revisionAllowance,
  };
}
