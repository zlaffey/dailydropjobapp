import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SavedDealsList } from "@/components/saved/SavedDealsList";
import { mockDeals } from "@/data/mockDeals";

describe("SavedDealsList", () => {
  it("removes an item", () => {
    const onRemove = vi.fn();

    render(
      <SavedDealsList
        savedDeals={[
          { id: "saved_1", savedAt: new Date().toISOString(), deal: mockDeals[0] },
          { id: "saved_2", savedAt: new Date().toISOString(), deal: mockDeals[1] },
        ]}
        onRemove={onRemove}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: `Remove ${mockDeals[0].id}` }));
    expect(onRemove).toHaveBeenCalledWith(mockDeals[0].id);
  });
});
