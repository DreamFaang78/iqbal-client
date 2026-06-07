import { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | HOMMED Kanpur',
  description: 'Internal admin dashboard for HOMMED — Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/admin' },
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
