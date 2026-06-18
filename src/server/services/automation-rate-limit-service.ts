const hits = new Map<string, { count: number; resetAt: number }>();

export function checkAutomationRateLimit(input: { key: string; limit?: number; windowMs?: number }) {
  const limit = input.limit ?? 30;
  const windowMs = input.windowMs ?? 60_000;
  const now = Date.now();
  const current = hits.get(input.key);
  if (!current || current.resetAt <= now) {
    hits.set(input.key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (current.count >= limit) return { allowed: false, remaining: 0, resetAt: current.resetAt };
  current.count += 1;
  hits.set(input.key, current);
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}
