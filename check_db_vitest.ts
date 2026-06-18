import { describe, it, expect } from 'vitest';

describe('DB check', () => {
  it('should check DATABASE_URL', async () => {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    expect(process.env.DATABASE_URL).toBeTruthy();
    
    // Try using the app prisma
    const { prisma } = await import('@/lib/prisma');
    const result = await prisma.$queryRaw`SELECT 1 as val`;
    console.log('Result:', result);
  });
});
