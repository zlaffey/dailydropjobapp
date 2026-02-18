"use client";

import { useMemo, useState } from "react";
import { AIRPORTS } from "@/lib/constants";

type AirportAutocompleteProps = {
  label: string;
  value: string;
  includeAnywhere?: boolean;
  onChange: (code: string) => void;
};

export function AirportAutocomplete({ label, value, includeAnywhere = false, onChange }: AirportAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value);
  const listboxId = `${label.toLowerCase().replace(/\s+/g, "-")}-suggestions`;

  const suggestions = useMemo(() => {
    const normalized = input.trim().toLowerCase();
    const airportMatches = AIRPORTS.filter(
      (airport) =>
        airport.code.toLowerCase().includes(normalized) ||
        airport.city.toLowerCase().includes(normalized) ||
        airport.name.toLowerCase().includes(normalized),
    ).slice(0, 5);

    if (includeAnywhere && "anywhere".includes(normalized)) {
      return [{ code: "ANYWHERE", city: "Anywhere", name: "Wildcard" }, ...airportMatches];
    }

    return airportMatches;
  }, [includeAnywhere, input]);

  return (
    <label className="relative block text-xs text-text-secondary">
      <span className="mb-1 block">{label}</span>
      <input
        value={input}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onChange={(event) => {
          const next = event.target.value.toUpperCase();
          setInput(next);
          onChange(next);
        }}
        className="w-full rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary"
        aria-autocomplete="list"
        aria-controls={listboxId}
        role="combobox"
        aria-expanded={open}
      />
      {open && suggestions.length > 0 ? (
        <ul id={listboxId} role="listbox" className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-bg-card p-1 shadow-xl">
          {suggestions.map((airport) => (
            <li key={airport.code}>
              <button
                type="button"
                className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-bg-elevated"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setInput(airport.code);
                  onChange(airport.code);
                  setOpen(false);
                }}
              >
                {airport.code} · {airport.city}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </label>
  );
}
