import type { AutomationDispatchStatus, AutomationRetryDecision } from '@/domain/automation-webhooks';

export function decideAutomationRetry(input: { status: AutomationDispatchStatus; attemptCount: number; maxRetries: number; statusCode?: number }) : AutomationRetryDecision {
  if (input.status === 'SENT' || input.status === 'SKIPPED') return 'DO_NOT_RETRY';
  if (input.attemptCount >= input.maxRetries) return 'MOVE_TO_DEAD_LETTER';
  if (input.statusCode && input.statusCode >= 400 && input.statusCode < 500 && input.statusCode !== 429) return 'DO_NOT_RETRY';
  if (input.statusCode === 429 || (input.statusCode && input.statusCode >= 500)) return 'RETRY_WITH_BACKOFF';
  return 'RETRY_SOON';
}

export function nextAutomationRetryAt(input: { attemptCount: number; now?: Date }) {
  const now = input.now ?? new Date();
  const delaySeconds = Math.min(60 * 60, Math.pow(2, Math.max(0, input.attemptCount)) * 60);
  return new Date(now.getTime() + delaySeconds * 1000);
}
