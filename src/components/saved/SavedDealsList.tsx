"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { DealBadge } from "@/components/deals/DealBadge";
import type { SavedDeal } from "@/types";

type SavedDealsListProps = {
  savedDeals: SavedDeal[];
  onRemove: (dealId: string) => void;
};

export function SavedDealsList({ savedDeals, onRemove }: SavedDealsListProps) {
  const [sortBy, setSortBy] = useState<"date" | "value">("date");

  const sortedDeals = useMemo(() => {
    const copy = [...savedDeals];
    copy.sort((a, b) => {
      if (sortBy === "date") return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      return b.deal.bestCpp - a.deal.bestCpp;
    });
    return copy;
  }, [savedDeals, sortBy]);

  if (!savedDeals.length) {
    return (
      <EmptyState
        title="No saved deals yet"
        description="Save deals from Search to track them here."
      />
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{savedDeals.length} saved deals</p>
        <label className="text-sm text-text-secondary">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as "date" | "value")}
            className="ml-2 rounded-lg border border-border bg-bg-card px-2 py-1 text-text-primary"
          >
            <option value="date">Date saved</option>
            <option value="value">Best value</option>
          </select>
        </label>
      </div>

      <ul className="space-y-2">
        {sortedDeals.map((saved) => (
          <li key={saved.id} className="rounded-xl border border-border bg-bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{saved.deal.origin.code} → {saved.deal.destination.code}</p>
                <p className="text-xs text-text-secondary">{saved.deal.airline} · {saved.deal.cabin.replace("_", " ")}</p>
                <div className="mt-2"><DealBadge quality={saved.deal.quality} /></div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(saved.deal.id)}
                className="rounded-md border border-border px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
                aria-label={`Remove ${saved.deal.id}`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
