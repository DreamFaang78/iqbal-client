'use client';

import React, { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

/**
 * "Continue with Google" button.
 *
 * Starts the Supabase Google OAuth (PKCE) redirect flow. Google sends the user
 * back to `/auth/callback` on the SAME origin the button was clicked from
 * (localhost in dev, the Vercel domain in production), so no URL is hardcoded.
 *
 * NOTE: this is patient-only sign-in. Staff/admin continue to use email/password
 * so nobody can self-grant clinical access via Google.
 */
export default function GoogleSignInButton({ label = 'Continue with Google' }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error: oauthError } = await supabaseBrowser.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (oauthError) throw oauthError;
      // On success the browser is redirected to Google, so nothing else runs here.
    } catch (err: any) {
      setError(err?.message || 'Could not start Google sign-in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-rose-500 text-center">{error}</p>
      )}
    </div>
  );
}
