"use client";

import { useCallback, useEffect, useMemo } from "react";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { useSearch } from "@/hooks/useSearch";
import { readUrlState, useURLState } from "@/hooks/useURLState";
import { useExperiment } from "@/hooks/useExperiment";
import { track } from "@/lib/analytics";
import { sampleFlightDeals } from "@/data/sampleFlights";
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
import { TravelGoalTracker } from "@/components/dashboard/TravelGoalTracker";
import { SavedDealsList } from "@/components/saved/SavedDealsList";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { UpgradeBanner } from "@/components/subscriber/UpgradeBanner";
import { PaywallGate } from "@/components/subscriber/PaywallGate";
import { AppShell } from "@/components/layout/AppShell";
import { RightRail } from "@/components/layout/RightRail";
import { DEFAULT_TRAVEL_GOAL } from "@/lib/constants";

const dealSnapshotById = new Map(sampleFlightDeals.map((deal) => [deal.id, deal]));

function getDealSnapshotById(dealId) {
  return dealSnapshotById.get(dealId) ?? null;
}

function DashboardTab({ onOpenDeal }) {
  const {
    setActiveTab,
    settings,
    savedDeals,
    savedDealIds,
    toggleSavedDeal,
    recentlyViewedDealIds,
  } = useAppContext();

  return (
    <div className="space-y-6">
      <section className="section-card grid grid-cols-1 gap-5 p-5 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="section-subtitle">Portfolio snapshot</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Subscriber Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Track balances, monitor goal progress, and surface top-value routes tailored to your preferences.
          </p>
          <div className="mt-4">
            <PreferenceChips settings={settings} onOpenSettings={() => setActiveTab("settings")} />
          </div>
        </div>
        <TravelGoalTracker goal={DEFAULT_TRAVEL_GOAL} currentPoints={settings.pointsBalances[DEFAULT_TRAVEL_GOAL.program] ?? 0} />
      </section>

      <RecommendedDeals settings={settings} savedDealIds={savedDealIds} onOpenDeal={onOpenDeal} onToggleSave={toggleSavedDeal} />
      <TrendingDeals savedDealIds={savedDealIds} onOpenDeal={onOpenDeal} onToggleSave={toggleSavedDeal} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentlyViewed dealIds={recentlyViewedDealIds} />
        <SavedDealsPreview savedDeals={savedDeals} onViewAll={() => setActiveTab("saved")} />
      </div>
    </div>
  );
}

function SearchTab({ onOpenDeal }) {
  const {
    experiment,
    searchState,
    results,
    loading,
    error,
    cacheStatus,
    cachedAt,
    updateSearch,
    applySearchStateFromURL,
    clearFilters,
    refresh,
  } = useSearch();

  const {
    settings,
    updateSettings,
    savedDealIds,
    toggleSavedDeal,
  } = useAppContext();

  const visibleResults = useMemo(() => results.slice(0, 18), [results]);
  const blurFromIndex = settings.isPro ? undefined : 5;
  const hiddenCount = settings.isPro ? 0 : Math.max(0, visibleResults.length - 5);

  useEffect(() => {
    const syncSearchStateFromHistory = () => {
      const { searchState: nextSearchState } = readUrlState();
      applySearchStateFromURL(nextSearchState);
    };

    window.addEventListener("popstate", syncSearchStateFromHistory);
    return () => {
      window.removeEventListener("popstate", syncSearchStateFromHistory);
    };
  }, [applySearchStateFromURL]);

  const upgradeToPro = useCallback(() => {
    updateSettings({ isPro: true });
    track("upgraded_to_pro", { source: "paywall" });
  }, [updateSettings]);

  return (
    <div className="space-y-4">
      <div className="section-card p-4">
        <p className="section-subtitle">Search workspace</p>
        <h1 className="mt-1 text-xl font-semibold">Find the highest-value points deals</h1>
      </div>

      <UpgradeBanner isPro={Boolean(settings.isPro)} onUpgrade={upgradeToPro} />

      <div className="section-card p-4">
        <SearchBar searchState={searchState} onChange={updateSearch} />
      </div>
      <CacheStatusBar cacheStatus={cacheStatus} cachedAt={cachedAt} onRefresh={refresh} />
      <div className="section-card p-4">
        <ActiveFilters searchState={searchState} onChange={updateSearch} onClear={clearFilters} />
      </div>

      <div className="section-card flex flex-wrap items-center justify-between gap-2 px-4 py-3">
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
            onOpenDeal={onOpenDeal}
            onToggleSave={toggleSavedDeal}
          />
          {!settings.isPro && hiddenCount > 0 ? <PaywallGate hiddenCount={hiddenCount} onUpgrade={upgradeToPro} /> : null}
        </>
      ) : null}
    </div>
  );
}

