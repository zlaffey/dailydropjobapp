import type { TabId } from "@/types";

type TabNavigationProps = {
  activeTab: TabId;
  savedCount: number;
  onChange: (tab: TabId) => void;
};

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "search", label: "Search" },
  { id: "saved", label: "Saved" },
  { id: "settings", label: "Settings" },
];

export function TabNavigation({ activeTab, savedCount, onChange }: TabNavigationProps) {
  return (
    <nav className="section-card flex flex-wrap gap-2 p-2" aria-label="Primary tabs">
      {tabs.map((tab) => {
        const selected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${selected ? "bg-brand-primary/25 text-text-primary shadow-[inset_0_0_0_1px_rgba(14,165,233,0.45)]" : "text-text-secondary hover:bg-bg-elevated/50 hover:text-text-primary"}`}
          >
            {tab.label}
            {tab.id === "saved" ? (
              <span className="ml-2 rounded-full border border-border bg-bg-card px-2 py-0.5 text-xs">{savedCount}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
