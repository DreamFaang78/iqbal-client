import { Metadata } from 'next';
import TrackOrderClient from './TrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Your Order | HOMMED Kanpur',
  description: 'Track your HOMMED homeopathic medicine order status and delivery updates online — fast support from Dr. Iqbal\'s clinic in Kanpur.',
  alternates: {
    canonical: 'https://www.hommed.org/track-order',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
