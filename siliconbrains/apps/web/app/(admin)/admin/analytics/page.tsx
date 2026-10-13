import type { Metadata } from 'next';
import AnalyticsManager from '@/components/admin/AnalyticsManager';

export const metadata: Metadata = { title: 'Analytics' };

export default function AdminAnalyticsPage() {
  return <AnalyticsManager />;
}