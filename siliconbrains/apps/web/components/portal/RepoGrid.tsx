import type { CodeRepository, RepoArtifact } from "@/lib/types";

export default function RepoGrid({
  repositories,
  artifacts,
}: {
  repositories: CodeRepository[];
  artifacts: RepoArtifact[];
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-outline bg-surface-container/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Sovereignty &amp; IP Registry</p>
          <h2 className="mt-1 text-lg font-semibold text-on-surface">Code Repositories &amp; Architecture Specs</h2>
        </div>
        <button className="rounded-md border border-outline px-3 py-1.5 text-[11px] text-on-surface-variant hover:border-primary/30">
          View Git Audit Log
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {repositories.length === 0 ? (
          <p className="col-span-full py-6 text-center text-sm text-on-surface-variant">No repositories linked yet.</p>
        ) : (
          repositories.map((r) => (
            <div key={r.id} className="flex flex-col gap-2 rounded-lg border border-outline bg-surface-container/60 p-4">
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-on-surface-variant">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.6-4.6 4.9.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5C19.1 20.2 22 16.4 22 12c0-5.5-4.5-10-10-10z" />
                </svg>
                <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">Private GitHub</p>
              </div>
              <p className="font-mono text-xs font-semibold text-on-surface">{r.name}</p>
              {r.description && <p className="text-[11px] text-on-surface-variant">{r.description}</p>}
              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-outline pt-2 text-[10px] text-on-surface-variant">
                {r.branch && <span>{r.branch}</span>}
                {r.version_label && <span>· {r.version_label}</span>}
                {r.build_label && <span>· {r.build_label}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {artifacts.length > 0 && (
        <div className="rounded-lg border border-outline bg-surface-container-high/40 p-4">
          <p className="mb-3 text-[10px] uppercase tracking-wider text-on-surface-variant">Architecture Artifacts &amp; Schemas</p>
          <div className="flex flex-wrap gap-2">
            {artifacts.map((a) => (
              <span key={a.id} className="rounded-full border border-outline bg-surface-container/60 px-3 py-1 text-[11px] text-on-surface-variant">
                {a.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}