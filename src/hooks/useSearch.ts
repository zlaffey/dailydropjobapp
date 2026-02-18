"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Deal, SearchState } from "@/types";
import { DEFAULT_SEARCH_STATE, searchDeals } from "@/services/dealService";
import { useDebounce } from "@/hooks/useDebounce";
import { parseSearchStateFromURL, useURLState } from "@/hooks/useURLState";
import { useExperiment } from "@/hooks/useExperiment";

export function useSearch() {
  const experiment = useExperiment();
  const { writeSearchStateToURL } = useURLState();

  const initialState = useMemo(() => {
    const parsed = parseSearchStateFromURL();
    if (!parsed.sortBy || parsed.sortBy === DEFAULT_SEARCH_STATE.sortBy) {
      return {
        ...parsed,
        sortBy: experiment.variants[experiment.assignment],
      };
    }
    return parsed;
  }, [experiment.assignment, experiment.variants]);

  const [searchState, setSearchState] = useState<SearchState>(initialState);
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
    writeSearchStateToURL(debouncedState);
    executeSearch(debouncedState);
  }, [debouncedState, executeSearch, writeSearchStateToURL]);

  const updateSearch = useCallback((nextValues: Partial<SearchState>) => {
    setSearchState((prev) => ({ ...prev, ...nextValues }));
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

  return {
    experiment,
    searchState,
    results,
    loading,
    error,
    cacheStatus,
    cachedAt,
    updateSearch,
    clearFilters,
    refresh: () => executeSearch(searchState, true),
  };
}
