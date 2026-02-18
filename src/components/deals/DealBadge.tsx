import { Badge } from "@/components/ui/Badge";
import type { DealQuality } from "@/types";

const copy: Record<DealQuality, { label: string; icon: string; variant: "great" | "good" | "fair" }> = {
  great: { label: "Great Deal", icon: "🔥", variant: "great" },
  good: { label: "Good Deal", icon: "✅", variant: "good" },
  fair: { label: "Fair", icon: "➖", variant: "fair" },
};

type DealBadgeProps = {
  quality: DealQuality;
};

export function DealBadge({ quality }: DealBadgeProps) {
  const item = copy[quality];
  return (
    <Badge variant={item.variant}>
      <span aria-hidden="true" className="mr-1">{item.icon}</span>
      {item.label}
    </Badge>
  );
}
