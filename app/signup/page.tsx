'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ShieldAlert, UserPlus, Mail, Lock, Phone, User } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      // Save user to storage
      localStorage.setItem('hommed_token', data.token);
      localStorage.setItem('hommed_user', JSON.stringify(data.user));
      
      // Dispatch authentication change event
      window.dispatchEvent(new Event('auth-change'));

      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Registration error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-blue/5 rounded-full filter blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-purple/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white border border-slate-100 rounded-[32px] p-8 sm:p-10 shadow-sm relative z-10 space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Link href="/">
            <img
              src="/logo.png"
              alt="HomMed Logo"
              className="h-16 w-auto object-contain mb-2 hover:scale-[1.02] transition-transform duration-300"
            />
          </Link>
          <h2 className="font-heading font-extrabold text-2xl tracking-tight text-brand-navy">Create Patient Account</h2>
          <p className="text-slate-500 text-xs font-light">Join Kanpur's most trusted natural wellness platform</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold flex items-center space-x-2">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-slate-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none"
              />
              <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-semibold text-slate-700">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 87561 24708"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none"
              />
              <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@example.com"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none"
              />
              <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none"
              />
              <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-brand-blue/20 pt-1"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <UserPlus className="h-4.5 w-4.5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footnote */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-blue font-bold hover:text-brand-navy transition-colors">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
