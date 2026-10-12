'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type Message,
  type Thread,
  clientLabel,
  fmtListTime,
  fmtMessageTime,
  initials,
} from "@/lib/massages";

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const POLL_MS = 15_000;

type Filter = 'all' | 'unread';

const inputCls =
  'w-full rounded-DEFAULT border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none';
const btnPrimary =
  'rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition hover:shadow-[0_0_20px_rgba(142,182,155,0.3)] disabled:opacity-50';

export default function MessagesManager() {
  const { getToken } = useAuth();

  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [msgError, setMsgError] = useState<string | null>(null);

  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const request = useCallback(
    async <T,>(path: string, init?: RequestInit): Promise<T | undefined> => {
      const token = await getToken();
      const res = await fetch(`${API}/api/admin/messages${path}`, {
        ...init,
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Request failed (${res.status})`);
      }
      return res.status === 204 ? undefined : ((await res.json()) as T);
    },
    [getToken],
  );

  const loadThreads = useCallback(
    async (silent = false) => {
      try {
        const t = await request<Thread[]>('/threads');
        setThreads(t ?? []);
        if (!silent) setLoadError(null);
      } catch (e) {
        if (!silent) setLoadError(e instanceof Error ? e.message : 'Could not load messages');
      }
    },
    [request],
  );

  const markRead = useCallback(
    async (id: string) => {
      try {
        await request(`/threads/${id}/read`, { method: 'PATCH' });
        setThreads((prev) => (prev ? prev.map((t) => (t.id === id ? { ...t, unread_count: 0 } : t)) : prev));
      } catch {
        /* non-critical: it will retry on the next poll */
      }
    },
    [request],
  );

  const loadMessages = useCallback(
    async (id: string, silent = false) => {
      try {
        const res = await request<Message[]>(`/threads/${id}/messages`);
        if (activeIdRef.current !== id) return; // user switched threads while loading
        const list = res ?? [];
        setMessages(list);
        if (!silent) setMsgError(null);
        if (list.some((m) => m.sender_role === 'client' && !m.read_at)) void markRead(id);
      } catch (e) {
        if (!silent && activeIdRef.current === id) {
          setMsgError(e instanceof Error ? e.message : 'Could not load this conversation');
        }
      }
    },
    [request, markRead],
  );

  useEffect(() => { void loadThreads(); }, [loadThreads]);

  // Not real-time (chat is out of scope for v1): refresh while the tab is visible.
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      void loadThreads(true);
      const id = activeIdRef.current;
      if (id) void loadMessages(id, true);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [loadThreads, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages?.length, activeId]);

  function openThread(id: string) {
    activeIdRef.current = id;
    setActiveId(id);
    setMessages(null);
    setMsgError(null);
    setDraft('');
    setSendError(null);
    void loadMessages(id);
  }

  function closeThread() {
    activeIdRef.current = null;
    setActiveId(null);
    setMessages(null);
  }

  async function send() {
    const body = draft.trim();
    if (!activeId || !body || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const m = await request<Message>(`/threads/${activeId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
      if (m) {
        setMessages((prev) => [...(prev ?? []), m]);
        setThreads((prev) =>
          prev
            ? prev.map((t) =>
                t.id === activeId
                  ? { ...t, last_message: { body: m.body.slice(0, 140), sender_role: 'admin', created_at: m.created_at } }
                  : t,
              )
            : prev,
        );
        setDraft('');
      }
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Could not send. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  }

  const unreadTotal = useMemo(() => (threads ?? []).reduce((n, t) => n + t.unread_count, 0), [threads]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (threads ?? [])
      .filter((t) => {
        if (filter === 'unread' && t.unread_count === 0) return false;
        if (!q) return true;
        return [clientLabel(t), t.client.email ?? '', t.client.company_name ?? '', t.title].some((s) =>
          s.toLowerCase().includes(q),
        );
      })
      .sort((a, b) => {
        if (a.last_message && b.last_message) return b.last_message.created_at.localeCompare(a.last_message.created_at);
        if (a.last_message) return -1;
        if (b.last_message) return 1;
        return a.title.localeCompare(b.title);
      });
  }, [threads, filter, query]);

  const active = threads?.find((t) => t.id === activeId) ?? null;

  /* ───────────── Load / empty states ───────────── */
  if (loadError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Messages</h1>
        <div role="alert" className="rounded-lg border border-error/40 bg-error/10 p-5 text-sm text-error">
          {loadError}{' '}
          <button onClick={() => loadThreads()} className="underline">Retry</button>
        </div>
      </div>
    );
  }

  if (threads === null) {
    return (
      <div className="space-y-6" aria-busy="true">
        <h1 className="text-2xl font-semibold text-on-surface">Messages</h1>
        <div className="h-[28rem] animate-pulse rounded-lg bg-surface-container" />
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Messages</h1>
        <div className="rounded-lg border border-dashed border-outline p-10 text-center">
          <p className="text-on-surface">No engagements yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Each client engagement gets its own conversation. Create one to start messaging.
          </p>
          <Link href="/admin/engagements" className={`${btnPrimary} mt-4 inline-block`}>Go to engagements</Link>
        </div>
      </div>
    );
  }

  /* ───────────── Inbox ───────────── */
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Messages</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          One conversation per engagement. Clients see your replies in their portal.
        </p>
      </div>

      <div className="grid h-[calc(100vh-11rem)] min-h-[32rem] overflow-hidden rounded-lg border border-outline bg-surface-container lg:grid-cols-[22rem_1fr]">
        {/* Thread list */}
        <section
          aria-label="Conversations"
          className={`${activeId ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col border-outline lg:border-r`}
        >
          <div className="space-y-3 border-b border-outline p-4">
            <input
              className={inputCls}
              placeholder="Search client, company, engagement"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search conversations"
            />
            <div className="flex gap-2" role="group" aria-label="Filter conversations">
              {(['all', 'unread'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`rounded-full border px-3.5 py-1 text-sm transition ${
                    filter === f
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {f === 'all' ? 'All' : `Unread (${unreadTotal})`}
                </button>
              ))}
            </div>
          </div>

          <ul className="min-h-0 flex-1 divide-y divide-outline overflow-y-auto">
            {visible.length === 0 ? (
              <li className="p-6 text-center text-sm text-on-surface-variant">
                {filter === 'unread' ? 'No unread messages' : 'No conversations match your search'}
              </li>
            ) : (
              visible.map((t) => {
                const label = clientLabel(t);
                const selected = t.id === activeId;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => openThread(t.id)}
                      aria-current={selected ? 'true' : undefined}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                        selected ? 'bg-surface-container-high' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <span
                        aria-hidden
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-sm font-semibold text-primary"
                      >
                        {initials(label)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={`truncate text-sm ${t.unread_count ? 'font-semibold text-on-surface' : 'font-medium text-on-surface'}`}>
                            {label}
                          </span>
                          {t.last_message && (
                            <span className="shrink-0 text-xs text-on-surface-variant">{fmtListTime(t.last_message.created_at)}</span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-secondary">{t.title}</span>
                        <span className="mt-0.5 flex items-center justify-between gap-2">
                          <span className="truncate text-sm text-on-surface-variant">
                            {t.last_message
                              ? `${t.last_message.sender_role === 'admin' ? 'You: ' : ''}${t.last_message.body}`
                              : 'No messages yet'}
                          </span>
                          {t.unread_count > 0 && (
                            <span
                              aria-label={`${t.unread_count} unread`}
                              className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-on-primary"
                            >
                              {t.unread_count}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </section>

        {/* Conversation */}
        <section
          aria-label="Conversation"
          className={`${activeId ? 'flex' : 'hidden lg:flex'} min-h-0 flex-col`}
        >
          {!active ? (
            <div className="m-auto p-8 text-center">
              <p className="text-on-surface">Select a conversation</p>
              <p className="mt-1 text-sm text-on-surface-variant">Pick an engagement on the left to read and reply.</p>
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 border-b border-outline px-5 py-3">
                <button onClick={closeThread} className="text-sm text-on-surface-variant hover:text-on-surface lg:hidden">
                  Back
                </button>
                <div className="min-w-0">
                  <h2 className="truncate font-medium text-on-surface">{clientLabel(active)}</h2>
                  <p className="truncate text-xs text-on-surface-variant">
                    {active.title}
                    {active.client.company_name ? ` · ${active.client.company_name}` : ''}
                    {active.client.email ? ` · ${active.client.email}` : ''}
                  </p>
                </div>
              </header>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {msgError ? (
                  <div role="alert" className="rounded-DEFAULT border border-error/40 bg-error/10 p-4 text-sm text-error">
                    {msgError}{' '}
                    <button onClick={() => loadMessages(active.id)} className="underline">Retry</button>
                  </div>
                ) : messages === null ? (
                  <div className="space-y-3" aria-busy="true">
                    {[0, 1, 2].map((i) => <div key={i} className="h-12 w-2/3 animate-pulse rounded-lg bg-surface-container-high" />)}
                  </div>
                ) : messages.length === 0 ? (
                  <p className="py-10 text-center text-sm text-on-surface-variant">
                    No messages yet. Send the first one below.
                  </p>
                ) : (
                  messages.map((m) => {
                    const mine = m.sender_role === 'admin';
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                          <p
                            className={`whitespace-pre-wrap break-words rounded-lg px-4 py-2.5 text-sm ${
                              mine ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            {m.body}
                          </p>
                          <span className="mt-1 text-xs text-on-surface-variant">
                            {mine ? 'You' : clientLabel(active)} · {fmtMessageTime(m.created_at)}
                            {mine && m.read_at ? ' · Seen' : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <footer className="space-y-2 border-t border-outline p-4">
                {sendError && (
                  <p role="alert" className="text-sm text-error">{sendError}</p>
                )}
                <div className="flex items-end gap-3">
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    maxLength={4000}
                    placeholder="Write a reply. Press Ctrl/Cmd + Enter to send."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        void send();
                      }
                    }}
                    aria-label="Message"
                  />
                  <button onClick={send} disabled={sending || !draft.trim()} className={btnPrimary}>
                    {sending ? 'Sending' : 'Send'}
                  </button>
                </div>
                {draft.length > 3500 && (
                  <p className="text-right text-xs text-on-surface-variant">{draft.length}/4000</p>
                )}
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
}