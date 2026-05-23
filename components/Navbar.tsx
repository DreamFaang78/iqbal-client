'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, LogOut, Calendar } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('hommed_user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { localStorage.removeItem('hommed_user'); }
    }
    const handleAuthChange = () => {
      const u = localStorage.getItem('hommed_user');
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('hommed_user');
    localStorage.removeItem('hommed_token');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#doctor' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0E1F12]/92 backdrop-blur-xl border-b border-[#4CAF6E]/12 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-[#0E1F12]/72 backdrop-blur-md border-b border-[#4CAF6E]/6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center group shrink-0">
            <img
              src="/logo.png"
              alt="HomMed Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[#4CAF6E] bg-[#4CAF6E]/10'
                    : 'text-white/70 hover:text-white hover:bg-white/6'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ── DESKTOP RIGHT ACTIONS ── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-4 h-10 text-sm text-white/80 hover:text-white bg-white/6 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 h-10 text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 h-10 flex items-center text-sm text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/book"
                  className="btn-gold flex items-center gap-2 px-5 h-10 rounded-full text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                </Link>
              </>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {isOpen && (
        <div className="md:hidden bg-[#132918]/95 backdrop-blur-xl border-b border-[#4CAF6E]/10 animate-fade-in">
          <div className="px-4 pt-3 pb-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-[#4CAF6E] bg-[#4CAF6E]/10'
                    : 'text-white/70 hover:text-white hover:bg-white/6'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/8 space-y-2">
              {user ? (
                <>
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm text-white bg-white/8 rounded-xl border border-white/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm text-red-400 border border-red-500/30 rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-3 text-sm text-white/80 border border-white/10 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="btn-gold flex items-center justify-center gap-2 w-full py-3 text-sm rounded-xl"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Appointment
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
