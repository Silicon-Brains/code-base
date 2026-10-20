"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import { api } from "@/lib/api";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUSES: LeadStatus[] = ["new", "contacted", "converted", "archived"];
const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Approved",
  archived: "Archived",
};

export default function LeadsInbox() {
  const { getToken } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const token = useCallback(async () => {
    const t = await getToken();
    if (!t) throw new Error("Your session has expired — please sign in again.");
    return t;
  }, [getToken]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setLeads(await api.admin.list<Lead[]>(await token(), "leads"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (lead: Lead, status: LeadStatus) => {
    if (lead.status === status || busyId) return;
    setBusyId(lead.id);
    setError("");
    try {
      const updated = await api.admin.update<Lead>(await token(), "leads", lead.id, { status });
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: updated.status } : l)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const deleteLead = async (lead: Lead) => {
    if (busyId) return;
    setBusyId(lead.id);
    setError("");
    try {
      await api.admin.remove(await token(), "leads", lead.id);
      setLeads((current) => current.filter((item) => item.id !== lead.id));
      setConfirmDeleteId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete enquiry");
    } finally {
      setBusyId(null);
    }
  };

  const count = (s: LeadStatus | "all") => (s === "all" ? leads.length : leads.filter((l) => l.status === s).length);
  const visible = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Leads</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Project inquiries submitted through the Contact form, newest first.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s}>
            <Badge active={filter === s}>
              {s} ({count(s)})
            </Badge>
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading…</p>
      ) : visible.length === 0 ? (
        <Card>
          <p className="text-sm text-on-surface-variant">No leads {filter === "all" ? "yet" : `with status “${filter}”`}.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((l) => (
            <Card key={l.id} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-on-surface">{l.full_name}</p>
                  <p className="text-xs text-on-surface-variant">
                    <a href={`mailto:${l.work_email}`} className="text-primary hover:underline">
                      {l.work_email}
                    </a>
                    {l.organization ? ` · ${l.organization}` : ""}
                    {l.website ? ` · ${l.website}` : ""}
                  </p>
                </div>
                <p className="text-xs text-on-surface-variant">{new Date(l.created_at).toLocaleString()}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(l.domain_interest ?? []).map((d) => (
                  <Badge key={d}>{d}</Badge>
                ))}
                {l.budget_range && <Badge>{l.budget_range}</Badge>}
                {l.timeline && <Badge>{l.timeline}</Badge>}
                {l.nda_requested && <Badge active>NDA requested</Badge>}
              </div>

              <p className="whitespace-pre-wrap text-sm text-on-surface-variant">{l.message}</p>

              <div className="flex flex-wrap items-center gap-2 border-t border-outline pt-4">
                <span className="mr-1 text-[10px] uppercase tracking-wide text-on-surface-variant">Status</span>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={busyId === l.id}
                    onClick={() => setStatus(l, s)}
                    aria-pressed={l.status === s}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      l.status === s
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-outline text-on-surface-variant hover:border-primary/30"
                    }`}
                  >
                    {s === "converted" ? (l.status === "converted" ? "Approved" : "Approve client") : STATUS_LABEL[s]}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  {confirmDeleteId === l.id ? (
                    <>
                      <span className="text-xs text-error">Delete this enquiry permanently?</span>
                      <button
                        type="button"
                        disabled={busyId === l.id}
                        onClick={() => void deleteLead(l)}
                        className="rounded-full border border-error/40 bg-error/10 px-3 py-1 text-xs font-medium text-error transition hover:bg-error/15 disabled:opacity-50"
                      >
                        {busyId === l.id ? "Deleting…" : "Confirm delete"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === l.id}
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-full border border-outline px-3 py-1 text-xs text-on-surface-variant transition hover:border-primary/30 disabled:opacity-50"
                      >Cancel</button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === l.id}
                      onClick={() => setConfirmDeleteId(l.id)}
                      className="rounded-full border border-error/30 px-3 py-1 text-xs font-medium text-error transition hover:bg-error/10 disabled:opacity-50"
                    >Delete enquiry</button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
