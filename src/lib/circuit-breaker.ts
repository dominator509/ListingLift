/**
 * In-memory circuit breaker with three states: CLOSED, OPEN, HALF_OPEN.
 * Protects downstream resources from cascading failure.
 */
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  cooldownMs: number;
  halfOpenMaxRequests: number;
}

interface CircuitBreakerState {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureAt: number;
  lastStateChangeAt: number;
  halfOpenRequests: number;
}

const circuits = new Map<string, CircuitBreakerState>();

/**
 * Maximum number of concurrent circuits before LRU eviction kicks in.
 * Prevents unbounded Map growth under resource exhaustion.
 */
const MAX_CIRCUITS = 500;

/**
 * Ordered list tracking circuit insertion order for LRU eviction.
 * Most recently inserted/accessed name is at the end.
 */
const circuitInsertionOrder: string[] = [];

/**
 * Evict the least-recently-inserted circuit when the Map exceeds MAX_CIRCUITS.
 * Only evicts idle circuits (CLOSED state, zero failures) to preserve active faults.
 */
function evictIfNeeded(): void {
  while (circuits.size >= MAX_CIRCUITS && circuitInsertionOrder.length > 0) {
    let evicted = false;
    for (let i = 0; i < circuitInsertionOrder.length; i++) {
      const name = circuitInsertionOrder[i];
      const state = circuits.get(name);
      if (state && state.state === 'CLOSED' && state.failures === 0) {
        circuits.delete(name);
        circuitInsertionOrder.splice(i, 1);
        evicted = true;
        break;
      }
    }
    if (!evicted) break; // all circuits are non-idle, stop eviction
  }
}

function trackInsertion(name: string): void {
  const idx = circuitInsertionOrder.indexOf(name);
  if (idx !== -1) circuitInsertionOrder.splice(idx, 1);
  circuitInsertionOrder.push(name);
  evictIfNeeded();
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 3,
  cooldownMs: 30_000,
  halfOpenMaxRequests: 3,
};

export class CircuitOpenError extends Error {
  readonly retryAfterMs: number;
  constructor(retryAfterMs: number) {
    super('Circuit breaker is OPEN');
    this.name = 'CircuitOpenError';
    this.retryAfterMs = retryAfterMs;
  }
}

function getConfig(name: string, overrides?: Partial<CircuitBreakerConfig>): CircuitBreakerConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

function getState(name: string): CircuitBreakerState {
  let state = circuits.get(name);
  if (!state) {
    state = { state: 'CLOSED', failures: 0, successes: 0, lastFailureAt: 0, lastStateChangeAt: Date.now(), halfOpenRequests: 0 };
    circuits.set(name, state);
    trackInsertion(name);
  }
  return state;
}

export function getCircuitState(name: string): { state: CircuitState; failures: number; successes: number } {
  const s = getState(name);
  return { state: s.state, failures: s.failures, successes: s.successes };
}

export function getAllCircuitStates(): Array<{ name: string; state: CircuitState; failures: number }> {
  return Array.from(circuits.entries()).map(([name, s]) => ({
    name,
    state: s.state,
    failures: s.failures,
  }));
}

export function callWithCircuitBreaker<T>(
  name: string,
  fn: () => Promise<T>,
  config?: Partial<CircuitBreakerConfig>
): Promise<T> {
  const cfg = getConfig(name, config);
  const state = getState(name);
  const now = Date.now();

  if (state.state === 'OPEN') {
    if (now - state.lastFailureAt >= cfg.cooldownMs) {
      state.state = 'HALF_OPEN';
      state.halfOpenRequests = 0;
      state.successes = 0;
      state.lastStateChangeAt = now;
    } else {
      const retryAfterMs = cfg.cooldownMs - (now - state.lastFailureAt);
      return Promise.reject(new CircuitOpenError(retryAfterMs));
    }
  }

  if (state.state === 'HALF_OPEN') {
    if (state.halfOpenRequests >= cfg.halfOpenMaxRequests) {
      const retryAfterMs = cfg.cooldownMs - (now - state.lastFailureAt);
      return Promise.reject(new CircuitOpenError(Math.max(retryAfterMs, 1000)));
    }
    state.halfOpenRequests++;
  }

  return fn()
    .then((result) => {
      if (state.state === 'HALF_OPEN') {
        state.successes++;
        if (state.successes >= cfg.successThreshold) {
          state.state = 'CLOSED';
          state.failures = 0;
          state.successes = 0;
          state.halfOpenRequests = 0;
          state.lastStateChangeAt = Date.now();
        }
      } else if (state.state === 'CLOSED') {
        state.failures = 0; // reset on success
      }
      return result;
    })
    .catch((err) => {
      state.failures++;
      state.lastFailureAt = Date.now();
      if (state.failures >= cfg.failureThreshold) {
        state.state = 'OPEN';
        state.lastStateChangeAt = Date.now();
      }
      throw err;
    });
}
