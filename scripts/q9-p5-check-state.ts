/**
 * Q9 Phase 5 — Check current DB state for rollback baseline
 * Usage: npx tsx scripts/q9-p5-check-state.ts
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Check count of seeded data
  const tables = ['User', 'Organization', 'Role', 'Session', 'Membership', 'Job', 'Client', 'Image'] as const;
  for (const t of tables) {
    try {
      const count = await prisma.$queryRawUnsafe(`SELECT count(*)::int FROM "${t}"`);
      console.log(`${t}: ${JSON.stringify(count)}`);
    } catch (e: any) {
      console.log(`${t}: ERROR — ${e.message}`);
    }
  }

  // Get checksums for the tables that differ from baseline
  const checksumTables = ['User', 'Organization', 'Role', 'Session', 'Membership'];
  for (const t of checksumTables) {
    const result = await prisma.$queryRawUnsafe(
      `SELECT md5(string_agg(row_hash, '' ORDER BY row_hash)) AS chk FROM (SELECT md5(t::text) AS row_hash FROM "${t}" t) sub`
    );
    console.log(`Checksum ${t}: ${(result as any)[0]?.chk || 'EMPTY'}`);
  }

  await prisma.$disconnect();
  pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
