import { Chip } from "@/components/ui/Chip";
import type { SearchState } from "@/types";

const options: Array<{ label: string; value: SearchState["cabin"] }> = [
  { label: "All", value: "all" },
  { label: "Economy", value: "economy" },
  { label: "Premium", value: "premium_economy" },
  { label: "Business", value: "business" },
  { label: "First", value: "first" },
];

type CabinSelectorProps = {
  value: SearchState["cabin"];
  onChange: (value: SearchState["cabin"]) => void;
};

export function CabinSelector({ value, onChange }: CabinSelectorProps) {
  return (
    <div>
      <p className="mb-1 text-xs text-text-secondary">Cabin</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip key={option.value} label={option.label} selected={value === option.value} onClick={() => onChange(option.value)} />
        ))}
      </div>
    </div>
  );
}
