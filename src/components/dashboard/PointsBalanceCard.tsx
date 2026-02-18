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
      className="section-card w-full p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-primary/40"
    >
      <p className="text-[11px] uppercase tracking-[0.12em] text-text-secondary">{info.shortName}</p>
      <p className="mt-2 text-xl font-semibold" style={{ color: info.color }}>
        {balance.toLocaleString()} pts
      </p>
    </button>
  );
}
