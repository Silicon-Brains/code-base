export type AdminUser = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'client';
  company_name: string | null;
  created_at: string;
  engagement_count: number;
};

export function displayName(u: Pick<AdminUser, 'full_name' | 'email'>): string {
  return u.full_name?.trim() || u.email || 'Unnamed user';
}

export function initials(u: Pick<AdminUser, 'full_name' | 'email'>): string {
  const src = displayName(u);
  const parts = src.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
}