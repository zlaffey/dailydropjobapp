"use client";

import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Deal, SavedDeal } from "@/types";

function loadInitialSavedDeals(): SavedDeal[] {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(STORAGE_KEYS.savedDeals);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as SavedDeal[];
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.savedDeals);
    return [];
  }
}

export function useSavedDeals() {
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>(loadInitialSavedDeals);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.savedDeals, JSON.stringify(savedDeals));
  }, [savedDeals]);

  const savedDealIds = useMemo(() => new Set(savedDeals.map((entry) => entry.deal.id)), [savedDeals]);

  function toggleSavedDeal(deal: Deal) {
    setSavedDeals((prev) => {
      const exists = prev.some((entry) => entry.deal.id === deal.id);
      if (exists) return prev.filter((entry) => entry.deal.id !== deal.id);
      return [{ id: `saved_${deal.id}`, savedAt: new Date().toISOString(), deal }, ...prev];
    });
  }

  function removeSavedDeal(dealId: string) {
    setSavedDeals((prev) => prev.filter((entry) => entry.deal.id !== dealId));
  }

  return { savedDeals, savedDealIds, toggleSavedDeal, removeSavedDeal };
}
