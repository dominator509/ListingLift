import { TASKRABBIT_MARKETPLACE_SAFETY_RULES, isUnsafeTaskrabbitAutomationAction } from '@/domain/taskrabbit';
import { taskrabbitSafetyCheckSchema } from '@/schemas/taskrabbit';

export function evaluateTaskrabbitWorkflowSafety(input: unknown) {
  const parsed = taskrabbitSafetyCheckSchema.parse(input);
  const unsafeActions = parsed.intendedActions.filter(isUnsafeTaskrabbitAutomationAction);
  const warnings: string[] = [];
  if (unsafeActions.length > 0) warnings.push('Unsafe Taskrabbit automation/storage action detected. Keep workflow manual unless approved integration permits it.');
  if (parsed.deliveryMode === 'TASKRABBIT_MESSAGE_WITH_ALLOWED_LINK' && !parsed.externalLinkAllowed) warnings.push('External link delivery requires task-context permission and customer consent.');
  if (parsed.storesLocationData) warnings.push('Avoid storing full customer addresses; store only coarse area notes unless needed for the task.');
  if (!parsed.customerConsentForDirectFollowUp) warnings.push('Direct-retainer follow-up must remain internal/planned until platform rules and customer consent allow it.');
  return {
    ok: unsafeActions.length === 0,
    unsafeActions,
    warnings,
    safetyRules: TASKRABBIT_MARKETPLACE_SAFETY_RULES,
    manualFallbackRequired: true,
  };
}
