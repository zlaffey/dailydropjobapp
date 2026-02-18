"use client";

import { useCallback, useEffect, useState } from "react";
import type { Deal, SearchState } from "@/types";
import { DEFAULT_SEARCH_STATE, searchDeals } from "@/services/dealService";
import { useDebounce } from "@/hooks/useDebounce";
import { parseSearchStateFromURL, useURLState } from "@/hooks/useURLState";
import { useExperiment } from "@/hooks/useExperiment";

function areSearchStatesEqual(a: SearchState, b: SearchState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useSearch() {
  const experiment = useExperiment();
  const { replaceSearchStateInURL } = useURLState();

  const [searchState, setSearchState] = useState<SearchState>(() => {
    const parsed = parseSearchStateFromURL();
    if (!parsed.sortBy || parsed.sortBy === DEFAULT_SEARCH_STATE.sortBy) {
      return {
        ...parsed,
        sortBy: experiment.variants[experiment.assignment],
      };
    }
    return parsed;
  });
  const [results, setResults] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<"fresh" | "cached">("fresh");
  const [cachedAt, setCachedAt] = useState<number | undefined>(undefined);

  const debouncedState = useDebounce(searchState, 300);

  const executeSearch = useCallback(
    async (state: SearchState, forceRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        const response = await searchDeals(state, { forceRefresh });
        setResults(response.deals);
        setCacheStatus(response.cacheStatus);
        setCachedAt(response.cachedAt);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deals.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    replaceSearchStateInURL(debouncedState);
    executeSearch(debouncedState);
  }, [debouncedState, executeSearch, replaceSearchStateInURL]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasExplicitSort = new URLSearchParams(window.location.search).has("sort");
    if (hasExplicitSort) return;

    setSearchState((prev) => {
      if (prev.sortBy !== DEFAULT_SEARCH_STATE.sortBy) return prev;
      const nextSort = experiment.variants[experiment.assignment];
      if (nextSort === prev.sortBy) return prev;
      return { ...prev, sortBy: nextSort };
    });
  }, [experiment.assignment, experiment.variants]);

  const updateSearch = useCallback((nextValues: Partial<SearchState>) => {
    setSearchState((prev) => ({ ...prev, ...nextValues }));
  }, []);

  const applySearchStateFromURL = useCallback((nextState: SearchState) => {
    setSearchState((prev) => (areSearchStatesEqual(prev, nextState) ? prev : nextState));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchState((prev) => ({
      ...prev,
      maxPoints: DEFAULT_SEARCH_STATE.maxPoints,
      minCpp: DEFAULT_SEARCH_STATE.minCpp,
      nonstopOnly: false,
      dealQuality: "all",
      cabin: "all",
      programs: [],
    }));
  }, []);

  const refresh = useCallback(() => executeSearch(searchState, true), [executeSearch, searchState]);

  return {
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
  };
}
