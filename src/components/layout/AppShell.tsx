import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Footer } from "@/components/layout/Footer";
import type { Experiment, TabId, UserSettings } from "@/types";

type AppShellProps = {
  settings: UserSettings;
  activeTab: TabId;
  savedCount: number;
  experiment: Experiment;
  onTabChange: (tab: TabId) => void;
  rightRail: ReactNode;
  children: ReactNode;
};

export function AppShell({ settings, activeTab, savedCount, experiment, onTabChange, rightRail, children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary xl:h-[100dvh] xl:overflow-hidden">
      <section className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 xl:h-full xl:px-5 xl:py-5">
        <div className="grid gap-4 xl:h-full xl:grid-cols-[240px_minmax(0,1fr)_320px]">
          <div className="hidden xl:block xl:h-full">
            <LeftSidebar activeTab={activeTab} savedCount={savedCount} onChange={onTabChange} />
          </div>

          <section className="min-w-0 space-y-5 pb-20 xl:h-full xl:overflow-y-auto xl:overscroll-contain xl:pb-0 xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
            <Header settings={settings} />
            <div className="animate-stagger space-y-5">{children}</div>
            <Footer experiment={experiment} />
          </section>

          <aside className="hidden xl:block xl:h-full">{rightRail}</aside>
        </div>

        <aside className="mt-4 hidden md:block xl:hidden">{rightRail}</aside>
      </section>

      <MobileTabBar activeTab={activeTab} savedCount={savedCount} onChange={onTabChange} />
    </main>
  );
}
