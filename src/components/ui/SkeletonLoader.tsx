import { cn } from "@/lib/cn";

type SkeletonLoaderProps = {
  className?: string;
};

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return <div className={cn("animate-pulse rounded-md bg-slate-700/70", className)} aria-hidden="true" />;
}
