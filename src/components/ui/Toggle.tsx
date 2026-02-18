import { cn } from "@/lib/cn";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm text-text-secondary"
    >
      <span
        className={cn(
          "inline-flex h-6 w-10 items-center rounded-full border border-border p-1 transition",
          checked ? "bg-brand-primary/40" : "bg-bg-elevated",
        )}
      >
        <span className={cn("h-4 w-4 rounded-full bg-white transition", checked ? "translate-x-4" : "translate-x-0")} />
      </span>
      {label}
    </button>
  );
}
