'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, LogOut, Calendar, MapPin, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [branchesOpen, setBranchesOpen] = useState(false);
  const [mobileBranchesOpen, setMobileBranchesOpen] = useState(false);
  const branchesRef = useRef<HTMLDivElement>(null);
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

  // Close branches dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (branchesRef.current && !branchesRef.current.contains(e.target as Node)) {
        setBranchesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    { name: 'Shop', href: '/shop' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Contact', href: '/#contact' },
  ];

  const branches = [
    {
      name: 'Civil Lines Branch',
      href: '/locations/civil-lines',
      address: 'Near Green Park Stadium, Civil Lines, Kanpur',
    },
    {
      name: 'Jajmau Branch',
      href: '/locations/jajmau',
      address: 'Near Ganga Bridge, Jajmau, Kanpur',
    },
  ];

  // Hide the Navbar entirely on Staff, Admin, Dashboard and Auth pages to maximize portal workspace
  const isPortalOrAuthRoute = ['/staff', '/admin', '/login', '/signup', '/dashboard'].some(
    path => pathname?.startsWith(path)
  );

  if (isPortalOrAuthRoute) {
    return null;
  }

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

            {/* ── OUR BRANCHES DROPDOWN ── */}
            <div className="relative" ref={branchesRef}>
              <button
                id="branches-dropdown-btn"
                onClick={() => setBranchesOpen(!branchesOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  branchesOpen
                    ? 'text-[#4CAF6E] bg-[#4CAF6E]/10'
                    : 'text-white/70 hover:text-white hover:bg-white/6'
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                Our Branches
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${branchesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {branchesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#132918]/98 backdrop-blur-xl border border-[#4CAF6E]/15 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in z-50">
                  <div className="p-2 space-y-1">
                    <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-[#4CAF6E]/60 uppercase tracking-widest">
                      Choose a Location
                    </p>
                    {branches.map((branch) => (
                      <Link
                        key={branch.name}
                        href={branch.href}
                        onClick={() => setBranchesOpen(false)}
                        className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-[#4CAF6E]/10 transition-all group"
                      >
                        <div className="mt-0.5 p-1.5 bg-[#4CAF6E]/15 rounded-lg shrink-0 group-hover:bg-[#4CAF6E]/25 transition-colors">
                          <MapPin className="h-3.5 w-3.5 text-[#4CAF6E]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-[#4CAF6E] transition-colors leading-tight">
                            {branch.name}
                          </p>
                          <p className="text-[11px] text-white/45 mt-0.5 leading-snug">
                            {branch.address}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="px-3 py-2 border-t border-white/8 mt-1">
                      <Link
                        href="/book"
                        onClick={() => setBranchesOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#4CAF6E]/15 hover:bg-[#4CAF6E]/25 text-[#4CAF6E] text-xs font-semibold rounded-xl transition-all"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        Book Appointment at Any Branch
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── DESKTOP RIGHT ACTIONS ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/cart"
              className="flex items-center gap-2 px-3 h-10 text-sm text-white/70 hover:text-[#4CAF6E] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </Link>

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

            {/* ── MOBILE: OUR BRANCHES ACCORDION ── */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => setMobileBranchesOpen(!mobileBranchesOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/6 transition-all rounded-xl"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#4CAF6E]" />
                  Our Branches
                </span>
                <ChevronDown className={`h-4 w-4 text-[#4CAF6E] transition-transform duration-200 ${mobileBranchesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileBranchesOpen && (
                <div className="mx-2 mb-1 bg-[#0E1F12]/60 border border-[#4CAF6E]/12 rounded-xl overflow-hidden">
                  {branches.map((branch, i) => (
                    <Link
                      key={branch.name}
                      href={branch.href}
                      onClick={() => { setIsOpen(false); setMobileBranchesOpen(false); }}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-[#4CAF6E]/10 transition-all ${
                        i < branches.length - 1 ? 'border-b border-white/6' : ''
                      }`}
                    >
                      <MapPin className="h-4 w-4 text-[#4CAF6E] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-white">{branch.name}</p>
                        <p className="text-[11px] text-white/45 mt-0.5">{branch.address}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/8 space-y-2">
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm text-[#4CAF6E] border border-[#4CAF6E]/30 rounded-xl hover:bg-[#4CAF6E]/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                View Cart
              </Link>
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

