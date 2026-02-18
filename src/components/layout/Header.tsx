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
    <header className="section-card overflow-hidden p-0">
      <div className="border-b border-border/70 bg-gradient-to-r from-brand-primary/15 via-transparent to-brand-accent/15 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">DealDrop Intelligence Desk</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-2xl font-bold tracking-tight">DealDrop</p>
          <p className="mt-1 text-sm text-text-secondary">
            {getGreeting()}, {settings.displayName} · Your points market snapshot is live.
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-bg-elevated/40 px-4 py-3 text-right">
          <p className="text-[11px] uppercase tracking-[0.14em] text-text-secondary">Total points</p>
          <p className="mt-1 text-lg font-semibold">{totalPoints.toLocaleString()} pts</p>
          {settings.isPro ? <Badge variant="pro" className="mt-2">Pro Member</Badge> : <Badge className="mt-2">Free Tier</Badge>}
        </div>
      </div>
    </header>
  );
}
