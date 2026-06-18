import { UPWORK_MARKETPLACE_SAFETY_RULES, assertNoUnsafeUpworkAutomation } from '@/domain/upwork';
import { upworkSafetyCheckSchema } from '@/schemas/upwork';

export function evaluateUpworkWorkflowSafety(input: unknown) {
  const parsed = upworkSafetyCheckSchema.parse(input);
  const automation = assertNoUnsafeUpworkAutomation(parsed.intendedActions);
  const linkRisk = parsed.deliveryMode === 'UPWORK_MESSAGE_WITH_ALLOWED_LINK' && !parsed.externalLinkAllowed;
  return {
    allowed: automation.allowed && !linkRisk,
    blockedActions: automation.blockedActions,
    deliveryLinkAllowed: !linkRisk,
    linkRisk,
    rules: [...UPWORK_MARKETPLACE_SAFETY_RULES],
    recommendation: automation.allowed && !linkRisk
      ? 'Manual Upwork workflow can proceed with audit logging and operator review.'
      : 'Use manual Upwork-safe workflow only; do not scrape, store credentials, automate messaging, or use unapproved external links.',
  };
}
