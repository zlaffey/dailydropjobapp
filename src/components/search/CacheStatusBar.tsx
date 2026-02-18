"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/formatters";

type CacheStatusBarProps = {
  cacheStatus: "fresh" | "cached";
  cachedAt?: number;
  onRefresh: () => void;
};

export function CacheStatusBar({ cacheStatus, cachedAt, onRefresh }: CacheStatusBarProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => setTick((value) => value + 1), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const detail = cacheStatus === "cached" && cachedAt ? `Updated ${formatTimeAgo(cachedAt)}` : "Fresh results";

  return (
    <div key={tick} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-surface-cache bg-surface-cache/25 px-3 py-2 text-xs text-sky-100">
      <span>Showing {cacheStatus} results · {detail}</span>
      <button type="button" className="rounded-md border border-sky-200/40 px-2 py-1 hover:rotate-12" onClick={onRefresh}>
        Refresh
      </button>
    </div>
  );
}
