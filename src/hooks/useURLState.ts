"use client";

import { useCallback } from "react";
import type { SearchState, TabId } from "@/types";
import { ALL_PROGRAMS } from "@/lib/constants";
import { DEFAULT_SEARCH_STATE } from "@/services/dealService";

const VALID_TABS: TabId[] = ["dashboard", "search", "saved", "settings"];
const SEARCH_PARAM_KEYS = ["from", "to", "months", "programs", "cabin", "maxPoints", "minCpp", "nonstop", "quality", "sort"] as const;

function csvToArray(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

function normalizeNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function hasSearchContext(params: URLSearchParams): boolean {
  return SEARCH_PARAM_KEYS.some((key) => params.has(key)) || params.has("deal");
}

export function parseSearchStateFromURL(): SearchState {
  if (typeof window === "undefined") return DEFAULT_SEARCH_STATE;

  const params = new URLSearchParams(window.location.search);
  const cabin = params.get("cabin") as SearchState["cabin"] | null;
  const quality = params.get("quality") as SearchState["dealQuality"] | null;
  const sort = params.get("sort") as SearchState["sortBy"] | null;

  return {
    ...DEFAULT_SEARCH_STATE,
    origin: (params.get("from") ?? "").toUpperCase(),
    destination: (params.get("to") ?? "").toUpperCase(),
    months: csvToArray(params.get("months")),
    programs: csvToArray(params.get("programs")).filter((program) => ALL_PROGRAMS.includes(program as (typeof ALL_PROGRAMS)[number])) as SearchState["programs"],
    cabin: cabin && ["all", "economy", "premium_economy", "business", "first"].includes(cabin) ? cabin : "all",
    maxPoints: normalizeNumber(Number(params.get("maxPoints")), DEFAULT_SEARCH_STATE.maxPoints),
    minCpp: normalizeNumber(Number(params.get("minCpp")), DEFAULT_SEARCH_STATE.minCpp),
    nonstopOnly: params.get("nonstop") === "1",
    dealQuality: quality && ["all", "great", "good", "fair"].includes(quality) ? quality : "all",
    sortBy: sort && ["best_value", "lowest_points", "lowest_cash", "soonest", "popularity"].includes(sort) ? sort : DEFAULT_SEARCH_STATE.sortBy,
  };
}

export function readUrlState(): {
  searchState: SearchState;
  dealId: string | null;
  tabHash: TabId | null;
  hasSearchParams: boolean;
} {
  if (typeof window === "undefined") {
    return {
      searchState: DEFAULT_SEARCH_STATE,
      dealId: null,
      tabHash: null,
      hasSearchParams: false,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const rawHash = window.location.hash.replace("#", "") as TabId;

  return {
    searchState: parseSearchStateFromURL(),
    dealId: params.get("deal"),
    tabHash: VALID_TABS.includes(rawHash) ? rawHash : null,
    hasSearchParams: hasSearchContext(params),
  };
}

function applySearchParams(params: URLSearchParams, state: SearchState): URLSearchParams {
  const next = new URLSearchParams(params);

  SEARCH_PARAM_KEYS.forEach((key) => next.delete(key));

  if (state.origin) next.set("from", state.origin);
  if (state.destination) next.set("to", state.destination);
  if (state.months.length) next.set("months", state.months.join(","));
  if (state.programs.length) next.set("programs", state.programs.join(","));
  if (state.cabin !== "all") next.set("cabin", state.cabin);
  if (state.maxPoints !== DEFAULT_SEARCH_STATE.maxPoints) next.set("maxPoints", String(state.maxPoints));
  if (state.minCpp > 0) next.set("minCpp", String(state.minCpp));
  if (state.nonstopOnly) next.set("nonstop", "1");
  if (state.dealQuality !== "all") next.set("quality", state.dealQuality);
  if (state.sortBy !== DEFAULT_SEARCH_STATE.sortBy) next.set("sort", state.sortBy);

  return next;
}

export function useURLState() {
  const replaceSearchStateInURL = useCallback((state: SearchState) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.search = applySearchParams(url.searchParams, state).toString();
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const pushDealInURL = useCallback((dealId: string | null) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    if (dealId) {
      url.searchParams.set("deal", dealId);
    } else {
      url.searchParams.delete("deal");
    }

    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const pushTabHash = useCallback((tab: TabId) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const nextHash = `#${tab}`;
    if (url.hash === nextHash) return;

    url.hash = tab;
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return {
    replaceSearchStateInURL,
    pushDealInURL,
    pushTabHash,
  };
}
