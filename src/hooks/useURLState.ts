"use client";

import { useCallback } from "react";
import type { SearchState } from "@/types";
import { ALL_PROGRAMS } from "@/lib/constants";
import { DEFAULT_SEARCH_STATE } from "@/services/dealService";

function csvToArray(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export function parseSearchStateFromURL(): SearchState {
  if (typeof window === "undefined") return DEFAULT_SEARCH_STATE;

  const params = new URLSearchParams(window.location.search);

  return {
    ...DEFAULT_SEARCH_STATE,
    origin: params.get("from") ?? "",
    destination: params.get("to") ?? "",
    months: csvToArray(params.get("months")),
    programs: csvToArray(params.get("programs")).filter((program) => ALL_PROGRAMS.includes(program as (typeof ALL_PROGRAMS)[number])) as SearchState["programs"],
    cabin: (params.get("cabin") as SearchState["cabin"]) ?? "all",
    maxPoints: Number(params.get("maxPoints") ?? DEFAULT_SEARCH_STATE.maxPoints),
    minCpp: Number(params.get("minCpp") ?? DEFAULT_SEARCH_STATE.minCpp),
    nonstopOnly: params.get("nonstop") === "1",
    dealQuality: (params.get("quality") as SearchState["dealQuality"]) ?? "all",
    sortBy: (params.get("sort") as SearchState["sortBy"]) ?? DEFAULT_SEARCH_STATE.sortBy,
  };
}

export function useURLState() {
  const writeSearchStateToURL = useCallback((state: SearchState) => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams();
    if (state.origin) params.set("from", state.origin);
    if (state.destination) params.set("to", state.destination);
    if (state.months.length) params.set("months", state.months.join(","));
    if (state.programs.length) params.set("programs", state.programs.join(","));
    if (state.cabin !== "all") params.set("cabin", state.cabin);
    if (state.maxPoints !== DEFAULT_SEARCH_STATE.maxPoints) params.set("maxPoints", String(state.maxPoints));
    if (state.minCpp > 0) params.set("minCpp", String(state.minCpp));
    if (state.nonstopOnly) params.set("nonstop", "1");
    if (state.dealQuality !== "all") params.set("quality", state.dealQuality);
    if (state.sortBy !== DEFAULT_SEARCH_STATE.sortBy) params.set("sort", state.sortBy);

    const queryString = params.toString();
    const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, []);

  return { writeSearchStateToURL };
}
