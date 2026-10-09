import type { SprintCycle } from "@/lib/types";

export default function TelemetryFooter({ sprint }: { sprint: SprintCycle | null }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-outline bg-surface-container/40 px-5 py-4 text-[11px] text-on-surface-variant">
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="text-[9px] uppercase tracking-wider opacity-70">CVE</p>
          <p className="text-on-surface">{sprint?.cve_label ?? "—"}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider opacity-70">Vulnerabilities</p>
          <p className="text-on-surface">{sprint?.vulnerabilities_label ?? "—"}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider opacity-70">Governance</p>
          <p className="text-on-surface">{sprint?.governance_label ?? "—"}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider opacity-70">Codebase Delta</p>
          <p className="text-on-surface">{sprint?.code_delta_label ?? "—"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
        <span className="text-[10px] uppercase tracking-wider">Nominal</span>
      </div>
    </div>
  );
}