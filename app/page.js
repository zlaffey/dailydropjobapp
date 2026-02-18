"use client";

import { useMemo, useState } from "react";
import { DealGrid } from "@/components/deals/DealGrid";
import { DealCardSkeleton } from "@/components/deals/DealCardSkeleton";
import { DealDetailDrawer } from "@/components/deals/DealDetailDrawer";
import { mockDeals } from "@/data/mockDeals";

export default function Home() {
  const deals = useMemo(() => mockDeals.slice(0, 6), []);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [savedDealIds, setSavedDealIds] = useState(() => new Set());
  const [loading] = useState(false);

  function handleToggleSave(deal) {
    setSavedDealIds((prev) => {
      const next = new Set(prev);
      if (next.has(deal.id)) {
        next.delete(deal.id);
      } else {
        next.add(deal.id);
      }
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">DealDrop Search</h1>
          <p className="mt-1 text-sm text-text-secondary">Phase 2: Deal cards and detail drawer implemented.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <DealCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <DealGrid
            deals={deals}
            savedDealIds={savedDealIds}
            onOpenDeal={setSelectedDeal}
            onToggleSave={handleToggleSave}
          />
        )}
      </section>

      <DealDetailDrawer
        deal={selectedDeal}
        isOpen={Boolean(selectedDeal)}
        onClose={() => setSelectedDeal(null)}
        onSelectDeal={setSelectedDeal}
      />
    </main>
  );
}
