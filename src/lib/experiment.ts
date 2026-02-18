import type { Experiment, SortOption } from "@/types";
import { track } from "@/lib/analytics";

const DEFAULT_VARIANTS = {
  A: "best_value",
  B: "lowest_points",
} as const;

function safeStorageGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function safeStorageSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export function getExperiment(name: string): Experiment {
  const storageKey = `experiment_${name}`;
  const stored = safeStorageGet(storageKey);

  if (stored) {
    try {
      return JSON.parse(stored) as Experiment;
    } catch {
      // Continue to reassign if parsing failed.
    }
  }

  const assignment = Math.random() < 0.5 ? "A" : "B";
  const experiment: Experiment = {
    name,
    variants: DEFAULT_VARIANTS,
    assignment,
  };

  safeStorageSet(storageKey, JSON.stringify(experiment));
  track("experiment_assigned", { experiment_name: name, variant: assignment });
  return experiment;
}

export function getDefaultSortFromExperiment(name = "default_sort_order"): SortOption {
  const experiment = getExperiment(name);
  return experiment.variants[experiment.assignment];
}
