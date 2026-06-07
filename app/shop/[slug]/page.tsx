import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const productName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const title = `${productName} | HOMMED Homeopathic Shop Kanpur`;
  const description = `Buy ${productName} — a genuine homeopathic remedy curated by Dr. Iqbal's HOMMED clinic in Kanpur. Safe, natural and trusted by thousands of patients.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.hommed.org/shop/${slug}`,
    },
  };
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
