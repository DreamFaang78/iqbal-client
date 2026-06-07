import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | HOMMED Shop Kanpur',
  description: 'Complete your homeopathic medicine order from HOMMED — Dr. Iqbal\'s clinic in Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
