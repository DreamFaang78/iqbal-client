import { Metadata } from 'next';
import BookClient from './BookClient';

export const metadata: Metadata = {
  title: 'Book Free Consultation | Dr. Iqbal Homeopathy Kanpur',
  description: 'Book a FREE homeopathy consultation with Dr. Iqbal in Kanpur. Choose your nearest branch and preferred time — skin, hair, thyroid, PCOS & chronic care.',
  alternates: {
    canonical: 'https://www.hommed.org/book',
  },
};

export default function BookPage() {
  return <BookClient />;
}
