import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-wide pt-10">
      <Skeleton className="h-3 w-32 mb-8" />
      <header className="mb-10 max-w-2xl space-y-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-full" />
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="surface-card p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="size-11 rounded-lg" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
