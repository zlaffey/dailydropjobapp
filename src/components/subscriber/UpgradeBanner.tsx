import { Badge } from "@/components/ui/Badge";

type UpgradeBannerProps = {
  isPro: boolean;
  onUpgrade: () => void;
};

export function UpgradeBanner({ isPro, onUpgrade }: UpgradeBannerProps) {
  if (isPro) {
    return (
      <div className="rounded-xl border border-brand-accent/40 bg-brand-accent/20 p-3">
        <Badge variant="pro">Pro Member</Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-brand-accent/40 bg-brand-accent/10 p-3">
      <p className="text-sm">Unlock full results and advanced alerts with Pro.</p>
      <button type="button" onClick={onUpgrade} className="rounded-lg bg-brand-accent px-3 py-1.5 text-sm text-white">
        Upgrade
      </button>
    </div>
  );
}
