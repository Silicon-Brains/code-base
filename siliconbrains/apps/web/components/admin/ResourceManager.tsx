"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { api } from "@/lib/api";
import type { ResourceConfig } from "@/lib/admin-config";
import { emptyForm, formToPayload, formatCell, rowToForm, type FormValues, type Row } from "@/lib/admin-form";

const INPUT =
  "w-full rounded-md border border-outline bg-surface-container/60 px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/40";

type Option = { value: string; label: string };

export default function ResourceManager({ resource, title, noun, description, fields, columns }: ResourceConfig) {
  const { getToken } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<FormValues>(() => emptyForm(fields));
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<Record<string, Option[]>>({});

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
      setRows(await api.admin.list<Row[]>(t, resource));
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

  const startNew = () => {
    setForm(emptyForm(fields));
    setEditing("new");
    setError("");
  };
  const startEdit = (row: Row) => {
    setForm(rowToForm(fields, row));
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
    if (!window.confirm(`Delete this ${noun}? This cannot be undone.`)) return;
    setError("");
    try {
      await api.admin.remove(await token(), resource, String(row.id));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const setValue = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">{description}</p>
        </div>
        {editing === null && (
          <Button variant="primary" onClick={startNew}>
            + New {noun}
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

      <Card className="overflow-x-auto !p-0">
        {loading ? (
          <p className="p-6 text-sm text-on-surface-variant">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-on-surface-variant">No {noun} records yet.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
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
              {rows.map((row) => (
                <tr key={String(row.id)} className="border-b border-outline/60 last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className="max-w-xs truncate px-4 py-3 text-on-surface-variant">
                      {formatCell(c, row, optionLabels)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right text-xs">
                    <button onClick={() => startEdit(row)} className="mr-4 text-primary hover:underline">
                      Edit
                    </button>
                    <button onClick={() => remove(row)} className="text-error hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
