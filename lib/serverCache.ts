/**
 * High-performance In-Memory Server Cache with Stale-While-Revalidate & Timeout Fallbacks.
 * Prevents Supabase micro-instance hanging and statement timeout freezes.
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const cacheStore = new Map<string, CacheEntry<any>>();

// Default TTL: 30 seconds
const DEFAULT_TTL_MS = 30 * 1000;

export function getCached<T>(key: string, ttlMs: number = DEFAULT_TTL_MS): T | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > ttlMs) {
    return null;
  }

  return entry.data as T;
}

/**
 * Returns data even if expired (used as resilient fallback during DB timeouts)
 */
export function getLastKnownData<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  return entry ? (entry.data as T) : null;
}

export function setCached<T>(key: string, data: T): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function invalidateCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    cacheStore.clear();
    return;
  }

  for (const key of cacheStore.keys()) {
    if (key.startsWith(keyPrefix)) {
      cacheStore.delete(key);
    }
  }
}

/**
 * Execute a promise with a maximum timeout (default 5000ms) to prevent statement timeouts.
 */
export async function withTimeout<T = any>(promise: PromiseLike<T> | Promise<T>, ms: number = 6000): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Database query timed out after ${ms}ms`));
    }, ms);
  });

  try {
    const result = await Promise.race([Promise.resolve(promise), timeoutPromise]);
    clearTimeout(timeoutId);
    return result as T;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
