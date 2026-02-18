"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { PointsComparison } from "@/components/deals/PointsComparison";
import { DealBadge } from "@/components/deals/DealBadge";
import { CppTooltip } from "@/components/deals/CppTooltip";
import { WhyGoodDeal } from "@/components/deals/WhyGoodDeal";
import { HowToBook } from "@/components/deals/HowToBook";
import { SimilarDeals } from "@/components/deals/SimilarDeals";
import { formatCurrency, formatMonthYear } from "@/lib/formatters";
import { getBestProgramOption } from "@/lib/dealScoring";
import { getSimilarDeals } from "@/services/dealService";
import type { Deal } from "@/types";

type DealDetailDrawerProps = {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectDeal: (deal: Deal) => void;
};

export function DealDetailDrawer({ deal, isOpen, onClose, onSelectDeal }: DealDetailDrawerProps) {
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);

  useEffect(() => {
    if (!deal) return;
    getSimilarDeals(deal.id, 3).then(setRelatedDeals).catch(() => setRelatedDeals([]));
  }, [deal]);

  if (!deal) return null;

  const best = getBestProgramOption(deal.programOptions);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`${deal.origin.code} → ${deal.destination.code}`}>
      <section className="space-y-5">
        <header className="space-y-2">
          <DealBadge quality={deal.quality} />
          <p className="text-sm text-text-secondary">{deal.origin.name} → {deal.destination.name}</p>
        </header>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Points & pricing</h3>
            <CppTooltip />
          </div>
          <PointsComparison options={deal.programOptions} />
          <p className="mt-2 text-sm text-text-secondary">Cash equivalent: <span className="font-semibold text-text-primary">{formatCurrency(deal.cashPrice)}</span></p>
        </section>

        <WhyGoodDeal deal={deal} />

        {best ? <HowToBook option={best} /> : null}

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Flight details</h3>
          <ul className="mt-2 space-y-1 text-sm text-text-primary">
            <li>Airline: {deal.airline}</li>
            <li>Cabin: {deal.cabin.replace("_", " ")}</li>
            <li>Stops: {deal.isNonstop ? "Nonstop" : "1 stop"}</li>
            <li>Travel window: {formatMonthYear(deal.travelMonth)}</li>
          </ul>
        </section>

        <SimilarDeals deals={relatedDeals} onSelect={onSelectDeal} />
      </section>
    </Drawer>
  );
}
