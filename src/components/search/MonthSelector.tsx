import { MONTH_OPTIONS } from "@/lib/constants";
import { formatMonthYear } from "@/lib/formatters";
import { Chip } from "@/components/ui/Chip";

type MonthSelectorProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  function toggleMonth(month: string) {
    if (value.includes(month)) {
      onChange(value.filter((item) => item !== month));
      return;
    }
    onChange([...value, month]);
  }

  return (
    <div>
      <p className="mb-1 text-xs text-text-secondary">Months</p>
      <div className="flex flex-wrap gap-2">
        {MONTH_OPTIONS.slice(0, 6).map((month) => (
          <Chip key={month} label={formatMonthYear(month)} selected={value.includes(month)} onClick={() => toggleMonth(month)} />
        ))}
      </div>
    </div>
  );
}
