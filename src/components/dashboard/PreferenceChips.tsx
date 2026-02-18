import { PROGRAM_INFO } from "@/lib/constants";
import { Chip } from "@/components/ui/Chip";
import type { UserSettings } from "@/types";

type PreferenceChipsProps = {
  settings: UserSettings;
  onOpenSettings: () => void;
};

export function PreferenceChips({ settings, onOpenSettings }: PreferenceChipsProps) {
  return (
    <section className="rounded-2xl border border-border bg-bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        {settings.homeAirports.map((airport) => (
          <Chip key={airport.code} label={airport.code} selected />
        ))}
        {settings.preferredPrograms.map((program) => (
          <Chip key={program} label={PROGRAM_INFO[program].shortName} selected />
        ))}
        <Chip label={settings.cabinPreference.replace("_", " ")} selected />
      </div>
      <button type="button" onClick={onOpenSettings} className="mt-3 text-sm text-brand-primary underline">
        Edit preferences →
      </button>
    </section>
  );
}
