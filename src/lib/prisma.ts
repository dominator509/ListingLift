import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const parsed = new URL(url);

  const dbPoolMax = Math.max(1, parseInt(process.env.DB_POOL_MAX ?? '40', 10));
  const dbPoolTimeoutMs = Math.max(1000, parseInt(process.env.DB_POOL_TIMEOUT ?? '10000', 10));
  const dbQueryTimeoutMs = Math.max(1000, parseInt(process.env.DB_QUERY_TIMEOUT ?? '30000', 10));

  const pool = new pg.Pool({
    host: parsed.hostname === 'localhost' ? '127.0.0.1' : parsed.hostname,
    port: parseInt(parsed.port || '5432'),
    database: parsed.pathname.replace(/^\//, '').split('?')[0],
    user: parsed.username,
    password: parsed.password || '',
    max: dbPoolMax,
    connectionTimeoutMillis: dbPoolTimeoutMs,
    idleTimeoutMillis: 300000,
    query_timeout: dbQueryTimeoutMs,
  });

  // Set PostgreSQL statement_timeout on each new connection
  pool.on('connect', (client) => {
    client.query(`SET statement_timeout = ${dbQueryTimeoutMs}`).catch(() => {});
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
