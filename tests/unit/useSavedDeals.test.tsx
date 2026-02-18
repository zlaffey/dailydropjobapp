import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSavedDeals } from "@/hooks/useSavedDeals";
import { mockDeals } from "@/data/mockDeals";

describe("useSavedDeals", () => {
  it("toggles deals and tracks id set", () => {
    const { result } = renderHook(() => useSavedDeals());

    act(() => {
      result.current.toggleSavedDeal(mockDeals[0]);
    });

    expect(result.current.savedDeals.length).toBe(1);
    expect(result.current.savedDealIds.has(mockDeals[0].id)).toBe(true);

    act(() => {
      result.current.toggleSavedDeal(mockDeals[0]);
    });

    expect(result.current.savedDeals.length).toBe(0);
  });
});
