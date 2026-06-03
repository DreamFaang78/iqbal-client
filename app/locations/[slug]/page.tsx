import React from 'react';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCATIONS, LocationData } from '@/lib/data';
import { Metadata } from 'next';
import LocationContent from './LocationContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render programmatic pages at build-time for maximum SEO and performance
export async function generateStaticParams() {
  return DEFAULT_LOCATIONS.map((loc) => ({
    slug: loc.slug,
  }));
}

// Server helper to fetch location data
async function getLocationData(slug: string): Promise<LocationData | null> {
  const found = DEFAULT_LOCATIONS.find((l) => l.slug === slug);
  return found || null;
}

// Dynamic Open Graph / Twitter Card SEO Tags
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const location = await getLocationData(resolvedParams.slug);

  if (!location) {
    return {
      title: 'Location Not Found | HOMMED',
    };
  }

  const title = `Best Homeopathic Clinic & Doctor in ${location.name}, Kanpur | Dr. Iqbal`;
  const description = `Looking for homeopathy treatment in ${location.name}, Kanpur? Dr. Iqbal offers expert constitutional solutions for Skin, Hair, Thyroid, and Chronic Diseases with zero side effects.`;
  const shareImage = '/logo.png'; // Fallback sharing brand image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://hommed.org/locations/${location.slug}`,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `HOMMED Homeopathic Clinic - ${location.name}, Kanpur`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function LocationPage({ params }: PageProps) {
  const resolvedParams = await params;
  const location = await getLocationData(resolvedParams.slug);

  if (!location) {
    notFound();
  }

  return <LocationContent location={location} />;
}
