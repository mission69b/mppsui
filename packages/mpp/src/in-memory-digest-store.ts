import type { DigestStore } from './server.js';

const DEFAULT_TTL_MS = 86_400_000; // 24 hours
const EVICTION_INTERVAL_MS = 3_600_000; // 1 hour

export class InMemoryDigestStore implements DigestStore {
  private store = new Map<string, number>();
  private readonly ttlMs: number;

  constructor(ttlMs = DEFAULT_TTL_MS) {
    this.ttlMs = ttlMs;
    if (typeof globalThis.setInterval === 'function') {
      const timer = setInterval(() => this.evict(), EVICTION_INTERVAL_MS);
      if (typeof timer === 'object' && 'unref' in timer) timer.unref();
    }
  }

  async has(digest: string): Promise<boolean> {
    const expiresAt = this.store.get(digest);
    if (expiresAt === undefined) return false;
    if (Date.now() > expiresAt) {
      this.store.delete(digest);
      return false;
    }
    return true;
  }

  async set(digest: string, ttlMs?: number): Promise<void> {
    this.store.set(digest, Date.now() + (ttlMs ?? this.ttlMs));
  }

  private evict(): void {
    const now = Date.now();
    for (const [digest, expiresAt] of this.store.entries()) {
      if (now > expiresAt) this.store.delete(digest);
    }
  }
}
