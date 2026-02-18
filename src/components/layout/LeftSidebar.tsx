import { LayoutDashboard, Search, Bookmark, Settings, Plane, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TabId } from "@/types";

type LeftSidebarProps = {
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

export function LeftSidebar({ activeTab, savedCount, onChange }: LeftSidebarProps) {
  return (
    <aside className="section-card flex h-full flex-col p-3">
      <div className="rounded-xl border border-border/80 bg-bg-elevated/35 px-3 py-3">
        <div className="flex items-center gap-2">
          <Plane size={18} className="text-brand-primary" />
          <p className="text-lg font-semibold tracking-tight">DealDrop</p>
        </div>
        <p className="mt-1 text-xs text-text-secondary">Intelligence Desk</p>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1.5" aria-label="Primary navigation">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          const { Icon } = tab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                selected
                  ? "bg-brand-primary/20 text-text-primary shadow-[inset_0_0_0_1px_rgba(14,165,233,0.45)]"
                  : "text-text-secondary hover:bg-bg-elevated/45 hover:text-text-primary"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} className={selected ? "text-brand-primary" : "text-text-secondary"} />
                {tab.label}
              </span>
              {tab.id === "saved" ? (
                <span className="rounded-full border border-border bg-bg-card px-2 py-0.5 text-[11px]">{savedCount}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="flex items-center gap-2 rounded-xl border border-border/80 bg-bg-elevated/30 px-3 py-2 text-left text-sm text-text-secondary transition hover:text-text-primary"
      >
        <LogOut size={14} />
        Logout
      </button>
    </aside>
  );
}
