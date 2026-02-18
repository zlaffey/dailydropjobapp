import { describe, expect, it } from "vitest";
import { formatCpp, formatCurrency, formatMonthYear, formatPoints, formatRoute } from "@/lib/formatters";

describe("formatters", () => {
  it("formats values", () => {
    expect(formatPoints(82400)).toBe("82,400 pts");
    expect(formatCurrency(1247)).toBe("$1,247");
    expect(formatCpp(2.078)).toBe("2.08¢/pt");
    expect(formatRoute("jfk", "nrt")).toBe("JFK -> NRT");
  });

  it("formats month year", () => {
    expect(formatMonthYear("2026-06")).toBe("Jun 2026");
  });
});
