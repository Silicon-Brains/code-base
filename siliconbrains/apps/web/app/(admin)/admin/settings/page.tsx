import type { Metadata } from 'next';
import SettingsManager from '@/components/admin/SettingsManager';

export const metadata: Metadata = { title: 'Settings' };

export default function AdminSettingsPage() {
  return <SettingsManager />;
}