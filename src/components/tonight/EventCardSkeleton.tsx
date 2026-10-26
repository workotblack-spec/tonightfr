import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none bg-surface-elevated" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-20 bg-surface-elevated" />
        <Skeleton className="h-5 w-3/4 bg-surface-elevated" />
        <Skeleton className="h-4 w-1/2 bg-surface-elevated" />
      </div>
    </div>
  );
}
