import { Metadata } from 'next';
import CheckoutSuccessClient from './CheckoutSuccessClient';

export const metadata: Metadata = {
  title: 'Order Confirmed | HOMMED Kanpur',
  description: 'Your HOMMED order has been placed successfully. Thank you for choosing Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/checkout/success' },
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />;
}
