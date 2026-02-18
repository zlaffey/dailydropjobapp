import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaywallGate } from "@/components/subscriber/PaywallGate";

describe("PaywallGate", () => {
  it("calls onUpgrade after CTA click", async () => {
    vi.useFakeTimers();
    const onUpgrade = vi.fn();

    render(<PaywallGate hiddenCount={8} onUpgrade={onUpgrade} />);

    fireEvent.click(screen.getByRole("button", { name: /start free trial/i }));
    vi.runAllTimers();

    expect(onUpgrade).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
