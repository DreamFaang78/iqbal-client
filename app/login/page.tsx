'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ShieldAlert, LogIn, Mail, Lock } from 'lucide-react';

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
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'Login error, please verify details.');
    } finally {
      setLoading(false);
    }
  };

  // Simulated Google Sign In for demo ease
  const handleGoogleMock = () => {
    const mockUser = {
      id: 'mock-google-id',
      name: 'Google Patient',
      email: 'patient@google.com',
      phone: '8756124708',
      role: 'user'
    };
    localStorage.setItem('hommed_token', 'mock-google-jwt-token');
    localStorage.setItem('hommed_user', JSON.stringify(mockUser));
    window.dispatchEvent(new Event('auth-change'));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
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
              <span className="text-[10px] text-slate-400 hover:text-brand-blue transition-colors cursor-pointer">
                Forgot password?
              </span>
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

        {/* Separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-medium uppercase font-accent">or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Google OAuth Simulation button */}
        <button
          onClick={handleGoogleMock}
          className="w-full h-12 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-700 text-sm flex items-center justify-center space-x-2.5 transition-all"
        >
          {/* Custom SVG logo for google */}
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.823-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.506 0 2.879.537 3.957 1.425l3.056-3.056C18.847 2.215 15.753 1 12.24 1 6.032 1 1 6.032 1 12.24s5.032 11.24 11.24 11.24c5.895 0 10.82-4.148 10.82-11.24 0-.668-.078-1.378-.22-1.955H12.24Z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footnote */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-brand-blue font-bold hover:text-brand-navy transition-colors">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
