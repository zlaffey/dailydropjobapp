"use client";

import { useMemo, useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { ActiveFilters } from "@/components/search/ActiveFilters";
import { SortControls } from "@/components/search/SortControls";
import { ResultsSummary } from "@/components/search/ResultsSummary";
import { CacheStatusBar } from "@/components/search/CacheStatusBar";
import { DealGrid } from "@/components/deals/DealGrid";
import { DealCardSkeleton } from "@/components/deals/DealCardSkeleton";
import { DealDetailDrawer } from "@/components/deals/DealDetailDrawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Home() {
  const {
    experiment,
    searchState,
    results,
    loading,
    error,
    cacheStatus,
    cachedAt,
    updateSearch,
    clearFilters,
    refresh,
  } = useSearch();

  const [selectedDeal, setSelectedDeal] = useState(null);
  const [savedDealIds, setSavedDealIds] = useState(() => new Set());

  const visibleResults = useMemo(() => results.slice(0, 18), [results]);

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
      <section className="mx-auto max-w-6xl space-y-4 px-4 py-8 sm:px-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">DealDrop Search</h1>
          <p className="text-sm text-text-secondary">Phase 3: Live search, filters, sort, cache status, URL sync.</p>
        </header>

        <SearchBar searchState={searchState} onChange={updateSearch} />
        <CacheStatusBar cacheStatus={cacheStatus} cachedAt={cachedAt} onRefresh={refresh} />
        <ActiveFilters searchState={searchState} onChange={updateSearch} onClear={clearFilters} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <ResultsSummary deals={visibleResults} />
          <SortControls value={searchState.sortBy} onChange={(sortBy) => updateSearch({ sortBy })} />
        </div>

        {error ? <ErrorState message={error} onRetry={refresh} /> : null}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <DealCardSkeleton key={idx} />
            ))}
          </div>
        ) : null}

        {!loading && !error && visibleResults.length === 0 ? (
          <EmptyState
            title="No deals match your filters"
            description="Try clearing filters or broadening destination/month selection."
            action={
              <button type="button" onClick={clearFilters} className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-slate-900">
                Clear filters
              </button>
            }
          />
        ) : null}

        {!loading && !error && visibleResults.length > 0 ? (
          <DealGrid
            deals={visibleResults}
            savedDealIds={savedDealIds}
            onOpenDeal={setSelectedDeal}
            onToggleSave={handleToggleSave}
          />
        ) : null}

        <p className="text-xs text-text-secondary">Experiment variant: {experiment.assignment}</p>
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
