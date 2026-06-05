import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

const db = supabaseAdmin || supabase;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    // Use service role to bypass RLS since tracking is public,
    // but we heavily restrict the selected fields for privacy.
    const { data: order, error } = await db
      .from('orders')
      .select('id, total_amount, status, payment_method, payment_status, created_at, order_items(id, quantity, price_at_purchase, products(name, image_url))')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ message: 'Order not found or invalid ID format' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
