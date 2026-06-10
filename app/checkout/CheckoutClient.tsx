'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import Script from 'next/script';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    // Quick Buy Feature Check
    const searchParams = new URLSearchParams(window.location.search);
    const quickProductSlug = searchParams.get('product');
    const quickQty = parseInt(searchParams.get('qty') || '1', 10);

    if (quickProductSlug) {
      fetch(`/api/products/${quickProductSlug}`)
        .then(res => res.json())
        .then(product => {
          if (product && !product.message) {
            setCart([{
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: quickQty > 0 ? quickQty : 1
            }]);
            setIsLoaded(true);
          } else {
            router.push('/shop');
          }
        })
        .catch(() => router.push('/shop'));
    } else {
      const savedCart = localStorage.getItem('hommed_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.length === 0) {
            router.push('/cart');
          } else {
            setCart(parsedCart);
          }
        } catch (e) {
          router.push('/cart');
        }
      } else {
        router.push('/cart');
      }
      setIsLoaded(true);
    }

  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 99;
  const totalAmount = subtotal + shippingFee;

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderPayload = {
        items: cart,
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          line1: formData.addressLine1,
          line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        billingAddress: {
          line1: formData.addressLine1,
          line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone
      };

      const token = localStorage.getItem('hommed_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      if (formData.paymentMethod === 'Razorpay') {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key', 
          amount: data.amount,
          currency: data.currency,
          name: "HomMed Clinic",
          description: "Purchase from HomMed Shop",
          order_id: data.razorpayOrderId,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch('/api/razorpay/callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (verifyRes.ok) {
              // Success
              localStorage.removeItem('hommed_cart');
              window.dispatchEvent(new Event('cart-updated'));
              router.push('/checkout/success');
            } else {
              alert('Payment verification failed.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#4CAF6E"
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          alert(`Payment Failed: ${response.error.description}`);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // COD Success
        localStorage.removeItem('hommed_cart');
        window.dispatchEvent(new Event('cart-updated'));
        router.push('/checkout/success?order=' + data.orderId);
      }
    } catch (err: any) {
      alert(err.message);
      setIsProcessing(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="bg-[#0A140C] min-h-screen py-12 font-sans relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[20%] left-[-10%] w-[40rem] h-[40rem] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="font-heading text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={processPayment} className="space-y-8">
              
              {/* Contact Info */}
              <div className="bg-[#132918]/80 backdrop-blur-md border border-[#4CAF6E]/20 rounded-3xl p-6 sm:p-8 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#4CAF6E]/20 text-[#4CAF6E] flex items-center justify-center text-sm">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-white/70 text-sm">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/70 text-sm">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-white/70 text-sm">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#132918]/80 backdrop-blur-md border border-[#4CAF6E]/20 rounded-3xl p-6 sm:p-8 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#4CAF6E]/20 text-[#4CAF6E] flex items-center justify-center text-sm">2</span>
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-white/70 text-sm">Address Line 1</label>
                    <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} className="w-full bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/70 text-sm">Address Line 2 (Optional)</label>
                    <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} className="w-full bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-white/70 text-sm">City</label>
                      <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50" />
                    </div>
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-white/70 text-sm">State</label>
                      <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50" />
                    </div>
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-white/70 text-sm">PIN Code</label>
                      <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-[#0E1F12] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#132918]/80 backdrop-blur-md border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-sm">3</span>
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'bg-[#4CAF6E]/10 border-[#4CAF6E]' : 'bg-[#0E1F12] border-white/10 hover:border-white/30'}`}>
                    <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleInputChange} className="w-5 h-5 accent-[#4CAF6E]" />
                    <div className="flex-grow">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#4CAF6E]" />
                        Cash on Delivery
                      </h4>
                      <p className="text-white/50 text-sm">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>
              </div>

            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl p-6 shadow-lg sticky top-24">
              <h2 className="font-heading text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      <p className="text-white/50 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#4CAF6E] font-medium text-sm whitespace-nowrap">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10 mb-6">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Shipping</span>
                  <span className="text-[#4CAF6E]">₹{shippingFee}</span>
                </div>
                <div className="pt-3 flex justify-between items-center border-t border-white/10 mt-3">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">₹{totalAmount}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full btn-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${totalAmount}`}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
