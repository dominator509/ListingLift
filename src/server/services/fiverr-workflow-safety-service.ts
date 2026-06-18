import { assertNoUnsafeFiverrAutomation, FIVERR_MARKETPLACE_SAFETY_RULES } from '@/domain/fiverr';
import { fiverrSafetyCheckSchema } from '@/schemas/fiverr';

export function checkFiverrWorkflowSafety(input: unknown) {
  const parsed = fiverrSafetyCheckSchema.parse(input);
  const automation = assertNoUnsafeFiverrAutomation(parsed.intendedActions);
  const externalLinkAllowed = parsed.deliveryMode !== 'FIVERR_MESSAGE_WITH_ALLOWED_LINK' || parsed.externalLinkAllowed;
  return {
    allowed: automation.allowed && externalLinkAllowed,
    blockedActions: automation.blockedActions,
    externalLinkAllowed,
    safetyRules: [...FIVERR_MARKETPLACE_SAFETY_RULES],
    notes: [
      'Fiverr workflow is manual-first unless an approved API/integration path is available.',
      'ListingLift may prepare files and safe message copy, but final Fiverr delivery remains an operator action.',
    ],
  };
}
