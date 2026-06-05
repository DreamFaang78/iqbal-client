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

// GET: List all orders for the admin dashboard
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { data: orders, error } = await db
      .from('orders')
      .select('*, order_items(*, products(name))')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// PUT: Update order statuses (Admin Only)
export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const { data: updated, error } = await db
      .from('orders')
      .update({
        ...(status && { status }),
        ...(paymentStatus && { payment_status: paymentStatus })
      })
      .eq('id', orderId)
      .select()
      .maybeSingle();

    if (error || !updated) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Order updated successfully.',
      order: updated
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
