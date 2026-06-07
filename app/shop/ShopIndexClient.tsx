'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';

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

export default function ShopIndex() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          const cats = ['All', ...Array.from(new Set(data.map(p => p.category)))];
          setCategories(cats);
        }
      })
      .catch(() => {
        console.error('Failed to load products');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#0A140C] min-h-screen py-16 font-sans relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-[#4CAF6E]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-[#D4AF37]/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest">Hommed Skincare</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Natural Remedies for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF6E] to-[#D4AF37]">Radiant Skin</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base font-light">
            Explore our curated selection of homeopathic products targeting skin issues and promoting fair, glowing skin safely.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Categories */}
          <div className="flex items-center space-x-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#4CAF6E] text-white shadow-[0_0_20px_rgba(76,175,110,0.3)] border border-[#4CAF6E]'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-11 pl-11 pr-4 bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/20 rounded-xl text-sm text-white placeholder-white/40 focus:border-[#4CAF6E] focus:outline-none focus:ring-1 focus:ring-[#4CAF6E]/50 transition-all"
            />
            <Search className="h-4.5 w-4.5 text-[#4CAF6E] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4CAF6E]"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link href={`/shop/${product.slug}`} key={product.id} className="group">
                <article className="bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(76,175,110,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
                  
                  {/* Image Placeholder or Actual Image */}
                  <div className="relative h-64 overflow-hidden bg-[#0A140C] group-hover:bg-[#0E1F12] transition-colors flex items-center justify-center p-6">
                    {product.image_url ? (
                      <Image src={product.image_url.split(',')[0]} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ShoppingBag className="h-16 w-16 text-[#4CAF6E]/30" />
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider mb-2 block">
                        {product.category}
                      </span>
                      <h3 className="font-heading font-bold text-xl text-white leading-tight mb-2 group-hover:text-[#4CAF6E] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-white/60 text-sm font-light line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                      <span className="text-xl font-bold text-white">
                        ₹{product.price}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#4CAF6E]/10 flex items-center justify-center group-hover:bg-[#4CAF6E] transition-colors">
                        <ArrowRight className="h-4 w-4 text-[#4CAF6E] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#132918]/60 backdrop-blur-md border border-[#4CAF6E]/15 rounded-3xl max-w-md mx-auto space-y-4">
            <ShoppingBag className="h-10 w-10 text-[#4CAF6E]/40 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-white">No Products Found</h3>
            <p className="text-white/50 text-sm font-light">Try adjusting your search or check back later for new arrivals.</p>
          </div>
        )}

      </div>
    </div>
  );
}
