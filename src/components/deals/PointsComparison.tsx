import { formatCpp, formatCurrency, formatPoints } from "@/lib/formatters";
import { getBestProgramOption } from "@/lib/dealScoring";
import { PROGRAM_INFO } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { ProgramOption } from "@/types";

type PointsComparisonProps = {
  options: ProgramOption[];
  compact?: boolean;
};

export function PointsComparison({ options, compact = false }: PointsComparisonProps) {
  const best = getBestProgramOption(options);

  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1") }>
      {options.map((option) => {
        const info = PROGRAM_INFO[option.program];
        const isBest = best?.program === option.program;

        return (
          <div key={`${option.program}-${option.pointsRequired}`} className={cn("rounded-xl border p-3", isBest ? "border-brand-primary/50 bg-brand-primary/10" : "border-border bg-bg-card/60")}>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>{info.shortName}</span>
              {isBest ? <span className="text-brand-primary">✦ Best</span> : null}
            </div>
            <p className="mt-1 text-sm font-semibold">{formatPoints(option.pointsRequired)}</p>
            <p className="text-xs text-text-secondary">+ {formatCurrency(option.taxesFeesUsd)} fees</p>
            <p className="mt-1 text-xs text-text-primary">{formatCpp(option.centsPerPoint)}</p>
          </div>
        );
      })}
    </div>
  );
}
