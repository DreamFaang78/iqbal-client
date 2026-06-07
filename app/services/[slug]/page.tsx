import React from 'react';
import { notFound } from 'next/navigation';
import { DEFAULT_SERVICES, ServiceData } from '@/lib/data';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Metadata } from 'next';
import ServiceContent from './ServiceContent';

const db = supabaseAdmin || supabase;

// Server-side helper to fetch service data by slug
async function getServiceData(slug: string): Promise<ServiceData | null> {
  try {
    const { data } = await db
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data && data.title) {
      return {
        title: data.title,
        slug: data.slug,
        icon: data.icon || 'Activity',
        shortDescription: data.short_description || '',
        detailedDescription: data.detailed_description || '',
        symptoms: data.symptoms || [],
        treatments: data.treatments || []
      };
    }
  } catch (err) {
    console.error('Server side service fetch error, using local fallback:', err);
  }

  const local = DEFAULT_SERVICES.find((s) => s.slug === slug);
  return local || null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO / Open Graph Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await getServiceData(resolvedParams.slug);

  if (!service) {
    return {
      title: 'Specialization Not Found | HOMMED',
    };
  }

  const title = `${service.title} Treatment in Kanpur | Dr. Iqbal`;
  const rawDescription = service.shortDescription || `Advanced homeopathic clinical care for ${service.title} by Dr. Iqbal at Kanpur. Safe, natural treatment with zero side effects.`;
  const description = rawDescription.length > 155 ? `${rawDescription.slice(0, 152).trim()}...` : rawDescription;
  const shareImage = '/logo.png';

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.hommed.org/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://hommed.org/services/${service.slug}`,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `${service.title} Treatment — HOMMED Kanpur`,
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

export default async function ServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = await getServiceData(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  // Sidebar other services filter
  const otherServices = DEFAULT_SERVICES.filter((s) => s.slug !== resolvedParams.slug).slice(0, 5);

  return <ServiceContent service={service} otherServices={otherServices} />;
}
