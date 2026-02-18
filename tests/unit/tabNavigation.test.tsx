import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TabNavigation } from "@/components/layout/TabNavigation";

describe("TabNavigation", () => {
  it("changes tabs", () => {
    const onChange = vi.fn();
    render(<TabNavigation activeTab="dashboard" savedCount={2} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    expect(onChange).toHaveBeenCalledWith("search");
  });
});
