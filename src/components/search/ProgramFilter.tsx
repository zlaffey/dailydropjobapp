import { Chip } from "@/components/ui/Chip";
import { ALL_PROGRAMS, PROGRAM_INFO } from "@/lib/constants";
import type { PointsProgram } from "@/types";

type ProgramFilterProps = {
  value: PointsProgram[];
  onChange: (value: PointsProgram[]) => void;
};

export function ProgramFilter({ value, onChange }: ProgramFilterProps) {
  function toggleProgram(program: PointsProgram) {
    if (value.includes(program)) {
      onChange(value.filter((item) => item !== program));
      return;
    }
    onChange([...value, program]);
  }

  return (
    <div>
      <p className="mb-1 text-xs text-text-secondary">Programs</p>
      <div className="flex flex-wrap gap-2">
        <Chip label="All" selected={value.length === 0} onClick={() => onChange([])} />
        {ALL_PROGRAMS.map((program) => (
          <Chip key={program} label={PROGRAM_INFO[program].shortName} selected={value.includes(program)} onClick={() => toggleProgram(program)} />
        ))}
      </div>
    </div>
  );
}
