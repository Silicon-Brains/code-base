export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 animate-pulse rounded-md bg-surface-container-high" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-surface-container-high/70" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg border border-outline bg-surface-container/60" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-64 animate-pulse rounded-lg border border-outline bg-surface-container/60" />
        <div className="h-64 animate-pulse rounded-lg border border-outline bg-surface-container/60" />
      </div>
    </div>
  );
}
