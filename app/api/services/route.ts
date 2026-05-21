import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { DEFAULT_SERVICES } from '@/lib/data';

const db = supabaseAdmin || supabase;

// Helper to verify JWT token and check if user is admin
async function verifyAdminToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;

    const { data: profile } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return profile?.role === 'admin' || user.email?.toLowerCase() === 'admin@hommed.com';
  } catch (err) {
    return false;
  }
}

function mapService(s: any) {
  return {
    _id: s.id,
    title: s.title,
    slug: s.slug,
    icon: s.icon,
    shortDescription: s.short_description,
    detailedDescription: s.detailed_description,
    symptoms: s.symptoms || [],
    treatments: s.treatments || []
  };
}

// GET: Retrieve all services or single service by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const { data: service, error } = await db
        .from('services')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !service) {
        // Fallback local search
        const found = DEFAULT_SERVICES.find(s => s.slug === slug);
        if (found) return NextResponse.json(found, { status: 200 });
        return NextResponse.json({ message: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json(mapService(service), { status: 200 });
    }

    const { data: services, error } = await db
      .from('services')
      .select('*')
      .order('title', { ascending: true });

    if (error || !services || services.length === 0) {
      return NextResponse.json(DEFAULT_SERVICES, { status: 200 });
    }
    return NextResponse.json(services.map(mapService), { status: 200 });

  } catch (err: any) {
    // Graceful fallback to default data
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (slug) {
      const found = DEFAULT_SERVICES.find(s => s.slug === slug);
      if (found) return NextResponse.json(found, { status: 200 });
      return NextResponse.json({ message: 'Service not found (DB down)' }, { status: 404 });
    }
    return NextResponse.json(DEFAULT_SERVICES, { status: 200 });
  }
}

// POST: Create a new service (Admin Only)
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, icon, shortDescription, detailedDescription, symptoms, treatments } = body;

    if (!title || !icon || !shortDescription || !detailedDescription) {
      return NextResponse.json({ message: 'Missing required service fields.' }, { status: 400 });
    }

    // Auto-generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const { data: newService, error } = await db
      .from('services')
      .insert({
        title,
        slug,
        icon,
        short_description: shortDescription,
        detailed_description: detailedDescription,
        symptoms: symptoms || [],
        treatments: treatments || []
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Service created successfully!',
      service: mapService(newService)
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// PUT: Update an existing service (Admin Only)
export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, icon, shortDescription, detailedDescription, symptoms, treatments } = body;

    if (!id) {
      return NextResponse.json({ message: 'Service ID is required' }, { status: 400 });
    }

    const { data: updated, error } = await db
      .from('services')
      .update({
        ...(title && { title, slug: title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') }),
        ...(icon && { icon }),
        ...(shortDescription && { short_description: shortDescription }),
        ...(detailedDescription && { detailed_description: detailedDescription }),
        ...(symptoms && { symptoms }),
        ...(treatments && { treatments })
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Service updated successfully.',
      service: mapService(updated)
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete a service (Admin Only)
export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Service ID is required' }, { status: 400 });
    }

    const { data, error } = await db
      .from('services')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Service deleted successfully.' }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
