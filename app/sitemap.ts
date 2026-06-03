import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

// Revalidate sitemap cache every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hommed.org';

  // 1. Core static routes of the website
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 2. Dynamic Specialization/Services pages (fetched directly from Supabase)
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: services } = await supabase
      .from('services')
      .select('slug, created_at');

    if (services) {
      serviceRoutes = services.map(s => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.created_at ? new Date(s.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Error generating services sitemap:', err);
  }

  // 3. Dynamic Medical Blog articles (fetched directly from Supabase)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, published_at');

    if (blogs) {
      blogRoutes = blogs.map(b => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.published_at ? new Date(b.published_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error('Error generating blogs sitemap:', err);
  }

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
