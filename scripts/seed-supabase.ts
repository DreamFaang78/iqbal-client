import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Parse env variables manually from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or Service Role Key missing in .env.local!');
  process.exit(1);
}

// Admin client bypasses RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Import seed data manually
import { DEFAULT_SERVICES, DEFAULT_BLOGS } from '../lib/data';

async function seed() {
  console.log('Starting Supabase Seeding...');

  try {
    // 1. Seed Services
    const { data: services, error: servicesError } = await supabase.from('services').select('id');
    if (servicesError) throw servicesError;

    if (!services || services.length === 0) {
      console.log('Seeding default services...');
      const mappedServices = DEFAULT_SERVICES.map(s => ({
        title: s.title,
        slug: s.slug,
        icon: s.icon,
        short_description: s.shortDescription,
        detailed_description: s.detailedDescription,
        symptoms: s.symptoms,
        treatments: s.treatments
      }));

      const { error } = await supabase.from('services').insert(mappedServices);
      if (error) throw error;
      console.log('Successfully seeded services!');
    } else {
      console.log('Services table already has data. Skipping.');
    }

    // 2. Seed Blogs
    const { data: blogs, error: blogsError } = await supabase.from('blogs').select('id');
    if (blogsError) throw blogsError;

    if (!blogs || blogs.length === 0) {
      console.log('Seeding default blogs...');
      const mappedBlogs = DEFAULT_BLOGS.map(b => ({
        title: b.title,
        slug: b.slug,
        category: b.category,
        content: b.content,
        excerpt: b.excerpt,
        author: b.author,
        published_at: b.publishedAt,
        image: b.image || null
      }));

      const { error } = await supabase.from('blogs').insert(mappedBlogs);
      if (error) throw error;
      console.log('Successfully seeded blogs!');
    } else {
      console.log('Blogs table already has data. Skipping.');
    }

    // 3. Seed Popups
    const { data: popups, error: popupsError } = await supabase.from('popups').select('id');
    if (popupsError) throw popupsError;

    if (!popups || popups.length === 0) {
      console.log('Seeding default popups...');
      const defaultPopups = [
        { type: 'appointment', title: 'Need Homeopathy Consultation?', content: 'Book your digital wellness consult today and get 10% off your first medicine dispatch.', is_active: true, delay_seconds: 5 },
        { type: 'whatsapp', title: 'Consult Dr. Iqbal on WhatsApp', content: 'Get instant answers for your healthcare inquiries directly from the doctor.', is_active: true, delay_seconds: 3 },
        { type: 'exit', title: 'Wait! Don\'t Leave Empty-Handed', content: 'Drop your details below to download Dr. Iqbal\'s "Natural Homeopathy Health Guide" for free.', is_active: false, delay_seconds: 0 },
        { type: 'offer', title: 'Special Monsoon Wellness Offer', content: 'Free thyroid screen with every chronic allergy package.', is_active: false, delay_seconds: 10 }
      ];

      const { error } = await supabase.from('popups').insert(defaultPopups);
      if (error) throw error;
      console.log('Successfully seeded popups!');
    } else {
      console.log('Popups table already has data. Skipping.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('Seeding encountered an error:', err.message || err);
    process.exit(1);
  }
}

seed();
