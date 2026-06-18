export const SESSION_COOKIE_NAME = 'll_session';
export const SESSION_TTL_DAYS = 14;
export const SESSION_TTL_SECONDS = SESSION_TTL_DAYS * 24 * 60 * 60;
export const AUTH_PROTECTED_PREFIXES = ['/admin', '/client', '/agency'] as const;
