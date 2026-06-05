import React from 'react';
import { notFound } from 'next/navigation';
import { DEFAULT_BLOGS, BlogData } from '@/lib/data';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Metadata } from 'next';
import BlogContent from './BlogContent';

const db = supabaseAdmin || supabase;

// Server-side helper to fetch blog data by slug
async function getBlogData(slug: string): Promise<BlogData | null> {
  try {
    const { data } = await db
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data && data.title) {
      return {
        title: data.title,
        slug: data.slug,
        category: data.category || 'General Health',
        content: data.content,
        excerpt: data.excerpt || '',
        author: data.author || 'Dr. Iqbal',
        publishedAt: data.published_at || new Date().toISOString(),
        image: data.image || undefined
      };
    }
  } catch (err) {
    console.error('Server side blog fetch error, using local fallback:', err);
  }

  // Fallback to local
  const local = DEFAULT_BLOGS.find((b) => b.slug === slug);
  return local || null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO / Open Graph Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await getBlogData(resolvedParams.slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found | HOMMED',
    };
  }

  const title = `${blog.title} | HOMMED Medical Blog`;
  const description = blog.excerpt || 'Read medical insights and holistic health articles from Dr. Iqbal\'s Homoeopathic Centre.';
  const shareImage = blog.image || '/logo.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://hommed.org/blog/${blog.slug}`,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.publishedAt,
      authors: [blog.author || 'Dr. Iqbal'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const blog = await getBlogData(resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  // Sidebar recent posts
  const otherPosts = DEFAULT_BLOGS.filter((b) => b.slug !== resolvedParams.slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: blog.title,
    description: blog.excerpt,
    url: `https://www.hommed.org/blog/${blog.slug}`,
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    author: {
      '@type': 'Physician',
      name: 'Dr. Iqbal Quasim',
      jobTitle: 'Chief Homeopathic Physician',
      medicalSpecialty: 'Homeopathy',
      worksFor: {
        '@type': 'MedicalClinic',
        name: 'HOMMED Homoeopathic Centre',
        url: 'https://www.hommed.org',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kanpur',
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'IN',
        },
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'HOMMED Homoeopathic Centre',
      url: 'https://www.hommed.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.hommed.org/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.hommed.org/blog/${blog.slug}`,
    },
    about: {
      '@type': 'MedicalCondition',
      name: blog.category,
    },
    inLanguage: 'hi-IN',
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogContent blog={blog} otherPosts={otherPosts} />
    </>
  );
}

