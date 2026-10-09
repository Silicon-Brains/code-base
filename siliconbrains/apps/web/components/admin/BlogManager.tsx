'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type BlogPost, readMinutes, slugify, wordCount } from '../../lib/blog';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type Draft = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  tags: string; // comma separated in the form
  author_name: string;
  seo_description: string;
  featured: boolean;
  published: boolean;
};

type Filter = 'all' | 'published' | 'draft';
type FieldErrors = Record<string, string[] | undefined>;

class ApiError extends Error {
  constructor(message: string, public fields: FieldErrors = {}) {
    super(message);
  }
}

const emptyDraft: Draft = {
  id: null, title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
  category: '', tags: '', author_name: '', seo_description: '', featured: false, published: false,
};

const toDraft = (p: BlogPost): Draft => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt ?? '',
  content: p.content,
  cover_image_url: p.cover_image_url ?? '',
  category: p.category ?? '',
  tags: p.tags.join(', '),
  author_name: p.author_name ?? '',
  seo_description: p.seo_description ?? '',
  featured: p.featured,
  published: p.published,
});

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const inputCls =
  'w-full rounded-DEFAULT border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none';
const btnPrimary =
  'rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition hover:shadow-[0_0_20px_rgba(142,182,155,0.3)] disabled:opacity-50';
const btnOutline =
  'rounded-full border border-outline px-5 py-2 text-sm font-medium text-on-surface transition hover:border-primary disabled:opacity-50';

