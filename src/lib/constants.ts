import type { Airport, PointsProgram, TravelGoal, UserSettings } from "@/types";

export const AIRPORTS: Airport[] = [
  { code: "JFK", city: "New York", name: "John F. Kennedy International" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International" },
  { code: "ORD", city: "Chicago", name: "O'Hare International" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International" },
  { code: "MIA", city: "Miami", name: "Miami International" },
  { code: "DFW", city: "Dallas", name: "Dallas Fort Worth International" },
  { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International" },
  { code: "BOS", city: "Boston", name: "Boston Logan International" },
  { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta International" },
  { code: "DEN", city: "Denver", name: "Denver International" },
  { code: "IAH", city: "Houston", name: "George Bush Intercontinental" },
  { code: "DCA", city: "Washington", name: "Ronald Reagan Washington National" },
  { code: "NRT", city: "Tokyo", name: "Narita International" },
  { code: "HND", city: "Tokyo", name: "Haneda Airport" },
  { code: "LHR", city: "London", name: "Heathrow Airport" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport" },
  { code: "FCO", city: "Rome", name: "Leonardo da Vinci Fiumicino Airport" },
  { code: "BCN", city: "Barcelona", name: "Barcelona El Prat Airport" },
  { code: "CUN", city: "Cancun", name: "Cancun International" },
  { code: "SJO", city: "San Jose", name: "Juan Santamaria International" },
  { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International" },
  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith Airport" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport" },
  { code: "ICN", city: "Seoul", name: "Incheon International" },
  { code: "SIN", city: "Singapore", name: "Changi Airport" },
];

export const PROGRAM_INFO: Record<
  PointsProgram,
  { displayName: string; shortName: string; color: string; transferPartners: string[] }
> = {
  chase_ur: { displayName: "Chase Ultimate Rewards", shortName: "Chase UR", color: "#0ea5e9", transferPartners: ["United", "Air Canada", "ANA"] },
  amex_mr: { displayName: "Amex Membership Rewards", shortName: "Amex MR", color: "#60a5fa", transferPartners: ["Delta", "Air France", "ANA"] },
  capital_one: { displayName: "Capital One Miles", shortName: "Capital One", color: "#3b82f6", transferPartners: ["Air Canada", "Turkish", "Qantas"] },
  citi_ty: { displayName: "Citi ThankYou", shortName: "Citi TY", color: "#64748b", transferPartners: ["JetBlue", "Qatar", "Etihad"] },
  united: { displayName: "United MileagePlus", shortName: "United", color: "#2563eb", transferPartners: ["Star Alliance"] },
  delta: { displayName: "Delta SkyMiles", shortName: "Delta", color: "#1d4ed8", transferPartners: ["SkyTeam"] },
  american: { displayName: "American AAdvantage", shortName: "American", color: "#475569", transferPartners: ["oneworld"] },
};

export const CPP_THRESHOLDS = { great: 1.8, good: 1.3 } as const;

export const CACHE_TTL_MS = 15 * 60 * 1000;
export const SIMULATED_DELAY_MS = { min: 400, max: 900 } as const;
export const SIMULATED_ERROR_RATE = 0.05;

const monthFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", timeZone: "UTC" });

export const MONTH_OPTIONS = Array.from({ length: 12 }).map((_, idx) => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + idx);
  const parts = monthFormatter.formatToParts(d);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return `${year}-${month}`;
});

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: "Sarah",
  homeAirports: [AIRPORTS.find((airport) => airport.code === "JFK")!],
  preferredPrograms: ["chase_ur", "amex_mr"],
  cabinPreference: "economy",
  travelStyle: "comfort",
  dateFlexibility: "flexible",
  pointsBalances: {
    chase_ur: 82400,
    amex_mr: 45000,
    capital_one: 23000,
  },
  isPro: false,
};

export const DEFAULT_TRAVEL_GOAL: TravelGoal = {
  id: "goal_japan",
  name: "Japan Trip",
  program: "chase_ur",
  targetPoints: 80000,
  notes: "Aim for business class redemption in spring.",
};

export const ALL_PROGRAMS = Object.keys(PROGRAM_INFO) as PointsProgram[];

export const STORAGE_KEYS = {
  settings: "dealdrop_settings",
  savedDeals: "dealdrop_saved_deals",
  recentlyViewed: "dealdrop_recently_viewed",
  cache: "dealdrop_search_cache",
} as const;
