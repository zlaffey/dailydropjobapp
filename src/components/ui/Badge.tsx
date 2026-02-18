import { cn } from "@/lib/cn";

type BadgeVariant = "great" | "good" | "fair" | "pro" | "default";

const styles: Record<BadgeVariant, string> = {
  great: "bg-deal-great/15 text-deal-great border-deal-great/30",
  good: "bg-deal-good/15 text-deal-good border-deal-good/30",
  fair: "bg-deal-fair/20 text-slate-300 border-deal-fair/30",
  pro: "bg-brand-accent/20 text-brand-accent border-brand-accent/40",
  default: "bg-bg-elevated text-text-primary border-border",
};

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold", styles[variant], className)}>{children}</span>;
}
