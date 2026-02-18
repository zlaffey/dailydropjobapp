"use client";

import { AIRPORTS, ALL_PROGRAMS, PROGRAM_INFO } from "@/lib/constants";
import type { CabinClass, PointsProgram, UserSettings } from "@/types";

type SettingsFormProps = {
  settings: UserSettings;
  onChange: (updates: Partial<UserSettings>) => void;
};

const cabinOptions: CabinClass[] = ["economy", "premium_economy", "business", "first"];

export function SettingsForm({ settings, onChange }: SettingsFormProps) {
  function toggleAirport(code: string) {
    const airport = AIRPORTS.find((item) => item.code === code);
    if (!airport) return;

    const exists = settings.homeAirports.some((item) => item.code === code);
    if (exists) {
      onChange({ homeAirports: settings.homeAirports.filter((item) => item.code !== code) });
      return;
    }

    onChange({ homeAirports: [...settings.homeAirports, airport] });
  }

  function toggleProgram(program: PointsProgram) {
    const exists = settings.preferredPrograms.includes(program);
    if (exists) {
      onChange({ preferredPrograms: settings.preferredPrograms.filter((item) => item !== program) });
      return;
    }
    onChange({ preferredPrograms: [...settings.preferredPrograms, program] });
  }

  function updatePointsBalance(program: PointsProgram, value: string) {
    const parsed = Number(value || 0);
    onChange({
      pointsBalances: {
        ...settings.pointsBalances,
        [program]: Number.isFinite(parsed) ? parsed : 0,
      },
    });
  }

  return (
    <form className="space-y-5 rounded-2xl border border-border bg-bg-card p-4" onSubmit={(event) => event.preventDefault()}>
      <label className="block text-sm">
        <span className="mb-1 block text-text-secondary">Display name</span>
        <input
          value={settings.displayName}
          onChange={(event) => onChange({ displayName: event.target.value })}
          className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2"
        />
      </label>

      <fieldset>
        <legend className="text-sm text-text-secondary">Home airports</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {AIRPORTS.slice(0, 15).map((airport) => (
            <label key={airport.code} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs">
              <input
                type="checkbox"
                checked={settings.homeAirports.some((item) => item.code === airport.code)}
                onChange={() => toggleAirport(airport.code)}
              />
              {airport.code}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm text-text-secondary">Preferred programs</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ALL_PROGRAMS.map((program) => (
            <label key={program} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.preferredPrograms.includes(program)}
                onChange={() => toggleProgram(program)}
              />
              {PROGRAM_INFO[program].shortName}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm text-text-secondary">Cabin preference</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {cabinOptions.map((cabin) => (
            <label key={cabin} className="inline-flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="cabinPreference"
                checked={settings.cabinPreference === cabin}
                onChange={() => onChange({ cabinPreference: cabin })}
              />
              {cabin.replace("_", " ")}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm text-text-secondary">Travel style</legend>
        <div className="mt-2 flex gap-3">
          {(["budget", "comfort", "luxury"] as const).map((style) => (
            <label key={style} className="inline-flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="travelStyle"
                checked={settings.travelStyle === style}
                onChange={() => onChange({ travelStyle: style })}
              />
              {style}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={settings.dateFlexibility === "flexible"}
          onChange={(event) => onChange({ dateFlexibility: event.target.checked ? "flexible" : "fixed" })}
        />
        Flexible dates
      </label>

      <fieldset>
        <legend className="text-sm text-text-secondary">Points balances</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ALL_PROGRAMS.map((program) => (
            <label key={program} className="text-xs">
              <span className="mb-1 block text-text-secondary">{PROGRAM_INFO[program].shortName}</span>
              <input
                type="number"
                value={settings.pointsBalances[program] ?? 0}
                onChange={(event) => updatePointsBalance(program, event.target.value)}
                className="w-full rounded-lg border border-border bg-bg-elevated px-2 py-1 text-sm"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm text-text-secondary">Notifications (mock)</legend>
        <div className="mt-2 space-y-1 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked /> New deal alerts</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked /> Weekly digest</label>
        </div>
      </fieldset>
    </form>
  );
}
