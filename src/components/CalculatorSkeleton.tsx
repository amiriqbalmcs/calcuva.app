export function CalculatorSkeleton() {
  return (
    <div className="container-wide pt-20 sm:pt-28 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-10">
        <div className="h-3 w-12 bg-secondary rounded-full" />
        <div className="h-3 w-3 bg-secondary/50 rounded-full" />
        <div className="h-3 w-20 bg-secondary rounded-full" />
        <div className="h-3 w-3 bg-secondary/50 rounded-full" />
        <div className="h-3 w-32 bg-secondary rounded-full" />
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="h-4 w-24 bg-secondary rounded-full mb-4" />
        <div className="h-9 w-72 bg-secondary rounded-xl mb-3" />
        <div className="h-4 w-96 bg-secondary/60 rounded-full" />
      </div>

      {/* Main calculator area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs panel */}
        <div className="lg:col-span-1 rounded-2xl border border-border p-6 space-y-6">
          <div className="h-3 w-24 bg-secondary rounded-full" />
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-secondary rounded-full" />
                <div className="h-3 w-16 bg-secondary/60 rounded-full" />
              </div>
              <div className="h-10 w-full bg-secondary rounded-xl" />
              <div className="h-2 w-full bg-secondary/40 rounded-full" />
            </div>
          ))}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="rounded-2xl border border-border p-6">
                <div className="h-3 w-20 bg-secondary rounded-full mb-3" />
                <div className="h-8 w-32 bg-secondary rounded-xl" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border p-6 h-48 bg-secondary/20" />
        </div>
      </div>
    </div>
  );
}
