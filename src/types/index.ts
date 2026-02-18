export type PointsProgram =
  | "chase_ur"
  | "amex_mr"
  | "capital_one"
  | "citi_ty"
  | "united"
  | "delta"
  | "american";

export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export type DealQuality = "great" | "good" | "fair";

export interface Airport {
  code: string;
  city: string;
  name: string;
}

export interface ProgramOption {
  program: PointsProgram;
  pointsRequired: number;
  taxesFeesUsd: number;
  centsPerPoint: number;
  transferPartner?: string;
  bookingSteps?: string[];
}

export interface Deal {
  id: string;
  origin: Airport;
  destination: Airport;
  regionTags: string[];
  programOptions: ProgramOption[];
  cashPrice: number;
  cabin: CabinClass;
  airline: string;
  isNonstop: boolean;
  travelMonth: string;
  dateStart?: string;
  dateEnd?: string;
  updatedAt: string;
  bestCpp: number;
  quality: DealQuality;
  popularityScore: number;
  notes?: string;
}

export interface UserSettings {
  displayName: string;
  homeAirports: Airport[];
  preferredPrograms: PointsProgram[];
  cabinPreference: CabinClass;
  travelStyle: "budget" | "comfort" | "luxury";
  dateFlexibility: "fixed" | "flexible";
  pointsBalances: Partial<Record<PointsProgram, number>>;
  isPro?: boolean;
}

export interface SavedDeal {
  id: string;
  savedAt: string;
  deal: Deal;
}

export interface TravelGoal {
  id: string;
  name: string;
  program: PointsProgram;
  targetPoints: number;
  notes?: string;
}

export type SortOption = "best_value" | "lowest_points" | "lowest_cash" | "soonest" | "popularity";

export interface SearchState {
  origin: string;
  destination: string;
  months: string[];
  programs: PointsProgram[];
  cabin: CabinClass | "all";
  maxPoints: number;
  minCpp: number;
  nonstopOnly: boolean;
  dealQuality: DealQuality | "all";
  sortBy: SortOption;
}

export interface CacheEntry {
  key: string;
  results: Deal[];
  timestamp: number;
  ttl: number;
}

export interface SearchResponse {
  deals: Deal[];
  cacheStatus: "fresh" | "cached";
  cachedAt?: number;
  totalCount: number;
}

export type TabId = "dashboard" | "search" | "saved" | "settings";

export type EventName =
  | "search_requested"
  | "search_completed"
  | "search_failed"
  | "cache_hit"
  | "cache_refresh"
  | "deal_opened"
  | "deal_saved"
  | "experiment_assigned"
  | "upgraded_to_pro";

export type ExperimentVariant = "A" | "B";

export interface Experiment {
  name: string;
  variants: Record<ExperimentVariant, "best_value" | "lowest_points">;
  assignment: ExperimentVariant;
}
