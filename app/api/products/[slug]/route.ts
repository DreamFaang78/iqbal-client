import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const db = supabaseAdmin || supabase;

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

// GET: Retrieve a single product by slug
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;

    const { data: product, error } = await db
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// PUT: Update an existing product (Admin Only)
export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { slug } = await context.params;
    const body = await request.json();
    const { name, description, price, imageUrl, category, stock, isActive } = body;

    const { data: updated, error } = await db
      .from('products')
      .update({
        ...(name && { name, slug: name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(imageUrl !== undefined && { image_url: imageUrl }),
        ...(category && { category }),
        ...(stock !== undefined && { stock }),
        ...(isActive !== undefined && { is_active: isActive })
      })
      .eq('slug', slug)
      .select()
      .maybeSingle();

    if (error || !updated) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product updated successfully.',
      product: updated
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete a product (Admin Only)
export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { slug } = await context.params;

    const { data, error } = await db
      .from('products')
      .delete()
      .eq('slug', slug)
      .select()
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully.' }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
