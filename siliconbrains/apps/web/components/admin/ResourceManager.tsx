"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { api } from "@/lib/api";
import type { ResourceConfig } from "@/lib/admin-config";
import { emptyForm, formToPayload, formatCell, rowToForm, type FormValues, type Row } from "@/lib/admin-form";

const INPUT =
  "w-full rounded-md border border-outline bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/40";

type Option = { value: string; label: string };

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ResourceManager({ resource, title, noun, description, fields, columns }: ResourceConfig) {
  const { getToken } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<FormValues>(() => emptyForm(fields));
  const [slugAuto, setSlugAuto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<Record<string, Option[]>>({});
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const token = useCallback(async () => {
    const t = await getToken();
    if (!t) throw new Error("Your session has expired — please sign in again.");
    return t;
  }, [getToken]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const t = await token();
      const loadedRows = await api.admin.list<Row[]>(t, resource);
      setRows(loadedRows);
      // Load choices for relational select fields (e.g. client, engagement).
      const entries = await Promise.all(
        fields
          .filter((f) => f.optionsFrom)
          .map(async (f) => {
            const src = await api.admin.list<Row[]>(t, f.optionsFrom!.resource);
            const opts = src.map((r) => ({
              value: String(r.id),
              label: f.optionsFrom!.label.map((k) => r[k]).filter(Boolean).join(" · ") || String(r.id),
            }));
            return [f.key, opts] as const;
          })
      );
      setOptions(Object.fromEntries(entries));
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token, resource, fields]);

  useEffect(() => {
    load();
  }, [load]);

  const optionLabels = useMemo(() => {
    const out: Record<string, Record<string, string>> = {};
    for (const [key, opts] of Object.entries(options)) out[key] = Object.fromEntries(opts.map((o) => [o.value, o.label]));
    return out;
  }, [options]);

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      columns.some((column) => formatCell(column, row, optionLabels).toLowerCase().includes(q))
    );
  }, [rows, columns, optionLabels, query]);

  const startNew = () => {
    setForm(emptyForm(fields));
    setSlugAuto(true);
    setEditing("new");
    setError("");
  };
  const startEdit = (row: Row) => {
    setForm(rowToForm(fields, row));
    setSlugAuto(false);
    setEditing(row);
    setError("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || editing === null) return;
    const result = formToPayload(fields, form);
    if (!result.ok) return setError(result.error);
    setSaving(true);
    setError("");
    try {
      const t = await token();
      if (editing === "new") await api.admin.create(t, resource, result.payload);
      else await api.admin.update(t, resource, String(editing.id), result.payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Row) => {
    setError("");
    setRemovingId(String(row.id));
    try {
      await api.admin.remove(await token(), resource, String(row.id));
      setConfirmDelete(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setRemovingId(null);
    }
  };

  const setValue = (key: string, value: string | boolean) => {
    if (key === "slug") setSlugAuto(false);
    if (key === "title" && slugAuto && fields.some((field) => field.key === "slug")) {
      setForm((current) => ({ ...current, title: value, slug: slugify(String(value)) }));
      return;
    }
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Content & operations</p>
          <h1 className="text-2xl font-semibold tracking-tight text-on-surface">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">{description}</p>
        </div>
        {editing === null && (
          <Button variant="primary" onClick={startNew}>
            <span aria-hidden="true">＋</span> New {noun}
          </Button>
        )}
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {editing !== null && (
        <Card>
          <form onSubmit={save} className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-on-surface">{editing === "new" ? `New ${noun}` : `Edit ${noun}`}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map((f) => {
                const wide = f.type === "textarea" || f.type === "list" || f.type === "json";
                return (
                  <label key={f.key} className={`flex flex-col gap-1.5 text-xs text-on-surface-variant ${wide ? "md:col-span-2" : ""}`}>
                    <span>
                      {f.label}
                      {f.required ? " *" : ""}
                    </span>
                    {f.type === "boolean" ? (
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.key])}
                        onChange={(e) => setValue(f.key, e.target.checked)}
                        className="h-4 w-4"
                      />
                    ) : f.type === "select" ? (
                      <select value={String(form[f.key] ?? "")} onChange={(e) => setValue(f.key, e.target.value)} className={INPUT}>
                        <option value="">— select —</option>
                        {(f.optionsFrom ? options[f.key] ?? [] : (f.options ?? []).map((o) => ({ value: o, label: o }))).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : wide ? (
                      <textarea
                        value={String(form[f.key] ?? "")}
                        onChange={(e) => setValue(f.key, e.target.value)}
                        rows={f.type === "json" ? 6 : 4}
                        spellCheck={f.type === "json" ? false : undefined}
                        className={`${INPUT} ${f.type === "json" ? "font-mono text-xs" : ""}`}
                      />
                    ) : (
                      <input
                        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                        step={f.type === "number" ? "any" : undefined}
                        value={String(form[f.key] ?? "")}
                        onChange={(e) => setValue(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className={INPUT}
                      />
                    )}
                    {f.help && <span className="text-[10px] opacity-70">{f.help}</span>}
                  </label>
                );
              })}
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary" className={saving ? "pointer-events-none opacity-60" : ""}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden !p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline px-4 py-3 sm:px-5">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-outline bg-surface-container-low px-3 py-2 sm:max-w-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-on-surface-variant" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Search {title.toLowerCase()}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="min-w-0 flex-1 bg-transparent text-xs text-on-surface outline-none placeholder:text-on-surface-variant/70" />
          </label>
          <div className="flex items-center gap-3">
            {lastUpdated && <span className="hidden items-center gap-1.5 text-[10px] text-on-surface-variant sm:inline-flex" title={`Data refreshed ${lastUpdated.toLocaleString()}`}><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />Live · {lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>}
            <span className="text-xs text-on-surface-variant">{visibleRows.length} of {rows.length}</span>
            <button type="button" onClick={() => void load()} disabled={loading} className="rounded-lg border border-outline bg-surface px-3 py-2 text-xs font-medium text-on-surface-variant transition hover:border-primary/40 hover:text-on-surface disabled:opacity-50">
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
        {loading ? (
          <div className="space-y-3 p-5" aria-busy="true" aria-label={`Loading ${title.toLowerCase()}`}>
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-container-high/70" />)}
          </div>
        ) : error && !lastUpdated ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-on-surface">Could not load {title.toLowerCase()}</p>
            <p className="mt-1 text-xs text-on-surface-variant">Check the API and database connection, then try again.</p>
            <button type="button" onClick={() => void load()} className="mt-4 rounded-full border border-outline px-4 py-2 text-xs font-semibold text-on-surface transition hover:border-primary/40">Retry connection</button>
          </div>
        ) : rows.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-on-surface">No {noun} records yet</p>
            <p className="mt-1 text-xs text-on-surface-variant">Create the first record to start managing this section.</p>
            <button type="button" onClick={startNew} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:shadow-[0_8px_24px_rgba(31,78,61,0.2)]">Create {noun}</button>
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-on-surface-variant">No {noun} records match “{query}”.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline text-[10px] uppercase tracking-wide text-on-surface-variant">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-medium">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={String(row.id)} className="admin-table-row border-b border-outline/60 last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className="max-w-xs truncate px-4 py-3 text-on-surface-variant">
                      {formatCell(c, row, optionLabels)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right text-xs">
                    <button type="button" onClick={() => startEdit(row)} className="mr-4 rounded px-2 py-1 font-medium text-primary transition hover:bg-secondary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                      Edit
                    </button>
                    {confirmDelete?.id === row.id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-[10px] text-on-surface-variant">Sure?</span>
                        <button type="button" onClick={() => void remove(row)} disabled={removingId === String(row.id)} className="rounded px-2 py-1 font-medium text-error transition hover:bg-error/10 disabled:opacity-50">{removingId === String(row.id) ? "Deleting…" : "Confirm"}</button>
                        <button type="button" onClick={() => setConfirmDelete(null)} disabled={Boolean(removingId)} className="rounded px-2 py-1 text-on-surface-variant hover:bg-surface-container-high">Cancel</button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setConfirmDelete(row)} className="rounded px-2 py-1 text-on-surface-variant transition hover:bg-error/10 hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </Card>
    </div>
  );
}
