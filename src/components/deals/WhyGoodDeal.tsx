import { formatCurrency } from "@/lib/formatters";
import type { Deal } from "@/types";

type WhyGoodDealProps = {
  deal: Deal;
};

export function WhyGoodDeal({ deal }: WhyGoodDealProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Why this is a good deal</h3>
      <p className="mt-2 text-sm text-text-primary">
        This {deal.cabin.replace("_", " ")} fare from {deal.origin.city} to {deal.destination.city} normally costs around {formatCurrency(deal.cashPrice)}.
        At {deal.bestCpp.toFixed(2)} cents per point, it outperforms average redemption value and preserves cash.
      </p>
    </section>
  );
}
