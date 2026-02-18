import { DEFAULT_SETTINGS, MONTH_OPTIONS, SIMULATED_DELAY_MS, SIMULATED_ERROR_RATE } from "@/lib/constants";
import { track } from "@/lib/analytics";
import { mockDeals } from "@/data/mockDeals";
import { scoreRecommendation } from "@/lib/recommendationScoring";
import type { Deal, SearchResponse, SearchState, SortOption, UserSettings } from "@/types";
import { get, getCacheKey, remove, set } from "@/services/cacheService";

export function buildSearchCacheKey(params: SearchState): string {
  return getCacheKey({
    origin: params.origin || "any",
    destination: params.destination || "any",
    months: params.months,
    programs: params.programs,
    cabin: params.cabin,
    maxPoints: params.maxPoints,
    minCpp: params.minCpp,
    nonstopOnly: params.nonstopOnly,
    quality: params.dealQuality,
    sortBy: params.sortBy,
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateNetwork<T>(data: T): Promise<T> {
  const delay = Math.floor(Math.random() * (SIMULATED_DELAY_MS.max - SIMULATED_DELAY_MS.min + 1)) + SIMULATED_DELAY_MS.min;
  await wait(delay);

  if (Math.random() < SIMULATED_ERROR_RATE) {
    throw new Error("Network error: failed to fetch deals");
  }

  return data;
}

function dealBestPoints(deal: Deal): number {
  return Math.min(...deal.programOptions.map((option) => option.pointsRequired));
}

function applySort(deals: Deal[], sortBy: SortOption): Deal[] {
  const sorted = [...deals];

  sorted.sort((a, b) => {
    if (sortBy === "best_value") return b.bestCpp - a.bestCpp;
    if (sortBy === "lowest_points") return dealBestPoints(a) - dealBestPoints(b);
    if (sortBy === "lowest_cash") return a.cashPrice - b.cashPrice;
    if (sortBy === "popularity") return b.popularityScore - a.popularityScore;
    return a.travelMonth.localeCompare(b.travelMonth);
  });

  return sorted;
}

function matchesPrograms(deal: Deal, selected: SearchState["programs"]): boolean {
  if (!selected.length) return true;
  const programs = deal.programOptions.map((option) => option.program);
  return selected.some((program) => programs.includes(program));
}

function filterDeals(deals: Deal[], params: SearchState): Deal[] {
  return deals.filter((deal) => {
    if (params.origin && deal.origin.code !== params.origin.toUpperCase()) return false;
    if (params.destination && params.destination.toUpperCase() !== "ANYWHERE" && deal.destination.code !== params.destination.toUpperCase()) return false;
    if (params.months.length && !params.months.includes(deal.travelMonth)) return false;
    if (!matchesPrograms(deal, params.programs)) return false;
    if (params.cabin !== "all" && deal.cabin !== params.cabin) return false;
    if (params.nonstopOnly && !deal.isNonstop) return false;
    if (params.dealQuality !== "all" && deal.quality !== params.dealQuality) return false;
    if (params.minCpp > deal.bestCpp) return false;
    if (params.maxPoints < dealBestPoints(deal)) return false;
    return true;
  });
}

export const DEFAULT_SEARCH_STATE: SearchState = {
  origin: "",
  destination: "",
  months: [MONTH_OPTIONS[0]],
  programs: [],
  cabin: "all",
  maxPoints: 200000,
  minCpp: 0,
  nonstopOnly: false,
  dealQuality: "all",
  sortBy: "best_value",
};

export async function searchDeals(params: SearchState, options?: { forceRefresh?: boolean }): Promise<SearchResponse> {
  const cacheKey = buildSearchCacheKey(params);
  const cached = get(cacheKey);

  if (!options?.forceRefresh && cached && !cached.isStale) {
    track("cache_hit", {
      cache_key: cacheKey,
      cache_age_seconds: Math.round(cached.age / 1000),
    });
    return {
      deals: cached.results,
      cacheStatus: "cached",
      cachedAt: cached.timestamp,
      totalCount: cached.results.length,
    };
  }

  if (options?.forceRefresh) {
    remove(cacheKey);
    track("cache_refresh", { cache_key: cacheKey });
  }

  track("search_requested", { cache_key: cacheKey });
  const filtered = applySort(filterDeals(mockDeals, params), params.sortBy);

  const results = await simulateNetwork(filtered);
  set(cacheKey, results);

  track("search_completed", { cache_key: cacheKey, results_count: results.length });

  return {
    deals: results,
    cacheStatus: "fresh",
    totalCount: results.length,
  };
}

export async function getTrendingDeals(limit = 4): Promise<Deal[]> {
  const sorted = [...mockDeals].sort((a, b) => b.popularityScore - a.popularityScore);
  return simulateNetwork(sorted.slice(0, limit));
}

export async function getRecommendedDeals(settings: UserSettings = DEFAULT_SETTINGS, limit = 4): Promise<Deal[]> {
  const scored = mockDeals
    .map((deal) => ({ deal, score: scoreRecommendation(deal, settings) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.deal);

  return simulateNetwork(scored);
}

export async function getDealById(id: string): Promise<Deal | null> {
  const found = mockDeals.find((deal) => deal.id === id) ?? null;
  return simulateNetwork(found);
}

export async function getSimilarDeals(dealId: string, limit = 3): Promise<Deal[]> {
  const target = mockDeals.find((deal) => deal.id === dealId);
  if (!target) return [];

  const matches = mockDeals
    .filter((deal) => deal.id !== dealId)
    .filter(
      (deal) =>
        deal.destination.code === target.destination.code ||
        deal.programOptions.some((option) => target.programOptions.some((targetOption) => targetOption.program === option.program)),
    )
    .slice(0, limit);

  return simulateNetwork(matches);
}
