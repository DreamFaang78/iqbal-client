import { Metadata } from 'next';
import DashboardOrdersClient from './DashboardOrdersClient';

export const metadata: Metadata = {
  title: 'Your Orders | HOMMED Kanpur',
  description: 'View your order history with HOMMED — Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/dashboard/orders' },
  robots: { index: false, follow: false },
};

export default function DashboardOrdersPage() {
  return <DashboardOrdersClient />;
}
