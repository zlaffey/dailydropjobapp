import { Tooltip } from "@/components/ui/Tooltip";

export function CppTooltip() {
  return (
    <Tooltip label="Cents per point measures value per point. Higher is better, and 1.5+ is typically strong.">
      <span tabIndex={0} className="cursor-help rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
        What is CPP?
      </span>
    </Tooltip>
  );
}
