import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

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

// GET: Retrieve all active products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = db.from('products').select('*').eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: products, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// POST: Create a new product (Admin Only)
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, imageUrl, category, stock } = body;

    if (!name || !price) {
      return NextResponse.json({ message: 'Missing required product fields.' }, { status: 400 });
    }

    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const { data: newProduct, error } = await db
      .from('products')
      .insert({
        name,
        slug,
        description,
        price,
        image_url: imageUrl,
        category,
        stock: stock || 0
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Product created successfully!',
      product: newProduct
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
