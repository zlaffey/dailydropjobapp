import { Chip } from "@/components/ui/Chip";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Toggle } from "@/components/ui/Toggle";
import type { SearchState } from "@/types";

type ActiveFiltersProps = {
  searchState: SearchState;
  onChange: (state: Partial<SearchState>) => void;
  onClear: () => void;
};

export function ActiveFilters({ searchState, onChange, onClear }: ActiveFiltersProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-bg-card/60 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <RangeSlider
          label="Max points"
          min={10000}
          max={200000}
          step={1000}
          value={searchState.maxPoints}
          formatter={(value) => `${Math.round(value / 1000)}k`}
          onChange={(value) => onChange({ maxPoints: value })}
        />
        <RangeSlider
          label="Min CPP"
          min={0}
          max={3}
          step={0.1}
          value={searchState.minCpp}
          formatter={(value) => `${value.toFixed(1)}¢`}
          onChange={(value) => onChange({ minCpp: value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Toggle label="Nonstop only" checked={searchState.nonstopOnly} onChange={(value) => onChange({ nonstopOnly: value })} />

        <div className="flex flex-wrap gap-2">
          <Chip label="All" selected={searchState.dealQuality === "all"} onClick={() => onChange({ dealQuality: "all" })} />
          <Chip label="Great" selected={searchState.dealQuality === "great"} onClick={() => onChange({ dealQuality: "great" })} />
          <Chip label="Good" selected={searchState.dealQuality === "good"} onClick={() => onChange({ dealQuality: "good" })} />
        </div>

        <button type="button" onClick={onClear} className="ml-auto text-sm text-brand-primary underline">
          Clear all
        </button>
      </div>
    </section>
  );
}
