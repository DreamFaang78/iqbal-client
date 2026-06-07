import { Metadata } from 'next';
import ShopIndexClient from './ShopIndexClient';

export const metadata: Metadata = {
  title: 'Homeopathic Medicine Shop Kanpur | HOMMED Store',
  description: 'Buy genuine homeopathic medicines and wellness products curated by Dr. Iqbal. Trusted remedies for skin, hair, immunity & chronic care, delivered in Kanpur.',
  alternates: {
    canonical: 'https://www.hommed.org/shop',
  },
};

export default function ShopIndexPage() {
  return <ShopIndexClient />;
}
