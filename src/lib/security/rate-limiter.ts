/**
 * In-Memory Sliding Window Rate Limiter
 * Protects auth, checkout, and search endpoints from brute force and DoS attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      const validTimestamps = record.timestamps.filter((ts) => now - ts < 600000); // 10 min window
      if (validTimestamps.length === 0) {
        rateLimitMap.delete(key);
      } else {
        record.timestamps = validTimestamps;
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  intervalMs?: number; // Time window in milliseconds (default: 60s)
  maxRequests?: number; // Max requests allowed per window (default: 60)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetTimeMs: number } {
  const { intervalMs = 60000, maxRequests = 60 } = options;
  const now = Date.now();
  const windowStart = now - intervalMs;

  const record = rateLimitMap.get(identifier) || { timestamps: [] };
  // Filter timestamps within current window
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= maxRequests) {
    const oldestTimestamp = activeTimestamps[0];
    const resetTimeMs = Math.max(0, oldestTimestamp + intervalMs - now);
    return {
      allowed: false,
      remaining: 0,
      resetTimeMs,
    };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(identifier, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: maxRequests - activeTimestamps.length,
    resetTimeMs: intervalMs,
  };
}
