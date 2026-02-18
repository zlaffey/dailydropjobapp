import { BookmarkCheck } from "lucide-react";
import { PointsBalanceCard } from "@/components/dashboard/PointsBalanceCard";
import type { PointsProgram, SavedDeal, TabId, UserSettings } from "@/types";

type RightRailProps = {
  activeTab: TabId;
  settings: UserSettings;
  savedDeals: SavedDeal[];
  onTabChange: (tab: TabId) => void;
};

function formatPreferenceSummary(settings: UserSettings): string {
  const airports = settings.homeAirports.map((airport) => airport.code).slice(0, 2).join(", ");
  const cabin = settings.cabinPreference.replace("_", " ");
  return `${airports || "No home airport"} · ${cabin}`;
}

export function RightRail({ activeTab, settings, savedDeals, onTabChange }: RightRailProps) {
  const totalPoints = Object.values(settings.pointsBalances).reduce((sum, value) => sum + (value ?? 0), 0);
  const balanceEntries = Object.entries(settings.pointsBalances) as Array<[PointsProgram, number | undefined]>;
  const latestSaved = savedDeals[0];
  const initial = settings.displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-3">
      <section className="section-card p-4">
        <p className="section-subtitle">Account</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/20 text-sm font-bold text-brand-primary ring-2 ring-brand-primary/30">
            {initial}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{settings.displayName}</h2>
            <p className="text-sm text-text-secondary">{settings.isPro ? "Pro Member" : "Free Tier"}</p>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-border/60 bg-bg-elevated/25 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-text-secondary">Portfolio value</p>
          <p className="text-base font-semibold">{totalPoints.toLocaleString()} pts</p>
        </div>
      </section>

      {activeTab === "dashboard" ? (
        <>
          <section className="section-card p-4">
            <p className="section-subtitle">Points portfolio</p>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {balanceEntries.map(([program, balance]) => (
                <PointsBalanceCard
                  key={program}
                  program={program}
                  balance={Number(balance)}
                  onClick={() => onTabChange("search")}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeTab === "search" ? (
        <section className="section-card p-4">
          <p className="section-subtitle">Search status</p>
          <h3 className="mt-1 text-base font-semibold">Filter profile</h3>
          <p className="mt-2 text-sm text-text-secondary">{formatPreferenceSummary(settings)}</p>
          <p className="mt-2 text-xs text-text-secondary">Preferred programs: {settings.preferredPrograms.length || "All"}</p>
        </section>
      ) : null}

      {activeTab === "saved" ? (
        <section className="section-card p-4">
          <p className="section-subtitle">Saved library</p>
          <h3 className="mt-1 text-base font-semibold">{savedDeals.length} total saved</h3>
          <p className="mt-2 text-sm text-text-secondary">
            {latestSaved ? `Last saved ${new Date(latestSaved.savedAt).toLocaleDateString()}` : "No saved deals yet."}
          </p>
        </section>
      ) : null}

      {activeTab === "settings" ? (
        <section className="section-card p-4">
          <p className="section-subtitle">Preference summary</p>
          <h3 className="mt-1 text-base font-semibold">Traveler profile</h3>
          <p className="mt-2 text-sm text-text-secondary">{formatPreferenceSummary(settings)}</p>
          <p className="mt-2 text-xs text-text-secondary">Date flexibility: {settings.dateFlexibility}</p>
        </section>
      ) : null}

    </div>
  );
}
