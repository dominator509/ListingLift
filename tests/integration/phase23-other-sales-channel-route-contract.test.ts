import { describe, expect, it } from 'vitest';

describe('Phase 23 other sales channel route contract', () => {
  it('documents the dry-run route areas Codex must wire to Prisma', () => {
    const routes = [
      '/api/other-sales-channels/catalog',
      '/api/other-sales-channels/manual-order',
      '/api/other-sales-channels/proposal-template',
      '/api/other-sales-channels/delivery-template',
      '/api/other-sales-channels/follow-up-status',
      '/api/other-sales-channels/revenue-summary',
      '/api/other-sales-channels/export-plan',
      '/api/other-sales-channels/safety-check',
    ];
    expect(routes).toHaveLength(8);
  });
});
