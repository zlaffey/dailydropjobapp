import { PROGRAM_INFO } from "@/lib/constants";
import type { PointsProgram } from "@/types";

type PointsBalanceCardProps = {
  program: PointsProgram;
  balance: number;
  onClick: (program: PointsProgram) => void;
};

export function PointsBalanceCard({ program, balance, onClick }: PointsBalanceCardProps) {
  const info = PROGRAM_INFO[program];

  return (
    <button
      type="button"
      onClick={() => onClick(program)}
      className="w-full rounded-xl border border-border bg-bg-card p-3 text-left hover:border-brand-primary/40"
    >
      <p className="text-xs text-text-secondary">{info.shortName}</p>
      <p className="mt-1 text-lg font-semibold" style={{ color: info.color }}>
        {balance.toLocaleString()} pts
      </p>
    </button>
  );
}
