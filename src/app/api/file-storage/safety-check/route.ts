import { NextResponse } from 'next/server';

import { FILE_STORAGE_SECURITY_RULES, normalizeStoragePath } from '@/domain/file-storage';

export async function POST(request: Request) {
  const body = await request.json();
  const errors: string[] = [];
  for (const candidate of body.paths ?? []) {
    try { normalizeStoragePath(candidate); } catch (error) { errors.push(`${candidate}: ${(error as Error).message}`); }
  }
  return NextResponse.json({ ok: errors.length === 0, errors, rules: FILE_STORAGE_SECURITY_RULES });
}
