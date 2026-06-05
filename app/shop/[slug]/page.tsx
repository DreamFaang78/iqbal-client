'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, Plus, Minus, Share2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const productImages = product?.image_url ? product.image_url.split(',').filter(Boolean) : [];

  useEffect(() => {
    if (slug) {
      fetch(`/api/products/${slug}`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => setProduct(data))
        .catch(() => console.error('Error fetching product'))
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    const cart = JSON.parse(localStorage.getItem('hommed_cart') || '[]');
    const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
      // Ensure we don't exceed stock
      if (cart[existingItemIndex].quantity > product.stock) {
        cart[existingItemIndex].quantity = product.stock;
      }
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity
      });
    }

    localStorage.setItem('hommed_cart', JSON.stringify(cart));
    
    // Dispatch custom event to notify Navbar/other components
    window.dispatchEvent(new Event('cart-updated'));

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/checkout?product=${product?.slug}&qty=${quantity}`;
    navigator.clipboard.writeText(url);
    alert('Quick Order link copied! Share this link to let customers order directly.');
  };

  if (isLoading) {
    return (
      <div className="bg-[#0A140C] min-h-screen py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF6E]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#0A140C] min-h-screen py-16 flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <Link href="/shop" className="text-[#4CAF6E] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0A140C] min-h-screen py-12 font-sans relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#4CAF6E]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link href="/shop" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.3)] aspect-square flex items-center justify-center relative">
              {productImages.length > 0 ? (
                <img src={productImages[activeImage]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
              ) : (
                <div className="text-center p-8">
                  <ShoppingBag className="w-24 h-24 text-[#4CAF6E]/30 mx-auto mb-4" />
                  <p className="text-white/30 text-sm">No image available</p>
                </div>
              )}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold tracking-widest uppercase">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${activeImage === idx ? 'border-[#4CAF6E] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2 block">
                {product.category}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-[#4CAF6E]">
                ₹{product.price}
              </p>
            </div>

            <p className="text-white/70 text-base leading-relaxed font-light">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex flex-col space-y-3">
                  <label className="text-sm font-medium text-white/60">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-[#132918] border border-[#4CAF6E]/30 rounded-xl">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 text-white/60 hover:text-white hover:bg-[#4CAF6E]/10 transition-colors rounded-l-xl"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-white font-medium">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-3 text-white/60 hover:text-white hover:bg-[#4CAF6E]/10 transition-colors rounded-r-xl"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-white/40">{product.stock} items left</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-gold py-4 px-8 rounded-xl font-bold text-sm sm:text-base flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" /> Add to Cart
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      handleAddToCart();
                      router.push('/cart');
                    }}
                    className="flex-1 bg-white text-[#0A140C] py-4 px-4 sm:px-8 rounded-xl font-bold text-sm sm:text-base text-center hover:bg-slate-100 transition-colors"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleShareLink}
                    className="bg-[#4CAF6E]/20 text-[#4CAF6E] py-4 px-4 rounded-xl hover:bg-[#4CAF6E]/30 transition-colors flex justify-center items-center group"
                    title="Copy Direct Order Link"
                  >
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#4CAF6E]/10 rounded-lg shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#4CAF6E]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">100% Authentic</h4>
                  <p className="text-white/50 text-xs">Directly from Dr. Iqbal's pharmacy.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#D4AF37]/10 rounded-lg shrink-0">
                  <Truck className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">Secure Delivery</h4>
                  <p className="text-white/50 text-xs">Shipped safely to your doorstep.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
