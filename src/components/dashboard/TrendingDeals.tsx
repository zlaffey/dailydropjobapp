"use client";

import { useEffect, useState } from "react";
import { getTrendingDeals } from "@/services/dealService";
import { DealGrid } from "@/components/deals/DealGrid";
import type { Deal } from "@/types";

type TrendingDealsProps = {
  savedDealIds: Set<string>;
  onOpenDeal: (deal: Deal) => void;
  onToggleSave: (deal: Deal) => void;
};

export function TrendingDeals({ savedDealIds, onOpenDeal, onToggleSave }: TrendingDealsProps) {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    getTrendingDeals(4).then(setDeals).catch(() => setDeals([]));
  }, []);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Trending deals</h2>
        <p className="text-sm text-text-secondary">Popular with DealDrop users</p>
      </div>
      <DealGrid deals={deals} savedDealIds={savedDealIds} onOpenDeal={onOpenDeal} onToggleSave={onToggleSave} />
    </section>
  );
}
