import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

const db = supabaseAdmin;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }

    // Update order status to Paid
    const { data: order, error } = await db
      .from('orders')
      .update({
        payment_status: 'Paid',
        razorpay_payment_id: razorpay_payment_id
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    // Reduce stock for order items
    const { data: items } = await db
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', order.id);

    if (items) {
      for (const item of items) {
        // Fetch current stock and decrement
        // In a real app we'd use a postgres function or rpc to decrement safely
        const { data: product } = await db
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();
          
        if (product) {
          await db
            .from('products')
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq('id', item.product_id);
        }
      }
    }

    return NextResponse.json({ message: 'Payment verified successfully' }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
