"use client";

type PricingToggleProps = {
  billingCycle: "monthly" | "annual";
  onChange: (cycle: "monthly" | "annual") => void;
};

export function PricingToggle({ billingCycle, onChange }: PricingToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-brand-accent/40 bg-bg-elevated p-1 text-xs">
      <button
        type="button"
        className={`rounded-full px-3 py-1 ${billingCycle === "monthly" ? "bg-brand-accent text-white" : "text-text-secondary"}`}
        onClick={() => onChange("monthly")}
      >
        Monthly $9.99
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-1 ${billingCycle === "annual" ? "bg-brand-accent text-white" : "text-text-secondary"}`}
        onClick={() => onChange("annual")}
      >
        Annual $79.99
      </button>
    </div>
  );
}
