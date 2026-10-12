export type Message = {
  id: string;
  client_project_id: string;
  sender_role: 'admin' | 'client';
  body: string;
  read_at: string | null;
  created_at: string;
};

export type Thread = {
  id: string; // client_project_id
  title: string;
  client: {
    id: string;
    full_name: string | null;
    email: string | null;
    company_name: string | null;
  };
  unread_count: number;
  last_message: { body: string; sender_role: 'admin' | 'client'; created_at: string } | null;
};

export function clientLabel(t: Pick<Thread, 'client'>): string {
  return t.client.full_name?.trim() || t.client.email || 'Unnamed client';
}

export function initials(label: string): string {
  const parts = label.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
}

/** List timestamp: time if today, otherwise a short date. */
export function fmtListTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}),
  });
}

export function fmtMessageTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
