import { describe, expect, it } from 'vitest';
import {
  serializeSessionCookie,
  serializeSessionClearCookie,
  readSessionCookie,
} from '../../src/server/auth/session-cookie';
import { buildSharpTransformPlan, assertTransformDoesNotOverwriteOriginal } from '../../src/server/services/image-transform-contract-service';
import type { ProcessingOutputDraft } from '../../src/domain/image-processing';

function makeDraft(overrides: Partial<ProcessingOutputDraft> = {}): ProcessingOutputDraft {
  return {
    imageId: 'img_001',
    sourceStorageKey: 'uploads/original.jpg',
    outputType: 'TRANSPARENT_PNG',
    outputFormat: 'PNG',
    backgroundType: 'WHITE',
    width: 800,
    height: 600,
    folderPath: 'processed/',
    fileName: 'out.png',
    storageKey: 'processed/out.png',
    mimeType: 'image/png',
    operations: ['remove-background'],
    sellerReviewRequired: false,
    manualFallbackAllowed: false,
    metadata: {},
    ...overrides,
  };
}

describe('serializeSessionCookie — serialization', () => {
  it('produces HttpOnly SameSite=Strict cookie string', () => {
    const cookie = serializeSessionCookie('token123');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('ll_session=');
  });

  it('encodes special characters in token value', () => {
    const token = 'token+with/special=chars';
    const cookie = serializeSessionCookie(token);
    expect(cookie).toContain(encodeURIComponent(token));
  });

  it('includes Max-Age from SESSION_TTL_SECONDS by default', () => {
    const cookie = serializeSessionCookie('token');
    expect(cookie).toMatch(/Max-Age=\d+/);
  });

  it('uses custom maxAgeSeconds when provided', () => {
    const cookie = serializeSessionCookie('token', { maxAgeSeconds: 3600 });
    expect(cookie).toContain('Max-Age=3600');
  });

  it('uses custom path when provided', () => {
    const cookie = serializeSessionCookie('token', { path: '/admin' });
    expect(cookie).toContain('Path=/admin');
  });

  it('defaults path to /', () => {
    const cookie = serializeSessionCookie('token');
    expect(cookie).toContain('Path=/');
  });

  it('adds Secure flag only when requested', () => {
    const dev = serializeSessionCookie('token', { secure: false });
    expect(dev).not.toContain('Secure');
    const prod = serializeSessionCookie('token', { secure: true });
    expect(prod).toContain('Secure');
  });

  it('sets path, secure, maxAge all together', () => {
    const cookie = serializeSessionCookie('abc', { secure: true, maxAgeSeconds: 7200, path: '/api' });
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('Path=/api');
    expect(cookie).toContain('Max-Age=7200');
  });
});

describe('serializeSessionClearCookie', () => {
  it('sets empty token and Max-Age=0', () => {
    const cookie = serializeSessionClearCookie();
    expect(cookie).toContain('ll_session=');
    expect(cookie).toContain('Max-Age=0');
  });
});

describe('readSessionCookie — deserialization', () => {
  it('returns null when no cookie header', () => {
    const request = new Request('http://localhost:3000');
    expect(readSessionCookie(request)).toBeNull();
  });

  it('returns null when cookie header has no ll_session', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'other=value; another=val2' },
    });
    expect(readSessionCookie(request)).toBeNull();
  });

  it('returns null when ll_session cookie is empty', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'll_session=; other=val' },
    });
    expect(readSessionCookie(request)).toBeNull();
  });

  it('extracts session token from single cookie', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'll_session=mytoken123' },
    });
    expect(readSessionCookie(request)).toBe('mytoken123');
  });

  it('extracts session token among multiple cookies', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'other=value; ll_session=session_val; another=val2' },
    });
    expect(readSessionCookie(request)).toBe('session_val');
  });

  it('decodes URI-encoded token value', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: `ll_session=${encodeURIComponent('token+abc/123')}` },
    });
    expect(readSessionCookie(request)).toBe('token+abc/123');
  });

  it('handles ll_session at start of cookie string', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'll_session=val; other=val2' },
    });
    expect(readSessionCookie(request)).toBe('val');
  });

  it('handles ll_session at end of cookie string', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'a=1; b=2; ll_session=end_val' },
    });
    expect(readSessionCookie(request)).toBe('end_val');
  });

  it('handles cookies with spaces around semicolons', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'a=1 ; b=2 ; ll_session=spaced' },
    });
    expect(readSessionCookie(request)).toBe('spaced');
  });

  it('round-trips serialize and deserialize', () => {
    const token = 'my-real-session-token';
    const cookie = serializeSessionCookie(token);
    const cookieValue = cookie.split(';')[0].split('=')[1];
    const request = new Request('http://localhost:3000', {
      headers: { cookie: `ll_session=${cookieValue}` },
    });
    expect(readSessionCookie(request)).toBe(token);
  });
});

