import Redis from 'ioredis';

// ---------------------------------------------------------------------------
// AuthRateLimitResult — backward-compatible return type (used by tests +
// route-helpers for X-RateLimit headers)
// ---------------------------------------------------------------------------
export interface AuthRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

// ---------------------------------------------------------------------------
// RateLimitResult — modern return type (Q18 P2)
// ---------------------------------------------------------------------------
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

// ---------------------------------------------------------------------------
// Redis client (lazy)
// ---------------------------------------------------------------------------
let redisClient: Redis | null = null;

function getRedisUrl(): string | null {
  return process.env.SECURITY_RATE_LIMIT_DISTRIBUTED_STORE_URL
    || process.env.REDIS_URL
    || null;
}

function ensureRedis(): Redis | null {
  if (redisClient) return redisClient;
  const url = getRedisUrl();
  if (!url) return null;
  try {
    redisClient = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 2) return null;
        return Math.min(times * 200, 1000);
      },
    });
    redisClient.connect().catch(() => { redisClient = null; });
    redisClient.on('error', () => {});
    return redisClient;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Token Bucket Lua script (atomic Redis operations)
// ---------------------------------------------------------------------------
const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])  -- tokens per second
local now = tonumber(ARGV[3])           -- unix seconds

local tokens = tonumber(redis.call('HGET', key, 'tokens'))
local last_refill = tonumber(redis.call('HGET', key, 'last_refill'))

if tokens == nil then
  tokens = capacity
  last_refill = now
end

local elapsed = math.max(0, now - last_refill)
tokens = math.min(capacity, tokens + (elapsed * refill_rate))

if tokens >= 1 then
  tokens = tokens - 1
  redis.call('HSET', key, 'tokens', tokens, 'last_refill', now)
  redis.call('EXPIRE', key, math.ceil(capacity / math.max(refill_rate, 0.001)) + 10)
  return {1, tokens}
else
  return {0, tokens}
