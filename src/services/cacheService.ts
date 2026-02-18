import { CACHE_TTL_MS, STORAGE_KEYS } from "@/lib/constants";
import type { CacheEntry, Deal } from "@/types";

type CacheResult = {
  results: Deal[];
  timestamp: number;
  age: number;
  ttl: number;
  isStale: boolean;
};

const cache = new Map<string, CacheEntry>();

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function persist(): void {
  if (!canUseStorage()) return;
  const snapshot = Array.from(cache.values());
  window.localStorage.setItem(STORAGE_KEYS.cache, JSON.stringify(snapshot));
}

export function hydrateCache(): void {
  if (!canUseStorage()) return;

  const snapshot = window.localStorage.getItem(STORAGE_KEYS.cache);
  if (!snapshot) return;

  try {
    const entries = JSON.parse(snapshot) as CacheEntry[];
    entries.forEach((entry) => cache.set(entry.key, entry));
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.cache);
  }
}

export function getCacheKey(parts: Record<string, string | number | boolean | string[]>): string {
  return Object.keys(parts)
    .sort()
    .map((key) => {
      const value = parts[key];
      if (Array.isArray(value)) return `${key}:${[...value].sort().join(",")}`;
      return `${key}:${String(value)}`;
    })
    .join("|");
}

export function get(key: string): CacheResult | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  const isStale = age > entry.ttl;

  return {
    results: entry.results,
    timestamp: entry.timestamp,
    ttl: entry.ttl,
    age,
    isStale,
  };
}

export function set(key: string, results: Deal[], ttl = CACHE_TTL_MS): void {
  const entry: CacheEntry = {
    key,
    results,
    timestamp: Date.now(),
    ttl,
  };
  cache.set(key, entry);
  persist();
}

export function remove(key: string): void {
  cache.delete(key);
  persist();
}

export function clear(): void {
  cache.clear();
  if (canUseStorage()) window.localStorage.removeItem(STORAGE_KEYS.cache);
}

export function size(): number {
  return cache.size;
}
