import { AIRPORTS, ALL_PROGRAMS, MONTH_OPTIONS, PROGRAM_INFO } from "@/lib/constants";
import { calculateCpp, getDealQuality } from "@/lib/dealScoring";
import type { Airport, CabinClass, Deal, PointsProgram, ProgramOption } from "@/types";

const byCode = new Map<string, Airport>(AIRPORTS.map((airport) => [airport.code, airport]));

const routeTemplates: Array<{
  origin: string;
  destination: string;
  cabin: CabinClass;
  cashPrice: number;
  airline: string;
  isNonstop: boolean;
}> = [
  { origin: "JFK", destination: "NRT", cabin: "business", cashPrice: 4200, airline: "ANA", isNonstop: true },
  { origin: "JFK", destination: "LHR", cabin: "business", cashPrice: 3300, airline: "British Airways", isNonstop: true },
  { origin: "LAX", destination: "HND", cabin: "premium_economy", cashPrice: 1800, airline: "Japan Airlines", isNonstop: true },
  { origin: "SFO", destination: "CDG", cabin: "economy", cashPrice: 980, airline: "Air France", isNonstop: false },
  { origin: "MIA", destination: "FCO", cabin: "business", cashPrice: 3100, airline: "ITA Airways", isNonstop: false },
  { origin: "DFW", destination: "BCN", cabin: "premium_economy", cashPrice: 1700, airline: "American", isNonstop: false },
  { origin: "SEA", destination: "ICN", cabin: "business", cashPrice: 3600, airline: "Korean Air", isNonstop: true },
  { origin: "BOS", destination: "SIN", cabin: "first", cashPrice: 9200, airline: "Singapore", isNonstop: false },
  { origin: "ATL", destination: "CUN", cabin: "economy", cashPrice: 520, airline: "Delta", isNonstop: true },
  { origin: "DEN", destination: "SJO", cabin: "economy", cashPrice: 640, airline: "United", isNonstop: true },
  { origin: "IAH", destination: "BKK", cabin: "business", cashPrice: 3900, airline: "EVA Air", isNonstop: false },
  { origin: "ORD", destination: "SYD", cabin: "business", cashPrice: 5100, airline: "Qantas", isNonstop: false },
  { origin: "DCA", destination: "HNL", cabin: "premium_economy", cashPrice: 1200, airline: "United", isNonstop: false },
  { origin: "LAX", destination: "CUN", cabin: "economy", cashPrice: 430, airline: "Alaska", isNonstop: true },
  { origin: "SFO", destination: "HND", cabin: "first", cashPrice: 11000, airline: "ANA", isNonstop: true },
  { origin: "MIA", destination: "LHR", cabin: "premium_economy", cashPrice: 1400, airline: "Virgin Atlantic", isNonstop: true },
  { origin: "SEA", destination: "NRT", cabin: "economy", cashPrice: 970, airline: "Delta", isNonstop: true },
  { origin: "BOS", destination: "CDG", cabin: "business", cashPrice: 2700, airline: "Delta", isNonstop: true },
  { origin: "ATL", destination: "SIN", cabin: "first", cashPrice: 13000, airline: "Singapore", isNonstop: false },
  { origin: "ORD", destination: "FCO", cabin: "economy", cashPrice: 880, airline: "United", isNonstop: false },
];

const regionMap: Record<string, string[]> = {
  NRT: ["Asia", "East Asia"],
  HND: ["Asia", "East Asia"],
  LHR: ["Europe", "Western Europe"],
  CDG: ["Europe", "Western Europe"],
  FCO: ["Europe", "Southern Europe"],
  BCN: ["Europe", "Southern Europe"],
  CUN: ["North America", "Caribbean"],
  SJO: ["Central America"],
  HNL: ["North America", "Pacific"],
  SYD: ["Oceania"],
  BKK: ["Asia", "Southeast Asia"],
  ICN: ["Asia", "East Asia"],
  SIN: ["Asia", "Southeast Asia"],
};

const pointsMultiplierByCabin: Record<CabinClass, number> = {
  economy: 80,
  premium_economy: 62,
  business: 48,
  first: 42,
};

function clamp(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, num));
}

function pickPrograms(seed: number): PointsProgram[] {
  const count = 2 + (seed % 3);
  const choices: PointsProgram[] = [];
  for (let i = 0; i < ALL_PROGRAMS.length && choices.length < count; i += 1) {
    const idx = (seed + i * 2) % ALL_PROGRAMS.length;
    const candidate = ALL_PROGRAMS[idx];
    if (!choices.includes(candidate)) choices.push(candidate);
  }
  return choices;
}

function makeBookingSteps(program: PointsProgram, originCode: string, destinationCode: string): string[] {
  const programLabel = PROGRAM_INFO[program].shortName;
  return [
    `Log in to ${programLabel}`,
    `Search for ${originCode} to ${destinationCode}`,
    "Select the best itinerary",
    "Confirm taxes and fees",
    "Complete redemption",
  ];
}

function makeProgramOption(cashPrice: number, cabin: CabinClass, seed: number, program: PointsProgram): ProgramOption {
  const cabinFactor = pointsMultiplierByCabin[cabin];
  const basePoints = Math.round(cashPrice * cabinFactor + (seed % 9) * 1800);
  const adjustedPoints = clamp(basePoints, 15000, 180000);
  const taxesFeesUsd = Number((5 + (seed % 20) * 7.5).toFixed(2));
  const centsPerPoint = Number(calculateCpp(cashPrice, adjustedPoints).toFixed(2));

  return {
    program,
    pointsRequired: adjustedPoints,
    taxesFeesUsd,
    centsPerPoint,
    transferPartner: PROGRAM_INFO[program].transferPartners[seed % PROGRAM_INFO[program].transferPartners.length],
    bookingSteps: makeBookingSteps(program, "", ""),
  };
}

function monthForIndex(index: number): string {
  return MONTH_OPTIONS[index % MONTH_OPTIONS.length];
}

const allDeals: Deal[] = [];

for (let idx = 0; idx < 60; idx += 1) {
  const template = routeTemplates[idx % routeTemplates.length];
  const seed = idx + 11;
  const origin = byCode.get(template.origin)!;
  const destination = byCode.get(template.destination)!;
  const travelMonth = monthForIndex(idx);
  const programs = pickPrograms(seed);

  const programOptions = programs.map((program, optionIdx) => {
    const option = makeProgramOption(template.cashPrice + optionIdx * 120, template.cabin, seed + optionIdx * 3, program);
    return {
      ...option,
      bookingSteps: makeBookingSteps(program, origin.code, destination.code),
    };
  });

  const bestCpp = Math.max(...programOptions.map((option) => option.centsPerPoint));

  allDeals.push({
    id: `deal_${idx + 1}`,
    origin,
    destination,
    regionTags: regionMap[destination.code] ?? ["Unknown"],
    programOptions,
    cashPrice: template.cashPrice + (seed % 5) * 150,
    cabin: template.cabin,
    airline: template.airline,
    isNonstop: template.isNonstop,
    travelMonth,
    dateStart: `${travelMonth}-05`,
    dateEnd: `${travelMonth}-18`,
    updatedAt: new Date(Date.now() - (idx % 36) * 60 * 60 * 1000).toISOString(),
    bestCpp,
    quality: getDealQuality(bestCpp),
    popularityScore: clamp((seed * 17) % 101, 0, 100),
    notes: "Inventory and price are simulated for portfolio demo purposes.",
  });
}

export const mockDeals: Deal[] = allDeals;
