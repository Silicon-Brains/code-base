'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import { type Analytics, type CountRow, bucketLabel, formatMoney, pctChange } from '@/lib/analytics';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const RANGES = [
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
  { days: 365, label: '12 months' },
] as const;

const btnOutline =
  'rounded-full border border-outline px-5 py-2 text-sm font-medium text-on-surface transition hover:border-primary disabled:opacity-50';

export default function AnalyticsManager() {
  const { getToken } = useAuth();
  const [days, setDays] = useState<30 | 90 | 365>(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (range: number) => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const res = await fetch(`${API}/api/admin/analytics?days=${range}`, {
          cache: 'no-store',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? `Request failed (${res.status})`);
        }
        setData((await res.json()) as Analytics);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load analytics');
      } finally {
        setLoading(false);
      }
    },
    [getToken],
  );

  useEffect(() => { void load(days); }, [load, days]);

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Analytics</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Figures come from your own records (leads, clients, engagements, invoices), not website traffic.
        </p>
      </div>
      <div className="flex gap-2" role="group" aria-label="Date range">
        {RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => setDays(r.days)}
            aria-pressed={days === r.days}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              days === r.days
                ? 'border-primary bg-primary text-on-primary'
                : 'border-outline text-on-surface-variant hover:border-primary'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (error && !data) {
    return (
      <div className="space-y-6">
        {header}
        <div role="alert" className="rounded-lg border border-error/40 bg-error/10 p-5 text-sm text-error">
          {error}{' '}
          <button onClick={() => load(days)} className="underline">Retry</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6" aria-busy="true">
        {header}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-surface-container" />)}
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-surface-container" />
      </div>
    );
  }

  const k = data.kpis;
  const period = RANGES.find((r) => r.days === data.range_days)?.label ?? `${data.range_days} days`;

  return (
    <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
      {header}

      {error && (
        <p role="alert" className="rounded-DEFAULT border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}{' '}
          <button onClick={() => load(days)} className="underline">Retry</button>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Leads" value={String(k.leads)} delta={pctChange(k.leads, k.leads_prev)} prev={k.leads_prev} period={period} />
        <Kpi
          label="Conversion rate"
          value={k.conversion_rate === null ? 'No data' : `${k.conversion_rate}%`}
          note="Leads marked converted"
        />
        <Kpi
          label="New clients"
          value={String(k.new_clients)}
          delta={pctChange(k.new_clients, k.new_clients_prev)}
          prev={k.new_clients_prev}
          period={period}
        />
        <Kpi label="Active engagements" value={String(k.active_engagements)} note={`${k.avg_progress}% average progress`} />
        <Kpi
          label="Unread client messages"
          value={String(k.unread_messages)}
          note={`${k.messages_in_range} messages in ${period}`}
        />
      </div>

      <Card title="Leads over time" subtitle={`Contact-form enquiries, last ${period}`}>
        <TrendBars data={data.leads_trend} bucketDays={data.bucket_days} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Lead pipeline" subtitle="Current status of leads received in this period">
          <BarList rows={data.lead_status} empty="No leads in this period" capitalize />
        </Card>
        <Card title="Engagements by phase" subtitle="All client engagements right now">
          <BarList rows={data.phases} empty="No engagements yet" />
        </Card>
        <Card title="Services requested" subtitle="Project types chosen on the contact form">
          <BarList rows={data.lead_domains} empty="No leads in this period" />
        </Card>
        <Card title="Budget ranges" subtitle="Budget selected on the contact form">
          <BarList rows={data.lead_budgets} empty="No leads in this period" />
        </Card>
      </div>

      <Card title="Invoices" subtitle={`Issued in the last ${period}`}>
        {data.invoices.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No invoices issued in this period</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-outline text-on-surface-variant">
                  <th className="py-2 pr-4 font-medium">Currency</th>
                  <th className="py-2 pr-4 font-medium">Paid</th>
                  <th className="py-2 pr-4 font-medium">Pending</th>
                  <th className="py-2 pr-4 font-medium">Overdue</th>
                  <th className="py-2 font-medium">Invoices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline text-on-surface">
                {data.invoices.map((r) => (
                  <tr key={r.currency}>
                    <td className="py-3 pr-4 font-medium">{r.currency}</td>
                    <td className="py-3 pr-4">{formatMoney(r.paid, r.currency)}</td>
                    <td className="py-3 pr-4">{formatMoney(r.pending, r.currency)}</td>
                    <td className={`py-3 pr-4 ${r.overdue > 0 ? 'text-error' : ''}`}>{formatMoney(r.overdue, r.currency)}</td>
                    <td className="py-3">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span>Updated {new Date(data.generated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        <button onClick={() => load(days)} disabled={loading} className={btnOutline}>Refresh</button>
      </div>
    </div>
  );
}

function Kpi({
  label, value, delta, prev, period, note,
}: { label: string; value: string; delta?: number | null; prev?: number; period?: string; note?: string }) {
  return (
    <div className="rounded-lg border border-outline bg-surface-container p-5">
      <p className="text-sm text-on-surface-variant">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-on-surface">{value}</p>
      <p className="mt-1.5 text-xs text-on-surface-variant">
        {delta !== undefined ? (
          delta === null ? (
            prev === 0 ? `No data in the previous ${period}` : ''
          ) : (
            <>
              <span className={delta >= 0 ? 'text-primary' : 'text-error'}>
                {delta >= 0 ? '+' : ''}{delta}%
              </span>{' '}
              vs previous {period}
            </>
          )
        ) : (
          note
        )}
      </p>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-outline bg-surface-container p-5">
      <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
      <p className="mb-5 mt-0.5 text-sm text-on-surface-variant">{subtitle}</p>
      {children}
    </section>
  );
}

function BarList({ rows, empty, capitalize }: { rows: CountRow[]; empty: string; capitalize?: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  const total = rows.reduce((n, r) => n + r.count, 0);
  if (rows.length === 0 || total === 0) return <p className="text-sm text-on-surface-variant">{empty}</p>;
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className={`truncate text-on-surface ${capitalize ? 'capitalize' : ''}`}>{r.label}</span>
            <span className="shrink-0 text-on-surface-variant">{r.count}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function TrendBars({ data, bucketDays }: { data: { start: string; count: number }[]; bucketDays: number }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((n, d) => n + d.count, 0);
  if (total === 0) return <p className="text-sm text-on-surface-variant">No leads in this period</p>;

  const labelAt = new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]);
  return (
    <div role="img" aria-label={`Bar chart of leads over time, ${total} in total`}>
      <div className="flex h-44 items-end gap-1">
        {data.map((d, i) => (
          <div key={d.start} className="group relative flex h-full flex-1 items-end" title={`${bucketLabel(d.start, bucketDays)}: ${d.count}`}>
            <div
              className="w-full rounded-t-sm bg-primary/80 transition group-hover:bg-primary"
              style={{ height: d.count === 0 ? '2px' : `${Math.max(4, (d.count / max) * 100)}%`, opacity: d.count === 0 ? 0.25 : 1 }}
            />
            {labelAt.has(i) && (
              <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-on-surface-variant">
                {bucketLabel(d.start, bucketDays)}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="h-6" />
      <p className="text-xs text-on-surface-variant">
        {bucketDays === 1 ? 'Per day' : bucketDays === 7 ? 'Per week' : 'Per 30 days'} · peak {max}
      </p>
    </div>
  );
}