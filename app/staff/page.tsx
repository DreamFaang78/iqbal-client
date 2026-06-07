import { Metadata } from 'next';
import StaffClient from './StaffClient';

export const metadata: Metadata = {
  title: 'Staff Dashboard | HOMMED Kanpur',
  description: 'Internal staff dashboard for HOMMED — Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/staff' },
  robots: { index: false, follow: false },
};

export default function StaffPage() {
  return <StaffClient />;
}
