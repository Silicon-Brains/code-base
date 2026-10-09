import type { Metadata } from 'next';
import UsersManager from '@/components/admin/UserManager';

export const metadata: Metadata = { title: 'Users' };

export default function AdminUsersPage() {
  return <UsersManager />;
}