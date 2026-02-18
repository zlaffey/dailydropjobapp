"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/lib/constants";
import type { UserSettings } from "@/types";

function loadInitialSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  const stored = window.localStorage.getItem(STORAGE_KEYS.settings);
  if (!stored) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(stored) as UserSettings;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.settings);
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(loadInitialSettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  function updateSettings(nextValues: Partial<UserSettings>) {
    setSettings((prev) => ({ ...prev, ...nextValues }));
  }

  return { settings, updateSettings };
}