export default function BlogManager() {
  const { getToken } = useAuth();
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const request = useCallback(
    async <T,>(path: string, init?: RequestInit): Promise<T> => {
      const token = await getToken();
      const res = await fetch(`${API}/api/admin/blog-posts${path}`, {
        ...init,
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new ApiError(body?.error ?? `Request failed (${res.status})`, body?.fields ?? {});
      }
      return (res.status === 204 ? undefined : await res.json()) as T;
    },
    [getToken],
  );

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      setPosts(await request<BlogPost[]>(''));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not load posts');
    }
  }, [request]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const counts = useMemo(() => {
    const all = posts ?? [];
    return { all: all.length, published: all.filter((p) => p.published).length, draft: all.filter((p) => !p.published).length };
  }, [posts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (posts ?? []).filter((p) => {
      if (filter === 'published' && !p.published) return false;
      if (filter === 'draft' && p.published) return false;
      if (!q) return true;
      return [p.title, p.slug, p.category ?? '', ...p.tags].some((s) => s.toLowerCase().includes(q));
    });
  }, [posts, filter, query]);

  function openEditor(p?: BlogPost) {
    setDraft(p ? toDraft(p) : { ...emptyDraft });
    setSlugTouched(Boolean(p));
    setFormError(null);
    setFieldErrors({});
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => {
      if (!d) return d;
      const next = { ...d, [key]: value };
      if (key === 'title' && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  }

  async function submit(mode: 'save' | 'publish' | 'unpublish') {
    if (!draft) return;
    setSaving(true);
    setFormError(null);
    setFieldErrors({});
    const published = mode === 'publish' ? true : mode === 'unpublish' ? false : draft.published;
    const payload = {
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      content: draft.content,
      cover_image_url: draft.cover_image_url,
      category: draft.category,
      tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
      author_name: draft.author_name,
      seo_description: draft.seo_description,
      featured: draft.featured,
      published,
    };
    try {
      const saved = draft.id
        ? await request<BlogPost>(`/${draft.id}`, { method: 'PATCH', body: JSON.stringify(payload) })
        : await request<BlogPost>('', { method: 'POST', body: JSON.stringify(payload) });
      setPosts((prev) => {
        const rest = (prev ?? []).filter((p) => p.id !== saved.id);
        return [saved, ...rest];
      });
      setNotice(mode === 'publish' ? 'Published.' : mode === 'unpublish' ? 'Unpublished.' : 'Saved.');
      setDraft(null);
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

  async function remove(id: string) {
    try {
      await request<void>(`/${id}`, { method: 'DELETE' });
      setPosts((prev) => (prev ?? []).filter((p) => p.id !== id));
      setNotice('Deleted.');
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Could not delete the post.');
    } finally {
      setConfirmDeleteId(null);
    }
  }

  /* ───────────── Editor view ───────────── */
  if (draft) {
    const err = (k: string) => fieldErrors[k]?.[0];
    const words = wordCount(draft.content);
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <button onClick={() => setDraft(null)} className="text-sm text-on-surface-variant hover:text-on-surface">
              Back to posts
            </button>
            <h1 className="mt-1 text-2xl font-semibold text-on-surface">{draft.id ? 'Edit post' : 'New post'}</h1>
          </div>
          <div className="flex gap-2">
            <button disabled={saving} onClick={() => submit('save')} className={btnOutline}>
              {draft.published ? 'Save changes' : 'Save draft'}
            </button>
            {draft.published ? (
              <button disabled={saving} onClick={() => submit('unpublish')} className={btnOutline}>Unpublish</button>
            ) : (
              <button disabled={saving} onClick={() => submit('publish')} className={btnPrimary}>Publish</button>
            )}
          </div>
        </div>

        {formError && (
          <p role="alert" className="rounded-DEFAULT border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            {formError}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-5 rounded-lg border border-outline bg-surface-container p-5">
            <Field label="Title" error={err('title')}>
              <input className={inputCls} value={draft.title} onChange={(e) => update('title', e.target.value)} maxLength={160} />
            </Field>
            <Field label="Slug" hint={`/blog/${draft.slug || 'your-post'}`} error={err('slug')}>
              <input
                className={inputCls}
                value={draft.slug}
                onChange={(e) => { setSlugTouched(true); update('slug', e.target.value); }}
              />
            </Field>
            <Field label="Excerpt" hint={`${draft.excerpt.length}/300`} error={err('excerpt')}>
              <textarea className={inputCls} rows={2} maxLength={300} value={draft.excerpt} onChange={(e) => update('excerpt', e.target.value)} />
            </Field>
            <Field label="Content (Markdown)" hint={`${words} words · ${readMinutes(draft.content)} min read`} error={err('content')}>
              <textarea
                className={`${inputCls} font-mono leading-relaxed`}
                rows={18}
                value={draft.content}
                onChange={(e) => update('content', e.target.value)}
              />
            </Field>
          </div>

          <aside className="space-y-5 rounded-lg border border-outline bg-surface-container p-5 self-start">
            <Field label="Category" error={err('category')}>
              <input className={inputCls} value={draft.category} onChange={(e) => update('category', e.target.value)} placeholder="Cloud & DevOps" />
            </Field>
            <Field label="Tags" hint="Separate with commas" error={err('tags')}>
              <input className={inputCls} value={draft.tags} onChange={(e) => update('tags', e.target.value)} placeholder="kubernetes, terraform" />
            </Field>
            <Field label="Author" error={err('author_name')}>
              <input className={inputCls} value={draft.author_name} onChange={(e) => update('author_name', e.target.value)} />
            </Field>
            <Field label="Cover image URL" error={err('cover_image_url')}>
              <input className={inputCls} value={draft.cover_image_url} onChange={(e) => update('cover_image_url', e.target.value)} placeholder="https://" />
            </Field>
            <Field label="Search description" hint={`${draft.seo_description.length}/180`} error={err('seo_description')}>
              <textarea className={inputCls} rows={3} maxLength={180} value={draft.seo_description} onChange={(e) => update('seo_description', e.target.value)} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-on-surface">
              <input type="checkbox" className="accent-[var(--color-primary)]" checked={draft.featured} onChange={(e) => update('featured', e.target.checked)} />
              Feature this post
            </label>
          </aside>
        </div>
      </div>
    );
  }

  /* ───────────── List view ───────────── */
  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Blog</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Write, publish and manage posts. Only published posts are public.</p>
        </div>
        <button onClick={() => openEditor()} className={btnPrimary}>New post</button>
      </div>

      {notice && (
        <p role="status" className="rounded-DEFAULT border border-outline bg-surface-container-high px-4 py-2 text-sm text-on-surface">
          {notice}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2" role="group" aria-label="Filter posts">
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
          placeholder="Search title, slug, tag"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search posts"
        />
      </div>

      {loadError ? (
        <div role="alert" className="rounded-lg border border-error/40 bg-error/10 p-5 text-sm text-error">
          {loadError}{' '}
          <button onClick={load} className="underline">Retry</button>
        </div>
      ) : posts === null ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-container" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline p-10 text-center">
          <p className="text-on-surface">{posts.length === 0 ? 'No posts yet' : 'No posts match this filter'}</p>
          {posts.length === 0 && (
            <button onClick={() => openEditor()} className={`${btnPrimary} mt-4`}>Write your first post</button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-outline overflow-hidden rounded-lg border border-outline bg-surface-container">
          {visible.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <button onClick={() => openEditor(p)} className="block max-w-full truncate text-left font-medium text-on-surface hover:text-primary">
                  {p.title}
                </button>
                <p className="mt-0.5 truncate text-sm text-on-surface-variant">
                  /blog/{p.slug}
                  {p.category ? ` · ${p.category}` : ''}
                  {` · Updated ${fmtDate(p.updated_at)}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {p.featured && <span className="rounded-full border border-outline px-2.5 py-0.5 text-xs text-secondary">Featured</span>}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs ${
                    p.published ? 'bg-primary text-on-primary' : 'border border-outline text-on-surface-variant'
                  }`}
                >
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
              {confirmDeleteId === p.id ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-on-surface-variant">Delete this post?</span>
                  <button onClick={() => remove(p.id)} className="text-error hover:underline">Delete</button>
                  <button onClick={() => setConfirmDeleteId(null)} className="text-on-surface-variant hover:underline">Cancel</button>
                </div>
              ) : (
                <div className="flex gap-4 text-sm">
                  <button onClick={() => openEditor(p)} className="text-on-surface hover:text-primary">Edit</button>
                  <button onClick={() => setConfirmDeleteId(p.id)} className="text-on-surface-variant hover:text-error">Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label, hint, error, children,
}: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
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