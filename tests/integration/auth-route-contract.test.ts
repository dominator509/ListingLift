import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

describe('phase 3 auth route contract', () => {
  it('exposes signup login logout and me route handlers', () => {
    expect(read('src/app/api/auth/signup/route.ts')).toContain('signupSchema.parse');
    expect(read('src/app/api/auth/login/route.ts')).toContain('loginSchema.parse');
    expect(read('src/app/api/auth/logout/route.ts')).toContain('logout(request');
    expect(read('src/app/api/auth/me/route.ts')).toContain('requireSession');
  });

  it('sets a session cookie only through server route helpers', () => {
    const routeUtils = read('src/server/auth/route-utils.ts');
    expect(routeUtils).toContain('Set-Cookie');
    expect(routeUtils).toContain('serializeSessionCookie');
    expect(routeUtils).not.toMatch(/passwordHash.*json/i);
  });

  it('protects dashboard route groups through middleware', () => {
    const middleware = read('src/middleware.ts');
    expect(middleware).toContain("'/admin/:path*'");
    expect(middleware).toContain("'/client/:path*'");
    expect(middleware).toContain("'/agency/:path*'");
    expect(middleware).toContain('SESSION_COOKIE_NAME');
  });
});