function SavedTab() {
  const { savedDeals, removeSavedDeal } = useAppContext();
  return (
    <div className="space-y-3">
      <div className="section-card p-4">
        <p className="section-subtitle">Saved library</p>
        <h1 className="mt-1 text-xl font-semibold">Track deals you want to revisit</h1>
      </div>
      <SavedDealsList savedDeals={savedDeals} onRemove={removeSavedDeal} />
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = useAppContext();
  return (
    <div className="space-y-3">
      <div className="section-card p-4">
        <p className="section-subtitle">Profile settings</p>
        <h1 className="mt-1 text-xl font-semibold">Tune your deal feed and balances</h1>
      </div>
      <SettingsForm settings={settings} onChange={updateSettings} />
    </div>
  );
}

function ShellContent() {
  const {
    activeTab,
    setActiveTab,
    selectedDeal,
    setSelectedDeal,
    settings,
    savedDeals,
    recentlyViewedDealIds,
    addRecentlyViewedDealId,
  } = useAppContext();
  const experiment = useExperiment();
  const { pushDealInURL } = useURLState();
  const safeRecentlyViewedDealIds = Array.isArray(recentlyViewedDealIds) ? recentlyViewedDealIds : [];

  const openDealFromUI = useCallback((deal) => {
    setSelectedDeal(deal);
    addRecentlyViewedDealId(deal.id);
    pushDealInURL(deal.id);
  }, [addRecentlyViewedDealId, pushDealInURL, setSelectedDeal]);

  const closeDealFromUI = useCallback(() => {
    setSelectedDeal(null);
    pushDealInURL(null);
  }, [pushDealInURL, setSelectedDeal]);

  useEffect(() => {
    const syncDealFromUrl = () => {
      const { dealId } = readUrlState();
      if (!dealId) {
        setSelectedDeal(null);
        return;
      }

      const deal = getDealSnapshotById(dealId);
      if (deal) {
        setSelectedDeal(deal);
        return;
      }

      // Strip invalid deep-link deal IDs from the URL without creating a history entry.
      const url = new URL(window.location.href);
      url.searchParams.delete("deal");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      setSelectedDeal(null);
    };

    syncDealFromUrl();
    window.addEventListener("popstate", syncDealFromUrl);
    window.addEventListener("hashchange", syncDealFromUrl);

    return () => {
      window.removeEventListener("popstate", syncDealFromUrl);
      window.removeEventListener("hashchange", syncDealFromUrl);
    };
  }, [setSelectedDeal]);

  return (
    <>
      <AppShell
        settings={settings}
        activeTab={activeTab}
        savedCount={savedDeals.length}
        experiment={experiment}
        onTabChange={setActiveTab}
        rightRail={
          <RightRail
            activeTab={activeTab}
            settings={settings}
            savedDeals={savedDeals}
            recentlyViewedDealIds={safeRecentlyViewedDealIds}
            onTabChange={setActiveTab}
          />
        }
      >
        {activeTab === "dashboard" ? <DashboardTab onOpenDeal={openDealFromUI} /> : null}
        {activeTab === "search" ? <SearchTab onOpenDeal={openDealFromUI} /> : null}
        {activeTab === "saved" ? <SavedTab /> : null}
        {activeTab === "settings" ? <SettingsTab /> : null}
      </AppShell>

      <DealDetailDrawer
        deal={selectedDeal}
        isOpen={Boolean(selectedDeal)}
        onClose={closeDealFromUI}
        onSelectDeal={openDealFromUI}
      />
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <ShellContent />
    </AppProvider>
  );
}
