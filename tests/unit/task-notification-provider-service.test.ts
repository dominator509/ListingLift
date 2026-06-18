import { describe, expect, it } from 'vitest';
import { listTaskNotificationProviders, buildTaskNotificationProviderReadiness } from '@/server/services/task-notification-provider-service';

describe('task notification provider service', () => {
  it('lists Phase 30 providers', () => {
    const keys = listTaskNotificationProviders().map((provider) => provider.key);
    expect(keys).toEqual(expect.arrayContaining(['slack', 'smtp_email', 'google_sheets', 'airtable', 'trello', 'clickup', 'asana', 'notion']));
  });

  it('does not allow real calls without flags and secrets', () => {
    const readiness = buildTaskNotificationProviderReadiness({ providerKey: 'slack', actionKey: 'SEND_SLACK_ALERT', env: {} });
    expect(readiness.realCallsAllowed).toBe(false);
    expect(readiness.manualFallbackAvailable).toBe(true);
  });
});
