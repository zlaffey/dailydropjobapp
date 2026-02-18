import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mockDeals } from "@/data/mockDeals";
import { DealDetailDrawer } from "@/components/deals/DealDetailDrawer";

vi.mock("@/services/dealService", () => ({
  getSimilarDeals: vi.fn().mockResolvedValue([]),
}));

describe("DealDetailDrawer", () => {
  it("renders core drawer sections when open", async () => {
    render(
      <DealDetailDrawer
        deal={mockDeals[0]}
        isOpen
        onClose={() => {}}
        onSelectDeal={() => {}}
      />,
    );

    expect(screen.getByText(/points & pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/why this is a good deal/i)).toBeInTheDocument();
    expect(screen.getByText(/flight details/i)).toBeInTheDocument();
  });
});
