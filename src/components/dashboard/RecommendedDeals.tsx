"use client";

import { useEffect, useState } from "react";
import { getRecommendedDeals } from "@/services/dealService";
import { DealGrid } from "@/components/deals/DealGrid";
import type { Deal, UserSettings } from "@/types";

type RecommendedDealsProps = {
  settings: UserSettings;
  savedDealIds: Set<string>;
  onOpenDeal: (deal: Deal) => void;
  onToggleSave: (deal: Deal) => void;
};

export function RecommendedDeals({ settings, savedDealIds, onOpenDeal, onToggleSave }: RecommendedDealsProps) {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    getRecommendedDeals(settings, 4).then(setDeals).catch(() => setDeals([]));
  }, [settings]);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="section-subtitle">Personalized</p>
          <h2 className="section-title">Recommended for you</h2>
        </div>
      </div>
      <DealGrid deals={deals} savedDealIds={savedDealIds} onOpenDeal={onOpenDeal} onToggleSave={onToggleSave} />
    </section>
  );
}
