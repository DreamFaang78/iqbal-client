import { Metadata } from 'next';
import AdminProductsClient from './AdminProductsClient';

export const metadata: Metadata = {
  title: 'Manage Products | HOMMED Admin',
  description: 'Internal product management for HOMMED — Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/admin/products' },
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
