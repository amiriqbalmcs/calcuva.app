import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-wide py-12">
      {/* Hero Skeleton */}
      <div className="space-y-6 mb-16">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 sm:h-20 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-md" />
        <Skeleton className="h-12 w-full max-w-xl rounded-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="surface-card p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="size-11 rounded-lg" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
