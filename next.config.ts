import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://wa.me; frame-src https://www.google.com https://maps.google.com;",
  },
];

// Origins allowed to call /api/* endpoints from the browser.
// Add the subdomain you host the landing page on here.
const allowedOrigins = [
  'http://localhost:5173',       // Vite dev server (default)
  'http://localhost:8080',       // Vite dev server (lovable/tanstack config default)
  'http://localhost:4173',       // Vite preview
  'https://hommed.in',          // Main domain (if landing page is hosted here)
  'https://www.hommed.in',
  'https://care.hommed.in',     // Care subdomain
  'https://landing.hommed.in',  // Alternative subdomain
  'https://hommed.org',
  'https://www.hommed.org',
  'https://kit.hommed.org',
];

const corsHeaders = [
  { key: 'Access-Control-Allow-Origin', value: allowedOrigins.join(', ') },
  { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
  { key: 'Access-Control-Max-Age', value: '86400' },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  async headers() {
    return [
      // CORS for all API routes (allows landing page to POST leads)
      {
        source: '/api/:path*',
        headers: corsHeaders,
      },
      // Security headers for all other routes
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'hommed.org' }],
        destination: 'https://www.hommed.org/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
