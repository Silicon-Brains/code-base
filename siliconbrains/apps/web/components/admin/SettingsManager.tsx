'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type SettingsForm, type SiteSettings, toForm } from '@/lib/settings';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type FieldErrors = Record<string, string[] | undefined>;

class ApiError extends Error {
  constructor(message: string, public fields: FieldErrors = {}) {
    super(message);
  }
}

const inputCls =
  'w-full rounded-DEFAULT border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none';
const btnPrimary =
  'rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition hover:shadow-[0_0_20px_rgba(142,182,155,0.3)] disabled:opacity-50';
const btnOutline =
  'rounded-full border border-outline px-5 py-2 text-sm font-medium text-on-surface transition hover:border-primary disabled:opacity-50';

export default function SettingsManager() {
  const { getToken } = useAuth();
  const [saved, setSaved] = useState<SettingsForm | null>(null);
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<string | null>(null);

  const request = useCallback(
    async (init?: RequestInit): Promise<SiteSettings> => {
      const token = await getToken();
      const res = await fetch(`${API}/api/admin/settings`, {
        ...init,
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new ApiError(body?.error ?? `Request failed (${res.status})`, body?.fields ?? {});
      }
      return res.json();
    },
    [getToken],
  );

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const s = await request();
      const f = toForm(s);
      setSaved(f);
      setForm(f);
      setUpdatedAt(s.updated_at);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not load settings');
    }
  }, [request]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const dirty = useMemo(
    () => saved !== null && form !== null && JSON.stringify(saved) !== JSON.stringify(form),
    [saved, form],
  );

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  function set<K extends keyof SettingsForm>(key: K, value: string) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setFormError(null);
    setFieldErrors({});
    try {
      const s = await request({ method: 'PATCH', body: JSON.stringify(form) });
      const f = toForm(s);
      setSaved(f);
      setForm(f);
      setUpdatedAt(s.updated_at);
      setNotice('Saved.');
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

  function discard() {
    setForm(saved);
    setFormError(null);
    setFieldErrors({});
  }

  if (loadError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Settings</h1>
        <div role="alert" className="rounded-lg border border-error/40 bg-error/10 p-5 text-sm text-error">
          {loadError}{' '}
          <button onClick={load} className="underline">Retry</button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="space-y-6" aria-busy="true">
        <h1 className="text-2xl font-semibold text-on-surface">Settings</h1>
        {[0, 1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-lg bg-surface-container" />)}
      </div>
    );
  }

  const err = (k: keyof SettingsForm) => fieldErrors[k]?.[0];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Settings</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Site-wide details used across the public pages.
          {updatedAt && ` Last updated ${new Date(updatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}.`}
        </p>
      </div>

      {notice && (
        <p role="status" className="rounded-DEFAULT border border-outline bg-surface-container-high px-4 py-2 text-sm text-on-surface">
          {notice}
        </p>
      )}
      {formError && (
        <p role="alert" className="rounded-DEFAULT border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {formError}
        </p>
      )}

      <Section title="General" description="How the site identifies itself.">
        <Field label="Site name" error={err('site_name')}>
          <input className={inputCls} value={form.site_name} maxLength={80} onChange={(e) => set('site_name', e.target.value)} />
        </Field>
        <Field label="Tagline" hint={`${form.tagline.length}/160`} error={err('tagline')}>
          <input className={inputCls} value={form.tagline} maxLength={160} onChange={(e) => set('tagline', e.target.value)} />
        </Field>
      </Section>

      <Section title="Contact" description="Shown on the Contact page and footer. The email also powers the discovery-call link.">
        <Field label="Contact email" error={err('contact_email')}>
          <input type="email" className={inputCls} value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="hello@example.com" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone" error={err('phone')}>
            <input className={inputCls} value={form.phone} maxLength={40} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Location" error={err('location')}>
            <input className={inputCls} value={form.location} maxLength={120} onChange={(e) => set('location', e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Social links" description="Leave a field empty to hide that link.">
        <Field label="LinkedIn" error={err('linkedin_url')}>
          <input className={inputCls} value={form.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/company/…" />
        </Field>
        <Field label="GitHub" error={err('github_url')}>
          <input className={inputCls} value={form.github_url} onChange={(e) => set('github_url', e.target.value)} placeholder="https://github.com/…" />
        </Field>
        <Field label="X" error={err('x_url')}>
          <input className={inputCls} value={form.x_url} onChange={(e) => set('x_url', e.target.value)} placeholder="https://x.com/…" />
        </Field>
      </Section>

      <Section title="SEO defaults" description="Used for pages that don't set their own title or description.">
        <Field label="Default meta title" hint={`${form.default_meta_title.length}/70`} error={err('default_meta_title')}>
          <input className={inputCls} value={form.default_meta_title} maxLength={70} onChange={(e) => set('default_meta_title', e.target.value)} />
        </Field>
        <Field label="Default meta description" hint={`${form.default_meta_description.length}/180`} error={err('default_meta_description')}>
          <textarea className={inputCls} rows={3} value={form.default_meta_description} maxLength={180} onChange={(e) => set('default_meta_description', e.target.value)} />
        </Field>
      </Section>

      <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-lg border border-outline bg-surface-container-high px-5 py-3">
        <span className="text-sm text-on-surface-variant">{dirty ? 'You have unsaved changes' : 'All changes saved'}</span>
        <div className="flex gap-2">
          <button onClick={discard} disabled={!dirty || saving} className={btnOutline}>Discard</button>
          <button onClick={save} disabled={!dirty || saving} className={btnPrimary}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-lg border border-outline bg-surface-container p-5">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
        <p className="mt-0.5 text-sm text-on-surface-variant">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-baseline justify-between gap-2 text-sm font-medium text-on-surface">
        {label}
        {hint && <span className="text-xs font-normal text-on-surface-variant">{hint}</span>}
      </span>
      {children}
      {error && <span role="alert" className="block text-xs text-error">{error}</span>}
    </label>
  );
}