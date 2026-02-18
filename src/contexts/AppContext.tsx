"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Deal, TabId } from "@/types";
import { useSettings } from "@/hooks/useSettings";
import { useSavedDeals } from "@/hooks/useSavedDeals";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const validTabs: TabId[] = ["dashboard", "search", "saved", "settings"];

function readInitialTab(): TabId {
  if (typeof window === "undefined") return "dashboard";
  const hash = window.location.hash.replace("#", "") as TabId;
  return validTabs.includes(hash) ? hash : "dashboard";
}

type AppContextValue = {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedDeal: Deal | null;
  setSelectedDeal: (deal: Deal | null) => void;
  settings: ReturnType<typeof useSettings>["settings"];
  updateSettings: ReturnType<typeof useSettings>["updateSettings"];
  savedDeals: ReturnType<typeof useSavedDeals>["savedDeals"];
  savedDealIds: ReturnType<typeof useSavedDeals>["savedDealIds"];
  toggleSavedDeal: ReturnType<typeof useSavedDeals>["toggleSavedDeal"];
  removeSavedDeal: ReturnType<typeof useSavedDeals>["removeSavedDeal"];
  recentlyViewedDealIds: string[];
  addRecentlyViewedDealId: (dealId: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>(readInitialTab);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const { settings, updateSettings } = useSettings();
  const { savedDeals, savedDealIds, toggleSavedDeal, removeSavedDeal } = useSavedDeals();
  const { recentlyViewedDealIds, addRecentlyViewedDealId } = useRecentlyViewed();

  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      selectedDeal,
      setSelectedDeal,
      settings,
      updateSettings,
      savedDeals,
      savedDealIds,
      toggleSavedDeal,
      removeSavedDeal,
      recentlyViewedDealIds,
      addRecentlyViewedDealId,
    }),
    [
      activeTab,
      selectedDeal,
      settings,
      updateSettings,
      savedDeals,
      savedDealIds,
      toggleSavedDeal,
      removeSavedDeal,
      recentlyViewedDealIds,
      addRecentlyViewedDealId,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
