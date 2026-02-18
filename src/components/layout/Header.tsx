import { Badge } from "@/components/ui/Badge";
import type { UserSettings } from "@/types";

type HeaderProps = {
  settings: UserSettings;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Header({ settings }: HeaderProps) {
  const totalPoints = Object.values(settings.pointsBalances).reduce((sum, value) => sum + (value ?? 0), 0);

  return (
    <header className="rounded-2xl border border-border bg-bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xl font-bold">DealDrop</p>
          <p className="text-sm text-text-secondary">{getGreeting()}, {settings.displayName} 👋</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary">Points balance</p>
          <p className="text-sm font-semibold">{totalPoints.toLocaleString()} pts</p>
          {settings.isPro ? <Badge variant="pro" className="mt-1">Pro</Badge> : <Badge className="mt-1">Free</Badge>}
        </div>
      </div>
    </header>
  );
}