describe('buildSharpTransformPlan', () => {
  const baseDraft = makeDraft();

  it('builds a valid transform plan with metadata', () => {
    const plan = buildSharpTransformPlan(baseDraft);
    expect(plan.inputStorageKey).toBe('uploads/original.jpg');
    expect(plan.outputStorageKey).toBe('processed/out.png');
    expect(plan.width).toBe(800);
    expect(plan.height).toBe(600);
    expect(plan.mimeType).toBe('image/png');
    expect(plan.preservesOriginal).toBe(true);
  });

  it('includes read-original as first step', () => {
    expect(buildSharpTransformPlan(baseDraft).steps[0]).toBe('read-original');
  });

  it('includes compress and write as final steps', () => {
    const steps = buildSharpTransformPlan(baseDraft).steps;
    expect(steps[steps.length - 2]).toBe('compress-output');
    expect(steps[steps.length - 1]).toBe('write-new-processed-file');
  });

  it('adds background removal step when remove-background operation present', () => {
    const draft = makeDraft({ operations: ['remove-background'] });
    const plan = buildSharpTransformPlan(draft);
    expect(plan.steps).toContain('background-removal-provider-result');
  });

  it('adds compose-white-background for WHITE background', () => {
    const plan = buildSharpTransformPlan(makeDraft({ backgroundType: 'WHITE' }));
    expect(plan.steps).toContain('compose-white-background');
  });

  it('adds preserve-alpha-channel for TRANSPARENT background', () => {
    const plan = buildSharpTransformPlan(makeDraft({ backgroundType: 'TRANSPARENT' }));
    expect(plan.steps).toContain('preserve-alpha-channel');
  });

  it('adds resize step with correct dimensions', () => {
    const plan = buildSharpTransformPlan(baseDraft);
    expect(plan.steps).toContain('resize-800x600');
  });

  it('omits resize step when no dimensions are given', () => {
    const plan = buildSharpTransformPlan(makeDraft({ width: null, height: null }));
    const resizeSteps = plan.steps.filter(r => r.startsWith('resize-'));
    expect(resizeSteps).toHaveLength(0);
  });

  it('adds encode-webp step for WEBP output', () => {
    const plan = buildSharpTransformPlan(makeDraft({ outputFormat: 'WEBP', mimeType: 'image/webp' }));
    expect(plan.steps).toContain('encode-webp');
  });

  it('adds encode-jpg step for JPG output', () => {
    const plan = buildSharpTransformPlan(makeDraft({ outputFormat: 'JPG', mimeType: 'image/jpeg' }));
    expect(plan.steps).toContain('encode-jpg');
  });

  it('adds encode-png step for PNG output', () => {
    const plan = buildSharpTransformPlan(baseDraft);
    expect(plan.steps).toContain('encode-png');
  });

  it('omits resize when only width is given', () => {
    const plan = buildSharpTransformPlan(makeDraft({ width: 800, height: null }));
    expect(plan.steps.find(r => r.startsWith('resize-'))).toBeUndefined();
  });

  it('omits resize when only height is given', () => {
    const plan = buildSharpTransformPlan(makeDraft({ width: null, height: 600 }));
    expect(plan.steps.find(r => r.startsWith('resize-'))).toBeUndefined();
  });

  it('combines background-removal + white background + resize + png', () => {
    const draft = makeDraft({
      operations: ['remove-background'],
      backgroundType: 'WHITE',
      outputFormat: 'PNG',
      width: 400,
      height: 400,
    });
    const plan = buildSharpTransformPlan(draft);
    expect(plan.steps).toContain('background-removal-provider-result');
    expect(plan.steps).toContain('compose-white-background');
    expect(plan.steps).toContain('resize-400x400');
    expect(plan.steps).toContain('encode-png');
  });
});

describe('assertTransformDoesNotOverwriteOriginal', () => {
  const basePlan = {
    inputStorageKey: 'uploads/original.jpg',
    outputStorageKey: 'processed/out.png',
    steps: ['read-original', 'encode-png', 'compress-output', 'write-new-processed-file'],
    width: null as number | null,
    height: null as number | null,
    mimeType: 'image/png',
    preservesOriginal: true as const,
  };

  it('passes when input and output keys differ', () => {
    expect(assertTransformDoesNotOverwriteOriginal(basePlan)).toBe(true);
  });

  it('throws when input and output keys are the same', () => {
    const badPlan = { ...basePlan, outputStorageKey: 'uploads/original.jpg' };
    expect(() => assertTransformDoesNotOverwriteOriginal(badPlan)).toThrow('overwrite original');
  });
});
