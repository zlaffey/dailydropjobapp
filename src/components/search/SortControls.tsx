import type { SortOption } from "@/types";

type SortControlsProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
      Sort by
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary"
      >
        <option value="best_value">Best Value</option>
        <option value="lowest_points">Lowest Points</option>
        <option value="lowest_cash">Lowest Cash</option>
        <option value="soonest">Soonest</option>
      </select>
    </label>
  );
}
