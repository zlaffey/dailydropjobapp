import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Footer } from "@/components/layout/Footer";
import type { Experiment, TabId, UserSettings } from "@/types";

type AppShellProps = {
  settings: UserSettings;
  activeTab: TabId;
  savedCount: number;
  experiment: Experiment;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
};

export function AppShell({ settings, activeTab, savedCount, experiment, onTabChange, children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        <Header settings={settings} />
        <TabNavigation activeTab={activeTab} savedCount={savedCount} onChange={onTabChange} />
        {children}
        <Footer experiment={experiment} />
      </section>
    </main>
  );
}
