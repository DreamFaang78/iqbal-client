import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import Razorpay from 'razorpay';

const db = supabaseAdmin || supabase;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// Helper to verify JWT token and get user ID
async function getAuthUserId(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
  } catch (err) {
    return null;
  }
}

// GET: Retrieve user's orders
export async function GET(request: Request) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data: orders, error } = await db
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(orders, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// POST: Create a new order
export async function POST(request: Request) {
  try {
    // Optional auth for guest checkout support
    const userId = await getAuthUserId(request);
    
    const body = await request.json();
    const { items, paymentMethod, shippingAddress, billingAddress, customerName, customerEmail, customerPhone } = body;

    if (!items || items.length === 0 || !paymentMethod || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ message: 'Missing required order fields.' }, { status: 400 });
    }

    // 1. Calculate total amount and verify products
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const { data: product, error } = await db
        .from('products')
        .select('id, price, stock, is_active')
        .eq('id', item.productId)
        .single();

      if (error || !product || !product.is_active || product.stock < item.quantity) {
        return NextResponse.json({ message: `Product ${item.productId} is invalid or out of stock.` }, { status: 400 });
      }

      subtotal += Number(product.price) * item.quantity;
      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_purchase: product.price
      });
    }

    const SHIPPING_FEE = 99;
    const totalAmount = subtotal + SHIPPING_FEE;

    // 2. Create the order in DB
    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: 'Pending',
        status: 'Pending',
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Create order items
    const orderItemsToInsert = validatedItems.map(item => ({
      order_id: order.id,
      ...item
    }));

    const { error: itemsError } = await db.from('order_items').insert(orderItemsToInsert);
    if (itemsError) throw itemsError;

    // 4. Handle Razorpay or COD
    if (paymentMethod === 'Razorpay') {
      const options = {
        amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: order.id,
      };
      
      const razorpayOrder = await razorpay.orders.create(options);
      
      // Update order with razorpay_order_id
      await db.from('orders').update({ razorpay_order_id: razorpayOrder.id }).eq('id', order.id);

      return NextResponse.json({
        message: 'Order created',
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: options.amount,
        currency: options.currency
      }, { status: 201 });
    } else {
      // COD
      return NextResponse.json({
        message: 'Order created successfully',
        orderId: order.id
      }, { status: 201 });
    }

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
