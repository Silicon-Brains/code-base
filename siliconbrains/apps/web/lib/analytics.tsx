export type CountRow = { label: string; count: number };

export type Analytics = {
  range_days: 30 | 90 | 365;
  generated_at: string;
  kpis: {
    leads: number;
    leads_prev: number;
    conversion_rate: number | null;
    new_clients: number;
    new_clients_prev: number;
    active_engagements: number;
    avg_progress: number;
    unread_messages: number;
    messages_in_range: number;
  };
  bucket_days: number;
  leads_trend: { start: string; count: number }[];
  lead_status: CountRow[];
  lead_domains: CountRow[];
  lead_budgets: CountRow[];
  phases: CountRow[];
  invoices: { currency: string; paid: number; pending: number; overdue: number; count: number }[];
};

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString('en-US')}`;
  }
}

/** Percent change vs previous period; null when there is nothing to compare against. */
export function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export function bucketLabel(iso: string, bucketDays: number): string {
  const d = new Date(iso);
  return bucketDays >= 30
    ? d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}