import { mockDeals } from "@/data/mockDeals";
import type { Deal } from "@/types";

type RecentlyViewedProps = {
  dealIds: string[];
};

export function RecentlyViewed({ dealIds }: RecentlyViewedProps) {
  const deals: Deal[] = dealIds
    .map((dealId) => mockDeals.find((deal) => deal.id === dealId))
    .filter((deal): deal is Deal => Boolean(deal));

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Recently viewed</h2>
      {deals.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <article key={deal.id} className="rounded-xl border border-border bg-bg-card p-3">
              <p className="font-semibold">{deal.origin.code} → {deal.destination.code}</p>
              <p className="text-xs text-text-secondary">{deal.airline}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">Start exploring deals to see your recent activity here.</p>
      )}
    </section>
  );
}
