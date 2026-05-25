'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogIn, Mail, Lock, Sparkles } from 'lucide-react';

export default function StaffLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      if (data.user.role !== 'staff' && data.user.role !== 'admin') {
        throw new Error('Unauthorized role. This gateway is only for authorized Clinic Staff.');
      }

      localStorage.setItem('hommed_token', data.token);
      localStorage.setItem('hommed_user', JSON.stringify(data.user));
      
      window.dispatchEvent(new Event('auth-change'));

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/staff');
      }

    } catch (err: any) {
      setError(err.message || 'Login error, please verify details.');
    } finally {
      setLoading(false);
    }
  };

  // Mock staff login for ease of demo setup
  const handleStaffMock = () => {
    const mockUser = {
      id: 'mock-staff-id',
      name: 'Iqbal Staff Clinic',
      email: 'staff@hommed.com',
      phone: '9988776655',
      role: 'staff'
    };
    localStorage.setItem('hommed_token', 'mock-staff-jwt-token');
    localStorage.setItem('hommed_user', JSON.stringify(mockUser));
    window.dispatchEvent(new Event('auth-change'));
    router.push('/staff');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1F12] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 blob-cyan rounded-full filter blur-[120px] pointer-events-none opacity-50"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 blob-gold rounded-full filter blur-[120px] pointer-events-none opacity-30"></div>

      <div className="max-w-md w-full bg-[#132918]/80 border border-brand-cyan/20 rounded-[32px] p-8 sm:p-10 shadow-premium relative z-10 space-y-8 backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Link href="/">
            <div className="bg-white p-2 rounded-2xl shadow-inner inline-block hover:scale-[1.03] transition-transform duration-300 mb-2">
              <img
                src="/logo.png"
                alt="HomMed Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
          </Link>
          <div className="flex items-center space-x-1.5 bg-brand-cyan/15 text-brand-cyan-light px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-brand-cyan/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Staff Portal Gateway</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl tracking-tight text-white mt-3">HOMMED Clinical CRM</h2>
          <p className="text-brand-muted text-xs font-light">Verify credentials to manage patients, schedule, and write prescriptions</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/80 border border-rose-900/60 text-rose-300 rounded-2xl text-xs font-semibold flex items-center space-x-2">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold text-slate-300">Staff Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="staff@hommed.com"
                className="w-full h-12 pl-10 pr-4 bg-brand-navy border border-brand-cyan/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
              />
              <Mail className="h-4.5 w-4.5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-4 bg-brand-navy border border-brand-cyan/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
              />
              <Lock className="h-4.5 w-4.5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-brand-blue to-brand-green hover:brightness-110 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-brand-blue/20"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="h-4.5 w-4.5" />
                <span>Access Clinical Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Mock Access Gateway for Local testing/offline mode */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-brand-cyan/10"></div>
          <span className="flex-shrink mx-4 text-brand-muted text-[10px] font-bold uppercase tracking-widest">Demo Testing</span>
          <div className="flex-grow border-t border-brand-cyan/10"></div>
        </div>

        <button
          onClick={handleStaffMock}
          className="w-full h-12 border border-brand-cyan/20 bg-brand-navy/60 hover:bg-brand-navy text-brand-cyan-light rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
        >
          <span>Use Simulated Staff Account (Offline Demo Mode)</span>
        </button>

        <div className="text-center text-xs">
          <Link href="/login" className="text-brand-muted font-medium hover:text-brand-cyan-light transition-colors">
            &larr; Back to Patient Login
          </Link>
        </div>

      </div>
    </div>
  );
}
