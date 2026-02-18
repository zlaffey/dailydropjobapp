"use client";

import { useEffect, useMemo, useState } from "react";
import { mockDeals } from "@/data/mockDeals";
import { DEFAULT_SEARCH_STATE, searchDeals } from "@/services/dealService";

export default function Home() {
  const [message, setMessage] = useState("Booting DealDrop data layer...");

  const totalDeals = useMemo(() => mockDeals.length, []);

  useEffect(() => {
    async function run() {
      try {
        const response = await searchDeals({
          ...DEFAULT_SEARCH_STATE,
          months: [],
        });

        // Phase-1 smoke check for cache + search wiring.
        console.log("Deal count:", mockDeals.length);
        console.log("Search response:", response);

        setMessage(`Loaded ${response.totalCount} deals (${response.cacheStatus} fetch).`);
      } catch (error) {
        setMessage("Search failed in smoke test.");
      }
    }

    run();
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-6">
        <h1 className="text-3xl font-bold">DealDrop</h1>
        <p className="text-text-secondary">Phase 1 foundation is wired and running.</p>
        <div className="rounded-xl border border-border bg-bg-card p-5">
          <p className="text-sm text-text-secondary">Mock deals available</p>
          <p className="text-2xl font-semibold">{totalDeals}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-elevated p-4 text-sm">{message}</div>
      </section>
    </main>
  );
}
