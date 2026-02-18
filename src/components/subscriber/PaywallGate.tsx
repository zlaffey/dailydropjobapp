"use client";

import { useState } from "react";
import { PricingToggle } from "@/components/subscriber/PricingToggle";

type PaywallGateProps = {
  hiddenCount: number;
  onUpgrade: () => void;
};

export function PaywallGate({ hiddenCount, onUpgrade }: PaywallGateProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [upgrading, setUpgrading] = useState(false);

  return (
    <section className="relative rounded-2xl border border-brand-accent/40 bg-gradient-to-b from-transparent to-brand-accent/20 p-5 text-center">
      <h3 className="text-xl font-semibold">Unlock {hiddenCount} more deals with DealDrop Pro</h3>
      <p className="mt-1 text-sm text-text-secondary">Join 12,400+ deal hunters</p>
      <div className="mt-3"><PricingToggle billingCycle={billingCycle} onChange={setBillingCycle} /></div>
      <button
        type="button"
        disabled={upgrading}
        onClick={() => {
          setUpgrading(true);
          window.setTimeout(() => {
            onUpgrade();
            setUpgrading(false);
          }, 500);
        }}
        className="mt-4 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-slate-900"
      >
        {upgrading ? "Success!" : "Start Free Trial"}
      </button>
    </section>
  );
}
