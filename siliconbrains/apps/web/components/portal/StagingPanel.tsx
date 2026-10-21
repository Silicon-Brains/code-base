import type { StagingDeployment } from "@/lib/types";

export default function StagingPanel({ deployments }: { deployments: StagingDeployment[] }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-on-surface">Staging Deployments</h2>
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden /> Live Sandboxes
        </span>
      </div>

      {deployments.length === 0 ? (
        <div className="rounded-lg border border-outline bg-surface-container/60 px-4 py-6 text-center text-xs text-on-surface-variant">
          No staging environments yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {deployments.map((d) => (
            <div key={d.id} className="flex flex-col gap-2 rounded-lg border border-outline bg-surface-container/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-on-surface">{d.name}</p>
                  {d.version_label && <p className="text-[10px] font-mono text-on-surface-variant">{d.version_label}</p>}
                </div>
                {d.status && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-primary">
                    {d.status}
                  </span>
                )}
              </div>
              {d.url && <p className="truncate font-mono text-[10px] text-on-surface-variant">{d.url}</p>}
              {d.url && (
                <div className="mt-1 flex gap-2">
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-outline px-3 py-1 text-[11px] text-on-surface-variant hover:border-primary/30 hover:text-on-surface"
                  >
                    Open App ↗
                  </a>
                  <button className="rounded-md border border-outline px-3 py-1 text-[11px] text-on-surface-variant hover:border-primary/30">
                    Logs
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
