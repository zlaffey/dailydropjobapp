"use client";

import { useMemo } from "react";
import { DealBadge } from "@/components/deals/DealBadge";
import { PointsComparison } from "@/components/deals/PointsComparison";
import { formatMonthYear, formatTimeAgo } from "@/lib/formatters";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { getBestProgramOption } from "@/lib/dealScoring";
import type { Deal, ExperimentVariant } from "@/types";

type DealCardProps = {
  deal: Deal;
  isSaved?: boolean;
  isBlurred?: boolean;
  experimentVariant?: ExperimentVariant;
  onOpen: (deal: Deal) => void;
  onToggleSave: (deal: Deal) => void;
};

export function DealCard({ deal, isSaved = false, isBlurred = false, experimentVariant, onOpen, onToggleSave }: DealCardProps) {
  const updatedAgo = useMemo(() => formatTimeAgo(new Date(deal.updatedAt).getTime()), [deal.updatedAt]);
  const bestOption = useMemo(() => getBestProgramOption(deal.programOptions), [deal.programOptions]);

  function openCard() {
    if (isBlurred) return;
    onOpen(deal);
  }

  function saveDeal() {
    onToggleSave(deal);
    track("deal_saved", { deal_id: deal.id, experiment_variant: experimentVariant });
  }

  function handleSave(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    saveDeal();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      openCard();
    }
    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveDeal();
    }
  }

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`Open deal ${deal.origin.code} to ${deal.destination.code}`}
      onClick={openCard}
      onKeyDown={onKeyDown}
      className={cn(
        "group rounded-2xl border border-border bg-bg-card p-4 text-left transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary",
        !isBlurred && "hover:-translate-y-0.5 hover:border-brand-primary/50 hover:shadow-[0_0_24px_rgba(14,165,233,0.15)]",
        isBlurred && "pointer-events-none blur-[6px] opacity-70",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <DealBadge quality={deal.quality} />
        <button
          type="button"
          aria-label={isSaved ? "Unsave deal" : "Save deal"}
          onClick={handleSave}
          className={cn(
            "rounded-full border border-border px-2 py-1 text-xs transition",
            isSaved ? "scale-105 bg-brand-primary text-slate-900" : "bg-bg-elevated text-text-secondary hover:text-text-primary",
          )}
        >
          {isSaved ? "♥ Saved" : "♡ Save"}
        </button>
      </header>

      <h3 className="mt-4 text-xl font-semibold">{deal.origin.code} → {deal.destination.code}</h3>
      <p className="text-sm text-text-secondary">{deal.origin.city} → {deal.destination.city}</p>

      <div className="mt-4">
        <PointsComparison options={deal.programOptions.slice(0, 2)} compact />
      </div>

      <p className="mt-4 text-sm text-text-secondary">
        {formatMonthYear(deal.travelMonth)} · {deal.isNonstop ? "Nonstop" : "1 stop"} · {deal.cabin.replace("_", " ")} · {deal.airline}
      </p>
      <p className="mt-1 text-xs text-text-secondary">Updated {updatedAgo}{bestOption ? ` · Best ${bestOption.centsPerPoint.toFixed(2)}¢/pt` : ""}</p>
    </article>
  );
}
