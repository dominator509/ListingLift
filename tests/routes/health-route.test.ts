import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('health route', () => {
  it('returns ok response', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
  });
});
