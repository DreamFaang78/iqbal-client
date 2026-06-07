'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

/**
 * OAuth callback target. Google → Supabase → here (?code=...).
 *
 * Flow:
 *  1. Exchange the ?code for a Supabase session (PKCE).
 *  2. Resolve the user's role from public.profiles (the handle_new_user trigger
 *     auto-creates a 'patient' row for first-time Google users).
 *  3. Save the access token + a normalized user object into the app's existing
 *     localStorage keys (hommed_token / hommed_user) and fire 'auth-change'.
 *  4. Redirect by role (admin → /admin, otherwise → /dashboard).
 */
function CallbackInner() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const oauthErr = url.searchParams.get('error_description') || url.searchParams.get('error');
        if (oauthErr) throw new Error(oauthErr);
        if (!code) throw new Error('Missing authorization code from Google.');

        // 1. Exchange the code for a session.
        const { data, error: exchErr } = await supabaseBrowser.auth.exchangeCodeForSession(code);
        if (exchErr) throw exchErr;

        const session = data.session;
        const authUser = data.user ?? session?.user;
        if (!session || !authUser) throw new Error('Could not establish a session.');

        // 2. Resolve role + profile fields (best-effort).
        let role = 'patient';
        let name =
          (authUser.user_metadata?.full_name as string) ||
          (authUser.user_metadata?.name as string) ||
          authUser.email?.split('@')[0] ||
          'Patient';
        let phone = (authUser.user_metadata?.phone as string) || '';

        try {
          const { data: profile } = await supabaseBrowser
            .from('profiles')
            .select('role, name, phone')
            .eq('id', authUser.id)
            .maybeSingle();
          if (profile) {
            role = profile.role || role;
            name = profile.name || name;
            phone = profile.phone || phone;
          } else if (authUser.email?.toLowerCase() === 'admin@hommed.com') {
            role = 'admin';
          }
        } catch {
          /* profile read is best-effort; trigger creates it server-side */
        }

        if (cancelled) return;

        // 3. Persist into the app's existing auth keys so the rest of the app works.
        localStorage.setItem('hommed_token', session.access_token);
        localStorage.setItem(
          'hommed_user',
          JSON.stringify({ id: authUser.id, name, email: authUser.email, phone, role })
        );
        window.dispatchEvent(new Event('auth-change'));

        // Clean up the temporary OAuth session store.
        try {
          await supabaseBrowser.auth.signOut({ scope: 'local' });
        } catch {
          /* no-op */
        }

        // 4. Redirect by role.
        router.replace(role === 'admin' ? '/admin' : '/dashboard');
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Google sign-in failed. Please try again.');
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1F12] px-4">
      <div className="text-center space-y-4 max-w-sm">
        {error ? (
          <>
            <p className="text-rose-400 font-semibold">Sign-in failed</p>
            <p className="text-white/60 text-sm">{error}</p>
            <button
              onClick={() => router.replace('/login')}
              className="mt-2 px-5 h-11 bg-[#4CAF6E] hover:bg-[#3DAA58] text-[#0E1F12] rounded-xl text-sm font-bold cursor-pointer"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <span className="w-10 h-10 border-4 border-[#4CAF6E] border-t-transparent rounded-full animate-spin mx-auto block" />
            <p className="text-white/70 font-medium">Completing Google sign-in…</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0E1F12]">
          <span className="w-10 h-10 border-4 border-[#4CAF6E] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
