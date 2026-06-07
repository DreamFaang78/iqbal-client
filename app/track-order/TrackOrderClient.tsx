'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Package, CheckCircle, Clock, Truck, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

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

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialId = searchParams?.get('id') || '';
  const [searchId, setSearchId] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/${id.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        // Update URL quietly
        window.history.replaceState({}, '', `/track-order?id=${id.trim()}`);
      } else {
        setError('Order not found. Please verify the Order ID.');
      }
    } catch (err) {
      setError('An error occurred while tracking. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  const getStatusProgress = (status: string) => {
    if (status === 'Delivered') return 100;
    if (status === 'Shipped') return 66;
    if (status === 'Processing') return 33;
    return 10; // Pending
  };

  return (
    <div className="bg-[#0A140C] min-h-screen py-20 font-sans relative">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#4CAF6E]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Package className="w-8 h-8 text-[#4CAF6E]" />
            Track Your Order
          </h1>
          <p className="text-white/60">Enter your Order ID below to check its current status.</p>
        </div>

        <div className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-grow bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#4CAF6E] outline-none font-mono text-sm"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-4 bg-[#4CAF6E] hover:bg-[#45a049] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px]"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <><Search className="w-5 h-5" /> Track</>}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3 mb-8">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {order && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Card */}
            <div className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <p className="text-white/50 text-sm mb-1">Order ID</p>
                  <p className="text-white font-mono text-sm">{order.id}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-white/50 text-sm mb-1">Order Placed</p>
                  <p className="text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative pt-4 pb-8">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[#0E1F12] border border-white/5">
                  <div style={{ width: `${getStatusProgress(order.status)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#4CAF6E] transition-all duration-1000"></div>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-medium text-white/60 px-1">
                  <span className={`flex flex-col items-center gap-2 ${getStatusProgress(order.status) >= 10 ? 'text-[#4CAF6E]' : ''}`}>
                    <Clock className="w-5 h-5" /> Pending
                  </span>
                  <span className={`flex flex-col items-center gap-2 ${getStatusProgress(order.status) >= 66 ? 'text-[#4CAF6E]' : ''}`}>
                    <Truck className="w-5 h-5" /> Shipped
                  </span>
                  <span className={`flex flex-col items-center gap-2 ${getStatusProgress(order.status) >= 100 ? 'text-[#4CAF6E]' : ''}`}>
                    <CheckCircle className="w-5 h-5" /> Delivered
                  </span>
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-heading font-bold text-white text-xl">Order Items</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.payment_status === 'Paid' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'}`}>
                  {order.payment_method}: {order.payment_status}
                </span>
              </div>
              <div className="p-6 sm:p-8 divide-y divide-white/5">
                {order.order_items.map(item => (
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
                      <p className="text-sm text-white/50 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold block">₹{item.price_at_purchase * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#0E1F12] p-6 sm:p-8 border-t border-[#4CAF6E]/10 flex justify-between items-center">
                <span className="text-white/60">Total Amount</span>
                <span className="text-[#D4AF37] font-bold text-2xl">₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="bg-[#0A140C] min-h-screen"></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
