export default function PortalLoading() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
      <div className="h-32 animate-pulse rounded-lg border border-outline bg-surface-container-high/70" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
