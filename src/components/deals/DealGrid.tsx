import { DealCard } from "@/components/deals/DealCard";
import type { Deal } from "@/types";

type DealGridProps = {
  deals: Deal[];
  savedDealIds: Set<string>;
  blurFromIndex?: number;
  onOpenDeal: (deal: Deal) => void;
  onToggleSave: (deal: Deal) => void;
};

export function DealGrid({ deals, savedDealIds, blurFromIndex, onOpenDeal, onToggleSave }: DealGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {deals.map((deal, index) => (
        <DealCard
          key={deal.id}
          deal={deal}
          isSaved={savedDealIds.has(deal.id)}
          isBlurred={typeof blurFromIndex === "number" ? index >= blurFromIndex : false}
          onOpen={onOpenDeal}
          onToggleSave={onToggleSave}
        />
      ))}
    </section>
  );
}
