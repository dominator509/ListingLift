export type ErrorShape = {
  ok: false;
  code: string;
  message: string;
  details?: unknown;
};

export type SuccessShape<T> = {
  ok: true;
  data: T;
};

export type ApiResult<T> = SuccessShape<T> | ErrorShape;

export function ok<T>(data: T): SuccessShape<T> {
  return { ok: true, data };
}

export function fail(code: string, message: string, details?: unknown): ErrorShape {
  return { ok: false, code, message, details };
}

export function jsonError(code: string, message: string, status = 400, details?: unknown) {
  return Response.json(fail(code, message, details), { status });
}

export class ForbiddenError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(`CSRF_FORBIDDEN: ${code} — ${message}`);
    this.name = 'ForbiddenError';
    this.code = code;
  }
}
