type RangeSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formatter?: (value: number) => string;
  onChange: (value: number) => void;
};

export function RangeSlider({ label, value, min, max, step = 1, formatter = String, onChange }: RangeSliderProps) {
  return (
    <label className="block text-xs text-text-secondary">
      <span className="mb-1 block">{label}: <strong className="text-text-primary">{formatter(value)}</strong></span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-bg-elevated"
      />
    </label>
  );
}
