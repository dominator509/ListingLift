import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PHASE_2_DATABASE_CONTRACT } from '../../src/server/database/prisma-repository-contracts';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

describe('phase 2 prisma schema contract', () => {
  it('contains all required core models', () => {
    for (const modelName of PHASE_2_DATABASE_CONTRACT.requiredModels) {
      expect(schema).toContain(`model ${modelName} `);
    }
  });

  it('keeps tenant-critical models scoped by organizationId', () => {
    for (const modelName of PHASE_2_DATABASE_CONTRACT.tenantCriticalModels) {
      const start = schema.indexOf(`model ${modelName} `);
      const end = schema.indexOf('\nmodel ', start + 1);
      const block = schema.slice(start, end === -1 ? undefined : end);
      expect(block, `${modelName} should include organizationId`).toContain('organizationId');
    }
  });

  it('defines uniqueness constraints required by the roadmap', () => {
    expect(schema).toMatch(/email\s+String\s+@unique/);
    expect(schema).toMatch(/slug\s+String\s+@unique/);
    expect(schema).toContain('@@unique([salesChannelId, externalOrderId])');
    expect(schema).toMatch(/key\s+String\s+@unique/);
  });

  it('stores secrets only in encrypted secret ciphertext fields', () => {
    expect(schema).toContain('model Session');
    expect(schema).toContain('sessionTokenHash String');
    expect(schema).not.toContain('sessionToken     String');
    expect(schema).toContain('model EncryptedSecret');
    expect(schema).toContain('ciphertext');
    expect(schema).not.toMatch(/password\s+String/i);
    expect(schema).not.toMatch(/apiKey\s+String/i);
    expect(schema).not.toMatch(/accessToken\s+String/i);
  });
});
