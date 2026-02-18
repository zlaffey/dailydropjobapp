import { describe, expect, it } from "vitest";
import { calculateCpp, getBestProgramOption, getDealQuality } from "@/lib/dealScoring";

describe("dealScoring", () => {
  it("calculates cpp in cents", () => {
    expect(calculateCpp(1247, 60000)).toBeCloseTo(2.0783, 3);
  });

  it("returns fair/good/great quality tiers", () => {
    expect(getDealQuality(1.1)).toBe("fair");
    expect(getDealQuality(1.5)).toBe("good");
    expect(getDealQuality(2.2)).toBe("great");
  });

  it("picks the highest cpp option", () => {
    const best = getBestProgramOption([
      { program: "chase_ur", pointsRequired: 70000, taxesFeesUsd: 86, centsPerPoint: 1.8 },
      { program: "amex_mr", pointsRequired: 80000, taxesFeesUsd: 86, centsPerPoint: 1.5 },
    ]);
    expect(best?.program).toBe("chase_ur");
  });
});
