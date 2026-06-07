import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Patient Login | HOMMED Kanpur',
  description: 'Log in to your HOMMED patient account to manage appointments and orders with Dr. Iqbal\'s Homoeopathic Centre, Kanpur.',
  alternates: {
    canonical: 'https://www.hommed.org/login',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
