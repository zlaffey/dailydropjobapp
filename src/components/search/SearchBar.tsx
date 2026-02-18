import { AirportAutocomplete } from "@/components/search/AirportAutocomplete";
import { MonthSelector } from "@/components/search/MonthSelector";
import { ProgramFilter } from "@/components/search/ProgramFilter";
import { CabinSelector } from "@/components/search/CabinSelector";
import type { SearchState } from "@/types";

type SearchBarProps = {
  searchState: SearchState;
  onChange: (state: Partial<SearchState>) => void;
};

export function SearchBar({ searchState, onChange }: SearchBarProps) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <AirportAutocomplete label="Origin" value={searchState.origin} onChange={(value) => onChange({ origin: value })} />
        <AirportAutocomplete label="Destination" includeAnywhere value={searchState.destination} onChange={(value) => onChange({ destination: value })} />
      </div>

      <MonthSelector value={searchState.months} onChange={(value) => onChange({ months: value })} />
      <ProgramFilter value={searchState.programs} onChange={(value) => onChange({ programs: value })} />
      <CabinSelector value={searchState.cabin} onChange={(value) => onChange({ cabin: value })} />
    </section>
  );
}
