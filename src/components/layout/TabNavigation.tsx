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
    <nav className="flex flex-wrap gap-2" aria-label="Primary tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-full border px-3 py-1.5 text-sm ${activeTab === tab.id ? "border-brand-primary bg-brand-primary/20" : "border-border"}`}
        >
          {tab.label}
          {tab.id === "saved" ? ` (${savedCount})` : ""}
        </button>
      ))}
    </nav>
  );
}
