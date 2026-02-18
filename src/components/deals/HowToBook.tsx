import { PROGRAM_INFO } from "@/lib/constants";
import type { ProgramOption } from "@/types";

type HowToBookProps = {
  option: ProgramOption;
};

export function HowToBook({ option }: HowToBookProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">How to book via {PROGRAM_INFO[option.program].shortName}</h3>
      <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-text-primary">
        {(option.bookingSteps ?? []).map((step, index) => (
          <li key={`${option.program}-${index}`}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
