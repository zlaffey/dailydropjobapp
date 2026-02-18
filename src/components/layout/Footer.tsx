import type { Experiment } from "@/types";

type FooterProps = {
  experiment: Experiment;
};

export function Footer({ experiment }: FooterProps) {
  return (
    <footer className="mt-10 border-t border-border pt-4 text-xs text-text-secondary">
      <p>Built as a frontend engineering portfolio piece.</p>
      <p>Experiment variant: {experiment.assignment}</p>
    </footer>
  );
}
