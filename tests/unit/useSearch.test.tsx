import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeals } from "@/data/mockDeals";
import { useSearch } from "@/hooks/useSearch";

vi.mock("@/services/dealService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/dealService")>();

  return {
    ...actual,
    searchDeals: vi.fn().mockResolvedValue({
      deals: mockDeals.slice(0, 4),
      cacheStatus: "fresh",
      totalCount: 4,
    }),
  };
});

describe("useSearch", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("loads search results and updates state", async () => {
    const { result } = renderHook(() => useSearch());

    await waitFor(() => expect(result.current.results.length).toBe(4));

    act(() => {
      result.current.updateSearch({ origin: "JFK" });
    });
    expect(result.current.searchState.origin).toBe("JFK");
  });
});
