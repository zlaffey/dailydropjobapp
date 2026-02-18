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
        <p className="section-subtitle">Market pulse</p>
        <h2 className="section-title">Trending deals</h2>
      </div>
      <DealGrid deals={deals} savedDealIds={savedDealIds} onOpenDeal={onOpenDeal} onToggleSave={onToggleSave} />
    </section>
  );
}
