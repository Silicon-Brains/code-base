'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type AdminUser, displayName, initials } from '@/lib/users';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type Filter = 'all' | 'client' | 'admin';
type FieldErrors = Record<string, string[] | undefined>;

class ApiError extends Error {
  constructor(message: string, public fields: FieldErrors = {}) {
    super(message);
  }
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const inputCls =
  'w-full rounded-DEFAULT border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none';
const btnPrimary =
  'rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition hover:shadow-[0_0_20px_rgba(142,182,155,0.3)] disabled:opacity-50';
const btnOutline =
  'rounded-full border border-outline px-5 py-2 text-sm font-medium text-on-surface transition hover:border-primary disabled:opacity-50';

export default function UsersManager() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const request = useCallback(
    async <T,>(path: string, init?: RequestInit): Promise<T> => {
      const token = await getToken();
      const res = await fetch(`${API}/api/admin/users${path}`, {
        ...init,
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new ApiError(body?.error ?? `Request failed (${res.status})`, body?.fields ?? {});
      }
      return (await res.json()) as T;
    },
    [getToken],
  );

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      setUsers(await request<AdminUser[]>(''));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not load users');
    }
  }, [request]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const counts = useMemo(() => {
    const all = users ?? [];
    return {
      all: all.length,
      client: all.filter((u) => u.role === 'client').length,
      admin: all.filter((u) => u.role === 'admin').length,
    };
  }, [users]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (users ?? []).filter((u) => {
      if (filter !== 'all' && u.role !== filter) return false;
      if (!q) return true;
      return [u.full_name ?? '', u.email ?? '', u.company_name ?? ''].some((s) => s.toLowerCase().includes(q));
    });
  }, [users, filter, query]);

  function openEditor(u: AdminUser) {
    setEditing(u);
    setFullName(u.full_name ?? '');
    setCompany(u.company_name ?? '');
    setFormError(null);
    setFieldErrors({});
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    setFieldErrors({});
    try {
      const saved = await request<AdminUser>(`/${editing.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ full_name: fullName, company_name: company }),
      });
      setUsers((prev) => (prev ?? []).map((u) => (u.id === saved.id ? saved : u)));
      setNotice('Saved.');
      setEditing(null);
    } catch (e) {
      if (e instanceof ApiError) {
        setFormError(e.message);
        setFieldErrors(e.fields);
      } else {
        setFormError('Could not save. Check your connection and try again.');
      }
    } finally {
      setSaving(false);
    }
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'client', label: 'Clients' },
    { key: 'admin', label: 'Admins' },
  ];

  /* ───────────── Edit view ───────────── */
  if (editing) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <button onClick={() => setEditing(null)} className="text-sm text-on-surface-variant hover:text-on-surface">
            Back to users
          </button>
          <h1 className="mt-1 text-2xl font-semibold text-on-surface">Edit user</h1>
        </div>

        {formError && (
          <p role="alert" className="rounded-DEFAULT border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            {formError}
          </p>
        )}

        <div className="space-y-5 rounded-lg border border-outline bg-surface-container p-5">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-on-surface">Full name</span>
            <input className={inputCls} value={fullName} maxLength={120} onChange={(e) => setFullName(e.target.value)} />
            {fieldErrors.full_name?.[0] && <span role="alert" className="block text-xs text-error">{fieldErrors.full_name[0]}</span>}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-on-surface">Company</span>
            <input className={inputCls} value={company} maxLength={120} onChange={(e) => setCompany(e.target.value)} />
            {fieldErrors.company_name?.[0] && <span role="alert" className="block text-xs text-error">{fieldErrors.company_name[0]}</span>}
          </label>

          <dl className="grid gap-4 border-t border-outline pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-on-surface-variant">Email</dt>
              <dd className="mt-0.5 break-all text-on-surface">{editing.email ?? 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Role</dt>
              <dd className="mt-0.5 text-on-surface">{editing.role === 'admin' ? 'Admin' : 'Client'}</dd>
            </div>
          </dl>
          <p className="text-xs text-on-surface-variant">
            Email comes from Clerk. Roles are changed directly in Supabase, not from this page.
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className={btnPrimary}>Save changes</button>
          <button onClick={() => setEditing(null)} disabled={saving} className={btnOutline}>Cancel</button>
        </div>
      </div>
    );
  }

  /* ───────────── List view ───────────── */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Users</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Everyone who has signed up. New accounts appear here automatically as clients.
        </p>
      </div>

      {notice && (
        <p role="status" className="rounded-DEFAULT border border-outline bg-surface-container-high px-4 py-2 text-sm text-on-surface">
          {notice}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2" role="group" aria-label="Filter users">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                filter === f.key
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline text-on-surface-variant hover:border-primary'
              }`}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>
        <input
          className={`${inputCls} max-w-xs`}
          placeholder="Search name, email, company"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search users"
        />
      </div>

      {loadError ? (
        <div role="alert" className="rounded-lg border border-error/40 bg-error/10 p-5 text-sm text-error">
          {loadError}{' '}
          <button onClick={load} className="underline">Retry</button>
        </div>
      ) : users === null ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-container" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline p-10 text-center">
          <p className="text-on-surface">{users.length === 0 ? 'No users yet' : 'No users match this filter'}</p>
          {users.length === 0 && (
            <p className="mt-1 text-sm text-on-surface-variant">
              If someone has signed up but is missing, check that the Clerk webhook is delivering.
            </p>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-outline overflow-hidden rounded-lg border border-outline bg-surface-container">
          {visible.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-sm font-semibold text-primary"
              >
                {initials(u)}
              </span>
              <div className="min-w-0 flex-1">
                <button onClick={() => openEditor(u)} className="block max-w-full truncate text-left font-medium text-on-surface hover:text-primary">
                  {displayName(u)}
                </button>
                <p className="truncate text-sm text-on-surface-variant">
                  {u.email ?? 'No email'}
                  {u.company_name ? ` · ${u.company_name}` : ''}
                </p>
              </div>
              <p className="w-28 text-sm text-on-surface-variant">
                {u.role === 'client'
                  ? `${u.engagement_count} ${u.engagement_count === 1 ? 'engagement' : 'engagements'}`
                  : ''}
              </p>
              <p className="w-28 text-sm text-on-surface-variant">Joined {fmtDate(u.created_at)}</p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs ${
                  u.role === 'admin' ? 'bg-primary text-on-primary' : 'border border-outline text-on-surface-variant'
                }`}
              >
                {u.role === 'admin' ? 'Admin' : 'Client'}
              </span>
              <div className="flex gap-4 text-sm">
                <button onClick={() => openEditor(u)} className="text-on-surface hover:text-primary">Edit</button>
                {u.role === 'client' && (
                  <Link href="/admin/engagements" className="text-on-surface-variant hover:text-primary">Engagements</Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}