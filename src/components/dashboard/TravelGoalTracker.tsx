import { PROGRAM_INFO } from "@/lib/constants";
import type { TravelGoal } from "@/types";

type TravelGoalTrackerProps = {
  goal: TravelGoal;
  currentPoints: number;
};

export function TravelGoalTracker({ goal, currentPoints }: TravelGoalTrackerProps) {
  const progress = Math.min(100, Math.round((currentPoints / goal.targetPoints) * 100));

  return (
    <section className="rounded-2xl border border-border bg-bg-card p-4">
      <h2 className="text-xl font-semibold">Travel goal</h2>
      <p className="mt-1 text-sm text-text-secondary">
        {goal.name} — {currentPoints.toLocaleString()} / {goal.targetPoints.toLocaleString()} {PROGRAM_INFO[goal.program].shortName} ({progress}%)
      </p>
      <div className="mt-3 h-3 rounded-full bg-bg-elevated">
        <div className="h-3 rounded-full bg-brand-primary" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
