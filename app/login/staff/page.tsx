import { Metadata } from 'next';
import StaffLoginClient from './StaffLoginClient';

export const metadata: Metadata = {
  title: 'Staff Login | HOMMED Kanpur',
  description: 'Staff login portal for HOMMED — Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/login/staff' },
  robots: { index: false, follow: false },
};

export default function StaffLoginPage() {
  return <StaffLoginClient />;
}
