import { AIRPORTS, ALL_PROGRAMS, MONTH_OPTIONS, PROGRAM_INFO } from "@/lib/constants";
import { calculateCpp, getDealQuality } from "@/lib/dealScoring";
import type { Airport, CabinClass, Deal, PointsProgram, ProgramOption } from "@/types";

const airportByCode = new Map<string, Airport>(AIRPORTS.map((airport) => [airport.code, airport]));

const usOriginCodes = ["JFK", "LAX", "ORD", "SFO", "MIA", "DFW", "SEA", "BOS", "ATL", "DEN", "IAH", "DCA"];
const destinationCodes = ["NRT", "HND", "LHR", "CDG", "FCO", "BCN", "CUN", "SJO", "HNL", "SYD", "BKK", "ICN", "SIN"];

const routePairs: Array<{ origin: string; destination: string }> = usOriginCodes.flatMap((origin, originIdx) => {
  const first = destinationCodes[originIdx % destinationCodes.length];
  const second = destinationCodes[(originIdx * 3 + 2) % destinationCodes.length];
  const third = destinationCodes[(originIdx * 5 + 4) % destinationCodes.length];
  return [
    { origin, destination: first },
    { origin, destination: second },
    { origin, destination: third },
  ];
});

const airlines = [
  "ANA",
  "Japan Airlines",
  "British Airways",
  "Air France",
  "United",
  "Delta",
  "American",
  "Singapore",
  "Qantas",
  "Korean Air",
  "Lufthansa",
  "ITA Airways",
];

const cabinOptions: CabinClass[] = ["economy", "premium_economy", "business", "first"];

const cabinMultiplier: Record<CabinClass, number> = {
  economy: 86,
  premium_economy: 67,
  business: 50,
  first: 41,
};

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

const longHaulDestinations = new Set(["NRT", "HND", "SYD", "BKK", "ICN", "SIN"]);
const mediumHaulDestinations = new Set(["LHR", "CDG", "FCO", "BCN"]);
const REFERENCE_TIME = Date.UTC(2026, 1, 1, 14, 0, 0);
const VARIANTS_PER_MONTH = 3;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function mustGetAirport(code: string): Airport {
  const airport = airportByCode.get(code);
  if (!airport) throw new Error(`Unknown airport code: ${code}`);
  return airport;
}

function bookingStepsFor(program: PointsProgram, originCode: string, destinationCode: string): string[] {
  return [
    `Open ${PROGRAM_INFO[program].shortName}`,
    `Search ${originCode} to ${destinationCode}`,
    "Pick the best itinerary",
    "Review taxes and fees",
    "Confirm and book",
  ];
}

function pickPrograms(seed: number): PointsProgram[] {
  const count = 2 + (seed % 3);
  const selected: PointsProgram[] = [];
  for (let index = 0; index < ALL_PROGRAMS.length && selected.length < count; index += 1) {
    const candidate = ALL_PROGRAMS[(seed + index * 2) % ALL_PROGRAMS.length];
    if (!selected.includes(candidate)) {
      selected.push(candidate);
    }
  }
  return selected;
}

function baseCashPrice(destinationCode: string, cabin: CabinClass): number {
  const cabinBase: Record<CabinClass, number> = {
    economy: 550,
    premium_economy: 1100,
    business: 2800,
    first: 6200,
  };

  const haulPremium = longHaulDestinations.has(destinationCode)
    ? 650
    : mediumHaulDestinations.has(destinationCode)
      ? 350
      : 120;

  return cabinBase[cabin] + haulPremium;
}

function makeProgramOption(
  program: PointsProgram,
  cashPrice: number,
  cabin: CabinClass,
  seed: number,
  originCode: string,
  destinationCode: string,
): ProgramOption {
  const pointsRequired = clamp(Math.round(cashPrice * cabinMultiplier[cabin] + (seed % 25) * 690), 12000, 220000);
  const taxesFeesUsd = Number((5 + (seed % 16) * 8.5).toFixed(2));
  const centsPerPoint = Number(calculateCpp(cashPrice, pointsRequired).toFixed(2));
  const partners = PROGRAM_INFO[program].transferPartners;
  const transferPartner = partners[seed % partners.length];

  return {
    program,
    pointsRequired,
    taxesFeesUsd,
    centsPerPoint,
    transferPartner,
    bookingSteps: bookingStepsFor(program, originCode, destinationCode),
  };
}

const generatedDeals: Deal[] = [];

routePairs.forEach((route, routeIdx) => {
  MONTH_OPTIONS.forEach((travelMonth, monthIdx) => {
    for (let variant = 0; variant < VARIANTS_PER_MONTH; variant += 1) {
      const seed = routeIdx * 997 + monthIdx * 89 + variant * 13 + 19;
      const cabin = cabinOptions[(seed + routeIdx) % cabinOptions.length];
      const destination = mustGetAirport(route.destination);
      const origin = mustGetAirport(route.origin);
      const cashPrice = baseCashPrice(route.destination, cabin) + (seed % 10) * 45;
      const programs = pickPrograms(seed);
      const programOptions = programs.map((program, optionIdx) =>
        makeProgramOption(program, cashPrice + optionIdx * 95, cabin, seed + optionIdx * 7, origin.code, destination.code),
      );
      const bestCpp = Math.max(...programOptions.map((option) => option.centsPerPoint));

      generatedDeals.push({
        id: `flight_${routeIdx}_${monthIdx}_${variant}`,
        origin,
        destination,
        regionTags: regionMap[destination.code] ?? ["Unknown"],
        programOptions,
        cashPrice,
        cabin,
        airline: airlines[(routeIdx + monthIdx + variant) % airlines.length],
        isNonstop: (seed + monthIdx) % 3 !== 0,
        travelMonth,
        dateStart: `${travelMonth}-${String(4 + (seed % 12)).padStart(2, "0")}`,
        dateEnd: `${travelMonth}-${String(10 + (seed % 14)).padStart(2, "0")}`,
        updatedAt: new Date(REFERENCE_TIME - ((routeIdx + monthIdx * 3 + variant) % 96) * 60 * 60 * 1000).toISOString(),
        bestCpp,
        quality: getDealQuality(bestCpp),
        popularityScore: clamp((seed * 17 + routeIdx * 9 + monthIdx * 5) % 101, 0, 100),
        notes: "Sample flight data generated for product demo and search testing.",
      });
    }
  });
});

export const sampleFlightDeals: Deal[] = generatedDeals;
export const SAMPLE_FLIGHT_COUNT = sampleFlightDeals.length;
