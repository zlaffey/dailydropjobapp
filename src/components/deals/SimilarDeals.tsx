import { DealBadge } from "@/components/deals/DealBadge";
import type { Deal } from "@/types";

type SimilarDealsProps = {
  deals: Deal[];
  onSelect: (deal: Deal) => void;
};

export function SimilarDeals({ deals, onSelect }: SimilarDealsProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Similar deals</h3>
      <div className="mt-2 space-y-2">
        {deals.map((deal) => (
          <button
            key={deal.id}
            type="button"
            className="w-full rounded-xl border border-border bg-bg-elevated/60 p-3 text-left"
            onClick={() => onSelect(deal)}
          >
            <p className="text-sm font-semibold">{deal.origin.code} → {deal.destination.code}</p>
            <p className="mt-1 text-xs text-text-secondary">{deal.airline} · {deal.cabin.replace("_", " ")}</p>
            <div className="mt-2"><DealBadge quality={deal.quality} /></div>
          </button>
        ))}
      </div>
    </section>
  );
}
