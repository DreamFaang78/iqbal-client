import { Metadata } from 'next';
import BlogIndexClient from './BlogIndexClient';

export const metadata: Metadata = {
  title: 'Homeopathy Blog Kanpur | Health Articles by Dr. Iqbal',
  description: 'Read homeopathy health articles by Dr. Iqbal — skin, hair fall, thyroid, PCOS, allergies & chronic disease care tips for Kanpur patients.',
  alternates: {
    canonical: 'https://www.hommed.org/blog',
  },
};

export default function BlogIndexPage() {
  return <BlogIndexClient />;
}
