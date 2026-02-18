import type { SavedDeal } from "@/types";

type SavedDealsPreviewProps = {
  savedDeals: SavedDeal[];
  onViewAll: () => void;
};

export function SavedDealsPreview({ savedDeals, onViewAll }: SavedDealsPreviewProps) {
  const top = savedDeals.slice(0, 3);

  return (
    <section className="section-card p-4">
      <p className="section-subtitle">Library</p>
      <h2 className="mt-1 section-title">Saved deals</h2>
      {top.length ? (
        <ul className="mt-3 space-y-2">
          {top.map((saved) => (
            <li key={saved.id} className="rounded-lg border border-border bg-bg-elevated/40 p-2.5">
              <p className="text-sm font-medium">{saved.deal.origin.code} → {saved.deal.destination.code}</p>
              <p className="text-xs text-text-secondary">Saved {new Date(saved.savedAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-text-secondary">Save deals from Search to track them here.</p>
      )}
      <button type="button" className="mt-4 text-sm text-brand-primary underline underline-offset-2" onClick={onViewAll}>
        View all saved ({savedDeals.length}) →
      </button>
    </section>
  );
}
