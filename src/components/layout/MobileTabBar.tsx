import { LayoutDashboard, Search, Bookmark, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TabId } from "@/types";

type MobileTabBarProps = {
  activeTab: TabId;
  savedCount: number;
  onChange: (tab: TabId) => void;
};

const tabs: Array<{ id: TabId; label: string; Icon: LucideIcon }> = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "search", label: "Search", Icon: Search },
  { id: "saved", label: "Saved", Icon: Bookmark },
  { id: "settings", label: "Settings", Icon: Settings },
];

export function MobileTabBar({ activeTab, savedCount, onChange }: MobileTabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/90 bg-bg-card/95 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur xl:hidden"
      aria-label="Mobile tab navigation"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-1">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          const { Icon } = tab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-[10px] font-medium transition ${
                selected
                  ? "bg-brand-primary/25 text-text-primary shadow-[inset_0_0_0_1px_rgba(14,165,233,0.45)]"
                  : "text-text-secondary hover:bg-bg-elevated/45 hover:text-text-primary"
              }`}
            >
              <Icon size={20} className={selected ? "text-brand-primary" : "text-text-secondary"} />
              <span className="truncate">{tab.label}</span>
              {tab.id === "saved" && savedCount > 0 ? (
                <span className="absolute right-2 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary px-1 text-[9px] font-bold text-slate-900">
                  {savedCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
