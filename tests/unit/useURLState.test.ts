import { describe, expect, it } from "vitest";
import { parseSearchStateFromURL } from "@/hooks/useURLState";

describe("useURLState", () => {
  it("parses search params", () => {
    window.history.replaceState(null, "", "/?from=JFK&to=NRT&months=2026-06,2026-07&programs=chase_ur,amex_mr&sort=lowest_points");

    const state = parseSearchStateFromURL();

    expect(state.origin).toBe("JFK");
    expect(state.destination).toBe("NRT");
    expect(state.months).toEqual(["2026-06", "2026-07"]);
    expect(state.programs).toEqual(["chase_ur", "amex_mr"]);
    expect(state.sortBy).toBe("lowest_points");
  });
});
