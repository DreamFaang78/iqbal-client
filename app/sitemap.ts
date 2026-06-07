import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { DEFAULT_LOCATIONS, DEFAULT_BLOGS } from '@/lib/data';

// Revalidate sitemap cache every 1 hour
export const revalidate = 3600;

// Last time each static section's content was meaningfully updated (ISO date)
const STATIC_CONTENT_LAST_MODIFIED = '2026-06-07';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.hommed.org';

  // 1. Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(STATIC_CONTENT_LAST_MODIFIED),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(STATIC_CONTENT_LAST_MODIFIED),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(STATIC_CONTENT_LAST_MODIFIED),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 2. Service pages from Supabase
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: services } = await supabase
      .from('services')
      .select('slug, created_at');

    if (services) {
      serviceRoutes = services.map((s: any) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.created_at ? new Date(s.created_at) : new Date(STATIC_CONTENT_LAST_MODIFIED),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Error generating services sitemap:', err);
  }

  // 3. Blog articles — merge Supabase blogs + DEFAULT_BLOGS (deduplicated by slug)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: dbBlogs } = await supabase
      .from('blogs')
      .select('slug, published_at');

    const dbSlugs = new Set((dbBlogs || []).map((b: any) => b.slug));

    const dbBlogRoutes: MetadataRoute.Sitemap = (dbBlogs || []).map((b: any) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.published_at ? new Date(b.published_at) : new Date(STATIC_CONTENT_LAST_MODIFIED),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const localBlogRoutes: MetadataRoute.Sitemap = DEFAULT_BLOGS
      .filter(b => !dbSlugs.has(b.slug))
      .map(b => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.publishedAt ? new Date(b.publishedAt) : new Date(STATIC_CONTENT_LAST_MODIFIED),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    blogRoutes = [...dbBlogRoutes, ...localBlogRoutes];
  } catch (err) {
    // Fallback: all DEFAULT_BLOGS
    blogRoutes = DEFAULT_BLOGS.map(b => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.publishedAt ? new Date(b.publishedAt) : new Date(STATIC_CONTENT_LAST_MODIFIED),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    console.error('Error generating blogs sitemap:', err);
  }

  // 4. Local landing pages (Kanpur neighborhoods)
  const locationRoutes: MetadataRoute.Sitemap = DEFAULT_LOCATIONS.map(loc => ({
    url: `${baseUrl}/locations/${loc.slug}`,
    lastModified: new Date(STATIC_CONTENT_LAST_MODIFIED),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...locationRoutes];
}
