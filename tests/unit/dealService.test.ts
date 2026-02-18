import { beforeEach, describe, expect, it, vi } from "vitest";
import { clear } from "@/services/cacheService";
import { DEFAULT_SEARCH_STATE, searchDeals } from "@/services/dealService";

describe("dealService", () => {
  beforeEach(() => {
    clear();
    vi.restoreAllMocks();
  });

  it("returns fresh results then cached results", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const first = await searchDeals({ ...DEFAULT_SEARCH_STATE, months: [] });
    expect(first.cacheStatus).toBe("fresh");
    expect(first.deals.length).toBeGreaterThan(0);

    const second = await searchDeals({ ...DEFAULT_SEARCH_STATE, months: [] });
    expect(second.cacheStatus).toBe("cached");
    expect(second.deals.length).toBe(first.deals.length);
  });
});
