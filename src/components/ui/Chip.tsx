import { cn } from "@/lib/cn";

type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition",
        selected ? "border-brand-primary bg-brand-primary/20 text-text-primary" : "border-border bg-bg-card text-text-secondary hover:text-text-primary",
      )}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
