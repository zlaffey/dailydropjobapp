import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSettings } from "@/hooks/useSettings";

describe("useSettings", () => {
  it("updates and persists settings", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ displayName: "Priya" });
    });

    expect(result.current.settings.displayName).toBe("Priya");
    expect(window.localStorage.getItem("dealdrop_settings")).toContain("Priya");
  });
});
