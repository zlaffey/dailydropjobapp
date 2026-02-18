import type { Deal, UserSettings } from "@/types";

export function scoreRecommendation(deal: Deal, settings: UserSettings): number {
  let score = 0;

  if (settings.homeAirports.some((airport) => airport.code === deal.origin.code)) {
    score += 40;
  }

  const dealPrograms = deal.programOptions.map((option) => option.program);
  if (dealPrograms.some((program) => settings.preferredPrograms.includes(program))) {
    score += 20;
  }

  if (deal.cabin === settings.cabinPreference) {
    score += 15;
  }

  if (deal.isNonstop) {
    score += 10;
  }

  score += Math.round((deal.popularityScore / 100) * 15);
  return score;
}
