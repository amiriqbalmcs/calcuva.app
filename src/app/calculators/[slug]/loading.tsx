import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-wide pt-10">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-3 w-48 mb-8" />

      {/* Header Skeleton */}
      <div className="flex items-start gap-4 mb-10">
        <Skeleton className="size-14 rounded-xl shrink-0" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-1/2 max-w-sm" />
          <Skeleton className="h-4 w-3/4 max-w-xl" />
        </div>
      </div>

      {/* Layout Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-1 surface-card p-6 space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-12" /></div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>

        {/* Right Column: Results & Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
