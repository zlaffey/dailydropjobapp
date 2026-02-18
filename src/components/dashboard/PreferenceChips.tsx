import { PROGRAM_INFO } from "@/lib/constants";
import { Chip } from "@/components/ui/Chip";
import type { UserSettings } from "@/types";

type PreferenceChipsProps = {
  settings: UserSettings;
  onOpenSettings: () => void;
};

export function PreferenceChips({ settings, onOpenSettings }: PreferenceChipsProps) {
  return (
    <section className="section-card px-5 py-4">
      <p className="section-subtitle">Preferences</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {settings.homeAirports.map((airport) => (
          <Chip key={airport.code} label={airport.code} selected />
        ))}
        {settings.preferredPrograms.map((program) => (
          <Chip key={program} label={PROGRAM_INFO[program].shortName} selected />
        ))}
        <Chip label={settings.cabinPreference.replace("_", " ")} selected />
      </div>
      <button type="button" onClick={onOpenSettings} className="mt-4 text-sm text-brand-primary underline underline-offset-2">
        Edit preferences →
      </button>
    </section>
  );
}
