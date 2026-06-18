type LogMeta = Record<string, unknown>;

function redact(value: unknown): unknown {
  if (typeof value === 'string') {
    if (/secret|token|key|password|authorization/i.test(value)) return '[redacted]';
    return value;
  }
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        /secret|token|key|password|authorization/i.test(key) ? '[redacted]' : redact(item),
      ]),
    );
  }
  return value;
}

export const logger = {
  info(message: string, meta: LogMeta = {}) {
    console.info(message, redact(meta));
  },
  warn(message: string, meta: LogMeta = {}) {
    console.warn(message, redact(meta));
  },
  error(message: string, meta: LogMeta = {}) {
    console.error(message, redact(meta));
  },
};
