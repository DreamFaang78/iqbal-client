import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Patient Dashboard | HOMMED Kanpur',
  description: 'Manage your appointments and orders with Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/dashboard' },
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
