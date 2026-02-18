import { PROGRAM_INFO } from "@/lib/constants";
import type { TravelGoal } from "@/types";

type TravelGoalTrackerProps = {
  goal: TravelGoal;
  currentPoints: number;
};

export function TravelGoalTracker({ goal, currentPoints }: TravelGoalTrackerProps) {
  const progress = Math.min(100, Math.round((currentPoints / goal.targetPoints) * 100));

  return (
    <section className="section-card p-5">
      <p className="section-subtitle">Travel goal</p>
      <h2 className="mt-1 section-title">{goal.name}</h2>
      <p className="mt-2 text-sm text-text-secondary">
        {currentPoints.toLocaleString()} / {goal.targetPoints.toLocaleString()} {PROGRAM_INFO[goal.program].shortName} ({progress}%)
      </p>
      <div className="mt-4 h-3 rounded-full bg-bg-elevated">
        <div className="h-3 rounded-full bg-brand-primary transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
