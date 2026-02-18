import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mockDeals } from "@/data/mockDeals";
import { DealCard } from "@/components/deals/DealCard";

describe("DealCard", () => {
  it("opens on Enter key and toggles save button", () => {
    const onOpen = vi.fn();
    const onToggleSave = vi.fn();
    const deal = mockDeals[0];

    render(<DealCard deal={deal} onOpen={onOpen} onToggleSave={onToggleSave} />);

    const card = screen.getByRole("button", { name: /open deal/i });
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onOpen).toHaveBeenCalledWith(deal);

    const saveButton = screen.getByRole("button", { name: /save deal/i });
    fireEvent.click(saveButton);
    expect(onToggleSave).toHaveBeenCalledWith(deal);
  });
});
