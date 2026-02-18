"use client";

import { useMemo } from "react";
import { getExperiment } from "@/lib/experiment";

export function useExperiment(name = "default_sort_order") {
  return useMemo(() => getExperiment(name), [name]);
}
