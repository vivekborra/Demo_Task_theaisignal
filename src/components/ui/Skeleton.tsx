import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  );
}

export function InternshipCardSkeleton() {
  return (
    <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-5 w-24 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
