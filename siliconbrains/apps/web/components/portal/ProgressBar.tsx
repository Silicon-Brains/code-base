export default function ProgressBar({ percent, showLabel = false }: { percent: number; showLabel?: boolean }) {
  const v = Math.max(0, Math.min(100, percent));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${v}%` }} />
      </div>
      {showLabel && <span className="shrink-0 text-xs text-on-surface-variant">{v}%</span>}
    </div>
  );
}