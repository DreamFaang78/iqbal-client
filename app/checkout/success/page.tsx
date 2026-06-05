'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-[#0A140C] min-h-screen py-20 font-sans relative overflow-hidden flex items-center justify-center">
      {/* Background Ornaments */}
      <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-[#4CAF6E]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 relative z-10 w-full text-center">
        <div className="bg-[#132918]/80 backdrop-blur-md border border-[#4CAF6E]/20 rounded-3xl p-10 sm:p-16 shadow-2xl">
          <div className="w-24 h-24 bg-[#4CAF6E]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#4CAF6E]/30">
            <CheckCircle2 className="w-12 h-12 text-[#4CAF6E]" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Order Successful!
          </h1>
          
          <p className="text-white/60 text-lg mb-10 max-w-md mx-auto">
            Thank you for your purchase. We have received your order and are currently processing it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard/orders" 
              className="w-full sm:w-auto px-8 py-4 bg-[#1A3322] hover:bg-[#20402A] text-white border border-[#4CAF6E]/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              View My Orders
            </Link>
            <Link 
              href="/shop" 
              className="w-full sm:w-auto px-8 py-4 btn-gold rounded-xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
