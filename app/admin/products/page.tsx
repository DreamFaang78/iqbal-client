'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, XCircle, Search, ShoppingBag, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem('hommed_token');
      
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const data = await res.json();
      const currentUrls = editProduct.image_url ? editProduct.image_url.split(',').filter(Boolean) : [];
      setEditProduct({ ...editProduct, image_url: [...currentUrls, data.url].join(',') });
    } catch (error: any) {
      alert('Upload failed: ' + (error.message || 'Make sure the "product-images" bucket exists in Supabase and is public.'));
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };
  
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?all=true');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [router]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredProducts(
      products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, products]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('hommed_token');
      const isUpdate = !!editProduct.slug && isEditing;
      const url = isUpdate ? `/api/products/${editProduct.slug}` : '/api/products';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editProduct.name,
          description: editProduct.description,
          price: Number(editProduct.price),
          imageUrl: editProduct.image_url,
          category: editProduct.category,
          stock: Number(editProduct.stock),
          isActive: editProduct.is_active !== undefined ? editProduct.is_active : true
        })
      });

      if (res.ok) {
        fetchProducts();
        setIsEditing(false);
        setEditProduct({});
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0A140C] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF6E]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A140C] min-h-screen font-sans text-white p-4 sm:p-8">
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-white/60 hover:text-[#4CAF6E] transition-colors mb-2 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#4CAF6E]" />
              Products Manager
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#132918] border border-white/10 rounded-xl focus:border-[#4CAF6E] outline-none text-sm w-full sm:w-64"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button 
              onClick={() => {
                setEditProduct({ is_active: true, stock: 10, category: 'Skincare' });
                setIsEditing(true);
              }}
              className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        <div className="bg-[#132918]/60 border border-white/5 rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0E1F12] border-b border-white/10 text-white/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#0E1F12] overflow-hidden border border-white/10 shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url.split(',')[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4 text-white/20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-white/40 text-xs">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-white/70 border border-white/10">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#4CAF6E]">₹{product.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`${product.stock <= 5 ? 'text-red-400' : 'text-white'}`}>
                        {product.stock} units
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${product.is_active ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                        {product.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditProduct(product);
                            setIsEditing(true);
                          }}
                          className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.slug)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#132918] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold">{editProduct.slug ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white"><XCircle className="w-6 h-6"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <form id="product-form" onSubmit={handleSaveProduct} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Product Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-[#0E1F12] border border-white/10 rounded-xl p-3 outline-none focus:border-[#4CAF6E] text-white"
                      value={editProduct.name || ''}
                      onChange={e => setEditProduct({...editProduct, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Category</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-[#0E1F12] border border-white/10 rounded-xl p-3 outline-none focus:border-[#4CAF6E] text-white"
                      value={editProduct.category || ''}
                      onChange={e => setEditProduct({...editProduct, category: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1">Description</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-[#0E1F12] border border-white/10 rounded-xl p-3 outline-none focus:border-[#4CAF6E] text-white resize-y"
                    value={editProduct.description || ''}
                    onChange={e => setEditProduct({...editProduct, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Price (₹)</label>
                    <input 
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full bg-[#0E1F12] border border-white/10 rounded-xl p-3 outline-none focus:border-[#4CAF6E] text-white"
                      value={editProduct.price || ''}
                      onChange={e => setEditProduct({...editProduct, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Stock Quantity</label>
                    <input 
                      required
                      type="number"
                      min="0"
                      className="w-full bg-[#0E1F12] border border-white/10 rounded-xl p-3 outline-none focus:border-[#4CAF6E] text-white"
                      value={editProduct.stock || 0}
                      onChange={e => setEditProduct({...editProduct, stock: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1">Product Images (Upload up to 4)</label>
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <input 
                      type="text"
                      placeholder="Or paste multiple image URLs (comma separated)"
                      className="flex-1 bg-[#0E1F12] border border-white/10 rounded-xl p-3 outline-none focus:border-[#4CAF6E] text-white text-xs"
                      value={editProduct.image_url || ''}
                      onChange={e => setEditProduct({...editProduct, image_url: e.target.value})}
                    />
                    <div className="relative overflow-hidden shrink-0">
                      <button 
                        type="button"
                        disabled={isUploading || (editProduct.image_url ? editProduct.image_url.split(',').filter(Boolean).length >= 4 : false)}
                        className="h-full px-4 py-3 bg-[#1A3322] border border-[#4CAF6E]/30 text-[#4CAF6E] hover:bg-[#20402A] rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 min-w-[140px]"
                      >
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-[#4CAF6E] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <UploadCloud className="w-4 h-4" />
                        )}
                        <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                      </button>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed w-full h-full"
                        disabled={isUploading || (editProduct.image_url ? editProduct.image_url.split(',').filter(Boolean).length >= 4 : false)}
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  
                  {editProduct.image_url && (
                    <div className="flex flex-wrap gap-3">
                      {editProduct.image_url.split(',').filter(Boolean).map((url, index) => (
                        <div key={index} className="w-24 h-24 rounded-xl bg-[#0E1F12] border border-white/10 overflow-hidden relative group">
                          <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => {
                              const newUrls = editProduct.image_url!.split(',').filter(Boolean);
                              newUrls.splice(index, 1);
                              setEditProduct({...editProduct, image_url: newUrls.join(',')});
                            }}
                            className="absolute top-1 right-1 bg-black/60 p-1 rounded hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                          >
                            <XCircle className="w-4 h-4 text-white" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-center py-0.5 text-[#4CAF6E] font-bold">
                              Main Image
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-[#4CAF6E]"
                      checked={editProduct.is_active !== false}
                      onChange={e => setEditProduct({...editProduct, is_active: e.target.checked})}
                    />
                    <span className="text-sm text-white">Product is Active (Visible in Shop)</span>
                  </label>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-white/10 flex gap-4 shrink-0 bg-[#0E1F12]">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 border border-white/10 rounded-xl text-white/80 hover:bg-white/5 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="product-form"
                className="flex-1 btn-gold py-3 rounded-xl font-bold"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
