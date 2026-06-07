'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('hommed_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-400/10 text-green-400 border-green-400/20';
      case 'Cancelled': return 'bg-red-400/10 text-red-400 border-red-400/20';
      case 'Shipped': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      default: return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0A140C] min-h-screen py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF6E]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A140C] min-h-screen py-12 font-sans relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-[#4CAF6E]" />
              My Orders
            </h1>
          </div>
          <Link href="/shop" className="btn-gold px-6 py-2 rounded-xl font-bold text-sm">
            Shop More
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6">
            <Package className="w-16 h-16 text-[#4CAF6E]/30" />
            <h3 className="text-xl font-bold text-white">No Orders Found</h3>
            <p className="text-white/50 text-sm max-w-sm mx-auto">You haven't placed any orders yet. Start exploring our natural skincare products.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-2xl overflow-hidden shadow-lg">
                
                {/* Order Header */}
                <div className="bg-[#0E1F12] p-4 sm:p-6 border-b border-[#4CAF6E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 text-sm">
                    <div>
                      <p className="text-white/50 mb-1">Order Placed</p>
                      <p className="text-white font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1">Total</p>
                      <p className="text-[#4CAF6E] font-medium font-mono">₹{order.total_amount}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-white/50 mb-1">Order ID</p>
                      <p className="text-white/80 font-mono text-xs">{order.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.payment_status === 'Paid' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'}`}>
                      {order.payment_method}: {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6 divide-y divide-white/5">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-[#0E1F12] rounded-xl flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                        {item.products.image_url ? (
                          <Image src={item.products.image_url.split(',')[0]} alt={item.products.name} fill sizes="64px" className="object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-[#4CAF6E]/30" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-white font-medium">{item.products.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                          <span>Qty: {item.quantity}</span>
                          <span>₹{item.price_at_purchase} each</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-white font-bold block">₹{item.quantity * item.price_at_purchase}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
