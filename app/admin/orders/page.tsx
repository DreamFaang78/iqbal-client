import { Metadata } from 'next';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata: Metadata = {
  title: 'Manage Orders | HOMMED Admin',
  description: 'Internal order management for HOMMED — Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/admin/orders' },
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
