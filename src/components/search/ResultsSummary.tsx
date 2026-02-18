import type { Deal } from "@/types";

type ResultsSummaryProps = {
  deals: Deal[];
};

export function ResultsSummary({ deals }: ResultsSummaryProps) {
  const greatCount = deals.filter((deal) => deal.quality === "great").length;
  return (
    <p aria-live="polite" className="text-sm text-text-secondary">
      {deals.length} deals found · {greatCount} Great Deals
    </p>
  );
}
