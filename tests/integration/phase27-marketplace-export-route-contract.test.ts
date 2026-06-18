import { describe, expect, it } from 'vitest';

describe('phase 27 marketplace export route contract', () => {
  it('documents dry-run routes that Codex must wire to Prisma and audits', () => {
    const routes = [
      '/api/marketplace-exports/catalog',
      '/api/marketplace-exports/manual-order',
      '/api/marketplace-exports/mapping',
      '/api/marketplace-exports/export-plan',
      '/api/marketplace-exports/delivery-template',
      '/api/marketplace-exports/compliance-warnings',
      '/api/marketplace-exports/revision-status',
      '/api/marketplace-exports/safety-check',
    ];
    expect(routes).toHaveLength(8);
  });
});
