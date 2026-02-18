import type { Experiment } from "@/types";

type FooterProps = {
  experiment: Experiment;
};

export function Footer({ experiment }: FooterProps) {
  return (
    <footer className="section-card mt-10 flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-text-secondary">
      <p>Built as a frontend engineering portfolio piece.</p>
      <p className="rounded-full border border-border bg-bg-elevated/50 px-2 py-1">
        Experiment variant: {experiment.assignment}
      </p>
    </footer>
  );
}
