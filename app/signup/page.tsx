import { Metadata } from 'next';
import SignupClient from './SignupClient';

export const metadata: Metadata = {
  title: 'Create Account | HOMMED Kanpur',
  description: 'Sign up for a HOMMED patient account to book appointments and track orders with Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/signup' },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupClient />;
}
