'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Search, Edit2 } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: {
    name: string;
  };
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: any;
  created_at: string;
  order_items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('hommed_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setFilteredOrders(data);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [router]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredOrders(
      orders.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
      )
    );
  }, [searchQuery, orders]);

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus: string) => {
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status, paymentStatus })
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
      } else {
        alert('Failed to update order');
      }
    } catch (err) {
      console.error(err);
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
            <h1 className="text-3xl font-bold font-heading">Order Management</h1>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search ID, Name, Phone..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#132918] border border-white/10 rounded-xl focus:border-[#4CAF6E] outline-none text-sm w-full sm:w-64"
            />
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="bg-[#132918]/60 border border-white/5 rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0E1F12] border-b border-white/10 text-white/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID & Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-white/80">{order.id.slice(0, 8)}...</p>
                      <p className="text-white/40 text-xs mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-white/40 text-xs">{order.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{order.order_items.length} items</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#4CAF6E]">₹{order.total_amount}</p>
                      <p className="text-[10px] text-white/40 mt-1 uppercase">{order.payment_method}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${order.payment_status === 'Paid' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors inline-flex items-center justify-center"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Edit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#132918] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Update Order {selectedOrder.id.slice(0,8)}...</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-white/50 hover:text-white"><XCircle className="w-6 h-6"/></button>
            </div>
            
            <div className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Order Status</label>
                <select 
                  className="w-full bg-[#0E1F12] border border-white/10 rounded-xl p-3 outline-none focus:border-[#4CAF6E]"
                  defaultValue={selectedOrder.status}
                  id="order-status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Payment Status</label>
                <select 
                  className="w-full bg-[#0E1F12] border border-white/10 rounded-xl p-3 outline-none focus:border-[#4CAF6E]"
                  defaultValue={selectedOrder.payment_status}
                  id="payment-status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="bg-[#0E1F12] rounded-xl p-4 border border-white/5">
                <h3 className="font-semibold text-sm mb-3 text-white/80">Shipping Details</h3>
                <p className="text-sm text-white/60">{selectedOrder.customer_name} ({selectedOrder.customer_phone})</p>
                <p className="text-sm text-white/60">{selectedOrder.shipping_address?.line1}, {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-white/80 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const status = (document.getElementById('order-status-select') as HTMLSelectElement).value;
                    const paymentStatus = (document.getElementById('payment-status-select') as HTMLSelectElement).value;
                    updateOrderStatus(selectedOrder.id, status, paymentStatus);
                  }}
                  className="flex-1 btn-gold py-3 rounded-xl font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
