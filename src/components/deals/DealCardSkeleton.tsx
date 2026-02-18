import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

export function DealCardSkeleton() {
  return (
    <article className="rounded-2xl border border-border bg-bg-card p-4">
      <SkeletonLoader className="h-6 w-28" />
      <SkeletonLoader className="mt-4 h-6 w-40" />
      <SkeletonLoader className="mt-2 h-4 w-56" />
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <SkeletonLoader className="h-20" />
        <SkeletonLoader className="h-20" />
      </div>
      <SkeletonLoader className="mt-4 h-4 w-48" />
      <SkeletonLoader className="mt-2 h-4 w-32" />
    </article>
  );
}
