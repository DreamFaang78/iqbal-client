import { Metadata } from 'next';
import AuthCallbackClient from './AuthCallbackClient';

export const metadata: Metadata = {
  title: 'Signing You In | HOMMED Kanpur',
  description: 'Authentication callback for HOMMED — Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: { canonical: 'https://www.hommed.org/auth/callback' },
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return <AuthCallbackClient />;
}
