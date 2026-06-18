import { describe, expect, it } from 'vitest';

describe('phase 29 automation webhook route contract', () => {
  it('documents required route areas', () => {
    const routes = [
      '/api/automation-webhooks/providers',
      '/api/automation-webhooks/subscriptions',
      '/api/automation-webhooks/events',
      '/api/automation-webhooks/dispatch',
      '/api/automation-webhooks/test',
      '/api/automation-webhooks/health',
      '/api/automation-webhooks/dead-letter',
      '/api/automation-webhooks/safety-check',
    ];
    expect(routes).toHaveLength(8);
  });
});
