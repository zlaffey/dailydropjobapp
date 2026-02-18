"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

function loadInitialRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(STORAGE_KEYS.recentlyViewed);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as string[];
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.recentlyViewed);
    return [];
  }
}

export function useRecentlyViewed(limit = 6) {
  const [recentlyViewedDealIds, setRecentlyViewedDealIds] = useState<string[]>(loadInitialRecentlyViewed);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.recentlyViewed, JSON.stringify(recentlyViewedDealIds));
  }, [recentlyViewedDealIds]);

  function addRecentlyViewedDealId(dealId: string) {
    setRecentlyViewedDealIds((prev) => [dealId, ...prev.filter((id) => id !== dealId)].slice(0, limit));
  }

  return { recentlyViewedDealIds, addRecentlyViewedDealId };
}