end
`;

let bucketScriptSha: string | null = null;

// ---------------------------------------------------------------------------
// Redis-backed Token Bucket consume (async)
// ---------------------------------------------------------------------------
async function redisConsume(
  key: string,
  capacity: number,
  refillRatePerSecond: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const client = ensureRedis();
  if (!client) return { allowed: true, remaining: 0 };

  try {
    const now = Math.floor(Date.now() / 1000);
    if (!bucketScriptSha) {
      bucketScriptSha = await client.script('LOAD', TOKEN_BUCKET_SCRIPT) as string;
    }
    const result = await client.evalsha(
      bucketScriptSha,
      1,
      `ll:ratelimit:${key}`,
      capacity,
      refillRatePerSecond,
      now,
    ) as [number, number];

    return { allowed: result[0] === 1, remaining: result[1] };
  } catch (err: unknown) {
    if (String(err).includes('NOSCRIPT')) {
      bucketScriptSha = null;
      return redisConsume(key, capacity, refillRatePerSecond);
    }
    return { allowed: true, remaining: 0 }; // fail-open
  }
}

// ---------------------------------------------------------------------------
// In-memory Token Bucket (fallback, also used by sync checkAuthRateLimit)
// ---------------------------------------------------------------------------
interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const memoryBuckets = new Map<string, TokenBucket>();

function memoryConsume(
  key: string,
  capacity: number,
  refillRatePerSecond: number,
  nowMs: number = Date.now(),
  windowMs?: number,
): { allowed: boolean; remaining: number; resetAt: Date } {
  const now = Math.floor(nowMs / 1000);
  let bucket = memoryBuckets.get(key);

  if (!bucket) {
    bucket = { tokens: capacity, lastRefill: now };
    memoryBuckets.set(key, bucket);
  }

  // Refill
  const elapsed = Math.max(0, now - bucket.lastRefill);
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillRatePerSecond);
  bucket.lastRefill = now;

  // Compute resetAt for backward compat: when the bucket will be full.
  // If windowMs was provided, use it directly (matches old sliding window).
  const resetAtMs = windowMs
    ? nowMs + windowMs
    : nowMs + Math.ceil((capacity - bucket.tokens) / Math.max(refillRatePerSecond, 0.001)) * 1000;

  // Consume
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      remaining: bucket.tokens < 1 ? 0 : Math.floor(bucket.tokens),
      resetAt: new Date(resetAtMs),
    };
  }

  // When denied, resetAt is when the next token will be available
  const retryAfterMs = windowMs
    ? nowMs + windowMs  // Use windowMs when denied too for backward compat
    : nowMs + Math.ceil(1 / Math.max(refillRatePerSecond, 0.001)) * 1000;
  return { allowed: false, remaining: 0, resetAt: new Date(retryAfterMs) };
}

// GC for in-memory buckets
const BUCKET_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    for (const [key, bucket] of memoryBuckets) {
      if (now - bucket.lastRefill > 600) {
        memoryBuckets.delete(key);
      }
    }
  }, BUCKET_CLEANUP_INTERVAL_MS).unref();
}

// ---------------------------------------------------------------------------
// OLD API (sync, backward compatible with all existing tests)
// ---------------------------------------------------------------------------

/**
 * Synchronous rate limit check (backward compatible).
 * Uses in-memory Token Bucket internally.
 *
 * @param key     - Unique identifier (e.g. "user@example.com::127.0.0.1")
 * @param now     - Current timestamp (ms) — pass Date.now() or fixed time for tests
 * @param limit   - Max requests allowed per window (also = token bucket capacity)
 * @param windowMs- Window duration in ms (also = time to fully refill bucket)
 */
export function checkAuthRateLimit(
  key: string,
  now: number = Date.now(),
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000,
): AuthRateLimitResult {
  // Edge cases for backward compat
  if (limit <= 0) {
    return { allowed: false, remaining: 0, resetAt: new Date(now + windowMs) };
  }
  if (windowMs <= 0) {
    // Zero window = instant reset on every call
    return { allowed: true, remaining: limit - 1, resetAt: new Date(now) };
  }

  const fillRate = limit / (windowMs / 1000); // tokens per second
  return memoryConsume(key, limit, fillRate, now, windowMs);
}

/**
 * Clear rate limit buckets for a given key.
 */
export function clearAuthRateLimit(key: string): void {
  memoryBuckets.delete(key);
  const redis = ensureRedis();
  if (redis) {
    redis.del(`ll:ratelimit:${key}`).catch(() => {});
  }
}

/**
 * Build a rate-limit key from email/identifier and IP address.
 */
export function getRateLimitKey(email: string, ipAddress?: string | null): string {
  return `${email.toLowerCase().trim()}::${ipAddress ?? 'unknown-ip'}`;
}

// ---------------------------------------------------------------------------
// NEW API (async, Redis-backed with in-memory fallback)
// ---------------------------------------------------------------------------

/**
 * Token Bucket rate limiter (Q18 P2 — preferred for new code).
 * Redis-backed when available, in-memory fallback otherwise.
 *
 * @param userId   - Unique identifier
 * @param action   - Action label (e.g. "login", "signup", "route")
 * @param capacity - Maximum burst size (max tokens in bucket)
 * @param fillRate - Tokens added per second
 */
export async function checkRateLimit(
  userId: string,
  action: string,
  capacity: number = 5,
  fillRate: number = 0.33,
): Promise<RateLimitResult> {
  const key = `${userId}::${action}`;

  if (ensureRedis()) {
    const result = await redisConsume(key, capacity, fillRate);
    if (!result.allowed) {
      const retryAfterMs = Math.ceil((1 - Math.max(result.remaining, 0)) / Math.max(fillRate, 0.001) * 1000);
      return { allowed: false, remaining: Math.floor(result.remaining), retryAfterMs };
    }
    return { allowed: true, remaining: Math.floor(result.remaining), retryAfterMs: 0 };
  }

  const memResult = memoryConsume(key, capacity, fillRate);
  if (!memResult.allowed) {
    const retryAfterMs = Math.max(0, memResult.resetAt.getTime() - Date.now());
    return { allowed: false, remaining: 0, retryAfterMs };
  }
  return { allowed: true, remaining: Math.floor(memResult.remaining), retryAfterMs: 0 };
}

/**
 * Async rate limit check (backward compatible wrapper).
 * Translates the old (limit, windowMs) parameters to Token Bucket (capacity, fillRate).
 */
export async function checkAuthRateLimitAsync(
  key: string,
  now: number = Date.now(),
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000,
): Promise<AuthRateLimitResult> {
  // Edge cases
  if (limit <= 0) {
    return { allowed: false, remaining: 0, resetAt: new Date(now + windowMs) };
  }
  if (windowMs <= 0) {
    return { allowed: true, remaining: limit - 1, resetAt: new Date(now) };
  }

  const fillRate = limit / (windowMs / 1000);
  const redis = ensureRedis();
  const dbKey = `async:${key}`;

  if (redis) {
    const result = await redisConsume(dbKey, limit, fillRate);
    const secondsToFull = Math.ceil((limit - Math.max(result.remaining, 0)) / Math.max(fillRate, 0.001));
    return {
      allowed: result.allowed,
      remaining: result.remaining >= 1 ? Math.floor(result.remaining) : 0,
      resetAt: new Date(now + secondsToFull * 1000),
    };
  }

  return memoryConsume(dbKey, limit, fillRate, now, windowMs);
}

/** Per-IP signup rate limit: 3 signups per IP per hour. */
export async function checkSignupRateLimit(ipAddress: string, now: number = Date.now()): Promise<AuthRateLimitResult> {
  return checkAuthRateLimit(`signup:ip:${ipAddress}`, now, 3, 60 * 60 * 1000);
}

/** Gracefully shutdown Redis connection. */
export async function shutdownRateLimiter(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch { /* ignore */ }
    redisClient = null;
  }
}
