"use client";

import { useMemo } from "react";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { useSearch } from "@/hooks/useSearch";
import { useExperiment } from "@/hooks/useExperiment";
import { track } from "@/lib/analytics";
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
import { PreferenceChips } from "@/components/dashboard/PreferenceChips";
import { RecommendedDeals } from "@/components/dashboard/RecommendedDeals";
import { TrendingDeals } from "@/components/dashboard/TrendingDeals";
import { RecentlyViewed } from "@/components/dashboard/RecentlyViewed";
import { SavedDealsPreview } from "@/components/dashboard/SavedDealsPreview";
import { PointsBalanceCard } from "@/components/dashboard/PointsBalanceCard";
import { TravelGoalTracker } from "@/components/dashboard/TravelGoalTracker";
import { SavedDealsList } from "@/components/saved/SavedDealsList";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { UpgradeBanner } from "@/components/subscriber/UpgradeBanner";
import { PaywallGate } from "@/components/subscriber/PaywallGate";
import { Footer } from "@/components/layout/Footer";
import { DEFAULT_TRAVEL_GOAL } from "@/lib/constants";

function DashboardTab() {
  const {
    setActiveTab,
    setSelectedDeal,
    settings,
    savedDeals,
    savedDealIds,
    toggleSavedDeal,
    recentlyViewedDealIds,
    addRecentlyViewedDealId,
  } = useAppContext();

  const balanceEntries = Object.entries(settings.pointsBalances);

  function handleOpenDeal(deal) {
    setSelectedDeal(deal);
    addRecentlyViewedDealId(deal.id);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Good day, {settings.displayName} 👋</h1>

      <PreferenceChips settings={settings} onOpenSettings={() => setActiveTab("settings")} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {balanceEntries.map(([program, balance]) => (
          <PointsBalanceCard key={program} program={program} balance={Number(balance)} onClick={() => setActiveTab("search")} />
        ))}
      </div>

      <TravelGoalTracker goal={DEFAULT_TRAVEL_GOAL} currentPoints={settings.pointsBalances[DEFAULT_TRAVEL_GOAL.program] ?? 0} />

      <RecommendedDeals
        settings={settings}
        savedDealIds={savedDealIds}
        onOpenDeal={handleOpenDeal}
        onToggleSave={toggleSavedDeal}
      />

      <TrendingDeals
        savedDealIds={savedDealIds}
        onOpenDeal={handleOpenDeal}
        onToggleSave={toggleSavedDeal}
      />

      <RecentlyViewed dealIds={recentlyViewedDealIds} />
      <SavedDealsPreview savedDeals={savedDeals} onViewAll={() => setActiveTab("saved")} />
    </div>
  );
}

function SearchTab() {
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

  const {
    settings,
    updateSettings,
    setSelectedDeal,
    savedDealIds,
    toggleSavedDeal,
    addRecentlyViewedDealId,
  } = useAppContext();

  const visibleResults = useMemo(() => results.slice(0, 18), [results]);
  const blurFromIndex = settings.isPro ? undefined : 5;
  const hiddenCount = settings.isPro ? 0 : Math.max(0, visibleResults.length - 5);

  function handleOpenDeal(deal) {
    setSelectedDeal(deal);
    addRecentlyViewedDealId(deal.id);
  }

  function upgradeToPro() {
    updateSettings({ isPro: true });
    track("upgraded_to_pro", { source: "paywall" });
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">DealDrop Search</h1>
        <p className="text-sm text-text-secondary">Live search with filters, cache status, and URL state sync.</p>
      </header>

      <UpgradeBanner isPro={Boolean(settings.isPro)} onUpgrade={upgradeToPro} />

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
        <>
          <DealGrid
            deals={visibleResults}
            savedDealIds={savedDealIds}
            blurFromIndex={blurFromIndex}
            experimentVariant={experiment.assignment}
            onOpenDeal={handleOpenDeal}
            onToggleSave={toggleSavedDeal}
          />
          {!settings.isPro && hiddenCount > 0 ? <PaywallGate hiddenCount={hiddenCount} onUpgrade={upgradeToPro} /> : null}
        </>
      ) : null}

      <p className="text-xs text-text-secondary">Experiment variant: {experiment.assignment}</p>
    </div>
  );
}

function SavedTab() {
  const { savedDeals, removeSavedDeal } = useAppContext();
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Saved Deals</h1>
      <SavedDealsList savedDeals={savedDeals} onRemove={removeSavedDeal} />
    </section>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = useAppContext();
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Settings</h1>
      <SettingsForm settings={settings} onChange={updateSettings} />
    </section>
  );
}

function ShellContent() {
  const { activeTab, setActiveTab, selectedDeal, setSelectedDeal } = useAppContext();
  const experiment = useExperiment();

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        <nav className="flex flex-wrap gap-2">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "search", label: "Search" },
            { id: "saved", label: "Saved" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-3 py-1.5 text-sm ${activeTab === tab.id ? "border-brand-primary bg-brand-primary/20" : "border-border"}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "dashboard" ? <DashboardTab /> : null}
        {activeTab === "search" ? <SearchTab /> : null}
        {activeTab === "saved" ? <SavedTab /> : null}
        {activeTab === "settings" ? <SettingsTab /> : null}

        <Footer experiment={experiment} />
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

export default function Home() {
  return (
    <AppProvider>
      <ShellContent />
    </AppProvider>
  );
}
