import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Your Cart | HOMMED Shop Kanpur',
  description: 'Review items in your HOMMED homeopathic shop cart before checkout.',
  alternates: {
    canonical: 'https://www.hommed.org/cart',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartClient />;
}
