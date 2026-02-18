import { cn } from "@/lib/cn";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ label, children, className }: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 w-max max-w-[220px] -translate-x-1/2 rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-text-secondary opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-bg-card" />
      </span>
    </span>
  );
}
