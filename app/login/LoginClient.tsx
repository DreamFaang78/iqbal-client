'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogIn, Mail, Lock } from 'lucide-react';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Login() {
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

      // Save user to storage
      localStorage.setItem('hommed_token', data.token);
      localStorage.setItem('hommed_user', JSON.stringify(data.user));
      
      // Dispatch authentication change event
      window.dispatchEvent(new Event('auth-change'));

      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else if (data.user.role === 'staff') {
        router.push('/staff');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'Login error, please verify details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-blue/5 rounded-full filter blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-purple/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white border border-slate-100 rounded-[32px] p-8 sm:p-10 shadow-sm relative z-10 space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="HomMed Logo"
              width={64}
              height={64}
              className="h-16 w-auto object-contain mb-2 hover:scale-[1.02] transition-transform duration-300"
            />
          </Link>
          <h2 className="font-heading font-extrabold text-2xl tracking-tight text-brand-navy">Sign In to HOMMED</h2>
          <p className="text-slate-500 text-xs font-light">Access your patient medical files & consult dashboard</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold flex items-center space-x-2">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div className="space-y-2">
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
                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none"
              />
              <Mail className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</label>
              <a
                href="https://wa.me/918707868504?text=Hello%20HOMMED%2C%20I%20need%20help%20resetting%20my%20account%20password"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none"
              />
              <Lock className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-brand-blue/20"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="h-4.5 w-4.5" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Google OAuth (patient sign-in) */}
        <GoogleSignInButton />

        {/* Footnote */}
        <div className="text-center text-xs text-slate-500 space-y-2">
          <div>
            Don't have an account?{' '}
            <Link href="/signup" className="text-brand-blue font-bold hover:text-brand-navy transition-colors">
              Create Account
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <Link href="/login/staff" className="text-xs text-slate-400 hover:text-brand-blue transition-colors font-medium">
              Are you clinic staff? Go to Staff Portal &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
