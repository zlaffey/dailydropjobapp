import { CPP_THRESHOLDS } from "@/lib/constants";
import type { DealQuality, ProgramOption } from "@/types";

export function calculateCpp(cashPriceUsd: number, pointsRequired: number): number {
  if (pointsRequired <= 0) return 0;
  return (cashPriceUsd * 100) / pointsRequired;
}

export function getDealQuality(cpp: number): DealQuality {
  if (cpp >= CPP_THRESHOLDS.great) return "great";
  if (cpp >= CPP_THRESHOLDS.good) return "good";
  return "fair";
}

export function getBestProgramOption(options: ProgramOption[]): ProgramOption | null {
  if (!options.length) return null;
  return options.reduce((best, option) => {
    if (option.centsPerPoint > best.centsPerPoint) return option;
    if (option.centsPerPoint === best.centsPerPoint && option.pointsRequired < best.pointsRequired) return option;
    return best;
  }, options[0]);
}
