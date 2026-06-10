'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('hommed_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('hommed_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = cart.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart);
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter(item => item.productId !== productId);
    updateCart(newCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 99;
  const totalAmount = subtotal + shippingFee;

  if (!isLoaded) return null;

  return (
    <div className="bg-[#0A140C] min-h-screen py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#4CAF6E]" />
            Your Cart
          </h1>
          <Link href="/shop" className="text-white/60 hover:text-[#4CAF6E] transition-colors text-sm font-medium flex items-center gap-2">
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-lg">
            <div className="w-24 h-24 bg-[#4CAF6E]/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-[#4CAF6E]/50" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-white/50 text-sm">Looks like you haven't added anything to your cart yet.</p>
            </div>
            <Link href="/shop" className="btn-gold px-8 py-3 rounded-xl font-bold">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* Image */}
                  <div className="relative w-full sm:w-24 h-32 sm:h-24 bg-[#0E1F12] rounded-xl flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                    {item.image_url ? (
                      <Image src={item.image_url.split(',')[0]} alt={item.name} fill sizes="96px" className="object-cover" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-[#4CAF6E]/30" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow space-y-2 w-full">
                    <div className="flex justify-between items-start pr-8 sm:pr-0">
                      <h3 className="font-heading font-bold text-white text-lg">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-red-400 hover:text-red-300 p-2 sm:p-0 absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-[#4CAF6E] font-bold">₹{item.price}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-[#0A140C] border border-[#4CAF6E]/20 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 text-white/60 hover:text-white hover:bg-[#4CAF6E]/20 transition-colors rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-white text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 text-white/60 hover:text-white hover:bg-[#4CAF6E]/20 transition-colors rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-white font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-[#132918]/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(212,175,55,0.1)] sticky top-24">
              <h2 className="font-heading text-xl font-bold text-white mb-6 pb-4 border-b border-white/10">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Shipping</span>
                  <span className="text-[#4CAF6E]">₹{shippingFee}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white font-bold">Estimated Total</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">₹{totalAmount}</span>
                </div>
              </div>

              <button 
                onClick={() => router.push('/checkout')}
                className="w-full btn-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-xs">
                <span>Secure Checkout Process</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
