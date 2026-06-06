const store: Map<string, number[]> = (globalThis as { __vfRateLimitStore?: Map<string, number[]> }).__vfRateLimitStore ?? new Map<string, number[]>();
(globalThis as { __vfRateLimitStore?: Map<string, number[]> }).__vfRateLimitStore = store;

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
  limit: number;
  resetAt: number;
}

export function checkRateLimit(key: string, cfg: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const cutoff = now - cfg.windowMs;
  const existing = store.get(key) ?? [];
  const recent = existing.filter((t) => t > cutoff);

  if (recent.length >= cfg.limit) {
    const oldest = recent[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + cfg.windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      limit: cfg.limit,
      resetAt: oldest + cfg.windowMs,
    };
  }

  recent.push(now);
  store.set(key, recent);

  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (!v.length || v[v.length - 1] < cutoff) store.delete(k);
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, cfg.limit - recent.length),
    retryAfter: 0,
    limit: cfg.limit,
    resetAt: now + cfg.windowMs,
  };
}

export function clearRateLimit(key: string): void {
  store.delete(key);
}

export const DEFAULT_LIMITS = {
  contactForm: { limit: 5, windowMs: 60 * 60 * 1000 },
} as const;
